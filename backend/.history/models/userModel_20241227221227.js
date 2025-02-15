const { Pool } = require('pg');
const pool = new Pool();

const bcrypt = require('bcrypt');

const createUser = async (username, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *`;
  const values = [username, hashedPassword, role];
  
  const res = await pool.query(query, values);
  return res.rows[0];
};

const findUserByUsername = async (username) => {
  const query = `SELECT * FROM users WHERE username = $1`;
  const res = await pool.query(query, [username]);
  return res.rows[0];
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = { createUser, findUserByUsername, comparePassword };
