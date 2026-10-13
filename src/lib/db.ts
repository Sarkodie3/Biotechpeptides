import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

function getDbPath(): string {
  const isVercel = !!process.env.VERCEL;
  const projectDbDir = path.resolve(process.cwd(), 'prisma');
  const projectDbPath = path.resolve(projectDbDir, 'dev.db');

  if (isVercel) {
    const tmpDbPath = '/tmp/dev.db';
    if (!fs.existsSync(tmpDbPath) && fs.existsSync(projectDbPath)) {
      try {
        fs.copyFileSync(projectDbPath, tmpDbPath);
      } catch (err) {
        console.error('Failed copying db to /tmp:', err);
      }
    }
    return fs.existsSync(tmpDbPath) ? tmpDbPath : projectDbPath;
  }

  if (!fs.existsSync(projectDbDir)) {
    fs.mkdirSync(projectDbDir, { recursive: true });
  }
  return projectDbPath;
}

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    const dbPath = getDbPath();
    dbInstance = new DatabaseSync(dbPath);
    initSchema(dbInstance);
  }
  return dbInstance;
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      sku TEXT,
      type TEXT NOT NULL DEFAULT 'simple',
      price REAL NOT NULL,
      regular_price REAL NOT NULL,
      sale_price REAL,
      on_sale INTEGER NOT NULL DEFAULT 0,
      short_description TEXT,
      description TEXT,
      specs TEXT,
      categories TEXT,
      images TEXT,
      attributes TEXT,
      variations TEXT,
      rating REAL DEFAULT 5.0,
      review_count INTEGER DEFAULT 0,
      in_stock INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      count INTEGER DEFAULT 0,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      date TEXT NOT NULL,
      author TEXT DEFAULT 'Dr. Usman',
      category TEXT DEFAULT 'Research',
      featured_image TEXT
    );

    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      shipping_address TEXT NOT NULL,
      items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      shipping_fee REAL DEFAULT 0,
      total REAL NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'customer',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id INTEGER NOT NULL,
      author TEXT NOT NULL,
      rating INTEGER NOT NULL,
      content TEXT NOT NULL,
      date TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Check if products need seeding
  const countRow = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (countRow.count === 0) {
    seedData(db);
  }
}

function seedData(db: DatabaseSync) {
  const refDir = path.resolve(process.cwd(), 'reference/api');
  if (!fs.existsSync(refDir)) {
    return;
  }

  try {
    // 1. Seed categories
    const catFile = path.join(refDir, 'products_categories.json');
    if (fs.existsSync(catFile)) {
      const cats = JSON.parse(fs.readFileSync(catFile, 'utf8'));
      const insertCat = db.prepare(`
        INSERT OR REPLACE INTO categories (id, name, slug, count, description)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const c of cats) {
        insertCat.run(c.id, c.name, c.slug, c.count || 0, c.description || '');
      }
    }

    // 2. Seed products & variations
    const prodFile = path.join(refDir, 'products.json');
    const varFile = path.join(refDir, 'variations.json');
    let variationsMap: Record<string, any> = {};
    if (fs.existsSync(varFile)) {
      try {
        variationsMap = JSON.parse(fs.readFileSync(varFile, 'utf8'));
      } catch {}
    }

    if (fs.existsSync(prodFile)) {
      const products = JSON.parse(fs.readFileSync(prodFile, 'utf8'));
      const insertProd = db.prepare(`
        INSERT OR REPLACE INTO products (
          id, name, slug, sku, type, price, regular_price, sale_price, on_sale,
          short_description, description, specs, categories, images, attributes,
          variations, rating, review_count, in_stock
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `);

      for (const p of products) {
        const price = parseFloat(p.prices?.price || '0') / 100;
        const regPrice = parseFloat(p.prices?.regular_price || '0') / 100;
        const salePrice = p.prices?.sale_price ? parseFloat(p.prices.sale_price) / 100 : null;
        const onSale = p.on_sale ? 1 : 0;

        // Build variations detail if any
        let productVariations: any[] = [];
        if (p.variations && Array.isArray(p.variations)) {
          for (const v of p.variations) {
            const vData = variationsMap[v.id] || v;
            productVariations.push(vData);
          }
        }

        insertProd.run(
          p.id,
          p.name,
          p.slug,
          p.sku || '',
          p.type || 'simple',
          price,
          regPrice,
          salePrice,
          onSale,
          p.short_description || '',
          p.description || '',
          JSON.stringify(extractSpecs(p.description || '')),
          JSON.stringify(p.categories || []),
          JSON.stringify(p.images || []),
          JSON.stringify(p.attributes || []),
          JSON.stringify(productVariations),
          parseFloat(p.average_rating || '5.0') || 5.0,
          p.review_count || 0,
          p.is_in_stock === false ? 0 : 1
        );
      }
    }

    // 3. Seed posts
    const postFile = path.join(refDir, 'posts.json');
    if (fs.existsSync(postFile)) {
      const posts = JSON.parse(fs.readFileSync(postFile, 'utf8'));
      const insertPost = db.prepare(`
        INSERT OR REPLACE INTO posts (id, title, slug, excerpt, content, date, author, category, featured_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const post of posts) {
        const title = typeof post.title === 'string' ? post.title : post.title?.rendered || '';
        const content = typeof post.content === 'string' ? post.content : post.content?.rendered || '';
        const excerpt = typeof post.excerpt === 'string' ? post.excerpt : post.excerpt?.rendered || '';
        const featured = post.yoast_head_json?.og_image?.[0]?.url || '';
        const cat = (post.categories || []).includes(41) ? 'Knowledge Center' : 'Research';

        insertPost.run(
          post.id,
          title,
          post.slug,
          excerpt,
          content,
          post.date || new Date().toISOString(),
          'Dr. Usman',
          cat,
          featured
        );
      }
    }

    // 4. Seed pages
    const pageFile = path.join(refDir, 'pages.json');
    if (fs.existsSync(pageFile)) {
      const pages = JSON.parse(fs.readFileSync(pageFile, 'utf8'));
      const insertPage = db.prepare(`
        INSERT OR REPLACE INTO pages (id, title, slug, content)
        VALUES (?, ?, ?, ?)
      `);
      for (const pg of pages) {
        const title = typeof pg.title === 'string' ? pg.title : pg.title?.rendered || '';
        const content = typeof pg.content === 'string' ? pg.content : pg.content?.rendered || '';
        insertPage.run(pg.id, title, pg.slug, content);
      }
    }

    console.log('Database successfully initialized and seeded with reference data!');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

function extractSpecs(html: string): Record<string, string> {
  const specs: Record<string, string> = {};
  const formulaMatch = html.match(/Molecular Formula:<\/strong>\s*([^<]+)/i) || html.match(/Molecular Formula:\s*([^<\n]+)/i);
  if (formulaMatch) specs['Molecular Formula'] = formulaMatch[1].trim();

  const weightMatch = html.match(/Molecular Weight:<\/strong>\s*([^<]+)/i) || html.match(/Molecular Weight:\s*([^<\n]+)/i);
  if (weightMatch) specs['Molecular Weight'] = weightMatch[1].trim();

  const seqMatch = html.match(/Sequence:<\/strong>\s*([^<]+)/i) || html.match(/Sequence:\s*([^<\n]+)/i);
  if (seqMatch) specs['Sequence'] = seqMatch[1].trim();

  const titleMatch = html.match(/Other known titles:<\/strong>\s*([^<]+)/i) || html.match(/Other known titles:\s*([^<\n]+)/i);
  if (titleMatch) specs['Other known titles'] = titleMatch[1].trim();

  return specs;
}

function toPlain<T>(data: T): T {
  if (data === null || data === undefined) return data;
  return JSON.parse(JSON.stringify(data));
}

// ---------------- Public Query Functions ----------------

export interface ProductRecord {
  id: number;
  name: string;
  slug: string;
  sku: string;
  type: string;
  price: number;
  regular_price: number;
  sale_price: number | null;
  on_sale: number;
  short_description: string;
  description: string;
  specs: string;
  categories: string;
  images: string;
  attributes: string;
  variations: string;
  rating: number;
  review_count: number;
  in_stock: number;
  created_at: string;
}

export function getAllProducts(options?: {
  category?: string;
  search?: string;
  inStockOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}): { products: ProductRecord[]; total: number; page: number; totalPages: number } {
  const db = getDb();
  let whereClauses: string[] = [];
  const params: any[] = [];

  if (options?.category) {
    whereClauses.push(`categories LIKE ?`);
    params.push(`%"slug":"${options.category}"%`);
  }

  if (options?.search) {
    whereClauses.push(`(name LIKE ? OR short_description LIKE ? OR description LIKE ? OR sku LIKE ?)`);
    const q = `%${options.search}%`;
    params.push(q, q, q, q);
  }

  if (options?.inStockOnly) {
    whereClauses.push(`in_stock = 1`);
  }

  if (options?.minPrice !== undefined) {
    whereClauses.push(`price >= ?`);
    params.push(options.minPrice);
  }

  if (options?.maxPrice !== undefined) {
    whereClauses.push(`price <= ?`);
    params.push(options.maxPrice);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Sorting
  let orderBy = 'name ASC';
  if (options?.sort === 'price') orderBy = 'price ASC';
  else if (options?.sort === 'price-desc') orderBy = 'price DESC';
  else if (options?.sort === 'popularity') orderBy = 'review_count DESC';
  else if (options?.sort === 'date') orderBy = 'id DESC';

  // Count total
  const countRow = db.prepare(`SELECT COUNT(*) as count FROM products ${whereSql}`).get(...params) as { count: number };
  const total = countRow.count;

  // Pagination
  const page = Math.max(1, options?.page || 1);
  const limit = Math.max(1, options?.limit || 28); // 28 is the exact WooCommerce page limit observed
  const offset = (page - 1) * limit;

  const products = db.prepare(`
    SELECT * FROM products ${whereSql}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset) as unknown as ProductRecord[];

  return {
    products: toPlain(products),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export function getProductBySlug(slug: string): ProductRecord | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM products WHERE slug = ?').get(slug);
  return toPlain(row as unknown as ProductRecord) || null;
}

export function getProductById(id: number): ProductRecord | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  return toPlain(row as unknown as ProductRecord) || null;
}

export function getCategories() {
  const db = getDb();
  return toPlain(db.prepare('SELECT * FROM categories ORDER BY name ASC').all());
}

export function getPosts(options?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const db = getDb();
  let whereClauses: string[] = [];
  const params: any[] = [];

  if (options?.category) {
    whereClauses.push('category = ?');
    params.push(options.category);
  }

  if (options?.search) {
    whereClauses.push('(title LIKE ? OR content LIKE ?)');
    const q = `%${options.search}%`;
    params.push(q, q);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const page = Math.max(1, options?.page || 1);
  const limit = Math.max(1, options?.limit || 10);
  const offset = (page - 1) * limit;

  const countRow = db.prepare(`SELECT COUNT(*) as count FROM posts ${whereSql}`).get(...params) as { count: number };
  const total = countRow.count;

  const posts = db.prepare(`
    SELECT * FROM posts ${whereSql}
    ORDER BY date DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  return {
    posts: toPlain(posts),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export function getPostBySlug(slug: string) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM posts WHERE slug = ?').get(slug);
  return toPlain(row) || null;
}

export function getPageBySlug(slug: string) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM pages WHERE slug = ?').get(slug);
  return toPlain(row) || null;
}

export function createOrder(order: {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: any;
  items: any;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO orders (
      id, order_number, customer_name, customer_email, customer_phone,
      shipping_address, items, subtotal, discount, shipping_fee, total, payment_method, status
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'processing'
    )
  `);
  stmt.run(
    order.id,
    order.orderNumber,
    order.customerName,
    order.customerEmail,
    order.customerPhone || '',
    JSON.stringify(order.shippingAddress),
    JSON.stringify(order.items),
    order.subtotal,
    order.discount,
    order.shippingFee,
    order.total,
    order.paymentMethod
  );
  return order;
}

export function getOrder(orderIdOrNumber: string) {
  const db = getDb();
  const row = db.prepare(`
    SELECT * FROM orders WHERE id = ? OR order_number = ?
  `).get(orderIdOrNumber, orderIdOrNumber);
  return toPlain(row) || null;
}

export function createInquiry(name: string, email: string, message: string) {
  const db = getDb();
  const id = 'inq_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  db.prepare(`
    INSERT INTO inquiries (id, name, email, message)
    VALUES (?, ?, ?, ?)
  `).run(id, name, email, message);
  return { id, name, email, message };
}
