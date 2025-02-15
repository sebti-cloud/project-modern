const { Pool } = require('pg');
const pool = new Pool();

const bcrypt = require('bcrypt');

const findAdminByUsername = async (username) => {
  const query = `SELECT * FROM admins WHERE username = $1`;
  try {
    console.log(`Exécution de la requête : ${query}, avec username : ${username}`);
    const res = await pool.query(query, [username]);
    console.log('Résultat de la requête:', res.rows[0]);
    return res.rows[0];
  } catch (err) {
    console.error('Erreur lors de la recherche d\'un administrateur par nom d\'utilisateur', err);
    throw err;
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    console.error('Erreur lors de la comparaison des mots de passe', err);
    throw err;
  }
};

module.exports = { findAdminByUsername, comparePassword };
