const express = require('express');
const router = express.Router();
const { findAdminByUsername, comparePassword } = require('../models/adminModel');
const jwt = require('jsonwebtoken');

// Route de login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérification si l'utilisateur existe
    const admin = await findAdminByUsername(username);
    if (!admin) {
      console.error('Admin not found');
      return res.status(400).send('Admin not found');
    }

    // Vérification du mot de passe
    const validPassword = await comparePassword(password, admin.password);
    if (!validPassword) {
      console.error('Invalid password');
      return res.status(400).send('Invalid password');
    }

    // Création et assignation du token
    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).send('Logged in');
  } catch (err) {
    console.error('Internal server error', err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
