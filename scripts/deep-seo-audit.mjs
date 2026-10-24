const BASE_URL = process.env.AUDIT_URL || 'https://biotechpeptidesonline.com';

const pagesToAudit = [
  { path: '/', name: 'Homepage' },
  { path: '/buy-peptides/', name: 'Catalog: Buy Peptides' },
  { path: '/product-category/peptides/', name: 'Category: Peptides' },
  { path: '/product-category/blends/', name: 'Category: Blends' },
  { path: '/product/bpc-157/', name: 'Product: BPC-157' },
  { path: '/product/aod-9604-5mg/', name: 'Product: AOD-9604 5mg' },
  { path: '/product/bpc-157-tb-500-10mg-blend-2/', name: 'Product: BPC-157 + TB-500 Blend' },
  { path: '/knowledge-center/', name: 'Knowledge Center' },
  { path: '/news/', name: 'News & Research Index' },
  { path: '/what-is-bpc-157/', name: 'Blog Article: What is BPC-157' },
];

function extractTagContent(html, tag) {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? match[1].trim() : null;
}

function extractAllTagsContent(html, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  const results = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    results.push(m[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' '));
  }
  return results;
}

function extractMetaAttr(html, attr, val, targetAttr = 'content') {
  const regex = new RegExp(`<meta[^>]*${attr}=["']${val}["'][^>]*${targetAttr}=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  if (match) return match[1];

  // Try flipped order: content="..." attr="..."
  const flippedRegex = new RegExp(`<meta[^>]*${targetAttr}=["']([^"']*)["'][^>]*${attr}=["']${val}["']`, 'i');
  const flippedMatch = html.match(flippedRegex);
  return flippedMatch ? flippedMatch[1] : null;
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  if (match) return match[1];
  const flipped = html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
  return flipped ? flipped[1] : null;
}

function extractAllJsonLd(html) {
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const schemas = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1].trim());
      schemas.push(parsed);
    } catch (e) {
      schemas.push({ error: 'Parse Error', raw: m[1].slice(0, 100) });
    }
  }
  return schemas;
}

function extractHrefs(html) {
  const regex = /<a[^>]*href=["']([^"']*)["']/gi;
  const hrefs = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    hrefs.push(m[1]);
  }
  return hrefs;
}

async function auditPage(pageDef) {
  const url = `${BASE_URL}${pageDef.path}`;
  console.log(`\n======================================================`);
  console.log(`Auditing: ${pageDef.name} (${url})`);
  console.log(`======================================================`);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
    });

    if (res.status !== 200) {
      console.error(`HTTP Status Error: ${res.status} ${res.statusText}`);
      return { ...pageDef, status: res.status, error: 'Non-200 status' };
    }

    const html = await res.text();

    const title = extractTagContent(html, 'title');
    const description = extractMetaAttr(html, 'name', 'description');
    const canonical = extractCanonical(html);
    const h1s = extractAllTagsContent(html, 'h1');
    const h2s = extractAllTagsContent(html, 'h2');
    const robots = extractMetaAttr(html, 'name', 'robots') || 'index, follow (default)';

    const ogTitle = extractMetaAttr(html, 'property', 'og:title');
    const ogDesc = extractMetaAttr(html, 'property', 'og:description');
    const ogUrl = extractMetaAttr(html, 'property', 'og:url');
    const ogImage = extractMetaAttr(html, 'property', 'og:image');

    const twCard = extractMetaAttr(html, 'name', 'twitter:card');
    const twTitle = extractMetaAttr(html, 'name', 'twitter:title');

    const schemas = extractAllJsonLd(html);
    const hrefs = extractHrefs(html);
    const legacyLinks = hrefs.filter((h) => h.includes('biotechpeptides.com') && !h.includes('biotechpeptidesonline.com'));

    // Check occurrences of biotechpeptides.com in entire HTML (excluding online)
    const legacyOccurrences = (html.match(/https?:\/\/(?:www\.)?biotechpeptides\.com(?!\w|\/wp-content)/g) || []).length;

    console.log(`• Status: HTTP ${res.status}`);
    console.log(`• Title (${title?.length || 0} chars): ${title}`);
    console.log(`• Description (${description?.length || 0} chars): ${description}`);
    console.log(`• Canonical: ${canonical}`);
    console.log(`• H1 Count: ${h1s.length} -> [${h1s.join(' | ')}]`);
    console.log(`• H2 Count: ${h2s.length} -> Sample: [${h2s.slice(0, 3).join(' | ')}]`);
    console.log(`• Robots: ${robots}`);
    console.log(`• Open Graph: title=${Boolean(ogTitle)}, desc=${Boolean(ogDesc)}, url=${ogUrl}, image=${Boolean(ogImage)}`);
    console.log(`• Twitter Card: ${twCard}, title=${Boolean(twTitle)}`);
    console.log(`• JSON-LD Count: ${schemas.length} -> Types: [${schemas.map((s) => s['@type'] || s.error).join(', ')}]`);
    console.log(`• Total Crawlable Links: ${hrefs.length}`);
    console.log(`• Legacy biotechpeptides.com links: ${legacyLinks.length}`);
    console.log(`• Legacy domain mentions in HTML: ${legacyOccurrences}`);

    return {
      path: pageDef.path,
      name: pageDef.name,
      status: res.status,
      title,
      description,
      canonical,
      h1Count: h1s.length,
      primaryH1: h1s[0] || 'NONE',
      h2Count: h2s.length,
      robots,
      schemas: schemas.map((s) => s['@type']).filter(Boolean),
      legacyLinksCount: legacyLinks.length,
      legacyOccurrences,
    };
  } catch (err) {
    console.error(`Audit error on ${pageDef.name}:`, err.message);
    return { ...pageDef, error: err.message };
  }
}

async function runAudit() {
  console.log(`Starting Deep SEO Audit against ${BASE_URL}...\n`);
  const results = [];
  for (const page of pagesToAudit) {
    const res = await auditPage(page);
    results.push(res);
  }

  console.log(`\n======================================================`);
  console.log(`AUDIT SUMMARY TABLE`);
  console.log(`======================================================`);
  console.table(
    results.map((r) => ({
      Page: r.name,
      Status: r.status,
      Title: r.title ? `${r.title.slice(0, 45)}...` : 'MISSING',
      'Canonical OK': Boolean(r.canonical && r.canonical.startsWith('https://biotechpeptidesonline.com')),
      H1s: r.h1Count,
      PrimaryH1: r.primaryH1 ? `${r.primaryH1.slice(0, 30)}...` : 'NONE',
      Schemas: r.schemas?.join(', ') || 'NONE',
      'Legacy Links': r.legacyLinksCount,
    }))
  );
}

runAudit();
