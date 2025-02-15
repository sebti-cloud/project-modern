const { Pool } = require('pg');
const pool = new Pool();

const bcrypt = require('bcrypt');

const createAdmin = async (username, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO admins (username, password, role) VALUES ($1, $2, $3) RETURNING *`;
  const values = [username, hashedPassword, role];
  
  const res = await pool.query(query, values);
  return res.rows[0];
};

const findAdminByUsername = async (username) => {
  const query = `SELECT * FROM admins WHERE username = $1`;
  const res = await pool.query(query, [username]);
  return res.rows[0];
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = { createAdmin, findAdminByUsername, comparePassword };
