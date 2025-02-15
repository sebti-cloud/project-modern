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

// Exemple de route d'administration protégée
app.get('/api/admin/dashboard', (req, res) => {
  res.json({ message: 'Bienvenue sur le tableau de bord administrateur' });
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
  
  // Route d'enregistrement utilisateur
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
      const token = jwt.sign({ id: newUser.id, email: newUser.email, role: 'user' }, secretKey, { expiresIn: '1h' });
  
      // Répondez avec le jeton
      res.status(201).send({ message: 'User registered successfully', token });
    } catch (err) {
      console.error('Error registering user:', err);
      res.status(500).send({ message: 'Failed to register user' });
    }
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
// Route pour ajouter un produit
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
  
  // Route pour mettre à jour le type de produit
  app.put('/api/products/:id/type', async (req, res) => {
    const { id } = req.params;
    const { types } = req.body;
  
    if (!types || !Array.isArray(types)) {
      return res.status(400).json({ message: 'Types are required and should be an array' });
    }
  
    try {
      const query = `
        UPDATE products SET types = $1, updated_at = NOW() WHERE id = $2 RETURNING *
      `;
      const values = [types, id];
      const result = await pool.query(query, values);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error updating product types:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  });
  
  // Route pour supprimer un produit
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
// Route pour ajouter une promotion
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
  
  // Route pour supprimer une promotion
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
  
  // Route pour récupérer les promotions
  app.get('/api/promotions', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM promotions');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  });
// Route pour ajouter un fournisseur
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
  
  // Route pour récupérer les fournisseurs
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
  
  // Route pour mettre à jour un fournisseur
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
  
  // Route pour supprimer un fournisseur
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
// Route pour récupérer les commandes
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
  
  // Route pour supprimer une commande
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
  
  // Route pour récupérer les commandes d'un utilisateur
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
// Route pour ajouter un contact
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
  
  // Route pour récupérer les contacts
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
  
  // Route pour valider un contact
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
  
  // Route pour supprimer un contact
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
// Route pour ajouter des catégories de produits
app.post('/api/products/categories', async (req, res) => {
    const { productIds } = req.body;
    try {
      console.log('Received productIds:', productIds);
      if (!Array.isArray(productIds) || productIds.length === 0) {
        throw new Error('Invalid productIds format');
      }
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
// Route pour ajouter un admin
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
  
  // Route pour récupérer les admins
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
  
  // Route pour mettre à jour le rôle d'un admin
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
  
  // Route pour supprimer un admin
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
// Route pour récupérer la liste des utilisateurs
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
  
  // Route pour récupérer les informations de l'utilisateur par ID
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
// Route pour enregistrer un produit aimé
app.post('/api/liked-products', (req, res) => {
    const { userId, product } = req.body;
  
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
  
  // Route pour récupérer les produits aimés d'un utilisateur
  app.get('/api/user-activities/liked-products/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const query = `
        SELECT ulp.product, p.name 
        FROM user_liked_products ulp 
        JOIN products p ON CAST(ulp.product AS INTEGER) = p.id 
        WHERE ulp.user_id = $1
      `;
      const values = [userId];
      const result = await pool.query(query, values);
  
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits aimés:', error.message);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });
// Route pour enregistrer un achat
app.post('/api/purchases', (req, res) => {
    const { userId, product } = req.body;
  
    if (!userId || !product) {
      return res.status(400).json({ message: 'userId et product sont requis' });
    }
  
    const query = 'INSERT INTO user_purchases (user_id, product) VALUES ($1, $2)';
    pool.query(query, [userId, product])
      .then(result => {
        res.status(201).json({ message: 'Achat enregistré avec succès' });
      })
      .catch(error => {
        console.error('Erreur lors de l\'enregistrement de l\'achat:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
      });
  });
  
  // Route pour récupérer les achats d'un utilisateur
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
// Route pour récupérer les rapports de ventes
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
  
  // Route pour générer un token PayPal
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
  
  // Route pour confirmer le paiement
  app.post('/api/confirm-payment', async (req, res) => {
    const { pendingOrderId, transactionId } = req.body;
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      const pendingOrderQuery = 'SELECT * FROM pending_orders WHERE order_id = $1';
      const pendingOrderResult = await client.query(pendingOrderQuery, [pendingOrderId]);
  
      if (pendingOrderResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).send({ message: 'Pending order not found' });
      }
  
      const pendingOrder = pendingOrderResult.rows[0];
  
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
  
      const deletePendingOrderQuery = 'DELETE FROM pending_orders WHERE order_id = $1';
      await client.query(deletePendingOrderQuery, [pendingOrderId]);
  
      await client.query('COMMIT');
      res.status(200).send({ message: 'Payment confirmed and order placed', orderId: order.id, totalPrice: order.total_price, trackingNumber: order.tracking_number });
    } catch (err) {
      await client.query('ROLLBACK');
      res.status(500).send({ message: 'Payment confirmation failed', error: err });
    } finally {
      client.release();
    }
  });
// Route pour enregistrer les connexions
app.post('/api/user-logins', (req, res) => {
    const { userId } = req.body;
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
// Route pour obtenir les informations de suivi
app.get('/api/track-order/:trackingNumber', async (req, res) => {
    const { trackingNumber } = req.params;
    try {
      const query = `SELECT user_name, user_address, status, updated_at, payment_method, total_price, tracking_number FROM orders WHERE tracking_number = $1`;
      const values = [trackingNumber];
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Tracking number not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching tracking information:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  });
  
  // Route pour mettre à jour le statut de suivi
  app.put('/api/update-tracking/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { status, paymentMethod } = req.body;
  
    if (!status || !paymentMethod) {
      return res.status(400).json({ message: 'Status and payment method are required' });
    }
  
    try {
      const query = `
        UPDATE orders SET status = $1, payment_method = $2, updated_at = NOW() WHERE id = $3 RETURNING *
      `;
      const values = [status, paymentMethod, orderId];
      const result = await pool.query(query, values);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  });
// Servir les fichiers frontend après les routes API
app.use(express.static(path.join(__dirname, '../ecommerce_website/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../ecommerce_website/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  updateOldProducts();
  setInterval(updateOldProducts, 24 * 60 * 60 * 1000); // Toutes les 24 heures
});

// Fonction pour mettre à jour les anciens produits
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

module.exports = app;
                                