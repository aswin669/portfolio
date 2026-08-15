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
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS demo_links TEXT DEFAULT '[]';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS architecture TEXT DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS features TEXT DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS journey TEXT DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS architecture_flow TEXT DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
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
    ALTER TABLE analytics ADD COLUMN IF NOT EXISTS session_id VARCHAR(255) DEFAULT '';
    ALTER TABLE analytics ADD COLUMN IF NOT EXISTS visitor_id VARCHAR(255) DEFAULT '';
    ALTER TABLE analytics ADD COLUMN IF NOT EXISTS referrer VARCHAR(500) DEFAULT '';
    ALTER TABLE analytics ADD COLUMN IF NOT EXISTS device_type VARCHAR(50) DEFAULT 'Desktop';
    ALTER TABLE analytics ADD COLUMN IF NOT EXISTS os VARCHAR(100) DEFAULT 'Unknown';
    ALTER TABLE analytics ADD COLUMN IF NOT EXISTS browser VARCHAR(100) DEFAULT 'Unknown';
    ALTER TABLE analytics ADD COLUMN IF NOT EXISTS screen_res VARCHAR(50) DEFAULT '';
    ALTER TABLE analytics ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT '';
    ALTER TABLE analytics ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Unknown';
    ALTER TABLE analytics ADD COLUMN IF NOT EXISTS region VARCHAR(100) DEFAULT '';
    ALTER TABLE analytics ADD COLUMN IF NOT EXISTS city VARCHAR(100) DEFAULT '';
    ALTER TABLE analytics ADD COLUMN IF NOT EXISTS ip VARCHAR(45) DEFAULT '';
    ALTER TABLE analytics ADD COLUMN IF NOT EXISTS duration_seconds INT DEFAULT 0;
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
    CREATE TABLE IF NOT EXISTS showcase_items (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) DEFAULT '',
      subtitle TEXT DEFAULT '',
      category VARCHAR(255) DEFAULT '',
      description TEXT DEFAULT '',
      image_url VARCHAR(500) NOT NULL,
      display_order INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
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
    seedTable('projects', 'projects', (r) => ({ name: r.name, slug: r.slug, title: r.name, tagline: r.tagline || '', description: r.tagline || r.description || '', problem: r.problem || '', solution: r.solution || '', content: (r.content || ''), category: r.category, stack: r.tech, tech: r.tech, status: r.status, image: r.image || '', featured: r.featured || false, noIndex: false, canonical: false, year: r.year || '', type: r.type || '', caseNo: r.caseNo || '', metaTitle: r.metaTitle, metaDesc: r.metaDesc, liveUrl: r.liveUrl || '', adminUrl: r.adminUrl || '', demoLinks: r.demoLinks || '[]', architecture: r.architecture || '', features: r.features || '', journey: r.journey || '', gallery: r.gallery || [], architectureFlow: r.architectureFlow || '' })),
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
  const { slug, title, name, description, tagline, content, problem, solution, category, stack, tech, status, image, featured, noIndex, canonical, metaTitle, metaDesc, year, type: ptype, caseNo, liveUrl, adminUrl, demoLinks, architecture, features, journey, gallery, architectureFlow, tags } = data;
  const rows = await query(
    `INSERT INTO projects (slug, title, name, description, tagline, content, problem, solution, category, stack, tech, status, image, featured, no_index, canonical, meta_title, meta_desc, year, type, case_no, live_url, admin_url, demo_links, architecture, features, journey, gallery, architecture_flow, tags)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30) RETURNING *`,
    [slug||'', title||'', name||title||'', description||'', tagline||'', content||'', problem||'', solution||'', category||'', stack||'', tech||stack||'', status||'Draft', image||'', featured||false, noIndex||false, canonical||false, metaTitle||'', metaDesc||'', year||'', ptype||'', caseNo||'', liveUrl||'', adminUrl||'', demoLinks||'[]', architecture||'', features||'', journey||'', gallery||[], architectureFlow||'', tags||[]]
  );
  return toCamelCase(rows[0]);
}

export async function updateProject(id: number, data: any) {
  await ensureInitialized();
  const allowedKeys: Record<string, string> = {
    slug: 'slug',
    title: 'title',
    name: 'name',
    description: 'description',
    tagline: 'tagline',
    content: 'content',
    problem: 'problem',
    solution: 'solution',
    category: 'category',
    stack: 'stack',
    tech: 'tech',
    status: 'status',
    image: 'image',
    featured: 'featured',
    noIndex: 'no_index',
    no_index: 'no_index',
    canonical: 'canonical',
    metaTitle: 'meta_title',
    meta_title: 'meta_title',
    metaDesc: 'meta_desc',
    meta_desc: 'meta_desc',
    year: 'year',
    type: 'type',
    caseNo: 'case_no',
    case_no: 'case_no',
    liveUrl: 'live_url',
    live_url: 'live_url',
    adminUrl: 'admin_url',
    admin_url: 'admin_url',
    demoLinks: 'demo_links',
    demo_links: 'demo_links',
    architecture: 'architecture',
    features: 'features',
    journey: 'journey',
    gallery: 'gallery',
    architectureFlow: 'architecture_flow',
    architecture_flow: 'architecture_flow',
    tags: 'tags',
  };

  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const [key, val] of Object.entries(data)) {
    const dbKey = allowedKeys[key];
    if (!dbKey) continue; // Skip unknown keys safely

    let valueToStore = val;
    if (['demoLinks', 'architectureFlow', 'features', 'journey'].includes(key) && typeof val === 'object' && val !== null) {
      valueToStore = JSON.stringify(val);
    }

    fields.push(`${dbKey} = $${idx++}`);
    values.push(valueToStore);
  }

  if (!fields.length) return getProject(id);
  fields.push('updated_at = NOW()');
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
  const allowedKeys: Record<string, string> = {
    title: 'title',
    slug: 'slug',
    excerpt: 'excerpt',
    content: 'content',
    author: 'author',
    tags: 'tags',
    published: 'published',
    image: 'image',
    category: 'category',
    metaTitle: 'meta_title',
    meta_title: 'meta_title',
    metaDesc: 'meta_desc',
    meta_desc: 'meta_desc',
  };

  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const [key, val] of Object.entries(data)) {
    const dbKey = allowedKeys[key];
    if (!dbKey) continue; // Skip unknown keys safely

    fields.push(`${dbKey} = $${idx++}`);
    values.push(val);
  }

  if (!fields.length) return getBlogPost(id);
  fields.push('updated_at = NOW()');
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
export async function recordVisit(data: string | {
  path: string;
  sessionId?: string;
  visitorId?: string;
  referrer?: string;
  deviceType?: string;
  os?: string;
  browser?: string;
  screenRes?: string;
  language?: string;
  country?: string;
  region?: string;
  city?: string;
  ip?: string;
  durationSeconds?: number;
}) {
  await ensureInitialized();
  const payload = typeof data === 'string' ? { path: data } : data;
  const {
    path = '/',
    sessionId = '',
    visitorId = '',
    referrer = '',
    deviceType = 'Desktop',
    os = 'Unknown',
    browser = 'Unknown',
    screenRes = '',
    language = '',
    country = 'Unknown',
    region = '',
    city = '',
    ip = '',
    durationSeconds = 0,
  } = payload;

  await query(
    `INSERT INTO analytics (path, session_id, visitor_id, referrer, device_type, os, browser, screen_res, language, country, region, city, ip, duration_seconds)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [
      path || '/',
      sessionId || '',
      visitorId || '',
      referrer || 'Direct / None',
      deviceType || 'Desktop',
      os || 'Unknown',
      browser || 'Unknown',
      screenRes || '',
      language || '',
      country || 'Unknown',
      region || '',
      city || '',
      ip || '',
      durationSeconds || 0,
    ]
  );
}

export async function getAnalytics(options?: number | {
  days?: number;
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  device?: string;
}) {
  await ensureInitialized();
  const opts = typeof options === 'number' ? { days: options } : (options || {});
  const days = Math.min(Math.max(opts.days || 7, 1), 365);
  const page = Math.max(opts.page || 1, 1);
  const limit = Math.min(Math.max(opts.limit || 15, 5), 100);
  const offset = (page - 1) * limit;
  const search = (opts.search || '').trim().toLowerCase();
  const filterCountry = (opts.country || '').trim();
  const filterDevice = (opts.device || '').trim();

  // Daily trend views & visitors
  const daily = await query(
    `SELECT DATE(timestamp) as date, COUNT(*) as count, COUNT(DISTINCT visitor_id) as visitors
     FROM analytics
     WHERE timestamp >= NOW() - ($1 || ' days')::INTERVAL
     GROUP BY DATE(timestamp)
     ORDER BY date`,
    [days]
  );

  // Overall counts
  const totalResult = await query('SELECT COUNT(*) as count, COUNT(DISTINCT visitor_id) as visitors, COUNT(DISTINCT session_id) as sessions, COALESCE(AVG(duration_seconds), 0) as avg_duration FROM analytics');
  const total = parseInt(totalResult[0]?.count || '0');
  const totalVisitors = parseInt(totalResult[0]?.visitors || '0');
  const totalSessions = parseInt(totalResult[0]?.sessions || '0');
  const avgDuration = Math.round(parseFloat(totalResult[0]?.avg_duration || '0'));

  // Live active visitors (in last 5 mins)
  const liveResult = await query(
    `SELECT COUNT(DISTINCT COALESCE(NULLIF(visitor_id, ''), NULLIF(session_id, ''), id::text)) as count
     FROM analytics
     WHERE timestamp >= NOW() - INTERVAL '5 minutes'`
  );
  const liveVisitors = parseInt(liveResult[0]?.count || '0');

  // Today, week, month
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayResult = await query('SELECT COUNT(*) as count FROM analytics WHERE DATE(timestamp) = $1', [todayStr]);
  const today = parseInt(todayResult[0]?.count || '0');

  const weekResult = await query('SELECT COUNT(*) as count FROM analytics WHERE timestamp >= NOW() - INTERVAL \'7 days\'');
  const thisWeek = parseInt(weekResult[0]?.count || '0');

  const monthResult = await query('SELECT COUNT(*) as count FROM analytics WHERE timestamp >= NOW() - INTERVAL \'30 days\'');
  const thisMonth = parseInt(monthResult[0]?.count || '0');

  // New vs Returning Visitors
  const returningResult = await query(
    `SELECT COUNT(*) as count FROM (
       SELECT visitor_id FROM analytics WHERE visitor_id != '' GROUP BY visitor_id HAVING COUNT(*) > 1
     ) sub`
  );
  const returningCount = parseInt(returningResult[0]?.count || '0');
  const newCount = Math.max(0, totalVisitors - returningCount);

  // Top Pages
  const topPagesResult = await query(
    'SELECT path, COUNT(*) as count FROM analytics GROUP BY path ORDER BY count DESC LIMIT 10'
  );

  // Top Referrers
  const topReferrersResult = await query(
    `SELECT COALESCE(NULLIF(referrer, ''), 'Direct / None') as referrer, COUNT(*) as count
     FROM analytics
     GROUP BY referrer
     ORDER BY count DESC LIMIT 10`
  );

  // Device Breakdown
  const deviceResult = await query(
    `SELECT COALESCE(NULLIF(device_type, ''), 'Desktop') as type, COUNT(*) as count
     FROM analytics
     GROUP BY type
     ORDER BY count DESC`
  );

  // Browser Breakdown
  const browserResult = await query(
    `SELECT COALESCE(NULLIF(browser, ''), 'Unknown') as name, COUNT(*) as count
     FROM analytics
     GROUP BY name
     ORDER BY count DESC LIMIT 8`
  );

  // Operating System Breakdown
  const osResult = await query(
    `SELECT COALESCE(NULLIF(os, ''), 'Unknown') as name, COUNT(*) as count
     FROM analytics
     GROUP BY name
     ORDER BY count DESC LIMIT 8`
  );

  // Location Breakdown (Country, Region, City)
  const locationResult = await query(
    `SELECT COALESCE(NULLIF(country, ''), 'Unknown') as country,
            COALESCE(NULLIF(region, ''), 'Unknown') as region,
            COALESCE(NULLIF(city, ''), 'Unknown') as city,
            COUNT(*) as count
     FROM analytics
     GROUP BY country, region, city
     ORDER BY count DESC LIMIT 15`
  );

  // Fill in missing daily entries
  const dayMap: Record<string, { count: number; visitors: number }> = {};
  for (const d of daily) {
    const key = new Date(d.date).toISOString().slice(0, 10);
    dayMap[key] = { count: parseInt(d.count || '0'), visitors: parseInt(d.visitors || '0') };
  }

  const fullDaily: { date: string; count: number; visitors: number }[] = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1) + i);
    const key = d.toISOString().slice(0, 10);
    fullDaily.push({ date: key, count: dayMap[key]?.count || 0, visitors: dayMap[key]?.visitors || 0 });
  }

  // Filtered & Paginated Visitor Logs
  let whereClauses: string[] = [];
  let queryParams: any[] = [];
  let paramIdx = 1;

  if (search) {
    whereClauses.push(`(LOWER(path) LIKE $${paramIdx} OR LOWER(visitor_id) LIKE $${paramIdx} OR LOWER(referrer) LIKE $${paramIdx} OR LOWER(country) LIKE $${paramIdx} OR LOWER(city) LIKE $${paramIdx} OR LOWER(browser) LIKE $${paramIdx})`);
    queryParams.push(`%${search}%`);
    paramIdx++;
  }
  if (filterCountry) {
    whereClauses.push(`LOWER(country) = $${paramIdx}`);
    queryParams.push(filterCountry.toLowerCase());
    paramIdx++;
  }
  if (filterDevice) {
    whereClauses.push(`LOWER(device_type) = $${paramIdx}`);
    queryParams.push(filterDevice.toLowerCase());
    paramIdx++;
  }

  const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const totalLogsCountRes = await query(`SELECT COUNT(*) as count FROM analytics ${whereStr}`, queryParams);
  const totalLogs = parseInt(totalLogsCountRes[0]?.count || '0');

  const logsQuery = `
    SELECT id, path, session_id, visitor_id, referrer, device_type, os, browser, screen_res, language, country, region, city, ip, duration_seconds, timestamp
    FROM analytics
    ${whereStr}
    ORDER BY timestamp DESC
    LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
  `;
  const logsResult = await query(logsQuery, [...queryParams, limit, offset]);

  const visitorLogs = logsResult.map((r: any) => ({
    id: r.id,
    path: r.path || '/',
    sessionId: r.session_id || `SES-${r.id}`,
    visitorId: r.visitor_id || `VIS-${String(r.id).padStart(6, '0')}`,
    referrer: r.referrer || 'Direct / None',
    deviceType: r.device_type || 'Desktop',
    os: r.os || 'Unknown',
    browser: r.browser || 'Unknown',
    screenRes: r.screen_res || 'N/A',
    language: r.language || 'en-US',
    country: r.country || 'Unknown',
    region: r.region || '',
    city: r.city || '',
    ip: r.ip ? r.ip.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, '$1.$2.*.*') : '127.0.0.1',
    durationSeconds: parseInt(r.duration_seconds || '0'),
    timestamp: r.timestamp,
  }));

  return {
    daily: fullDaily,
    total,
    totalVisitors,
    totalSessions,
    liveVisitors,
    today,
    thisWeek,
    thisMonth,
    avgDuration,
    newVsReturning: { new: newCount, returning: returningCount },
    topPages: topPagesResult.map((r: any) => ({ path: r.path, count: parseInt(r.count) })),
    topReferrers: topReferrersResult.map((r: any) => ({ referrer: r.referrer, count: parseInt(r.count) })),
    devices: deviceResult.map((r: any) => ({ type: r.type, count: parseInt(r.count) })),
    browsers: browserResult.map((r: any) => ({ name: r.name, count: parseInt(r.count) })),
    operatingSystems: osResult.map((r: any) => ({ name: r.name, count: parseInt(r.count) })),
    locations: locationResult.map((r: any) => ({ country: r.country, region: r.region, city: r.city, count: parseInt(r.count) })),
    logs: visitorLogs,
    pagination: {
      page,
      limit,
      total: totalLogs,
      totalPages: Math.ceil(totalLogs / limit) || 1,
    },
  };
}

export async function exportAnalyticsCSV() {
  await ensureInitialized();
  const rows = await query(`
    SELECT id, timestamp, visitor_id, session_id, path, referrer, device_type, os, browser, country, region, city, duration_seconds
    FROM analytics
    ORDER BY timestamp DESC
    LIMIT 5000
  `);

  const headers = ['ID', 'Timestamp', 'Visitor ID', 'Session ID', 'Path', 'Referrer', 'Device', 'OS', 'Browser', 'Country', 'Region', 'City', 'Duration (s)'];
  const csvLines = [headers.join(',')];

  rows.forEach((r: any) => {
    const line = [
      r.id,
      `"${new Date(r.timestamp).toISOString()}"`,
      `"${r.visitor_id || ''}"`,
      `"${r.session_id || ''}"`,
      `"${(r.path || '').replace(/"/g, '""')}"`,
      `"${(r.referrer || '').replace(/"/g, '""')}"`,
      `"${r.device_type || ''}"`,
      `"${r.os || ''}"`,
      `"${r.browser || ''}"`,
      `"${r.country || ''}"`,
      `"${r.region || ''}"`,
      `"${r.city || ''}"`,
      r.duration_seconds || 0,
    ].join(',');
    csvLines.push(line);
  });

  return csvLines.join('\n');
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

// Showcase Items
export async function getAllShowcaseItems() {
  await ensureInitialized();
  try {
    return await query('SELECT * FROM showcase_items ORDER BY display_order ASC, id ASC');
  } catch {
    return [];
  }
}

export async function getPublicShowcaseItems() {
  await ensureInitialized();
  try {
    return await query('SELECT * FROM showcase_items WHERE active = true ORDER BY display_order ASC, id ASC');
  } catch {
    return [];
  }
}

export async function getShowcaseItemById(id: number) {
  await ensureInitialized();
  try {
    const rows = await query('SELECT * FROM showcase_items WHERE id = $1', [id]);
    return rows.length ? rows[0] : null;
  } catch {
    return null;
  }
}

export async function createShowcaseItem(data: {
  title?: string;
  subtitle?: string;
  category?: string;
  description?: string;
  image_url: string;
  display_order?: number;
  active?: boolean;
}) {
  await ensureInitialized();
  const rows = await query(
    `INSERT INTO showcase_items (title, subtitle, category, description, image_url, display_order, active)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      data.title || '',
      data.subtitle || '',
      data.category || '',
      data.description || '',
      data.image_url,
      data.display_order ?? 0,
      data.active ?? true,
    ]
  );
  return rows[0];
}

export async function updateShowcaseItem(
  id: number,
  data: {
    title?: string;
    subtitle?: string;
    category?: string;
    description?: string;
    image_url?: string;
    display_order?: number;
    active?: boolean;
  }
) {
  await ensureInitialized();
  const current = await getShowcaseItemById(id);
  if (!current) throw new Error('Showcase item not found');

  const rows = await query(
    `UPDATE showcase_items
     SET title = $1, subtitle = $2, category = $3, description = $4, image_url = $5, display_order = $6, active = $7, updated_at = NOW()
     WHERE id = $8 RETURNING *`,
    [
      data.title !== undefined ? data.title : current.title,
      data.subtitle !== undefined ? data.subtitle : current.subtitle,
      data.category !== undefined ? data.category : current.category,
      data.description !== undefined ? data.description : current.description,
      data.image_url !== undefined ? data.image_url : current.image_url,
      data.display_order !== undefined ? data.display_order : current.display_order,
      data.active !== undefined ? data.active : current.active,
      id,
    ]
  );
  return rows[0];
}

export async function deleteShowcaseItem(id: number) {
  await ensureInitialized();
  await query('DELETE FROM showcase_items WHERE id = $1', [id]);
  return { success: true };
}

export async function reorderShowcaseItems(orderedIds: number[]) {
  await ensureInitialized();
  for (let i = 0; i < orderedIds.length; i++) {
    await query('UPDATE showcase_items SET display_order = $1 WHERE id = $2', [i, orderedIds[i]]);
  }
  return { success: true };
}



