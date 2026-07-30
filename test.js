const { Client } = require('pg');

async function test() {
  const client = new Client('postgresql://vdcd_user:testpass@localhost:5432/vdcd_db');
  await client.connect();
  const res = await client.query("SELECT id, title FROM article WHERE title ILIKE '%a%'");
  console.log('articles:', res.rows);
  await client.end();
}
test().catch(console.error);
