require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;
const secretKey = process.env.JWT_SECRET || 'votre_clé_secrète';

// Configuration de CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('Variables d\'environnement chargées :', {
  PG_USER: process.env.PG_USER,
  PG_HOST: process.env.PG_HOST,
  PG_DATABASE: process.env.PG_DATABASE,
  PG_PASSWORD: process.env.PG_PASSWORD,
  PG_PORT: process.env.PG_PORT,
});

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pool.connect().catch(err => console.error('Connection error', err.stack));
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware d'authentification pour les utilisateurs
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(403); // Forbidden
  }
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    if (user.role !== 'user') {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
};

// Middleware d'authentification pour les administrateurs
const authenticateAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(403); // Forbidden
  }
  jwt.verify(token, secretKey, (err, user) => {
    if (err || !user.isAdmin) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
};
// Route de connexion admin (exclue du middleware)
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const query = 'SELECT * FROM admins WHERE username = $1';
    const result = await pool.query(query, [username]);
    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const admin = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: admin.id, role: 'admin', isAdmin: true }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Utilisation du middleware pour protéger les routes admin
app.use('/api/admin', authenticateAdminToken);
app.get('/api/admin/dashboard', (req, res) => {
  res.json({ message: 'Bienvenue sur le tableau de bord administrateur' });
});

// Middleware pour enregistrer les connexions
app.use((req, res, next) => {
  if (req.user) { // Vérifiez si l'utilisateur est authentifié
    const query = 'INSERT INTO user_logins (user_id) VALUES ($1)';
    pool.query(query, [req.user.id])
      .then(result => {
        console.log('Connexion enregistrée pour l\'utilisateur:', req.user.id);
      })
      .catch(error => {
        console.error('Erreur lors de l\'enregistrement de la connexion:', error);
      });
  }
  next();
});

// Route de connexion utilisateur (clients)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: 'user' }, secretKey, { expiresIn: '1h' });
    res.status(200).send({ message: 'Login successful', token, userId: user.id });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send({ message: 'Failed to login' });
  }
});


app.delete('/api/promotions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM promotions WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error deleting promotion:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});





/*
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Import de Nodemailer
const axios = require('axios'); // Import d'Axios pour les requêtes HTTP
const app = express();
const PORT = process.env.PORT || 3001;
const secretKey = process.env.JWT_SECRET || 'votre_clé_secrète';





// Configuration de CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('Variables d\'environnement chargées :', {
  PG_USER: process.env.PG_USER,
  PG_HOST: process.env.PG_HOST,
  PG_DATABASE: process.env.PG_DATABASE,
  PG_PASSWORD: process.env.PG_PASSWORD,
  PG_PORT: process.env.PG_PORT,
});

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pool.connect().catch(err => console.error('Connection error', err.stack));
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(403); // Forbidden
  }
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
};





// Utilisation du middleware pour protéger les routes admin
app.use('/api/admin', authenticateToken);

// Middleware pour enregistrer les connexions
app.use((req, res, next) => {
  if (req.user) { // Vérifiez si l'utilisateur est authentifié
    const query = 'INSERT INTO user_logins (user_id) VALUES ($1)';
    pool.query(query, [req.user.id])
      .then(result => {
        console.log('Connexion enregistrée pour l\'utilisateur:', req.user.id);
      })
      .catch(error => {
        console.error('Erreur lors de l\'enregistrement de la connexion:', error);
      });
  }
  next();
});


// Route de connexion
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
    res.status(200).send({ message: 'Login successful', token, userId: user.id }); // Ajouter userId ici
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send({ message: 'Failed to login' });
  }
});


app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const query = 'SELECT * FROM admins WHERE username = $1';
    const result = await pool.query(query, [username]);
    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const admin = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: admin.id, role: admin.role }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});


app.delete('/api/promotions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM promotions WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error deleting promotion:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

*/

app.post('/api/promotions', async (req, res) => {
  const { name, description, discount_type, discount_value, start_date, end_date, product_id } = req.body;

  try {
    const query = `
      INSERT INTO promotions (name, description, discount_type, discount_value, start_date, end_date, product_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const values = [name, description, discount_type, discount_value, start_date, end_date, product_id];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding promotion:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// Routes d'administration sans authentification
app.post('/api/products', upload.array('images', 10), async (req, res) => {
  const { name, category, types, price, details, quantity, lowStockThreshold, supplierId } = req.body;

  // Traiter les chemins des images
  const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

  try {
    // Insérer les données dans la base de données
    const query = `
      INSERT INTO products (name, category, types, price, details, images, quantity, low_stock_threshold, supplier_id, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING id
    `;
    const values = [name, category, types ? JSON.parse(types).map(type => type.trim()) : null, price, details, `{${images.map(img => `"${img}"`).join(',')}}`, quantity, lowStockThreshold, supplierId];

    const result = await pool.query(query, values);
    const productId = result.rows[0].id;

    // Enregistrer le mouvement de stock
    const stockMovementQuery = `
      INSERT INTO stock_movements (product_id, quantity, movement_type) 
      VALUES ($1, $2, 'add')
    `;
    await pool.query(stockMovementQuery, [productId, quantity]);

    res.status(200).send('Product added successfully');
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).send(err.message || 'An error occurred while adding the product');
  }
});





app.put('/api/products/:id/type', async (req, res) => {
  const { id } = req.params;
  const { types } = req.body;

  console.log('Updating product with ID:', id);
  console.log('Received types:', types);

  if (!types || !Array.isArray(types)) {
    return res.status(400).json({ message: 'Types are required and should be an array' });
  }

  try {
    const query = `
      UPDATE products SET types = $1 WHERE id = $2 RETURNING *
    `;
    const values = [types, id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      console.log('Product not found with ID:', id);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Product updated successfully:', result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product types:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});


app.post('/api/products', upload.array('images', 10), async (req, res) => {
  const { name, category, types, price, details, quantity, lowStockThreshold, supplierId } = req.body;

  // Traiter les chemins des images
  const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

  try {
    // Insérer les données dans la base de données
    const query = `
      INSERT INTO products (name, category, types, price, details, images, quantity, low_stock_threshold, supplier_id, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING id
    `;
    const values = [name, category, types ? JSON.parse(types).map(type => type.trim()) : null, price, details, `{${images.map(img => `"${img}"`).join(',')}}`, quantity, lowStockThreshold, supplierId];

    const result = await pool.query(query, values);
    const productId = result.rows[0].id;

    // Enregistrer le mouvement de stock
    const stockMovementQuery = `
      INSERT INTO stock_movements (product_id, quantity, movement_type) 
      VALUES ($1, $2, 'add')
    `;
    await pool.query(stockMovementQuery, [productId, quantity]);

    res.status(200).send('Product added successfully');
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).send(err.message || 'An error occurred while adding the product');
  }
});




app.post('/api/suppliers', async (req, res) => {
  const { name, contact, email, phone, address } = req.body;

  try {
    const query = `
      INSERT INTO suppliers (name, contact, email, phone, address) 
      VALUES ($1, $2, $3, $4, $5) RETURNING id
    `;
    const values = [name, contact, email, phone, address];

    const result = await pool.query(query, values);
    res.status(200).json({ message: 'Supplier added successfully', supplierId: result.rows[0].id });
  } catch (err) {
    console.error('Error adding supplier:', err);
    res.status(500).send('An error occurred while adding the supplier');
  }
});
app.get('/api/suppliers', async (req, res) => {
  try {
    const query = 'SELECT * FROM suppliers';
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching suppliers:', err);
    res.status(500).send('An error occurred while fetching suppliers');
  }
});


app.put('/api/suppliers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, contact, email, phone, address } = req.body;

  try {
    const query = `
      UPDATE suppliers 
      SET name = $1, contact = $2, email = $3, phone = $4, address = $5 
      WHERE id = $6
    `;
    const values = [name, contact, email, phone, address, id];

    await pool.query(query, values);
    res.status(200).json({ message: 'Supplier updated successfully' });
  } catch (err) {
    console.error('Error updating supplier:', err);
    res.status(500).send('An error occurred while updating the supplier');
  }
});


app.delete('/api/suppliers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM suppliers WHERE id = $1';
    await pool.query(query, [id]);
    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    console.error('Error deleting supplier:', err);
    res.status(500).send('An error occurred while deleting the supplier');
  }
});



app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Supprimer les produits aimés liés à ce produit
      const deleteLikedProductsQuery = 'DELETE FROM liked_products WHERE product_id = $1';
      await client.query(deleteLikedProductsQuery, [id]);

      // Supprimer le produit
      const deleteProductQuery = 'DELETE FROM products WHERE id = $1 RETURNING *';
      const result = await client.query(deleteProductQuery, [id]);

      if (result.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).send({ message: 'Product not found' });
      }

      await client.query('COMMIT');
      res.status(200).send({ message: 'Product deleted successfully' });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error deleting product:', err);
      res.status(500).send({ message: 'Failed to delete product', error: err });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error connecting to database:', err);
    res.status(500).send({ message: 'Failed to connect to database', error: err });
  }
});

// Mise à jour du type de produit
app.put('/api/products/:id/type', async (req, res) => {
  const { id } = req.params;
  const { types } = req.body;

  if (!types || !Array.isArray(types)) {
    return res.status(400).json({ message: 'Types are required and should be an array' });
  }

  try {
    console.log('Updating product with ID:', id);
    console.log('New types:', types);

    const query = `
      UPDATE products SET types = $1, updated_at = NOW() WHERE id = $2 RETURNING *
    `;
    const values = [types, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      console.log('Product not found with ID:', id);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Product updated successfully:', result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product types:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Supprimer d'abord les lignes de order_items correspondant à l'order_id
      const deleteOrderItemsQuery = 'DELETE FROM order_items WHERE order_id = $1';
      await client.query(deleteOrderItemsQuery, [id]);
      
      // Supprimer la commande de la table orders
      const deleteOrderQuery = 'DELETE FROM orders WHERE id = $1 RETURNING *';
      const result = await client.query(deleteOrderQuery, [id]);

      if (result.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).send({ message: 'Order not found' });
      }

      await client.query('COMMIT');
      res.status(200).send({ message: 'Order deleted successfully' });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error deleting order:', err);
      res.status(500).send({ message: 'Failed to delete order', error: err });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error connecting to database:', err);
    res.status(500).send({ message: 'Failed to connect to database', error: err });
  }
});


app.get('/api/stockMovements', async (req, res) => {
  try {
    const query = `
      SELECT sm.id, sm.quantity, sm.movement_type, sm.date, p.name AS product_name 
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      ORDER BY sm.date DESC
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching stock movements:', err);
    res.status(500).send('An error occurred while fetching stock movements');
  }
});

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

app.delete('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM contacts WHERE id = $1';
    const values = [id];
    await pool.query(query, values);
    res.status(200).send({ message: 'Contact deleted successfully' });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).send({ message: 'Failed to delete contact' });
  }
});

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

// Route pour récupérer les informations de l'utilisateur
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const query = 'SELECT * FROM users WHERE id = $1';
  pool.query(query, [userId])
    .then(result => {
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
    })
    .catch(error => {
      console.error('Erreur lors de la récupération du profil utilisateur:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    });
});


app.post('/api/user/upload', authenticateToken, upload.single('photo'), async (req, res) => {
  const photoPath = req.file ? `/uploads/${req.file.filename}` : '';
  console.log('Fichier reçu :', req.file);

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

app.get('/api/promotions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM promotions');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});



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

app.put('/api/products/:id/like', async (req, res) => {
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
    res.status(500).send({ message: 'Failed to like product', error: err });
  }
});
// Récupérer les Informations de Suivi
app.get('/api/track-order/:trackingNumber', async (req, res) => {
  const { trackingNumber } = req.params;
  console.log('Received tracking number:', trackingNumber);
  try {
    const query = `SELECT user_name, user_address, status, updated_at, payment_method, total_price, tracking_number FROM orders WHERE tracking_number = $1`;
    const values = [trackingNumber];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      console.log('Tracking number not found:', trackingNumber);
      return res.status(404).json({ message: 'Tracking number not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching tracking information:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

app.put('/api/update-tracking/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status, paymentMethod } = req.body;

  console.log('Received data:', { orderId, status, paymentMethod }); // Ajouter ce log

  if (!status || !paymentMethod) {
    console.log('Status or payment method missing');
    return res.status(400).json({ message: 'Status and payment method are required' });
  }

  try {
    console.log('Updating order with ID:', orderId);
    console.log('New status:', status);
    console.log('New payment method:', paymentMethod);

    const query = `
      UPDATE orders SET status = $1, payment_method = $2, updated_at = NOW() WHERE id = $3 RETURNING *
    `;
    const values = [status, paymentMethod, orderId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      console.log('Order not found with ID:', orderId);
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Order updated successfully:', result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});


app.post('/api/admins', async (req, res) => {
  const { firstName, lastName, email, username, phone, role } = req.body;
  const hashedPassword = await bcrypt.hash('defaultpassword', 10); // Utiliser une clé de hachage par défaut pour les nouveaux admins
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

app.get('/api/categories', async (req, res) => {
  try {
    const query = 'SELECT * FROM categories';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).send('Failed to fetch categories');
  }
});

app.post('/api/products/categories', async (req, res) => {
  const { productIds } = req.body;

  try {
    console.log('Received productIds:', productIds);
    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new Error('Invalid productIds format');
    }

    // Filtrer les valeurs non numériques
    const validProductIds = productIds.filter(id => !isNaN(parseInt(id, 10)));
    if (validProductIds.length === 0) {
      throw new Error('No valid productIds found');
    }
    
    const query = `
      SELECT id, category 
      FROM products 
      WHERE id = ANY($1::int[])
    `;
    const values = [validProductIds.map(id => parseInt(id, 10))];
    console.log('Executing query with values:', values);
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      console.log('No categories found for productIds:', productIds);
    } else {
      console.log('Categories for products:', result.rows);
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories de produits:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  updateOldProducts();
  setInterval(updateOldProducts, 24 * 60 * 60 * 1000); // Toutes les 24 heures
});

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

// Route pour obtenir les commandes
app.get('/api/orders', async (req, res) => {
  try {
    const query = `SELECT id, user_name, user_surname, user_phone, products, total_price, created_at, status, tracking_number, payment_method FROM orders ORDER BY created_at DESC`;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

app.post('/api/checkout', async (req, res) => {
  const { cart, userInfo } = req.body;
  const { name, surname, phone, email, address, paymentMethod } = userInfo;

  if (!cart || cart.length === 0 || !name || !surname || !phone || !email || !address) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  // Calculer le prix total
  const totalPrice = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const trackingNumber = `TRACK-${Math.floor(Math.random() * 1000000)}`;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    if (paymentMethod === 'cash on delivery') {
      // Insérer la commande dans la table orders
      const orderQuery = `
        INSERT INTO orders (user_name, user_surname, user_phone, user_email, user_address, products, total_price, created_at, status, tracking_number, payment_method)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), 'pending', $8, $9)
        RETURNING *
      `;
      const orderResult = await client.query(orderQuery, [name, surname, phone, email, address, JSON.stringify(cart), totalPrice, trackingNumber, paymentMethod]);
      const order = orderResult.rows[0];

      await sendConfirmationEmail(order);

      await client.query('COMMIT');
      res.status(200).send({ message: 'Order placed successfully', orderId: order.id, totalPrice, trackingNumber });
    } else {
      // Insérer la commande dans la table pending_orders pour le paiement en ligne
      const pendingOrderQuery = `
        INSERT INTO pending_orders (user_name, user_surname, user_phone, user_email, user_address, products, total_price, created_at, tracking_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8)
        RETURNING order_id
      `;
      const pendingOrderResult = await client.query(pendingOrderQuery, [name, surname, phone, email, address, JSON.stringify(cart), totalPrice, trackingNumber]);
      const pendingOrder = pendingOrderResult.rows[0];

      await client.query('COMMIT');
      res.status(200).send({ message: 'Pending order created', orderId: pendingOrder.order_id, totalPrice, trackingNumber });
    }
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during checkout:', err);
    res.status(500).send({ message: 'Checkout failed', error: err });
  } finally {
    client.release();
  }
});

// Route pour rechercher des produits
app.get('/api/search', (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Paramètre de recherche manquant' });
  }

  const searchQuery = `%${query}%`;
  const queryText = 'SELECT * FROM products WHERE name ILIKE $1';
  pool.query(queryText, [searchQuery])
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(error => {
      console.error('Erreur lors de la recherche des produits:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    });
});


// Route pour obtenir les produits
app.get('/api/products', async (req, res) => {
  try {
    const query = `
      SELECT p.*, s.name AS supplier_name 
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.created_at DESC
    `;
    const result = await pool.query(query);
    const products = result.rows.map(product => ({
      ...product,
      types: product.types || [], // Retourner un tableau vide si `types` est NULL
    }));
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send(err.message || 'An error occurred while fetching products');
  }
});


app.get('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = `SELECT * FROM products WHERE id = $1`;
    const values = [id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).send('Produit non trouvé');
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).send(err.message || 'Une erreur est survenue lors de la récupération du produit');
  }
});


/*app.get('/api/products', async (req, res) => {
  console.log('Received request for products'); // Ajout de log
  const category = req.query.category; // Récupérer le paramètre de catégorie
  let query;
  let values = [];

  if (category) {
    query = 'SELECT * FROM products WHERE category = $1';
    values = [category];
  } else {
    query = 'SELECT * FROM products';
  }

  try {
    console.log('Executing query with values:', values); // Ajout de log
    const result = await pool.query(query, values);
    console.log('Products fetched successfully:', result.rows); // Ajout de log
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Failed to fetch products');
  }
});*/

// Route pour obtenir les produits en vente
app.get('/api/salesProducts', async (req, res) => {
  try {
    const category = req.query.category;
    let query = 'SELECT * FROM products WHERE types @> $1::text[]';
    let values = [['sale']];
    if (category && category !== 'all') {
      query += ' AND category = $2';
      values.push(category);
    }
    console.log('Executing query for sales products with values:', values);
    const result = await pool.query(query, values);
    console.log('Sales products fetched successfully:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching sales products:', err.message);
    res.status(500).send(err.message);
  }
});

// Route pour obtenir les produits aimés
app.get('/api/liked-products', async (req, res) => {
  try {
    const query = 'SELECT * FROM liked_products';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching liked products:', err);
    res.status(500).send('Failed to fetch liked products');
  }
});
// Route pour liker un produit
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
    res.status(500).send({ message: 'Failed to like product', error: err });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  try {
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion de l'utilisateur dans la base de données
    const query = 'INSERT INTO users (name, email, password, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [name, email, hashedPassword, phone, address];
    const result = await pool.query(query, values);

    const newUser = result.rows[0];

    // Génération d'un jeton JWT
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, secretKey, { expiresIn: '1h' });

    // Répondez avec le jeton
    res.status(201).send({ message: 'User registered successfully', token });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send({ message: 'Failed to register user' });
  }
});

// Route pour obtenir la liste des administrateurs
app.get('/api/admins', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM admins
      ORDER BY CASE WHEN role = 'Admin principale' THEN 1 ELSE 2 END, role;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).send('Failed to fetch admins');
  }
});

// Route pour les Paiements avec PayPal Sandbox
app.post('/api/paypal/payment', async (req, res) => {
  const { token, orderId } = req.body;

  try {
    const response = await axios({
      url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors du traitement du paiement :', error);
    res.status(500).json({ error: 'Erreur lors du traitement du paiement' });
  }
});

app.post('/api/paypal/token', async (req, res) => {
  const clientId = process.env.PAYPAL_SANDBOX_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SANDBOX_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await axios({
      url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      method: 'post',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: 'grant_type=client_credentials',
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de la génération du token PayPal :', error);
    res.status(500).json({ error: 'Erreur lors de la génération du token PayPal' });
  }
});

app.get('/api/order-total/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'SELECT total_price AS total, user_email AS email, tracking_number AS trackingNumber, user_name AS userName FROM orders WHERE id = $1';
    const values = [id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
});

app.put('/api/cart/:id', async (req, res) => {
  const { id } = req.params;
  const { qty } = req.body;
  try {
    const query = 'UPDATE cart SET qty = $1 WHERE id = $2 RETURNING *';
    const values = [qty, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
});

// Variables globales pour l'email et le mot de passe de l'admin
let adminEmail = '';
let adminPassword = '';

// Route pour mettre à jour les paramètres d'email de l'admin
app.post('/api/admin-settings', (req, res) => {
  const { email, password } = req.body;
  adminEmail = email;
  adminPassword = password;
  res.status(200).send({ message: 'Settings updated successfully' });
});

// Route pour obtenir l'email actuel de l'admin
app.get('/api/admin-settings/email', (req, res) => {
  res.status(200).json({ email: adminEmail });
});
// Fonction pour envoyer l'email de confirmation
const sendConfirmationEmail = async (order) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: adminEmail,
      pass: adminPassword,
    },
  });

  const mailOptions = {
    from: adminEmail,
    to: order.user_email,
    subject: `Confirmation de votre commande - ${order.tracking_number}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="text-align: center; padding: 20px;">
          <img src="image/logo.jpg" alt="logo" style="width: 100px; height: auto;">
        </div>
        <h2>Bonjour,</h2>
        <p>Nous vous remercions pour votre commande. Voici les détails de votre achat :</p>
        <ul>
          <li><strong>Numéro de commande :</strong> ${order.id}</li>
          <li><strong>Total de la commande :</strong> ${order.total_price} Dhs</li>
          <h3>Numéro de Suivi :</h3><p style="
            text-decoration: none;
            display: block;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 18px;
            color: #ffffff;
            text-align: center;
            background-color: #ff729d;
            border: 0px solid transparent;
            padding: 10px 20px;
            border-radius: 99px;
            cursor: pointer;
          ">${order.tracking_number}</p>
        </ul>
        <h3>Adresse de Livraison :</h3>
        <p>${order.user_address}</p>
        <p>Votre commande est en cours de traitement et vous recevrez une mise à jour par email une fois qu'elle aura été expédiée.</p>
        <p>Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter à ${adminEmail}.</p>
        <p>Merci pour votre achat !</p>
        <p>Cordialement,</p>
        <p><strong>Lima Store</strong></p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de confirmation envoyé:', info.response);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation :', error);
  }
};

// Route pour envoyer le reçu de paiement
app.post('/api/send-receipt', async (req, res) => {
  const { orderId, email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  console.log('Envoi du reçu de paiement pour Order ID:', orderId, 'à Email:', email);

  try {
    const orderQuery = 'SELECT * FROM orders WHERE id = $1';
    const orderResult = await pool.query(orderQuery, [orderId]);
    const order = orderResult.rows[0];

    // Utilisation de la fonction sendConfirmationEmail
    await sendConfirmationEmail(order);

    res.status(200).json({ message: 'Reçu de paiement envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du reçu de paiement :', error.message);
    res.status(500).json({ message: 'Failed to send receipt', error: error.message });
  }
});

app.post('/api/confirm-payment', async (req, res) => {
  const { pendingOrderId, transactionId } = req.body;
  console.log('Reçu la demande de confirmation de paiement avec Pending Order ID:', pendingOrderId, 'et Transaction ID:', transactionId);
  
  if (!pendingOrderId || !transactionId) {
    console.error('ID ou transactionId non défini dans la requête');
    return res.status(400).send({ message: 'PendingOrderId and transactionId are required' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const pendingOrderQuery = 'SELECT * FROM pending_orders WHERE order_id = $1';
    const pendingOrderResult = await client.query(pendingOrderQuery, [pendingOrderId]);

    if (pendingOrderResult.rows.length === 0) {
      console.error('Pending order not found:', pendingOrderId);
      await client.query('ROLLBACK');
      return res.status(404).send({ message: 'Pending order not found' });
    }

    const pendingOrder = pendingOrderResult.rows[0];
    console.log('Détails de la commande en attente:', pendingOrder);

    const orderQuery = `
      INSERT INTO orders (user_name, user_surname, user_phone, user_email, user_address, products, total_price, created_at, status, tracking_number, payment_method, transaction_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), 'paid', $8, 'online', $9)
      RETURNING *
    `;
    const orderValues = [
      pendingOrder.user_name, pendingOrder.user_surname, pendingOrder.user_phone,
      pendingOrder.user_email, pendingOrder.user_address, JSON.stringify(pendingOrder.products),
      pendingOrder.total_price, pendingOrder.tracking_number, transactionId
    ];
    const orderResult = await client.query(orderQuery, orderValues);
    const order = orderResult.rows[0];
    console.log('Commande insérée dans la table orders:', order);

    const deletePendingOrderQuery = 'DELETE FROM pending_orders WHERE order_id = $1';
    await client.query(deletePendingOrderQuery, [pendingOrderId]);

    await client.query('COMMIT');
    console.log('Paiement confirmé et commande transférée avec succès.');

    res.status(200).send({ message: 'Payment confirmed and order placed', orderId: order.id, totalPrice: order.total_price, trackingNumber: order.tracking_number });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error confirming payment:', err);
    res.status(500).send({ message: 'Payment confirmation failed', error: err });
  } finally {
    client.release();
  }
});
const insertOrder = async (order, client) => {
  const { userName, userSurname, userPhone, userEmail, userAddress, cart, totalPrice, paymentMethod, trackingNumber } = order;
  const orderQuery = `
    INSERT INTO orders (user_name, user_surname, user_phone, user_email, user_address, products, total_price, created_at, status, tracking_number, payment_method)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), 'pending', $8, $9)
    RETURNING *
  `;
  const orderValues = [userName, userSurname, userPhone, userEmail, userAddress, JSON.stringify(cart), totalPrice, trackingNumber, paymentMethod];
  const orderResult = await client.query(orderQuery, orderValues);
  return orderResult.rows[0];
};

app.post('/api/online-checkout', async (req, res) => {
  const { cart, userInfo } = req.body;
  const { name, surname, phone, email, address } = userInfo;

  if (!cart || cart.length === 0 || !name || !surname || !phone || !email || !address) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  const totalPrice = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const trackingNumber = `TRACK-${Math.floor(Math.random() * 1000000)}`;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const paymentConfirmed = true; // Simulation, remplacez par la logique réelle de confirmation de paiement

    if (paymentConfirmed) {
      const order = {
        userName: name,
        userSurname: surname,
        userPhone: phone,
        userEmail: email,
        userAddress: address,
        cart,
        totalPrice,
        paymentMethod: 'paid',
        trackingNumber
      };

      const newOrder = await insertOrder(order, client);
      await client.query('COMMIT');

      await sendConfirmationEmail(newOrder);

      res.status(200).send({ message: 'Order placed successfully', orderId: newOrder.id, totalPrice, trackingNumber });
    } else {
      await client.query('ROLLBACK');
      res.status(400).send({ message: 'Payment not confirmed' });
    }
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during online checkout:', err);
    res.status(500).send({ message: 'Online checkout failed', error: err });
  } finally {
    client.release();
  }
});

app.get('/api/pending-order-total/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Fetching pending order details for order_id:', id);
  try {
    const query = `
      SELECT * FROM pending_orders WHERE order_id = $1
    `;
    const values = [id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      console.error('Pending order not found:', id);
      return res.status(404).send({ message: 'Pending order not found' });
    }

    console.log('Pending order details fetched successfully:', result.rows[0]);
    res.status(200).send(result.rows[0]);
  } catch (err) {
    console.error('Error fetching pending order details:', err);
    res.status(500).send({ message: 'Error fetching pending order details', error: err });
  }
});

app.put('/api/update-payment-status/:id', async (req, res) => {
  const { id } = req.params;
  const { payment_status, transaction_id } = req.body;

  console.log('Mise à jour du statut de paiement pour ID:', id, 'avec statut:', payment_status, 'et Transaction ID:', transaction_id);

  try {
    if (!id || !payment_status || !transaction_id) {
      console.error('ID, payment_status ou transaction_id manquant');
      return res.status(400).send({ message: 'ID, payment_status et transaction_id sont requis' });
    }

    const query = `
      UPDATE pending_orders
      SET payment_status = $1, transaction_id = $2
      WHERE order_id = $3
      RETURNING *
    `;
    const values = [payment_status, transaction_id, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      console.error('Commande en attente non trouvée:', id);
      return res.status(404).send({ message: 'Commande en attente non trouvée' });
    }

    console.log('Statut de paiement mis à jour pour la commande en attente:', result.rows[0]);
    res.status(200).send({ message: 'Statut de paiement mis à jour avec succès', pendingOrder: result.rows[0] });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du statut de paiement:', err);
    res.status(500).send({ message: 'Échec de la mise à jour du statut de paiement', error: err });
  }
});

// Route pour enregistrer les connexions
app.post('/api/user-logins', (req, res) => {
  const { userId } = req.body;
  console.log('Received userId:', userId); // Ajouter un log pour vérifier la valeur de userId
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  const query = 'INSERT INTO user_logins (user_id) VALUES ($1)';
  pool.query(query, [userId])
    .then(result => {
      res.status(201).json({ message: 'Connexion enregistrée avec succès' });
    })
    .catch(error => {
      console.error('Erreur lors de l\'enregistrement de la connexion:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    });
});


app.post('/api/purchases', (req, res) => {
  const { userId, product } = req.body;

  console.log('Received data:', { userId, product }); // Log des données reçues

  if (!userId || !product) {
    console.error('userId et product sont requis');
    return res.status(400).json({ message: 'userId et product sont requis' });
  }

  const query = 'INSERT INTO user_purchases (user_id, product) VALUES ($1, $2)';
  pool.query(query, [userId, product])
    .then(result => {
      console.log('Achat enregistré:', { userId, product }); // Log de l'achat enregistré
      res.status(201).json({ message: 'Achat enregistré avec succès' });
    })
    .catch(error => {
      console.error('Erreur lors de l\'enregistrement de l\'achat:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    });
});


app.post('/api/liked-products', (req, res) => {
  const { userId, product } = req.body;

  console.log('Received data:', { userId, product }); // Ajouter ce log

  if (!userId || !product) {
    return res.status(400).json({ message: 'userId et product sont requis' });
  }

  const query = 'INSERT INTO user_liked_products (user_id, product) VALUES ($1, $2)';
  pool.query(query, [userId, product])
    .then(result => {
      res.status(201).json({ message: 'Produit aimé enregistré avec succès' });
    })
    .catch(error => {
      console.error('Erreur lors de l\'enregistrement du produit aimé:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    });
});




// Route pour récupérer les informations de l'utilisateur
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT id, name, email, phone, address, photo FROM users WHERE id = $1';
    const values = [req.user.id];
    console.log('Executing query with values:', values);
    const result = await pool.query(query, values);
    console.log('Query result:', result.rows);

    if (result.rows.length === 0) {
      console.error('User not found');
      return res.status(404).send('User not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).send('Failed to fetch user');
  }
});
// Route pour récupérer les utilisateurs
app.get('/api/users', async (req, res) => {
  try {
    const query = 'SELECT id, name, email, password, phone, address, created_at, photo FROM users';
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});


// Route pour récupérer les connexions des utilisateurs
app.get('/api/user-activities/logins/:userId', (req, res) => {
  const { userId } = req.params;
  const query = 'SELECT * FROM user_logins WHERE user_id = $1';
  pool.query(query, [userId])
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des connexions des utilisateurs:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    });
});

app.post('/api/products/categories', async (req, res) => {
  const { productIds } = req.body;

  try {
    console.log('Received productIds:', productIds);
    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new Error('Invalid productIds format');
    }

    // Filtrer les valeurs non numériques
    const validProductIds = productIds.filter(id => !isNaN(parseInt(id, 10)));
    if (validProductIds.length === 0) {
      throw new Error('No valid productIds found');
    }
    
    const query = `
      SELECT id, category 
      FROM products 
      WHERE id = ANY($1::int[])
    `;
    const values = [validProductIds.map(id => parseInt(id, 10))];
    console.log('Executing query with values:', values);
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      console.log('No categories found for productIds:', productIds);
    } else {
      console.log('Categories for products:', result.rows);
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories de produits:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});




// Route pour récupérer les achats des utilisateurs
app.get('/api/user-activities/purchases/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const query = `
      SELECT 
        up.user_id,
        up.product AS product_name,
        p.id AS product_id,
        p.name AS product_name,
        p.price AS product_price,
        p.category AS product_category,
        p.images AS product_images,
        up.purchase_date
      FROM 
        user_purchases up
      LEFT JOIN 
        products p ON up.product = p.name
      WHERE 
        up.user_id = $1;
    `;
    const values = [userId];
    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des achats des utilisateurs:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


app.get('/api/reports/sales', async (req, res) => {
  try {
    const query = `
      SELECT
        DATE_TRUNC('day', o.created_at) AS sales_date,
        SUM(oi.quantity * oi.price) AS total_sales
      FROM
        order_items oi
      JOIN
        orders o ON oi.order_id = o.id
      GROUP BY
        sales_date
      ORDER BY
        sales_date ASC;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des ventes:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});






// Route pour récupérer les produits aimés des utilisateurs
app.get('/api/user-activities/liked-products/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    console.log('Fetching liked products for user:', userId);
    const query = `
      SELECT ulp.product, p.name 
      FROM user_liked_products ulp 
      JOIN products p ON CAST(ulp.product AS INTEGER) = p.id 
      WHERE ulp.user_id = $1
    `;
    const values = [userId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      console.log('No liked products found for user:', userId);
    } else {
      console.log('Liked products for user:', result.rows);
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits aimés:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});



/* SECOURS
// Route pour obtenir les informations du panier par ID
app.get('/api/cart/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM carts WHERE id = $1';
    const values = [id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching cart information:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});
*/

// Servir les fichiers frontend après les routes API
app.use(express.static(path.join(__dirname, '../ecommerce_website/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../ecommerce_website/build', 'index.html'));
});

module.exports = app;
