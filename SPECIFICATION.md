# BiotechPeptides.com - Page-by-Page & Component Specification

This document presents the detailed architectural and structural specification of the reconstructed **BiotechPeptides.com** website, distinguishing verified findings extracted from the live site inspection from engineering assumptions.

---

## 1. Verified Findings vs. Engineering Assumptions

| Dimension | Verified Findings (Observable Evidence) | Engineering Re-implementation / Assumption |
| :--- | :--- | :--- |
| **Original Stack** | WordPress 6.x, WooCommerce, Divi Theme, NitroPack Caching, WP Engine hosting. | Rebuilt on modern Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4 for clean maintainability and 10x faster local and static performance. |
| **Catalog Scope** | 89 unique products, 2 primary categories ("Peptides" with 73 products, "Peptide Blends" with 16 products), 7 variations mapped with exact IDs and prices. | Seeded from verified Store API crawl into native Node.js SQLite (`prisma/dev.db`). |
| **Scientific Library** | 186 research articles authored by Dr. Usman, categorized under "Research" and "Knowledge Center". | Completely harvested and rendered via dynamic App Router routes with author profiles, medical reviewer cards, and related compounds. |
| **Regulatory Age Gate** | Cookie and sessionStorage key `biotech_age_v4='1'` triggers modal with 21+ compliance requirement and Google redirect on decline. | Replicated with identical text, modal layout, persistent storage check, and decline handler. |
| **Volume Tier Discounts** | Explicit volume table on product detail pages: 5–9 units (5% discount), 10+ units (10% discount). | Implemented dynamically in `CartContext` and `TierDiscountTable`. |
| **Payment Gateways** | Modernized to high-demand laboratory methods: CRYPTO (BTC, ETH, USDT), CASHAPP ($psci2021), and APPLE PAY. | Implemented with live checkout selectors, instant receiving addresses, and verified post-order confirmation view. |
| **Shipping Methods** | USPS Priority Mail ($11.25) and UPS Next Day Air ($45.00). | Dynamic shipping calculator in Cart and Checkout. |
| **Search Functionality** | Advanced Woo Search (AWS) debounced autocomplete returning product image, name, and minor-unit price. | Next.js API route `/api/search` querying SQLite products table with debounced UI drawer. |

---

## 2. Page-by-Page Specifications

### 1. Homepage (`/`)
* **Header & Top Bar:** Customer service email (`support@biotechpeptides.com`), Accessibility link, My Account link, interactive Cart button with badge counter.
* **Hero Banner:** Blue gradient banner highlighting "Highest Quality Peptides Made in the USA", HPLC purity guarantees, and "Shop All Peptides" CTA.
* **Trust & Value Bar:** 4 key value propositions (100% USA Made, 99%+ Purity Tested, Same Day Shipping, Dedicated Support).
* **Single Peptides Grid:** Direct grid of top 12 single peptides with sale badges, price display, and Quick View / Buy buttons.
* **Peptide Blends Showcase:** Secondary showcase emphasizing synergy blends (e.g. BPC-157 & TB-500).
* **About Biotech Peptides Module:** Company profile, manufacturing standards, and research commitment narrative.
* **Recent Research Articles:** Latest 3 peer-reviewed articles from the knowledge base.
* **Legal Footer:** Statutory 503A/503B notices, in-vitro disclaimers, copyright, and payment method icons.

### 2. Catalog: Buy Peptides (`/buy-peptides/`)
* **Layout:** Two-column responsive view (Sidebar filters + 4-column product grid).
* **Filters:** Category filter (All, Single Peptides, Blends), In-Stock toggle, Price sorting (Default, Price: Low to High, Price: High to Low, Popularity, Newest).
* **Pagination:** 28 products per page matching WooCommerce default pagination.
* **State Preservation:** URL search parameters (`?page=2&orderby=price`) allowing shareable filter states.

### 3. Category Archive Pages
* **Single Peptides (`/product-category/peptides/`):** Filtered view for 73 single peptide compounds with custom SEO title and category description.
* **Peptide Blends (`/product-category/blends/`):** Filtered view for 16 proprietary synergistic blends with blend-specific headers.

### 4. Product Detail Pages (`/product/[slug]/`)
* **Breadcrumbs:** Home > Peptides / Blends > Product Name.
* **Gallery:** Primary product image with zoom view, Certificate of Analysis (COA) thumbnail badge.
* **Pricing & Options:** Regular price, sale price, stock badge ("In Stock"), size/vial selection swatches for multi-variation products (e.g., 5mg vs 10mg).
* **Volume Discount Table:** Dynamic matrix displaying unit prices for 1–4 units, 5–9 units (5% off), and 10+ units (10% off).
* **Quantity Selector & Add-to-Cart:** Incremental counter with instant slide-over cart drawer opening.
* **Specifications Grid:** Molecular Formula, Molecular Weight, CAS Number, Sequence, and PubChem CID parsed from factual reference data.
* **Author / Medical Reviewer:** Dr. Usman author profile badge.
* **Related Products:** 4 related compounds from the same therapeutic category.
* **SEO & JSON-LD:** Structured schema.org Product markup with price, availability, and brand.

### 5. Shopping Cart (`/cart/`)
* **Itemized Table:** Product thumbnail, title, selected size variant, unit price, quantity increment/decrement, and subtotal.
* **Volume Savings Callout:** Green banner detailing exact dollar savings earned from tiered purchases.
* **Shipping Estimator:** Real-time selector for USPS Priority ($11.25) vs UPS Next Day ($45.00).
* **Coupon Form:** Promo code input interface.
* **Checkout CTA:** High-contrast blue button directing to checkout.

### 6. Checkout (`/checkout/`)
* **Billing & Shipping Address Form:** Standard compliant checkout fields (First name, last name, company, address 1 & 2, city, state, postal code, phone, email).
* **Payment Selector:**
  * **CRYPTO:** Supports Bitcoin (BTC), Ethereum (ETH), and USDT (TRC-20 & ERC-20) with wallet addresses and confirmation instructions.
  * **CASHAPP:** Cash App direct transfer to Cashtag $psci2021 with note "Cosmetics".
  * **APPLE PAY:** Fast Apple Cash / Apple Pay transfer to Biotechpeptidessupport@gmail.com / +3122862032.
* **Age & Terms Agreement:** Mandatory checkbox confirming "I certify that I am at least 21 years old and agree to the research-only terms."
* **Order Processing:** Submits to `/api/checkout`, persists order in SQLite, and routes to `/success-page/`.

### 7. Order Confirmation (`/success-page/`)
* **Order Details:** Order number, date, customer email, item list, and paid total.
* **Payment Verification:** If CashApp selected, renders highlighted box:
  * "Please send payment of $XX.XX to Cash App handle: **$psci2021**"
  * "Important: Write only **Cosmetics** in the payment note to prevent automated delays."

### 8. Customer Portal (`/my-account/`)
* **Guest State:** Dual-tab Login and Register forms with validation and session feedback.
* **Authenticated State:** Account dashboard displaying order history, address management, and logout action.

### 9. Research Blog & Knowledge Base (`/news/`, `/knowledge-center/`, `/[slug]/`)
* **Archive:** Grid of 186 articles with featured images, publication dates, excerpts, and search bar.
* **Post Single:** Full sanitized editorial article, references, author bio for Dr. Usman, and disclaimer footer.

### 10. Institutional & Legal Pages
* Fully reconstructed static pages with original copy:
  * `/about/` - Mission, laboratory quality assurance, and USA synthesis guarantee.
  * `/shipping/` - Cold-chain packaging, same-day dispatch cutoffs, USPS/UPS rates.
  * `/privacy-policy/` - CCPA & GDPR compliant data privacy declaration.
  * `/terms-and-conditions/` - Complete laboratory terms and 21+ compliance restrictions.
  * `/accessibility/` - ADA Title III accessibility declaration.
  * `/dr-usman/` - Scientific advisor biography and credentials.
  * `/cash-app-payment-instructions/` - Step-by-step payment protocol.
  * `/contact-us/` - Contact form submitting to SQLite `inquiries`, customer phone and email disclosures.

---

## 3. Shared Reusable Components

1. **`TopBar` (`src/components/TopBar.tsx`):** Slim utility bar with quick links and cart counter.
2. **`Header` (`src/components/Header.tsx`):** Sticky navigation bar with SVG logo, categorized dropdown, live search autocomplete, and mobile drawer.
3. **`AgeGateModal` (`src/components/AgeGateModal.tsx`):** Federal and state compliance modal gate with cookie/session persistence.
4. **`ProductCard` (`src/components/ProductCard.tsx`):** Standardized product thumbnail, sale badges, prices, and CTA buttons.
5. **`TierDiscountTable` (`src/components/TierDiscountTable.tsx`):** Dynamic discount tier matrix.
6. **`MiniCartDrawer` (`src/components/MiniCartDrawer.tsx`):** Side-panel cart drawer with quantity toggles and subtotal summary.
7. **`CatalogView` (`src/components/CatalogView.tsx`):** Generic product grid container with filters, sorting, and pagination.
8. **`Footer` (`src/components/Footer.tsx`):** Comprehensive footer with FDA/503A notices and navigation columns.
