import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
const db = new DatabaseSync(dbPath);

console.log('Opened SQLite DB at:', dbPath);

// Fields to check and replace:
// products: description, short_description, images
// posts: content, excerpt, featured_image
// pages: content

const oldDomain1 = 'https://biotechpeptides.com';
const oldDomain2 = 'http://biotechpeptides.com';
const newDomain = 'https://biotechpeptidesonline.com';

function replaceInTable(table, fields) {
  const rows = db.prepare(`SELECT id, ${fields.join(', ')} FROM ${table}`).all();
  let updatedCount = 0;

  for (const row of rows) {
    let changed = false;
    const updates = {};

    for (const f of fields) {
      const val = row[f];
      if (typeof val === 'string' && (val.includes(oldDomain1) || val.includes(oldDomain2))) {
        updates[f] = val.replaceAll(oldDomain1, newDomain).replaceAll(oldDomain2, newDomain);
        changed = true;
      }
    }

    if (changed) {
      const setClauses = Object.keys(updates)
        .map((k) => `${k} = ?`)
        .join(', ');
      const values = Object.values(updates);
      values.push(row.id);
      db.prepare(`UPDATE ${table} SET ${setClauses} WHERE id = ?`).run(...values);
      updatedCount++;
    }
  }

  console.log(`Table '${table}': updated ${updatedCount} rows containing legacy domain.`);
}

replaceInTable('products', ['description', 'short_description', 'images']);
replaceInTable('posts', ['content', 'excerpt', 'featured_image']);
replaceInTable('pages', ['content']);

console.log('Sanitization complete.');
