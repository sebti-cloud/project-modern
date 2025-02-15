require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pool.connect().catch(err => console.error('Connection error', err.stack));

// Vérification des informations de connexion
console.log('Informations de connexion PostgreSQL :', {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: typeof process.env.PG_PASSWORD === 'string' ? '******' : process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
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

// Routes d'authentification et d'administration
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  updateOldProducts(); // Appel initial
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


// Route pour obtenir les catégories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).send('Failed to fetch categories');
  }
});

// Route pour ajouter une catégorie
app.post('/api/categories', async (req, res) => {
  const { name } = req.body;
  try {
    const query = 'INSERT INTO categories (name) VALUES ($1)';
    const values = [name];
    await pool.query(query, values);
    res.status(200).send('Category added');
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).send('Failed to add category');
  }
});

// Route pour ajouter un produit
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

// Route pour mettre à jour un produit
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
// Route pour obtenir les produits
app.get('/api/products', async (req, res) => {
  try {
    const category = req.query.category;
    let query = 'SELECT * FROM products';
    let values = [];

    if (category) {
      query += ' WHERE category = $1';
      values = [category];
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route pour supprimer un produit
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM products WHERE id = $1';
    const values = [id];
    await pool.query(query, values);
    res.status(200).send('Product deleted');
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route pour incrémenter les likes d'un produit et ajouter le type "top" sans supprimer les autres types
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
    res.status(500).send(err);
  }
});

// Route pour récupérer les produits aimés
app.get('/api/liked-products', async (req, res) => {
  try {
    const query = 'SELECT * FROM liked_products';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route pour gérer le checkout et stocker les informations utilisateur
app.post('/api/checkout', async (req, res) => {
  const { cart, userInfo } = req.body;
  try {
    const total_price = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
    const products = cart.map(item => ({ id: item.id, qty: item.qty, price: item.price }));
    const productsString = JSON.stringify(products);
    const query = 'INSERT INTO orders (user_name, user_surname, user_phone, products, total_price, status) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [userInfo.name, userInfo.surname, userInfo.phone, productsString, total_price, 'pending'];
    await pool.query(query, values);

    res.status(200).send('Checkout successful');
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).send('Checkout failed');
  }
});

// Route pour obtenir les commandes
app.get('/api/orders', async (req, res) => {
  try {
    const query = 'SELECT * FROM orders';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).send('Failed to fetch orders');
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
    res.status(200).send({ message: 'Order deleted' });
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

module.exports = app;
