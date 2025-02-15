const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/admin-dashboard', (req, res) => {
    res.send('Bienvenue dans le tableau de bord de l\'administrateur');
});

module.exports = router;
