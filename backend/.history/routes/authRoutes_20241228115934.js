const express = require('express');
const router = express.Router();
const { findAdminByUsername, comparePassword } = require('../models/adminModel');
const jwt = require('jsonwebtoken');

// Route de login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(`Tentative de connexion avec l'utilisateur : ${username}`);
    console.log('Types des valeurs reçues :', {
      username: typeof username,
      password: typeof password,
    });

    // Vérification si l'utilisateur existe
    const admin = await findAdminByUsername(username);
    if (!admin) {
      console.error('Admin not found');
      return res.status(400).send('Admin not found');
    }

    console.log('Admin trouvé :', admin);

    // Vérification du mot de passe
    const validPassword = await comparePassword(password, admin.password);
    if (!validPassword) {
      console.error('Invalid password');
      return res.status(400).send('Invalid password');
    }

    console.log('Mot de passe valide');

    // Création et assignation du token
    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token généré :', token);
    res.cookie('token', token, { httpOnly: true }).send('Logged in');
  } catch (err) {
    console.error('Internal server error', err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
