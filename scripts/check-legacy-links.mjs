async function findLegacyLinks() {
  const res = await fetch('https://biotechpeptidesonline.com/product/bpc-157/');
  const html = await res.text();
  const regex = /<a[^>]*href=["']([^"']*)["'][^>]*>/gi;
  let m;
  console.log('--- Checking Product /product/bpc-157/ ---');
  while ((m = regex.exec(html)) !== null) {
    if (m[1].includes('biotechpeptides.com') && !m[1].includes('biotechpeptidesonline.com')) {
      console.log('Found legacy link:', m[0]);
    }
  }

  const postRes = await fetch('https://biotechpeptidesonline.com/what-is-bpc-157/');
  const postHtml = await postRes.text();
  console.log('--- Checking Post /what-is-bpc-157/ ---');
  const regex2 = /<a[^>]*href=["']([^"']*)["'][^>]*>/gi;
  while ((m = regex2.exec(postHtml)) !== null) {
    if (m[1].includes('biotechpeptides.com') && !m[1].includes('biotechpeptidesonline.com')) {
      console.log('Found legacy link:', m[0]);
    }
  }
}
findLegacyLinks();
