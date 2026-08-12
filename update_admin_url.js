require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function updateAdminUrls() {
  const data = JSON.parse(fs.readFileSync('./data/projects.json', 'utf8'));
  for (const p of data) {
    if (p.adminUrl) {
      await pool.query('UPDATE projects SET admin_url = $1 WHERE slug = $2', [p.adminUrl, p.slug]);
      console.log(`Updated admin_url for ${p.slug}`);
    }
  }
  pool.end();
}

updateAdminUrls().catch(console.error);
