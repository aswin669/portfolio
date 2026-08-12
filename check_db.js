require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
pool.query("SELECT * FROM settings WHERE key IN ('admin_email', 'admin_password')").then(res => {
  console.log(res.rows);
  pool.end();
}).catch(console.error);
