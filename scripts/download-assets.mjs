import fs from 'node:fs/promises';
import path from 'node:path';

const PUBLIC_DIR = path.resolve('./public');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';

async function downloadFile(url, targetPath) {
  try {
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    // Check if exists
    try {
      await fs.access(targetPath);
      return true; // Already downloaded
    } catch {}

    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.warn(`Failed downloading ${url}: ${res.status}`);
      return false;
    }
    const arrayBuffer = await res.arrayBuffer();
    await fs.writeFile(targetPath, Buffer.from(arrayBuffer));
    console.log(`Saved: ${targetPath}`);
    return true;
  } catch (err) {
    console.warn(`Error downloading ${url}:`, err.message);
    return false;
  }
}

async function main() {
  console.log('Downloading essential branding & product assets...');
  
  // Core branding assets
  const coreAssets = [
    'https://biotechpeptides.com/wp-content/uploads/2020/12/Biotech-Peptides.png',
    'https://biotechpeptides.com/wp-content/uploads/2022/10/Biotech-Peptides-192x192-1.png',
    'https://biotechpeptides.com/wp-content/uploads/2020/12/biotech-peptides-social.jpg',
    'https://biotechpeptides.com/wp-content/uploads/2026/07/Asset-9@300x-100.webp',
    'https://biotechpeptides.com/wp-content/uploads/2026/07/Asset-10.svg',
    'https://biotechpeptides.com/wp-content/uploads/2026/07/Asset-11.svg',
    'https://biotechpeptides.com/wp-content/uploads/2026/07/Asset-2@300x.webp',
    'https://biotechpeptides.com/wp-content/uploads/2020/02/b2.png'
  ];

  for (const assetUrl of coreAssets) {
    const urlObj = new URL(assetUrl);
    const localRel = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
    const dest = path.join(PUBLIC_DIR, localRel);
    await downloadFile(assetUrl, dest);
  }

  // Load products.json
  const productsPath = path.resolve('./reference/api/products.json');
  try {
    const productsRaw = await fs.readFile(productsPath, 'utf8');
    const products = JSON.parse(productsRaw);
    console.log(`Scanning ${products.length} products for main images...`);

    // Download first 1-2 images for all products to keep footprint reasonable while showing real product images
    for (const p of products) {
      if (p.images && p.images.length > 0) {
        for (const img of p.images.slice(0, 2)) {
          if (img.src && img.src.startsWith('http')) {
            try {
              const u = new URL(img.src);
              const localRel = u.pathname.startsWith('/') ? u.pathname.slice(1) : u.pathname;
              await downloadFile(img.src, path.join(PUBLIC_DIR, localRel));
            } catch {}
          }
          if (img.thumbnail && img.thumbnail.startsWith('http')) {
            try {
              const u = new URL(img.thumbnail);
              const localRel = u.pathname.startsWith('/') ? u.pathname.slice(1) : u.pathname;
              await downloadFile(img.thumbnail, path.join(PUBLIC_DIR, localRel));
            } catch {}
          }
        }
      }
    }
  } catch (e) {
    console.warn('Could not read products.json:', e.message);
  }

  console.log('Asset download phase finished.');
}

main().catch(console.error);
