require('dotenv').config({ path: '.env.development' });
const { Client } = require('pg');
const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('Connected to DB. Creating extension...');
    return client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  })
  .then(res => {
    console.log('Extension created successfully:', res);
    client.end();
  })
  .catch(e => {
    console.error('Error:', e.message);
    client.end();
  });
