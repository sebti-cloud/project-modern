const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Route de login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérification si l'utilisateur existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('User not found');
    }

    // Vérification du mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send('Invalid password');
    }

    // Création et assignation du token
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).send('Logged in');
  } catch (err) {
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
