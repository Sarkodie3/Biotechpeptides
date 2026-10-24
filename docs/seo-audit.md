# SEO audit and Search Console follow-up

## Implemented

- Keep page 2+ of the catalog, categories, and news self-canonical rather than pointing every page to page 1.
- Mark internal search and filter/sort variants noindex, including Googlebot-specific directives.
- Allow crawling of noindex pages so crawlers can read their directives. This is not access control: sensitive customer/order data still requires server-side authorization.
- Retain noindex on cart, checkout, account, and order confirmation pages, explicitly including Googlebot.
- Omit sitemap lastmod values where a reliable content-modification timestamp is unavailable. Publication, import, and request dates are not content-update dates.
- Remove the unsupported fixed price-expiry date from product offers.

Existing foundations include server-rendered content, product/article/breadcrumb JSON-LD, route-specific metadata, canonical HTTPS URLs, a sitemap, and legacy sitemap redirects.

## Owner actions after deployment

1. In Google Search Console, select or verify the property for biotechpeptidesonline.com. A Domain property uses DNS verification; an existing verified property does not need to be recreated.
2. Under **Sitemaps**, submit `https://biotechpeptidesonline.com/sitemap.xml` and inspect processing errors.
3. Use **URL Inspection** on the homepage, an important product, an article, and `/buy-peptides/?page=2`. Test live URLs and review Google's selected canonical. Request indexing of the important changed URLs.
4. Review **Page indexing**, **Product snippets / Merchant listings** (if available), **Core Web Vitals**, **Manual actions**, and **Security issues**.
5. In **Performance > Search results**, establish a baseline for queries/pages, impressions, clicks, CTR, and average position. Compare subsequent periods rather than treating a code change as proof of ranking improvement.

## Further content review

The repository describes reconstructed/imported content. Confirm permission to publish it, original business identity, social-profile ownership, author credentials/attribution, product pricing/availability, and evidence behind purity/manufacturing/testing claims. These were not independently verified in this audit. Publish original, useful research explanations and genuine batch-specific evidence rather than adding keyword repetition or invented reviews.

Search Console data and live response headers were not available during this source audit. No ranking gains or Google indexing changes have been verified. Crawling can take days to weeks and indexing is not guaranteed.

## References

- https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/monitor-debug/search-console-start
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl

## Regression checks

Run `node --test tests/seo.test.mjs`, `npm run typecheck`, and `npm run build`. The SEO tests use Node's native TypeScript support (Node 22.18+ or 24+).
