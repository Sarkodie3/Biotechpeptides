import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('./prisma/dev.db');

console.log('--- PRODUCTS TABLE COLUMNS ---');
console.table(db.prepare('PRAGMA table_info(products)').all());

console.log('\n--- SAMPLE SPECS FROM 5 PRODUCTS ---');
const sampleWithSpecs = db.prepare("SELECT name, specs, short_description FROM products WHERE specs IS NOT NULL AND specs != '{}' LIMIT 5").all();
for (const p of sampleWithSpecs) {
  console.log(`\nProduct: ${p.name}`);
  console.log(`Specs: ${p.specs}`);
  console.log(`Short Desc: ${p.short_description?.slice(0, 100)}...`);
}

console.log('\n--- CHECKING PURITY CLAIMS IN SPECS ---');
const allProducts = db.prepare('SELECT id, name, specs, description FROM products').all();
let specsWithPurity = 0;
let specsWithUSA = 0;
for (const p of allProducts) {
  if (p.specs && p.specs.includes('Purity')) specsWithPurity++;
  if (p.description && (p.description.includes('USA') || p.description.includes('United States'))) specsWithUSA++;
}
console.log(`Total products: ${allProducts.length}`);
console.log(`Products with Purity in specs: ${specsWithPurity}`);
console.log(`Products with USA in description: ${specsWithUSA}`);

console.log('\n--- CHECKING RESEARCH ARTICLES (POSTS) ---');
console.table(db.prepare('PRAGMA table_info(posts)').all());
const samplePosts = db.prepare('SELECT id, title, slug, LENGTH(content) as content_len, author FROM posts LIMIT 5').all();
console.log('Sample posts:', samplePosts);

const totalPosts = db.prepare('SELECT COUNT(*) as count FROM posts').get();
console.log('Total posts:', totalPosts);

// Check post lengths and duplicates
const posts = db.prepare('SELECT id, title, slug, content FROM posts').all();
let shortPosts = 0;
let emptyPosts = 0;
const titleMap = new Map();
const duplicates = [];

for (const post of posts) {
  if (!post.content || post.content.length < 50) emptyPosts++;
  else if (post.content.length < 500) shortPosts++;

  const cleanT = post.title.trim().toLowerCase();
  if (titleMap.has(cleanT)) {
    duplicates.push({ title: post.title, slug1: titleMap.get(cleanT), slug2: post.slug });
  } else {
    titleMap.set(cleanT, post.slug);
  }
}

console.log(`Empty posts: ${emptyPosts}`);
console.log(`Short posts (<500 chars): ${shortPosts}`);
console.log(`Duplicate titles found: ${duplicates.length}`);
if (duplicates.length > 0) {
  console.log('Sample duplicates:', duplicates.slice(0, 5));
}
