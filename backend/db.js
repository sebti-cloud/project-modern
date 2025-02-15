const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'ma_base_de_donnees',
  password: 'pwd123',
  port: 5432,
});

client.connect().catch(err => console.error('Connection error', err.stack));

module.exports = client;
