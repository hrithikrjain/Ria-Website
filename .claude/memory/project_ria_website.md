---
name: project-ria-website
description: Ria Art Jewellery website — full D2C static site built in HTML/CSS/Vanilla JS
metadata:
  type: project
---

Complete static website built for Ria Art Jewellery, a Mumbai-based imitation jewellery brand.

**Why:** Client needed a zero-cost D2C site with WhatsApp-first conversion flow.

**Stack:** HTML + CSS + Vanilla JS + Decap CMS + GitHub + Cloudflare Pages

**Location:** `C:\Users\Sandesh Jain\Downloads\Ria-Website\`

**What was built:**
- `index.html` — full homepage (hero, collections strip, brand story, featured products, trust, occasions, testimonials, Instagram grid, footer)
- `collections/*.html` — 24 collection pages (auto-generated, category-filtered via `data-category` on body)
- `occasions/*.html` — 6 occasion pages (bridal, reception, mehendi, sangeet, festive, party-wear)
- `products/*.html` — ~182 individual product pages (auto-generated from template, slug on body)
- `pages/` — about, contact, size-guide, care-guide, policy
- `search.html` — client-side search
- `admin/` — Decap CMS (index.html + config.yml)
- `_headers` — Cloudflare Pages cache headers
- `sitemap.xml`

**Key JS files:**
- `assets/js/products-data.js` — all ~182 products as `window.RIA_PRODUCTS` array
- `assets/js/components.js` — injects nav + vault drawer + footer into every page
- `assets/js/main.js` — nav scroll, search, vault (localStorage key: `ria_vault`), mobile nav
- `assets/js/collection-page.js` — renders product grid filtered by body data-category
- `assets/js/product-page.js` — renders full product detail page from slug
- `assets/js/filters.js` — filter panel with sessionStorage persistence

**WhatsApp number:** +91 98699 39003 (`wa.me/919869939003`)

**Variant types:** single | quantity | colour | sgm (Silver/Gold/Copper Brown triple finish)

**Images:** All in `assets/images/products/[category-slug]/` — original filenames preserved (JPEG/PNG). NOT yet converted to WebP (future task).

**Decap CMS:** Admin at `/admin/`. Needs `YOUR_GITHUB_USERNAME` replaced in `admin/config.yml` before deploying.

**To deploy:** Push to GitHub → connect to Cloudflare Pages → set build output to `/` (no build step needed).
