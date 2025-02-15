const express = require('express');
const router = express.Router();
const { verifyToken, isAdminPrincipal } = require('../middleware/authMiddleware');
const User = require('../models/userModel'); // Assure-toi que cette ligne est correcte

// Route pour ajouter un administrateur
router.post('/add-admin', verifyToken, isAdminPrincipal, async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = new User({
      username,
      password,
      role: 'admin'  // Assure-toi que le rôle est admin
    });

    await newUser.save();
    res.status(201).send('New admin added successfully.');
  } catch (err) {
    res.status(500).send('Error adding new admin.');
  }
});

module.exports = router;
