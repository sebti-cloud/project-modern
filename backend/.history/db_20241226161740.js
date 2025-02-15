const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'ma_base_de_donnees',
  password: 'pwd123',  // Utilisez le mot de passe correct ici
  port: 5432,
});

client.connect();

module.exports = client;
