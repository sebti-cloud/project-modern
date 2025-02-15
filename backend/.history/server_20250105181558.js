require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const secretKey = 'your_secret_key'; // Utilisez une clé secrète pour JWT

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(403); // Pas de token trouvé

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403); // Token non valide
    req.user = user;
    next();
  });
};

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Appliquez le middleware aux routes protégées
app.use('/api/admin', authenticateToken);
app.use('/api/products', authenticateToken);
app.use('/api/orders', authenticateToken);
app.use('/api/likedProducts', authenticateToken);
app.use('/api/categories', authenticateToken);
app.use('/api/contacts', authenticateToken);
app.use('/api/admins', authenticateToken);

console.log('Variables d\'environnement chargées :', {
  PG_USER: process.env.PG_USER,
  PG_HOST: process.env.PG_HOST,
  PG_DATABASE: process.env.PG_DATABASE,
  PG_PASSWORD: process.env.PG_PASSWORD,
  PG_PORT: process.env.PG_PORT
});

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pool.connect().catch(err => console.error('Connection error', err.stack));

// Vérification des informations de connexion
pool.connect()
  .then(async client => {
    try {
      const res = await client.query('SELECT NOW()');
      client.release();
      console.log('Connexion à la base de données réussie, heure actuelle :', res.rows[0]);
    } catch (err_1) {
      client.release();
      console.error('Erreur lors de la connexion à la base de données :', err_1.stack);
    }
  });

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes pour les produits
app.post('/api/products', upload.single('image'), async (req, res) => {
  const { name, category, types, price, details } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  try {
    const query = 'INSERT INTO products (name, category, types, price, details, image, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())';
    const values = [name, category, types ? JSON.parse(types) : [], price, details, image];
    await pool.query(query, values);
    res.status(200).send('Product added');
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).send(err);
  }
});

app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, category, types, price, details } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
  try {
    const parsedTypes = types ? JSON.parse(types) : [];
    const query = 'UPDATE products SET name = $1, category = $2, types = $3, price = $4, details = $5, image = $6 WHERE id = $7';
    const values = [name, category, parsedTypes, price, details, image, id];
    await pool.query(query, values);
    res.status(200).send('Product updated');
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).send(err);
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete product with id: ${id}`); // Ajout de logging
  const client = await pool.connect(); // Connection client pour les transactions
  try {
    await client.query('BEGIN'); // Démarrer une transaction

    // Supprimer les références dans liked_products
    const deleteLikedQuery = 'DELETE FROM liked_products WHERE product_id = $1';
    await client.query(deleteLikedQuery, [id]);

    // Supprimer le produit de la table products
    const deleteProductQuery = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const result = await client.query(deleteProductQuery, [id]);

    if (result.rowCount === 0) {
      console.error('Product not found');
      await client.query('ROLLBACK'); // Annuler la transaction en cas d'erreur
      return res.status(404).send({ message: 'Product not found' });
    }

    await client.query('COMMIT'); // Valider la transaction
    console.log(`Product deleted: ${JSON.stringify(result.rows[0])}`); // Ajout de logging
    res.status(200).send({ message: 'Product deleted successfully' });
  } catch (err) {
    await client.query('ROLLBACK'); // Annuler la transaction en cas d'erreur
    console.error('Error deleting product:', err); // Ajout de logging de l'erreur
    res.status(500).send({ message: 'Failed to delete product', error: err }); // Ajout de plus d'informations dans la réponse
  } finally {
    client.release(); // Libérer le client
  }
});
// Route pour supprimer un produit aimé
app.delete('/api/liked-products/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete liked product with id: ${id}`); // Ajout de logging
  try {
    const query = 'DELETE FROM liked_products WHERE id = $1 RETURNING *';
    const values = [id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      console.error('Liked product not found');
      return res.status(404).send({ message: 'Liked product not found' });
    }

    console.log(`Liked product deleted: ${JSON.stringify(result.rows[0])}`); // Ajout de logging
    res.status(200).send({ message: 'Liked product deleted successfully' });
  } catch (err) {
    console.error('Error deleting liked product:', err); // Ajout de logging de l'erreur
    res.status(500).send({ message: 'Failed to delete liked product', error: err }); // Ajout de plus d'informations dans la réponse
  }
});

// Route temporaire pour afficher les données des admins
app.get('/api/admins', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM admins
      ORDER BY CASE WHEN role = 'admin_principale' THEN 1 ELSE 2 END, role;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).send('Failed to fetch admins');
  }
});

// Route pour ajouter un nouvel administrateur
app.post('/api/admins', async (req, res) => {
  const { firstName, lastName, email, username, phone, role } = req.body;
  const hashedPassword = await bcrypt.hash('defaultpassword', 10); // Ajout d'un mot de passe par défaut (à changer plus tard par l'utilisateur)
  try {
    const query = 'INSERT INTO admins (firstName, lastName, email, username, phone, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const values = [firstName, lastName, email, username, phone, hashedPassword, role];
    await pool.query(query, values);
    res.status(201).send({ message: 'Admin added successfully' });
  } catch (err) {
    console.error('Error adding admin:', err);
    res.status(500).send({ message: 'Failed to add admin', error: err });
  }
});

// Route pour mettre à jour le rôle d'un administrateur
app.put('/api/admins/:id', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const query = 'UPDATE admins SET role = $1 WHERE id = $2 RETURNING *';
    const values = [role, id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      console.error('Admin not found');
      return res.status(404).send({ message: 'Admin not found' });
    }

    console.log(`Admin role updated: ${JSON.stringify(result.rows[0])}`);
    res.status(200).send({ message: 'Admin role updated successfully' });
  } catch (err) {
    console.error('Error updating admin role:', err);
    res.status(500).send({ message: 'Failed to update admin role', error: err });
  }
});

// Route pour supprimer un administrateur
app.delete('/api/admins/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM admins WHERE id = $1';
    const values = [id];
    await pool.query(query, values);
    res.status(200).send({ message: 'Admin deleted successfully' });
  } catch (err) {
    console.error('Error deleting admin:', err);
    res.status(500).send({ message: 'Failed to delete admin' });
  }
});

// Route pour incrémenter les likes d'un produit et ajouter le type "top" sans supprimer les autres types
app.put('/api/products/:id/like', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'UPDATE products SET likes = likes + 1 WHERE id = $1 RETURNING *';
    const values = [id];
    const result = await pool.query(query, values);
    const updatedProduct = result.rows[0];

    if (updatedProduct.likes > 5 && !updatedProduct.types.includes('top')) {
      const updateTypeQuery = 'UPDATE products SET types = array_append(types, $1) WHERE id = $2';
      const updateTypeValues = ['top', id];
      await pool.query(updateTypeQuery, updateTypeValues);
    }

    res.status(200).send(updatedProduct);
  } catch (err) {
    res.status(500).send({ message: 'Failed to like product', error: err }); // Ajout de plus d'informations dans la réponse
  }
});

// Route pour récupérer les produits aimés
app.get('/api/liked-products', async (req, res) => {
  try {
    const query = 'SELECT * FROM liked_products';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send({ message: 'Failed to fetch liked products', error: err }); // Ajout de plus d'informations dans la réponse
  }
});
// Route pour gérer le checkout et stocker les informations utilisateur
app.post('/api/checkout', authenticateToken, async (req, res) => {
  const { cart, userInfo } = req.body;
  const trackingNumber = generateTrackingNumber(); // Générer le numéro de suivi
  try {
    const total_price = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
    const products = cart.map(item => ({ id: item.id, qty: item.qty, price: item.price }));
    const productsString = JSON.stringify(products);
    const query = 'INSERT INTO orders (user_id, user_name, user_surname, user_phone, products, total_price, status, tracking_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    const values = [req.user.id, userInfo.name, userInfo.surname, userInfo.phone, productsString, total_price, 'pending', trackingNumber];
    console.log('Exécution de la requête de checkout avec valeurs :', values);
    const result = await pool.query(query, values);
    console.log('Résultat de la requête de checkout :', result);

    res.status(200).send({ message: 'Checkout successful', trackingNumber });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).send('Checkout failed');
  }
});

// Route pour valider une commande
app.put('/api/orders/:id/validate', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'UPDATE orders SET status = $1 WHERE id = $2';
    const values = ['validated', id];
    await pool.query(query, values);
    res.status(200).send({ message: 'Order validated' });
  } catch (err) {
    console.error('Error validating order:', err);
    res.status(500).send({ message: 'Failed to validate order' });
  }
});

// Route pour supprimer une commande
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM orders WHERE id = $1';
    const values = [id];
    await pool.query(query, values);
    res.status(200).send({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).send({ message: 'Failed to delete order' });
  }
});

// Route pour le formulaire de contact
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message, phone } = req.body;
  try {
    const query = 'INSERT INTO contacts (name, email, subject, message, phone) VALUES ($1, $2, $3, $4, $5)';
    const values = [name, email, subject, message, phone];
    console.log('Exécution de la requête de contact avec valeurs :', values);
    await pool.query(query, values);
    res.status(200).send({ message: 'Message Sent' });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).send({ message: 'Message Sending Failed' });
  }
});

// Route pour valider un message de contact
app.put('/api/contacts/:id/validate', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'UPDATE contacts SET status = $1 WHERE id = $2';
    const values = ['validated', id];
    await pool.query(query, values);
    res.status(200).send({ message: 'Contact validated' });
  } catch (err) {
    console.error('Error validating contact:', err);
    res.status(500).send({ message: 'Failed to validate contact' });
  }
});

// Route pour supprimer un message de contact
app.delete('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM contacts WHERE id = $1';
    const values = [id];
    await pool.query(query, values);
    res.status(200).send({ message: 'Contact deleted' });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).send({ message: 'Failed to delete contact' });
  }
});

// Route pour la recherche de produits
app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const searchQuery = `
      SELECT * FROM products
      WHERE name ILIKE $1 OR category ILIKE $1 OR details ILIKE $1
    `;
    const values = [`%${query}%`];
    console.log('Exécution de la requête de recherche avec valeurs :', values);
    const result = await pool.query(searchQuery, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).send('Failed to search products');
  }
});

// Route pour ajouter un type à un produit
app.put('/api/products/:id/add-type', async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  try {
    const query = 'UPDATE products SET types = array_append(types, $1) WHERE id = $2';
    const values = [type, id];
    console.log('Exécution de la requête pour ajouter un type avec valeurs :', values);
    await pool.query(query, values);
    res.status(200).send('Product type added');
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route pour mettre à jour le type d'un produit (sale, top, old, etc.)
app.put('/api/products/:id/type', async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  try {
    const query = 'UPDATE products SET type = $1 WHERE id = $2';
    const values = [type, id];
    console.log('Exécution de la requête pour mettre à jour le type avec valeurs :', values);
    await pool.query(query, values);
    res.status(200).send('Product type updated');
  } catch (err) {
    res.status(500).send(err);
  }
});
// Route pour récupérer les produits en vente
app.get('/api/salesProducts', async (req, res) => {
  try {
    const category = req.query.category;
    let query = 'SELECT * FROM products WHERE type = $1';
    let values = ['sale'];
    if (category && category !== 'all') {
      query += ' AND category = $2';
      values.push(category);
    }
    console.log('Exécution de la requête pour récupérer les produits en vente avec valeurs :', values);
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route pour obtenir les messages de contact
app.get('/api/contacts', async (req, res) => {
  try {
    const query = 'SELECT * FROM contacts';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).send('Failed to fetch contacts');
  }
});

// Route pour récupérer toutes les catégories
app.get('/api/categories', async (req, res) => {
  try {
    const query = 'SELECT * FROM categories'; // Assurez-vous que la table "categories" existe dans votre base de données
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).send('Failed to fetch categories');
  }
});

// Route pour ajouter une nouvelle catégorie
app.post('/api/categories', async (req, res) => {
  const { name } = req.body;
  try {
    const query = 'INSERT INTO categories (name) VALUES ($1)';
    const values = [name];
    await pool.query(query, values);
    res.status(201).send({ message: 'Category added successfully' });
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).send({ message: 'Failed to add category' });
  }
});

// Route pour supprimer une catégorie
app.delete('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM categories WHERE id = $1';
    const values = [id];
    await pool.query(query, values);
    res.status(200).send({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).send({ message: 'Failed to delete category' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  updateOldProducts(); // Appel initial
  setInterval(updateOldProducts, 24 * 60 * 60 * 1000); // Toutes les 24 heures
});

// Route pour obtenir les produits par catégorie
app.get('/api/products', async (req, res) => {
  const { category } = req.query;
  try {
    let query = 'SELECT * FROM products';
    let values = [];
    if (category) {
      query += ' WHERE category = $1';
      values.push(category);
    }
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Failed to fetch products');
  }
});

// Mise à jour des produits anciens
const updateOldProducts = async () => {
  try {
    const query = `
      UPDATE products
      SET types = array_remove(types, 'new')
      WHERE 'new' = ANY(types) AND created_at < NOW() - INTERVAL '3 months'
    `;
    await pool.query(query);
    console.log('Old products updated successfully');
  } catch (err) {
    console.error('Error updating old products:', err);
  }
};

// Route pour obtenir les informations de suivi
app.get('/api/track', async (req, res) => {
  const trackingNumber = req.query.number;

  // Logique pour obtenir les informations de suivi en utilisant le numéro de suivi
  const trackingInfo = await getTrackingInfo(trackingNumber); // Fonction fictive

  if (trackingInfo) {
    res.json({ info: trackingInfo });
  } else {
    res.status(404).send('Tracking information not found');
  }
});

// Fonction fictive pour obtenir les informations de suivi
const getTrackingInfo = async (trackingNumber) => {
  // Simuler la récupération des informations de suivi
  return `Information for tracking number ${trackingNumber}`;
};

// Générer un numéro de suivi
const generateTrackingNumber = () => {
  return `TRACK-${Math.floor(100000 + Math.random() * 900000)}`;
};
// Route pour obtenir les commandes
app.get('/api/orders', async (req, res) => {
  console.log('Received request for orders'); // Ajout de log
  try {
    const query = 'SELECT * FROM orders';
    const result = await pool.query(query);
    console.log('Orders fetched successfully:', result.rows); // Ajout de log
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).send('Failed to fetch orders');
  }
});

// Route pour obtenir les produits
app.get('/api/products', async (req, res) => {
  console.log('Received request for products'); // Ajout de log
  try {
    const query = 'SELECT * FROM products';
    const result = await pool.query(query);
    console.log('Products fetched successfully:', result.rows); // Ajout de log
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Failed to fetch products');
  }
});

// Route pour l'inscription des utilisateurs
app.post('/api/register', async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const query = 'INSERT INTO users (name, email, password, phone, address) VALUES ($1, $2, $3, $4, $5)';
    const values = [name, email, hashedPassword, phone, address];
    await pool.query(query, values);
    res.status(201).send({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send({ message: 'Failed to register user' });
  }
});

// Route pour la connexion des utilisateurs
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Email:', email);
  console.log('Password:', password);
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    const user = result.rows[0];
    console.log('User:', user);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
      res.status(200).send({ message: 'Login successful', token, email: user.email });
    } else {
      console.log('Invalid email or password');
      res.status(401).send({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).send({ message: 'Failed to login user' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const query = 'SELECT * FROM admins WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
      res.status(200).send({ token, role: user.role }); // Inclure le rôle de l'utilisateur dans la réponse
    } else {
      res.status(401).send({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error logging in admin:', err);
    res.status(500).send({ message: 'Failed to login admin' });
  }
});

// Route pour récupérer les informations de l'utilisateur connecté
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT id, name, email, phone, address, photo FROM users WHERE id = $1';
    const values = [req.user.id];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).send('Failed to fetch user');
  }
});

// Route pour récupérer les commandes passées d'un utilisateur
app.get('/api/orders/user', authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM orders WHERE user_id = $1';
    const values = [req.user.id];
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).send('Failed to fetch user orders');
  }
});

// Route pour récupérer les produits aimés d'un utilisateur
app.get('/api/products/liked', authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM liked_products WHERE user_id = $1';
    const values = [req.user.id];
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching liked products:', err);
    res.status(500).send('Failed to fetch liked products');
  }
});

// Route pour télécharger une photo de profil
app.post('/api/user/upload', authenticateToken, upload.single('photo'), async (req, res) => {
  const photoPath = req.file ? `/uploads/${req.file.filename}` : '';
  console.log('Fichier reçu :', req.file); // Ajout de log pour vérifier le fichier reçu
  try {
    const query = 'UPDATE users SET photo = $1 WHERE id = $2 RETURNING photo';
    const values = [photoPath, req.user.id];
    const result = await pool.query(query, values);
    res.status(200).send({ message: 'Photo uploaded successfully', photo: result.rows[0].photo });
  } catch (err) {
    console.error('Error uploading photo:', err);
    res.status(500).send({ message: 'Failed to upload photo' });
  }
});

// Configuration de passport.js pour Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3001/auth/google/callback'
},
  async (token, tokenSecret, profile, done) => {
    const { id, displayName, emails } = profile;
    try {
      const query = 'SELECT * FROM users WHERE google_id = $1';
      const values = [id];
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        const insertQuery = 'INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING *';
        const insertValues = [displayName, emails[0].value, id];
        const insertResult = await pool.query(insertQuery, insertValues);
        return done(null, insertResult.rows[0]);
      } else {
        return done(null, result.rows[0]);
      }
    } catch (err) {
      return done(err);
    }
  }));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];
    const result = await pool.query(query, values);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

// Routes pour l'authentification Google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/profile'); // Rediriger vers le profil utilisateur après connexion réussie
  });

// Servir les fichiers frontend après les routes API
app.use(express.static(path.join(__dirname, '../ecommerce_website/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../ecommerce_website/build', 'index.html'));
});

module.exports = app;
