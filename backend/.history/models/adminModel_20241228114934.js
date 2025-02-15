const { Pool } = require('pg');
const pool = new Pool();

const bcrypt = require('bcrypt');

const createAdmin = async (username, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO admins (username, password, role) VALUES ($1, $2, $3) RETURNING *`;
  const values = [username, hashedPassword, role];
  
  try {
    console.log(`Insertion d'un nouvel admin avec : ${username}, ${hashedPassword}, ${role}`);
    console.log('Types des valeurs :', {
      username: typeof username,
      hashedPassword: typeof hashedPassword,
      role: typeof role
    });
    const res = await pool.query(query, values);
    console.log('Admin créé:', res.rows[0]);
    return res.rows[0];
  } catch (err) {
    console.error('Erreur lors de la création d\'un administrateur', err);
    throw err;
  }
};

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
    console.log(`Comparaison du mot de passe : ${password} avec le mot de passe haché : ${hashedPassword}`);
    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    console.error('Erreur lors de la comparaison des mots de passe', err);
    throw err;
  }
};

module.exports = { createAdmin, findAdminByUsername, comparePassword };
