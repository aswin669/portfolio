import { Pool } from 'pg';

const connStr = process.env.DATABASE_URL || '';
const needsSSL = connStr.includes('sslmode=require') || (connStr.includes('render.com') && !connStr.includes('.internal'));

const pool = new Pool({
  connectionString: connStr || undefined,
  ssl: needsSSL ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function query(sql: string, params?: any[]) {
  const result = await pool.query(sql, params);
  return result.rows;
}

async function initTables() {
  await query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE,
      title VARCHAR(255) DEFAULT '',
      description TEXT DEFAULT '',
      content TEXT DEFAULT '',
      category VARCHAR(255) DEFAULT '',
      stack VARCHAR(255) DEFAULT '',
      status VARCHAR(50) DEFAULT 'Draft',
      image VARCHAR(500) DEFAULT '',
      featured BOOLEAN DEFAULT FALSE,
      meta_title VARCHAR(255) DEFAULT '',
      meta_desc TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS no_index BOOLEAN DEFAULT FALSE;
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS canonical BOOLEAN DEFAULT FALSE;
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS tagline TEXT DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS problem TEXT DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution TEXT DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS tech VARCHAR(255) DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS year VARCHAR(50) DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS type VARCHAR(255) DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS case_no VARCHAR(255) DEFAULT '';
    UPDATE projects SET name = title WHERE name = '';
    UPDATE projects SET tagline = description WHERE tagline = '';
    UPDATE projects SET tech = stack WHERE tech = '';
    UPDATE projects SET year = '' WHERE year IS NULL;
    UPDATE projects SET type = '' WHERE type IS NULL;
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_url VARCHAR(500) DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS admin_url VARCHAR(500) DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS architecture TEXT DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS features TEXT DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS journey TEXT DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS architecture_flow TEXT DEFAULT '';
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE,
      title VARCHAR(255) DEFAULT '',
      content TEXT DEFAULT '',
      excerpt TEXT DEFAULT '',
      category VARCHAR(255) DEFAULT '',
      tags TEXT[] DEFAULT '{}',
      image VARCHAR(500) DEFAULT '',
      published BOOLEAN DEFAULT FALSE,
      author VARCHAR(100) DEFAULT 'Admin',
      meta_title VARCHAR(255) DEFAULT '',
      meta_desc TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE,
      slug VARCHAR(255) DEFAULT '',
      count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS technologies (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE,
      slug VARCHAR(255) DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS media (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) DEFAULT '',
      url VARCHAR(500) DEFAULT '',
      type VARCHAR(100) DEFAULT 'image/jpeg',
      size INTEGER DEFAULT 0,
      uploaded_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) DEFAULT '',
      email VARCHAR(255) DEFAULT '',
      subject VARCHAR(255) DEFAULT '',
      message TEXT DEFAULT '',
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) DEFAULT '',
      role VARCHAR(255) DEFAULT '',
      content TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    );
    ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS quote TEXT DEFAULT '';
    ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS company VARCHAR(255) DEFAULT '';
    ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS image VARCHAR(500) DEFAULT '';
    ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 5;
    CREATE TABLE IF NOT EXISTS experience (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) DEFAULT '',
      company VARCHAR(255) DEFAULT '',
      start_date VARCHAR(100) DEFAULT '',
      end_date VARCHAR(100) DEFAULT '',
      highlights TEXT[] DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS analytics (
      id SERIAL PRIMARY KEY,
      path VARCHAR(500) DEFAULT '',
      timestamp TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR(255) PRIMARY KEY,
      value TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS logs (
      id SERIAL PRIMARY KEY,
      type VARCHAR(50) NOT NULL DEFAULT 'system',
      action VARCHAR(255) NOT NULL DEFAULT '',
      severity VARCHAR(20) NOT NULL DEFAULT 'info',
      message TEXT DEFAULT '',
      details JSONB DEFAULT '{}',
      user_info VARCHAR(255) DEFAULT '',
      email VARCHAR(255) DEFAULT '',
      ip_address VARCHAR(45) DEFAULT '',
      endpoint VARCHAR(255) DEFAULT '',
      method VARCHAR(10) DEFAULT '',
      status_code INT DEFAULT 0,
      response_time INT DEFAULT 0,
      request_id VARCHAR(255) DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

function camelToSnake(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    result[key.replace(/([A-Z])/g, (_, c) => `_${c.toLowerCase()}`)] = val;
  }
  return result;
}

async function seedTable(file: string, table: string, mapper: (row: any) => any) {
  const count = await query(`SELECT COUNT(*) as count FROM ${table}`);
  if (parseInt(count[0]?.count || '0') > 0) return;
  const fs = await import('fs');
  const path = await import('path');
  const filePath = path.join(process.cwd(), 'data', `${file}.json`);
  if (!fs.existsSync(filePath)) return;
  const rows = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  for (const row of rows) {
      const mapped = camelToSnake(mapper(row));
    const cols = Object.keys(mapped);
    const vals = Object.values(mapped);
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
    try {
      await query(`INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`, vals);
    } catch (e) {
      console.error(`Seed error for ${file}:`, e);
    }
  }
}

async function seedIfEmpty() {
  await Promise.all([
    seedTable('projects', 'projects', (r) => ({ name: r.name, slug: r.slug, title: r.name, tagline: r.tagline || '', description: r.tagline || r.description || '', problem: r.problem || '', solution: r.solution || '', content: (r.content || ''), category: r.category, stack: r.tech, tech: r.tech, status: r.status, image: r.image || '', featured: r.featured || false, noIndex: false, canonical: false, year: r.year || '', type: r.type || '', caseNo: r.caseNo || '', metaTitle: r.metaTitle, metaDesc: r.metaDesc, liveUrl: r.liveUrl || '', adminUrl: r.adminUrl || '', architecture: r.architecture || '', features: r.features || '', journey: r.journey || '', gallery: r.gallery || [], architectureFlow: r.architectureFlow || '' })),
    seedTable('blog', 'blog_posts', (r) => ({ title: r.title, slug: r.slug, excerpt: r.excerpt, content: r.content, author: r.author, tags: r.tags || [], published: r.published ?? false, image: r.image || '', category: r.category || '', metaTitle: r.metaTitle || '', metaDesc: r.metaDesc || '' })),
    seedTable('categories', 'categories', (r) => ({ name: r.name, slug: r.slug || '', count: r.count || 0 })),
    seedTable('technologies', 'technologies', (r) => ({ name: r.name, slug: r.slug || '' })),
    seedTable('testimonials', 'testimonials', (r) => ({ name: r.name, role: r.role || '', content: r.content || '', quote: r.quote || '', company: r.company || '', image: r.image || '', rating: r.rating || 5 })),
    seedTable('experience', 'experience', (r) => ({ title: r.title, company: r.company, startDate: r.startDate, endDate: r.endDate, highlights: r.highlights })),
    seedTable('media', 'media', (r) => ({ name: r.name || '', url: r.url, type: r.type || 'image/jpeg', size: r.size || 0 })),
    seedTable('contact', 'contacts', (r) => ({ name: r.name, email: r.email, subject: r.subject || '', message: r.message, read: r.read || false })),
    seedTable('analytics', 'analytics', (r) => ({ path: r.path, timestamp: r.timestamp })),
  ]);
  // Seed default settings
  const existing = await query('SELECT COUNT(*) as c FROM settings');
  if (parseInt(existing[0]?.c || '0') === 0) {
    const defaults: [string, string][] = [
      ['site_name', 'ASWIN S'],
      ['site_tagline', 'MERN Stack Developer crafting dynamic front-end interfaces and robust back-end solutions'],
      ['admin_email', process.env.ADMIN_EMAIL || 'Aswinsreedharan669@gmail.com'],
      ['admin_password', process.env.ADMIN_PASSWORD || 'admin123'],
      ['github_url', 'https://github.com/aswin669'],
      ['linkedin_url', 'https://linkedin.com/in/aswin669'],
      ['twitter_url', ''],
      ['email_address', 'Aswinsreedharan669@gmail.com'],
      ['meta_title', 'ASWIN S | MERN Stack Developer'],
      ['meta_description', 'MERN Stack Developer crafting dynamic front-end interfaces and robust back-end solutions'],
    ];
    for (const [k, v] of defaults) {
      await query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT DO NOTHING', [k, v]);
    }
  }
}

let initPromise: Promise<void> | null = null;

export async function ensureInitialized() {
  if (!process.env.DATABASE_URL) return;
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await initTables();
        await seedIfEmpty();
        await query(`INSERT INTO logs (type, action, severity, message) VALUES ('server', 'server_start', 'info', 'Database initialized and seeded')`);
      } catch (err) {
        console.error('DB init error:', err);
        initPromise = null;
      }
    })();
  }
  return initPromise;
}

function toCamelCase(row: any): any {
  if (!row) return row;
  const result: any = {};
  for (const key of Object.keys(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = row[key];
  }
  return result;
}

function toCamelArray(rows: any[]): any[] {
  return rows.map(toCamelCase);
}

// Projects
export async function getAllProjects() {
  await ensureInitialized();
  return toCamelArray(await query('SELECT * FROM projects ORDER BY created_at DESC'));
}

export async function getProject(idOrSlug: string | number) {
  await ensureInitialized();
  const isNum = typeof idOrSlug === 'number' || !isNaN(Number(idOrSlug));
  const rows = await query(
    `SELECT * FROM projects WHERE ${isNum ? 'id = $1' : 'slug = $1'}`,
    [isNum ? Number(idOrSlug) : idOrSlug]
  );
  return rows.length ? toCamelCase(rows[0]) : null;
}

export async function createProject(data: any) {
  await ensureInitialized();
  const { slug, title, name, description, tagline, content, problem, solution, category, stack, tech, status, image, featured, noIndex, canonical, metaTitle, metaDesc, year, type: ptype, caseNo, liveUrl, adminUrl, architecture, features, journey, gallery, architectureFlow } = data;
  const rows = await query(
    `INSERT INTO projects (slug, title, name, description, tagline, content, problem, solution, category, stack, tech, status, image, featured, no_index, canonical, meta_title, meta_desc, year, type, case_no, live_url, admin_url, architecture, features, journey, gallery, architecture_flow)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28) RETURNING *`,
    [slug||'', title||'', name||title||'', description||'', tagline||'', content||'', problem||'', solution||'', category||'', stack||'', tech||stack||'', status||'Draft', image||'', featured||false, noIndex||false, canonical||false, metaTitle||'', metaDesc||'', year||'', ptype||'', caseNo||'', liveUrl||'', adminUrl||'', architecture||'', features||'', journey||'', gallery||[], architectureFlow||'']
  );
  return toCamelCase(rows[0]);
}

export async function updateProject(id: number, data: any) {
  await ensureInitialized();
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const [key, val] of Object.entries(data)) {
    const dbKey = key.replace(/([A-Z])/g, (_, c) => `_${c.toLowerCase()}`);
    fields.push(`${dbKey} = $${idx++}`);
    values.push(val);
  }
  if (!fields.length) return getProject(id);
  fields.push(`updated_at = NOW()`);
  values.push(id);
  const rows = await query(
    `UPDATE projects SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows.length ? toCamelCase(rows[0]) : null;
}

export async function deleteProject(id: number) {
  await ensureInitialized();
  const rows = await query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
  return rows.length > 0;
}

// Blog
export async function getAllBlogPosts() {
  await ensureInitialized();
  return toCamelArray(await query('SELECT * FROM blog_posts ORDER BY created_at DESC'));
}

export async function getBlogPost(idOrSlug: string | number) {
  await ensureInitialized();
  const isNum = typeof idOrSlug === 'number' || !isNaN(Number(idOrSlug));
  const rows = await query(
    `SELECT * FROM blog_posts WHERE ${isNum ? 'id = $1' : 'slug = $1'}`,
    [isNum ? Number(idOrSlug) : idOrSlug]
  );
  return rows.length ? toCamelCase(rows[0]) : null;
}

export async function createBlogPost(data: any) {
  await ensureInitialized();
  const { title, slug, excerpt, content, author, tags, published, image, category, metaTitle, metaDesc } = data;
  const rows = await query(
    `INSERT INTO blog_posts (title, slug, excerpt, content, author, tags, published, image, category, meta_title, meta_desc)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [title||'', slug||'', excerpt||'', content||'', author||'Admin', tags||[], published||false, image||'', category||'', metaTitle||'', metaDesc||'']
  );
  return toCamelCase(rows[0]);
}

export async function updateBlogPost(id: number, data: any) {
  await ensureInitialized();
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const [key, val] of Object.entries(data)) {
    if (key === 'tags' && Array.isArray(val)) {
      fields.push(`tags = $${idx++}`);
      values.push(val);
    } else {
      const dbKey = key.replace(/([A-Z])/g, (_, c) => `_${c.toLowerCase()}`);
      fields.push(`${dbKey} = $${idx++}`);
      values.push(val);
    }
  }
  if (!fields.length) return getBlogPost(id);
  fields.push(`updated_at = NOW()`);
  values.push(id);
  const rows = await query(
    `UPDATE blog_posts SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows.length ? toCamelCase(rows[0]) : null;
}

export async function deleteBlogPost(id: number) {
  await ensureInitialized();
  const rows = await query('DELETE FROM blog_posts WHERE id = $1 RETURNING id', [id]);
  return rows.length > 0;
}

// Categories
export async function getAllCategories() {
  await ensureInitialized();
  return toCamelArray(await query('SELECT * FROM categories ORDER BY name'));
}

export async function createCategory(data: any) {
  await ensureInitialized();
  const rows = await query(
    'INSERT INTO categories (name, slug, count) VALUES ($1,$2,$3) RETURNING *',
    [data.name||'', data.slug||'', data.count||0]
  );
  return toCamelCase(rows[0]);
}

export async function deleteCategory(id: number) {
  await ensureInitialized();
  const rows = await query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
  return rows.length > 0;
}

// Technologies
export async function getAllTechnologies() {
  await ensureInitialized();
  return toCamelArray(await query('SELECT * FROM technologies ORDER BY name'));
}

export async function createTechnology(data: any) {
  await ensureInitialized();
  const rows = await query(
    'INSERT INTO technologies (name, slug) VALUES ($1,$2) RETURNING *',
    [data.name||'', data.slug||'']
  );
  return toCamelCase(rows[0]);
}

export async function deleteTechnology(id: number) {
  await ensureInitialized();
  const rows = await query('DELETE FROM technologies WHERE id = $1 RETURNING id', [id]);
  return rows.length > 0;
}

// Media
export async function getAllMedia() {
  await ensureInitialized();
  return toCamelArray(await query('SELECT * FROM media ORDER BY uploaded_at DESC'));
}

export async function getMediaItem(id: number) {
  await ensureInitialized();
  const rows = await query('SELECT * FROM media WHERE id = $1', [id]);
  return rows.length ? toCamelCase(rows[0]) : null;
}

export async function createMediaItem(data: any) {
  await ensureInitialized();
  const rows = await query(
    'INSERT INTO media (name, url, type, size) VALUES ($1,$2,$3,$4) RETURNING *',
    [data.name||'', data.url||'', data.type||'image/jpeg', data.size||0]
  );
  return toCamelCase(rows[0]);
}

export async function updateMediaItem(id: number, data: any) {
  await ensureInitialized();
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const [key, val] of Object.entries(data)) {
    const dbKey = key.replace(/([A-Z])/g, (_, c) => `_${c.toLowerCase()}`);
    fields.push(`${dbKey} = $${idx++}`);
    values.push(val);
  }
  if (!fields.length) return getMediaItem(id);
  values.push(id);
  const rows = await query(
    `UPDATE media SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows.length ? toCamelCase(rows[0]) : null;
}

export async function deleteMediaItem(id: number) {
  await ensureInitialized();
  const rows = await query('DELETE FROM media WHERE id = $1 RETURNING id', [id]);
  return rows.length > 0;
}

// Contacts
export async function getAllContacts() {
  await ensureInitialized();
  return toCamelArray(await query('SELECT * FROM contacts ORDER BY created_at DESC'));
}

export async function createContact(data: any) {
  await ensureInitialized();
  const rows = await query(
    'INSERT INTO contacts (name, email, subject, message, read) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [data.name||'', data.email||'', data.subject||'', data.message||'', data.read||false]
  );
  return toCamelCase(rows[0]);
}

export async function deleteContact(id: number) {
  await ensureInitialized();
  const rows = await query('DELETE FROM contacts WHERE id=$1 RETURNING id', [id]);
  return rows.length > 0;
}

// Testimonials
export async function getAllTestimonials() {
  await ensureInitialized();
  return toCamelArray(await query('SELECT * FROM testimonials ORDER BY created_at DESC'));
}

export async function createTestimonial(data: any) {
  await ensureInitialized();
  const rows = await query(
    'INSERT INTO testimonials (name, role, content, quote, company, image, rating) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
    [data.name||'', data.role||'', data.content||'', data.quote||'', data.company||'', data.image||'', data.rating||5]
  );
  return toCamelCase(rows[0]);
}

export async function updateTestimonial(id: number, data: any) {
  await ensureInitialized();
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const [key, val] of Object.entries(data)) {
    const dbKey = key.replace(/([A-Z])/g, (_, c) => `_${c.toLowerCase()}`);
    fields.push(`${dbKey} = $${idx++}`);
    values.push(val);
  }
  if (!fields.length) return null;
  values.push(id);
  const rows = await query(
    `UPDATE testimonials SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows.length ? toCamelCase(rows[0]) : null;
}

export async function deleteTestimonial(id: number) {
  await ensureInitialized();
  const rows = await query('DELETE FROM testimonials WHERE id = $1 RETURNING id', [id]);
  return rows.length > 0;
}

// Experience
export async function getAllExperience() {
  await ensureInitialized();
  return toCamelArray(await query('SELECT * FROM experience ORDER BY created_at DESC'));
}

export async function createExperience(data: any) {
  await ensureInitialized();
  const rows = await query(
    'INSERT INTO experience (title, company, start_date, end_date, highlights) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [data.title||'', data.company||'', data.startDate||'', data.endDate||'', data.highlights||[]]
  );
  return toCamelCase(rows[0]);
}

export async function updateExperience(id: number, data: any) {
  await ensureInitialized();
  const rows = await query(
    'UPDATE experience SET title=$1, company=$2, start_date=$3, end_date=$4, highlights=$5 WHERE id=$6 RETURNING *',
    [data.title||'', data.company||'', data.startDate||'', data.endDate||'', data.highlights||[], id]
  );
  return rows.length ? toCamelCase(rows[0]) : null;
}

export async function deleteExperience(id: number) {
  await ensureInitialized();
  const rows = await query('DELETE FROM experience WHERE id=$1 RETURNING id', [id]);
  return rows.length > 0;
}

// Analytics
export async function recordVisit(path: string) {
  await ensureInitialized();
  await query('INSERT INTO analytics (path) VALUES ($1)', [path]);
}

export async function getAnalytics(days: number) {
  await ensureInitialized();
  const daily = await query(
    `SELECT DATE(timestamp) as date, COUNT(*) as count
     FROM analytics
     WHERE timestamp >= NOW() - ($1 || ' days')::INTERVAL
     GROUP BY DATE(timestamp)
     ORDER BY date`,
    [days]
  );

  const totalResult = await query('SELECT COUNT(*) as count FROM analytics');
  const total = parseInt(totalResult[0]?.count || '0');

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayResult = await query(
    'SELECT COUNT(*) as count FROM analytics WHERE DATE(timestamp) = $1',
    [todayStr]
  );
  const today = parseInt(todayResult[0]?.count || '0');

  const weekResult = await query(
    'SELECT COUNT(*) as count FROM analytics WHERE timestamp >= NOW() - INTERVAL \'7 days\''
  );
  const thisWeek = parseInt(weekResult[0]?.count || '0');

  const topPagesResult = await query(
    'SELECT path, COUNT(*) as count FROM analytics GROUP BY path ORDER BY count DESC LIMIT 10'
  );

  // Fill in missing days
  const dayMap: Record<string, number> = {};
  for (const d of daily) {
    dayMap[d.date.toISOString().slice(0, 10)] = parseInt(d.count);
  }

  const fullDaily: { date: string; count: number }[] = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1) + i);
    const key = d.toISOString().slice(0, 10);
    fullDaily.push({ date: key, count: dayMap[key] || 0 });
  }

  return {
    daily: fullDaily,
    total,
    today,
    thisWeek,
    topPages: topPagesResult.map((r: any) => ({ path: r.path, count: parseInt(r.count) })),
  };
}

// Settings
export async function getAllSettings() {
  await ensureInitialized();
  const rows = await query('SELECT key, value FROM settings');
  const result: Record<string, string> = {};
  for (const r of rows) result[r.key] = r.value;
  return result;
}

export async function upsertSetting(key: string, value: string) {
  await ensureInitialized();
  await query(
    'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
    [key, value]
  );
}

export async function getSetting(key: string) {
  await initPromise;
  const rows = await query('SELECT value FROM settings WHERE key = $1', [key]);
  return rows.length ? rows[0].value : null;
}


