const express = require('express');
const router = express.Router();
const { createUser, findUserByUsername, comparePassword } = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Route de login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérification si l'utilisateur existe
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(400).send('User not found');
    }

    // Vérification du mot de passe
    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(400).send('Invalid password');
    }

    // Création et assignation du token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).send('Logged in');
  } catch (err) {
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
