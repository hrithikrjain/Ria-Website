/* ============================================================
   RIA ART JEWELLERY — PRODUCT LOADER & RENDERER
   Reads /assets/data/products.json and populates grids.
   ============================================================ */

(function () {
  'use strict';

  const WA_NUMBER = '919869939003';
  const DATA_URL  = '/assets/data/products.json';

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    const grids = document.querySelectorAll('[data-product-grid]');
    if (!grids.length) return;

    grids.forEach(showSkeletons);

    let products = [];
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      products = await res.json();
    } catch (err) {
      console.error('products.json failed:', err);
      grids.forEach(grid => {
        grid.innerHTML = `
          <div style="grid-column:1/-1;text-align:center;padding:3rem;color:#6B5550">
            <p style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;margin-bottom:1rem">New pieces arriving soon</p>
            <a href="https://wa.me/${WA_NUMBER}"
               style="display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.5rem;background:#25D366;color:#fff;border-radius:9999px;font-size:.875rem;text-decoration:none"
               target="_blank">Enquire on WhatsApp</a>
          </div>`;
      });
      return;
    }

    window._riaProducts = products;

    grids.forEach(grid => renderGrid(grid, products));

    // Filter tab clicks
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const filter  = this.dataset.filter;
        const grid    = document.getElementById('featuredGrid') || document.querySelector('[data-product-grid]');
        if (!grid) return;
        grid.dataset.filterMode = filter;
        renderGrid(grid, products);
      });
    });
  }

  function renderGrid(grid, allProducts) {
    const gridType   = grid.dataset.productGrid || 'all';
    const filterMode = grid.dataset.filterMode  || gridType;
    const limit      = parseInt(grid.dataset.limit) || 999;

    let filtered = allProducts;
    if (filterMode === 'featured') {
      filtered = allProducts.filter(p => p.featured);
    } else if (filterMode !== 'all') {
      filtered = allProducts.filter(p => p.category_slug === filterMode);
    }
    filtered = filtered.slice(0, limit);

    if (!filtered.length) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:2rem;color:#6B5550;font-family:\'Cormorant Garamond\',serif">No pieces found.</p>';
      return;
    }

    grid.innerHTML = filtered.map(renderCard).join('');

    grid.querySelectorAll('.js-add-vault').forEach(btn => {
      btn.addEventListener('click', handleVaultAdd);
    });

    if (window._riaRevealObserver) {
      grid.querySelectorAll('.reveal').forEach(el => window._riaRevealObserver.observe(el));
    }
  }

  function renderCard(p) {
    const hasModel  = p.images && p.images.length > 1;
    const priceHTML = getPriceHTML(p);
    const waURL     = buildWAURL(p);
    const badges    = getBadges(p);

    return `
<article class="product-card hover-lift reveal${hasModel ? '' : ' no-model'}" data-slug="${p.slug}">
  <a href="/products/${p.slug}.html" class="product-card-link" aria-label="View ${p.title}">
    <div class="product-card-image-wrap">
      <img src="${p.images[0]}" alt="${p.title}" class="product-card-image product-img-n" loading="lazy" width="400" height="500" onerror="this.style.display='none'">
      ${hasModel ? `<img src="${p.images[1]}" alt="${p.title} — styled" class="product-card-image product-img-m" loading="lazy" width="400" height="500" onerror="this.style.display='none'">` : ''}
      <div class="product-badges">${badges}</div>
      <button class="product-vault-quick js-add-vault" data-product='${safeJSON(p)}' aria-label="Save to Inquiry Vault">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
      </button>
    </div>
  </a>
  <div class="product-card-body">
    <span class="product-cat-label">${p.category}</span>
    <h3 class="product-card-name"><a href="/products/${p.slug}.html">${p.title}</a></h3>
    <p class="product-card-price">${priceHTML}</p>
    <div class="product-card-actions">
      <a href="/products/${p.slug}.html" class="btn-ghost-sm">View Details ›</a>
      <a href="${waURL}" class="btn-wa-sm" target="_blank" rel="noopener">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#25D366"/><path fill="#FFFFFF" d="M12 4C7.582 4 4 7.582 4 12c0 1.418.373 2.748 1.024 3.896L4 20.5l4.736-1.24A7.948 7.948 0 0012 20c4.418 0 8-3.582 8-8S16.418 4 12 4z"/><path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
        Enquire
      </a>
    </div>
  </div>
</article>`;
  }

  function safeJSON(p) {
    return JSON.stringify({
      slug: p.slug, title: p.title, category: p.category,
      pricing_type: p.pricing_type, price: p.price,
      sgm_price: p.sgm_price, quantity_variants: p.quantity_variants,
      colour_variants: p.colour_variants, images: p.images
    }).replace(/'/g, '&#39;');
  }

  function getPriceHTML(p) {
    const fmt = n => '₹' + Number(n).toLocaleString('en-IN');
    switch (p.pricing_type) {
      case 'Single Price':
        return `<span class="price-amt">${fmt(p.price)}</span>`;
      case 'SGM Finish Variants':
        return `<span class="price-amt">${fmt(p.sgm_price)}</span><span class="price-note"> / finish</span>`;
      case 'Quantity Variants':
        return `<span class="price-from">From </span><span class="price-amt">${fmt(Math.min(...p.quantity_variants.map(v => v.price)))}</span>`;
      case 'Colour Variants':
        return `<span class="price-from">From </span><span class="price-amt">${fmt(Math.min(...p.colour_variants.map(v => v.price)))}</span>`;
      default:
        return '';
    }
  }

  function getBadges(p) {
    return [
      p.new_arrival  ? '<span class="badge badge-new">New</span>'         : '',
      p.bestseller   ? '<span class="badge badge-best">Bestseller</span>' : '',
      p.availability === 'Last Few Pieces' ? '<span class="badge badge-limited">Only a few left</span>' : '',
    ].join('');
  }

  function buildWAURL(p) {
    const msg = `Hi! I'm interested in "${p.title}" from Ria Art Jewellery 💛\n\nProduct: ${p.title}\nCategory: ${p.category}\nLink: ${window.location.origin}/products/${p.slug}.html\n\nPlease confirm availability. Thank you!`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  function showSkeletons(grid) {
    const cols = window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 4;
    grid.innerHTML = Array(cols * 2).fill(0).map(() => `
      <div class="product-skeleton">
        <div class="skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton-line" style="width:40%;height:10px;margin-bottom:6px"></div>
          <div class="skeleton-line" style="width:75%;height:14px;margin-bottom:8px"></div>
          <div class="skeleton-line" style="width:30%;height:12px"></div>
        </div>
      </div>`).join('');
  }

  function handleVaultAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const product = JSON.parse(this.dataset.product.replace(/&#39;/g, "'"));
      if (window.addToVault) {
        const v = getDefaultVariant(product);
        window.addToVault(product, v, this);
      }
      this.classList.add('saved');
    } catch (err) {
      console.warn('Vault add error:', err);
    }
  }

  function getDefaultVariant(p) {
    if (p.pricing_type === 'Quantity Variants' && p.quantity_variants?.length)
      return { label: p.quantity_variants[0].label, price: p.quantity_variants[0].price };
    if (p.pricing_type === 'Colour Variants' && p.colour_variants?.length)
      return { colour: p.colour_variants[0].colour, price: p.colour_variants[0].price };
    if (p.pricing_type === 'SGM Finish Variants')
      return { finishes: ['Silver'], price: p.sgm_price };
    return {};
  }

  window.riaProducts = { renderGrid };
})();

/* Shared price formatter used by search.js */
window.getPriceDisplay = function (p) {
  if (!p) return '';
  if (p.pricing_type === 'Single Price')        return '&#8377;' + Number(p.price || 0).toLocaleString('en-IN');
  if (p.pricing_type === 'SGM Finish Variants') return '&#8377;' + Number(p.sgm_price || 0).toLocaleString('en-IN') + ' / finish';
  if (p.pricing_type === 'Quantity Variants')   return 'From &#8377;' + Math.min(...(p.quantity_variants || []).map(v => v.price)).toLocaleString('en-IN');
  if (p.pricing_type === 'Colour Variants')     return 'From &#8377;' + Math.min(...(p.colour_variants || []).map(v => v.price)).toLocaleString('en-IN');
  return '';
};
