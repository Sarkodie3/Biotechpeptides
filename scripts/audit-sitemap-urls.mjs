async function auditSitemap() {
  const url = 'https://biotechpeptidesonline.com/sitemap.xml';
  console.log(`Fetching and auditing sitemap from: ${url}...\n`);

  const res = await fetch(url);
  if (res.status !== 200) {
    console.error(`Failed to fetch sitemap: HTTP ${res.status}`);
    return;
  }

  const xml = await res.text();
  const locMatches = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((m) => m[1].trim());

  console.log(`Total URLs in sitemap: ${locMatches.length}`);

  let nonCanonicalDomain = 0;
  let privateUrls = 0;
  let nonTrailingSlash = 0;
  let categoryUrls = [];
  let productUrls = [];
  let postUrls = [];
  let pageUrls = [];

  for (const u of locMatches) {
    if (!u.startsWith('https://biotechpeptidesonline.com/')) {
      nonCanonicalDomain++;
      console.warn(`Non-canonical domain found: ${u}`);
    }

    if (u.includes('/cart') || u.includes('/checkout') || u.includes('/my-account') || u.includes('/api/')) {
      privateUrls++;
      console.warn(`Private URL in sitemap: ${u}`);
    }

    if (!u.endsWith('/')) {
      nonTrailingSlash++;
    }

    if (u.includes('/product-category/')) {
      categoryUrls.push(u);
    } else if (u.includes('/product/')) {
      productUrls.push(u);
    } else if (u === 'https://biotechpeptidesonline.com/' || u.includes('/buy-peptides/') || u.includes('/news/') || u.includes('/knowledge-center/') || u.includes('/contact-us/')) {
      pageUrls.push(u);
    } else {
      postUrls.push(u);
    }
  }

  console.log(`• Canonical domain compliance: ${locMatches.length - nonCanonicalDomain}/${locMatches.length} URLs`);
  console.log(`• Private URL exclusions: ${privateUrls === 0 ? 'PASSED (0 private URLs)' : `FAILED (${privateUrls} private URLs)`}`);
  console.log(`• Trailing slash consistency: ${nonTrailingSlash === 0 ? 'PASSED (100% trailing slash)' : `WARNING (${nonTrailingSlash} non-trailing)`}`);
  console.log(`• Core Category URLs: ${categoryUrls.length}`);
  console.log(`• Product URLs: ${productUrls.length}`);
  console.log(`• Research Posts / Informational URLs: ${postUrls.length}`);
  console.log(`• Static Core Pages: ${pageUrls.length}`);

  // Test a sample of 15 random URLs from the sitemap for HTTP 200
  console.log(`\nTesting sample of 15 URLs from sitemap for HTTP 200...`);
  const sample = [
    locMatches[0], // homepage
    ...categoryUrls,
    ...productUrls.slice(0, 5),
    ...postUrls.slice(0, 5),
    ...pageUrls.slice(1, 3),
  ].filter(Boolean);

  let samplePassed = 0;
  for (const sUrl of sample) {
    try {
      const sRes = await fetch(sUrl, { method: 'HEAD' });
      if (sRes.status === 200) {
        samplePassed++;
      } else {
        console.error(`Sample URL failed: ${sUrl} -> HTTP ${sRes.status}`);
      }
    } catch (e) {
      console.error(`Sample URL error: ${sUrl} -> ${e.message}`);
    }
  }
  console.log(`Sample verification: ${samplePassed}/${sample.length} returned HTTP 200.`);
}

auditSitemap();
