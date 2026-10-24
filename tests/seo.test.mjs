import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getArchiveSeo } from '../src/lib/seo.ts';

for (const path of ['/buy-peptides/', '/product-category/peptides/', '/product-category/blends/', '/news/']) {
  test(`${path} preserves pagination in canonical URLs`, () => {
    assert.equal(getArchiveSeo(path, { page: '2' }).alternates.canonical, `https://biotechpeptidesonline.com${path}?page=2`);
    assert.equal(getArchiveSeo(path, { page: '2' }).robots.index, true);
    for (const page of [undefined, '1', '0', '-1', 'abc', '1.5']) {
      assert.equal(getArchiveSeo(path, { page }).alternates.canonical, `https://biotechpeptidesonline.com${path}`);
      assert.equal(getArchiveSeo(path, { page }).page, 1);
    }
  });
  test(`${path} search and filter variants are noindex for all bots`, () => {
    for (const params of [{ s: 'bpc' }, { orderby: 'price' }, { in_stock: '1' }]) {
      const result = getArchiveSeo(path, { page: '2', ...params });
      assert.equal(result.robots.index, false);
      assert.equal(result.robots.googleBot.index, false);
      assert.equal(result.robots.follow, true);
      assert.ok(result.alternates.canonical.endsWith('?page=2'));
    }
  });
}
