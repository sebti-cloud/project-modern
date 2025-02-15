const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Assure-toi de configurer correctement ton fichier de connexion à la base de données
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const admin = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (admin.rows.length === 0) return res.status(400).send('Username or password is incorrect');

    const validPass = await bcrypt.compare(password, admin.rows[0].password);
    if (!validPass) return res.status(400).send('Invalid password');

    const token = jwt.sign({ id: admin.rows[0].id }, process.env.JWT_SECRET);
    res.cookie('token', token, { httpOnly: true }).send('Logged in!');
});

module.exports = router;
