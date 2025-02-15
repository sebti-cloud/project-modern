const pool = require('../db');
const bcrypt = require('bcrypt');

// Fonction pour trouver un admin par nom d'utilisateur
async function findAdminByUsername(username) {
  try {
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    return result.rows[0];
  } catch (err) {
    console.error('Erreur lors de la recherche d\'un administrateur par nom d\'utilisateur', err);
    throw err;
  }
}

// Fonction pour comparer le mot de passe
async function comparePassword(plainPassword, hashedPassword) {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (err) {
    console.error('Erreur lors de la comparaison des mots de passe', err);
    throw err;
  }
}

module.exports = {
  findAdminByUsername,
  comparePassword
};
