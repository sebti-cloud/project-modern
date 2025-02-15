const jwt = require('jsonwebtoken');
const pool = require('../db'); // Importez votre pool de connexion PostgreSQL

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(403); // Pas de token trouvé

  jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
    if (err) return res.sendStatus(403); // Token non valide

    try {
      const query = 'SELECT * FROM admins WHERE id = $1';
      const values = [user.id];
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.sendStatus(403); // Utilisateur non trouvé
      }

      req.user = result.rows[0];
      next();
    } catch (error) {
      console.error('Error verifying user:', error);
      return res.sendStatus(500); // Erreur interne du serveur
    }
  });
};

module.exports = authenticateToken;
