const express = require('express');
const router = express.Router();
const { createUser } = require('../models/userModel');
const { verifyToken, isAdminPrincipal } = require('../middleware/authMiddleware');

// Route pour ajouter un administrateur
router.post('/add-admin', verifyToken, isAdminPrincipal, async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = await createUser(username, password, 'admin');
    res.status(201).send('New admin added successfully.');
  } catch (err) {
    res.status(500).send('Error adding new admin.');
  }
});

module.exports = router;
