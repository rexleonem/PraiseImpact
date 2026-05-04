const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  try {
    console.log('Testing connection to:', process.env.DATABASE_URL.split('@')[1]);
    const res = await pool.query('SELECT NOW()');
    console.log('Connection successful:', res.rows[0]);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await pool.end();
  }
}

test();
