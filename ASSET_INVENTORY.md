# BiotechPeptides.com - Asset Inventory & Recovery Log

This document details all digital assets recovered, localized, or mapped for the reconstruction of **BiotechPeptides.com**.

---

## 1. Brand & Structural Assets

| Asset Name | Original Path | Local Stored Path | Status |
| :--- | :--- | :--- | :--- |
| **Main Logo** | `/wp-content/uploads/2021/04/biotech-peptides-logo-300x74.png` | `public/wp-content/uploads/2021/04/biotech-peptides-logo-300x74.png` | **Recovered & Localized** |
| **Header SVG Logo** | Scalable vector logo component | `src/components/Header.tsx` (Inline SVG) | **Faithfully Recreated** |
| **Favicon** | `/favicon.ico` | `public/favicon.ico` | **Recovered & Localized** |
| **Certificate of Analysis Badge** | `/wp-content/uploads/coa-badge.png` | `public/wp-content/uploads/coa-badge.png` | **Recovered & Localized** |
| **Made in USA Badge** | `/wp-content/uploads/made-in-usa.png` | `public/wp-content/uploads/made-in-usa.png` | **Recovered & Localized** |
| **Payment Method Badges** | Visa, MC, Amex, Discover, CashApp | Inline SVG vector icons in Footer & Checkout | **Faithfully Recreated** |

---

## 2. Product Catalog Media

* **Scope:** 89 catalog compounds + 7 product variations.
* **Extraction Source:** WooCommerce Store API endpoint (`reference/api/products.json`).
* **Image Delivery Strategy:**
  1. Primary product images are stored with original CDN URIs (`https://biotechpeptides.com/wp-content/uploads/...`) mapped into the SQLite database.
  2. Next.js image optimization is configured with remote pattern domain rules in `next.config.ts` allowing both local serving and high-performance CDN caching.
  3. High-priority hero compounds (e.g., BPC-157, TB-500, CJC-1295, Semaglutide, Tirzepatide, GHK-Cu) have localized WebP/JPEG assets cached under `public/wp-content/uploads/`.
  4. An automated asset recovery script (`scripts/download-assets.mjs`) is provided to download all 89 remote assets locally on demand.

---

## 3. Scientific Library Media

* **Scope:** 186 research articles.
* **Extraction Source:** WordPress REST API `/wp/v2/posts` and Yoast SEO OpenGraph images.
* **Status:** 100% of featured image URLs are cataloged in `reference/api/posts.json` and populated into the SQLite `posts.featured_image` column.

---

## 4. Asset Recovery Scripts

To execute a batch download of all remote product images directly into your local `public/` directory:

```bash
node scripts/download-assets.mjs
```

This script checks for existing files, handles 404 fallbacks with a clean SVG molecule placeholder, and updates local image paths.
