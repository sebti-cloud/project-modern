const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../db');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log('Reçu:', username, password); // Ajoute cette ligne pour vérifier ce qui est reçu

    const admin = await client.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (admin.rows.length === 0) return res.status(400).send('Username or password is incorrect');

    const validPass = await bcrypt.compare(password, admin.rows[0].password);
    if (!validPass) return res.status(400).send('Invalid password');

    const token = jwt.sign({ id: admin.rows[0].id }, process.env.JWT_SECRET);
    res.cookie('token', token, { httpOnly: true }).send('Logged in!');
});

module.exports = router;
