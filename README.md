# BiotechPeptides.com - Complete Reconstruction

This repository contains the reconstructed full-stack production application for **BiotechPeptides.com**, meticulously recreated from scratch following the loss of original development files.

The reconstruction faithfully restores the visual identity, navigation, product catalog (89 research compounds and variations), scientific research library (186 peer-reviewed knowledge posts), e-commerce workflows (tiered volume pricing, slide-out cart, checkout with Authorize.Net and CashApp), regulatory 21+ compliance age gate, and dynamic search functionality observed on the reference website.

---

## 1. Technology Architecture

* **Frontend Framework:** Next.js 16 (App Router) with React 19 and TypeScript.
* **Styling System:** Tailwind CSS v4 with modern CSS variables matching original Divi color palettes (`#0c71c3` Biotech Blue, `#222222` Charcoal, `#f7f7f7` Gray).
* **Database & Persistence:** Node.js native `node:sqlite` (`DatabaseSync`), self-initializing and seeding to `prisma/dev.db` with zero external service dependencies or binary compilation overhead.
* **Data Seed Sources:** Verified extraction of Store API and Yoast sitemaps (`reference/api/products.json`, `posts.json`, `pages.json`, `variations.json`).
* **Client State Management:** React Context API (`CartContext`) with `localStorage` persistence and multi-tier volume discount computation.
* **Compliance Gate:** Cookie and `sessionStorage` backed `biotech_age_v4` modal dialog adhering strictly to 21+ in-vitro research disclaimers.

---

## 2. Directory Structure

```text
BIOTECHPEPTIDES/
├── prisma/
│   ├── dev.db                      # Auto-seeded SQLite database
│   └── schema.prisma               # Prisma-compatible data schema
├── public/
│   ├── wp-content/uploads/         # Recovered logos, badges, certificates, product graphics
│   └── favicon.ico                 # Site favicon
├── reference/
│   └── api/                        # Scraped reference datasets (products, posts, pages, variations)
├── src/
│   ├── app/
│   │   ├── [slug]/                 # Dynamic routing for 186 research articles & institutional pages
│   │   ├── api/
│   │   │   ├── checkout/           # Order placement & database persistence endpoint
│   │   │   ├── contact/            # Customer inquiry persistence endpoint
│   │   │   └── search/             # Real-time debounced autocomplete search API
│   │   ├── buy-peptides/           # Full catalog listing with pagination & sorting
│   │   ├── cart/                   # Shopping cart with volume discount & shipping calculations
│   │   ├── checkout/               # Checkout form (Authorize.Net card & CashApp 4% discount)
│   │   ├── contact-us/             # Contact inquiry form & business disclosures
│   │   ├── knowledge-center/       # Scientific knowledge articles index
│   │   ├── my-account/             # Authentication & account dashboard
│   │   ├── news/                   # Research blog archive with search & pagination
│   │   ├── product/[slug]/         # Individual product detail pages with volume tiers & COA
│   │   ├── product-category/
│   │   │   ├── blends/             # Peptide Blends catalog archive
│   │   │   └── peptides/           # Single Peptides catalog archive
│   │   ├── success-page/           # Order confirmation & CashApp instructions ($psci2021)
│   │   ├── globals.css             # Tailwind CSS v4 directives & custom utilities
│   │   ├── layout.tsx              # Root layout (TopBar, Header, AgeGateModal, Footer, CartContext)
│   │   └── page.tsx                # Reconstructed homepage
│   ├── components/
│   │   ├── AgeGateModal.tsx        # 21+ compliance age gate modal
│   │   ├── CatalogView.tsx         # Filterable, sortable, paginated catalog view
│   │   ├── Footer.tsx              # Legal 503A/503B notices, in-vitro warnings, navigation links
│   │   ├── Header.tsx              # Header with logo, responsive nav drawer, and search bar
│   │   ├── MiniCartDrawer.tsx      # Slide-out mini cart drawer
│   │   ├── ProductCard.tsx         # Reusable product grid card with badges & pricing
│   │   ├── ProductDetailClient.tsx # Product detail client interactive UI
│   │   ├── TierDiscountTable.tsx   # Volume tier discount table (5-9: 5%, 10+: 10%)
│   │   └── TopBar.tsx              # Top bar with email support, accessibility link, account link
│   ├── context/
│   │   └── CartContext.tsx         # Cart context with volume discount calculation
│   └── lib/
│       └── db.ts                   # SQLite schema, self-seeder, and data access methods
├── scripts/
│   ├── download-assets.mjs         # Asset downloader script
│   ├── sync-content.mjs            # Sitemap & API content harvester
│   └── test-routes.mjs             # E2E route & API test suite
├── .env.example                    # Environment variable template
├── next.config.ts                  # Next.js configuration (trailing slash, redirects)
├── package.json                    # Project metadata & scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Local development & handover guide
```

---

## 3. Quickstart & Local Development

### Prerequisites
* **Node.js:** v20.x or v24.x (Tested and verified on Node v24.16.0).
* **npm:** v10.x or higher.

### 1. Installation
Clone or navigate to the project directory:
```bash
cd "c:\Users\ASONGSEH QUEENTIN\Desktop\BIOTECHPEPTIDES"
npm install
```

### 2. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env
```
*(The defaults connect out-of-the-box to the local SQLite database at `prisma/dev.db`.)*

### 3. Database Initialization
The database self-seeds automatically on the first server query from `reference/api/` data. To manually trigger or re-verify:
```bash
node -e "require('./src/lib/db.ts')"
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running the Production Build
```bash
npm run build
npm run start
```

---

## 4. Automated Testing & Verification

An automated verification suite is included to validate all 21 key routes, dynamic slug resolvers, autocomplete search, contact persistence, and checkout order processing:

```bash
npm run test:routes
```

**Verification Results:**
* `24 Passed, 0 Failed` (100% test passing rate).
* Verifies `HTTP 200` on:
  * Homepage (`/`)
  * Catalog (`/buy-peptides/`)
  * Categories (`/product-category/peptides/`, `/product-category/blends/`)
  * Product Details (`/product/bpc-157/`, `/product/cjc-1295-dac-5mg/`)
  * Cart & Checkout (`/cart/`, `/checkout/`, `/success-page/`)
  * Account & Support (`/my-account/`, `/contact-us/`, `/knowledge-center/`)
  * Scientific Blog & Articles (`/news/`, `/what-is-bpc-157/`)
  * Institutional Pages (`/about/`, `/shipping/`, `/privacy-policy/`, `/terms-and-conditions/`, `/accessibility/`, `/dr-usman/`, `/cash-app-payment-instructions/`)
* Functional API verification:
  * Search autocomplete (`/api/search?q=bpc`)
  * Contact inquiry submission (`/api/contact`)
  * Checkout order creation (`/api/checkout`)

---

## 5. Deployment Options

### Option A: Vercel (Recommended for Next.js)
1. Push this repository to GitHub/GitLab.
2. Import project into Vercel.
3. Configure `DATABASE_URL` or use Vercel Postgres / Turso SQLite if running on serverless edge.
4. Deploy with zero configuration.

### Option B: Docker / Node Server (WP Engine or VPS)
1. Run `npm run build`.
2. Start using `npm run start` behind Nginx or PM2 on port 3000.
3. Persistent volume mapped to `prisma/dev.db` preserves orders and customer inquiries.

---

## 6. License & Compliance Notice

All product formulas, molecular weights, and descriptions reproduced herein are factual scientific research data for in-vitro research use only. Not for human or animal consumption.
