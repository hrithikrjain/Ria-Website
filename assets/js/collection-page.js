/* ============================================================
   RIA ART JEWELLERY — COLLECTION PAGE LOGIC
   ============================================================ */

// WA_NUMBER declared globally by whatsapp.js (loaded before this script)

document.addEventListener('DOMContentLoaded', () => {
  // Support both legacy data-category pages and URL-based template (/collections/slug)
  let cat = document.body.dataset.category;

  if (!cat) {
    const pathParts = window.location.pathname.split('/');
    const slug = pathParts[pathParts.length - 1].replace(/\.html$/, '');
    if (slug && slug !== 'collection-template') {
      const match = (window.RIA_PRODUCTS || []).find(p => p.category_slug === slug);
      if (match) {
        cat = match.category;
        // Populate hero content from categories.json non-blocking
        loadCollectionMeta(slug);
      }
    }
  }

  if (!cat) return;

  injectQuickFilterBar();

  const products = (window.RIA_PRODUCTS || []).filter(p => p.category === cat);
  renderCollectionGrid(products);
  renderRelated(cat);
});

function loadCollectionMeta(slug) {
  fetch('/assets/data/categories.json')
    .then(r => r.json())
    .then(cats => {
      const c = cats.find(x => x.slug === slug);
      if (!c) return;
      const heroImg = document.querySelector('.hero-bg img');
      if (heroImg && c.hero_image) { heroImg.src = c.hero_image; heroImg.alt = c.name; }
      const heroTitle = document.querySelector('.collection-hero-title');
      if (heroTitle) heroTitle.textContent = c.name;
      const heroSub = document.querySelector('.collection-hero-subtitle');
      if (heroSub && c.subtitle) heroSub.textContent = c.subtitle;
      const heroMicro = document.querySelector('.hero-micro');
      if (heroMicro) heroMicro.textContent = 'RIA ART JEWELLERY';
      document.title = (c.meta_title || c.name + ' | Ria Art Jewellery');
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && c.meta_description) metaDesc.setAttribute('content', c.meta_description);
    })
    .catch(() => {});
}

/* ── Quick-filter sticky bar (injected before the product grid section) ── */
function injectQuickFilterBar() {
  const gridSection = document.querySelector('#collection-grid')?.closest('section');
  if (!gridSection) return;

  const occasions = ['Bridal', 'Reception', 'Mehendi', 'Sangeet', 'Festive', 'Party Wear', 'Daily Wear'];

  const bar = document.createElement('div');
  bar.className = 'quick-filter-bar';
  bar.innerHTML = `
    <span class="quick-filter-label">Show:</span>
    ${occasions.map(o =>
      `<button class="quick-filter-chip" data-group="occasion" data-val="${o}">${o}</button>`
    ).join('')}
    <div class="quick-filter-divider"></div>
    <button class="quick-filter-adv filter-open-btn" type="button">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="4" y1="6" x2="11" y2="6"/><line x1="13" y1="6" x2="20" y2="6"/><circle cx="12" cy="6" r="2"/>
        <line x1="4" y1="12" x2="8" y2="12"/><line x1="10" y1="12" x2="20" y2="12"/><circle cx="9" cy="12" r="2"/>
        <line x1="4" y1="18" x2="14" y2="18"/><line x1="16" y1="18" x2="20" y2="18"/><circle cx="15" cy="18" r="2"/>
      </svg>
      All Filters
    </button>
  `;

  gridSection.parentNode.insertBefore(bar, gridSection);

  bar.querySelectorAll('.quick-filter-chip').forEach(chip => {
    chip.addEventListener('click', function () {
      this.classList.toggle('active');
      const panelChip = document.querySelector(
        `.filter-chip[data-group="${this.dataset.group}"][data-val="${this.dataset.val}"]`
      );
      if (panelChip) {
        if (this.classList.contains('active')) panelChip.classList.add('active');
        else panelChip.classList.remove('active');
      }
      if (typeof applyFilters === 'function') applyFilters();
    });
  });
}

/* ── Product grid ── */
function renderCollectionGrid(products) {
  const grid = document.getElementById('collection-grid');
  if (!grid) return;

  const showing = document.querySelector('.filter-showing');
  if (showing) showing.textContent = `Showing ${products.length} of ${products.length} pieces`;

  if (!products.length) {
    grid.innerHTML = `
      <p style="grid-column:1/-1;text-align:center;color:var(--ria-text-muted);padding:48px 0;
                font-family:'Cormorant Garamond',serif;font-size:1.1rem">
        No products found in this collection yet.
      </p>`;
    return;
  }

  grid.innerHTML = products.map(renderCard).join('');

  // Wire vault quick-add
  grid.querySelectorAll('.js-vault-add').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const slug    = btn.dataset.slug;
      const product = (window.RIA_PRODUCTS || []).find(p => p.slug === slug);
      if (product && window.addToVault) {
        window.addToVault(product, {}, btn);
        btn.classList.add('saved');
      }
    });
  });

  // Scroll reveal
  if (window._riaRevealObserver) {
    grid.querySelectorAll('.reveal').forEach(el => window._riaRevealObserver.observe(el));
  } else if (window._revealObserver) {
    grid.querySelectorAll('.reveal').forEach(el => window._revealObserver.observe(el));
  } else {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08 });
    grid.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
  }
}

/* ── Individual card — image-dominant with hover overlay ── */
function renderCard(p) {
  const price    = getDisplayPrice(p);
  const hasModel = p.images && p.images.length > 1;
  const waText   = encodeURIComponent(
    `Hi! I'm interested in "${p.title}" from Ria Art Jewellery \u{1F49B}\n` +
    `Category: ${p.category}\n` +
    `Link: ${window.location.origin}/products/${p.slug}\n\n` +
    `Please share availability and details. Thank you!`
  );
  const badges = [
    p.bestseller  ? '<span class="badge badge-best">Bestseller</span>' : '',
    p.new_arrival ? '<span class="badge badge-new">New</span>'         : '',
  ].join('');

  return `
<article class="product-card hover-lift reveal${hasModel ? '' : ' no-model'}"
  data-slug="${p.slug}"
  data-category="${p.category}"
  data-occasions="${(p.occasions || []).join(',')}"
  data-style="${(p.style || []).join(',')}"
  data-metal="${p.metal || ''}"
  data-price-band="${p.price_band || ''}">

  <a href="/products/${p.slug}" class="product-card-link">
    <div class="product-card-image-wrap">
      <img src="/assets/images/products/${p.images[0]}"
           alt="${p.title}" loading="lazy"
           class="product-card-image product-img-n"
           onerror="this.style.opacity='0'">
      ${hasModel
        ? `<img src="/assets/images/products/${p.images[1]}"
               alt="${p.title} model" loading="lazy"
               class="product-card-image product-img-m"
               onerror="this.style.opacity='0'">`
        : ''}
      <div class="product-badges">${badges}</div>
    </div>
  </a>

  <!-- Hover overlay: sibling of anchor to avoid nested anchors -->
  <div class="product-card-hover-overlay" aria-hidden="true">
    <a href="/products/${p.slug}" class="product-hover-view">View Details</a>
    <a href="https://wa.me/${WA_NUMBER}?text=${waText}"
       class="product-hover-wa" target="_blank" rel="noopener">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#25D366"/><path fill="#FFFFFF" d="M12 4C7.582 4 4 7.582 4 12c0 1.418.373 2.748 1.024 3.896L4 20.5l4.736-1.24A7.948 7.948 0 0012 20c4.418 0 8-3.582 8-8S16.418 4 12 4z"/><path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
      Enquire
    </a>
  </div>

  <button class="product-vault-quick js-vault-add"
          data-slug="${p.slug}"
          aria-label="Save ${p.title} to Inquiry Vault">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  </button>

  <div class="product-card-body product-card-body--slim">
    <h3 class="product-card-name">
      <a href="/products/${p.slug}">${p.title}</a>
    </h3>
    <p class="product-card-price"><span class="price-amt">${price}</span></p>
  </div>
</article>`;
}

/* ── Price helpers ── */
function getDisplayPrice(p) {
  const fmt = n => '₹' + Number(n).toLocaleString('en-IN');
  if (!p) return '';
  if (p.pricing_type === 'single' || p.pricing_type === 'Single Price')
    return fmt(p.price || 0);
  if (p.pricing_type === 'sgm' || p.pricing_type === 'SGM Finish Variants')
    return fmt(p.sgm_price || 0) + ' / finish';
  if (p.pricing_type === 'quantity' || p.pricing_type === 'Quantity Variants') {
    const min = Math.min(...(p.quantity_variants || []).map(v => v.price));
    return 'From ' + fmt(min);
  }
  if (p.pricing_type === 'colour' || p.pricing_type === 'Colour Variants') {
    const min = Math.min(...(p.colour_variants || []).map(v => v.price));
    return 'From ' + fmt(min);
  }
  return fmt(p.price || 0);
}

/* ── Related categories ── */
function renderRelated(currentCat) {
  const related = document.getElementById('related-categories');
  if (!related) return;

  const cats = [
    { name: 'Bridal Set',    slug: 'bridal-set',    img: 'bridal-set/bridal set 1N (13495).jpeg' },
    { name: 'Choker',        slug: 'choker',         img: 'choker/choker 1N (6395).jpeg' },
    { name: 'Necklace Set',  slug: 'necklace-set',   img: 'necklace-set/necklace 1N (5985).jpeg' },
    { name: 'Bangles',       slug: 'bangles',         img: 'bangles/bangles 2N (9285).jpeg' },
    { name: 'Kada Bracelet', slug: 'kada-bracelet',  img: 'kada-bracelet/kada bracelet 1N (2795) (SGM).jpeg' },
    { name: 'Ear Rings',     slug: 'ear-rings',       img: 'ear-rings/ear ring 1 (2795).jpeg' },
    { name: 'Matha Pati',    slug: 'matha-pati',     img: 'matha-pati/matha pati 2 (3295).jpeg' },
    { name: 'Long Set',      slug: 'long-set',        img: 'long-set/long set 1N (5195).jpeg' },
  ].filter(c => c.name !== currentCat).slice(0, 4);

  related.innerHTML = cats.map(c => `
    <a href="/collections/${c.slug}" class="collection-card" style="aspect-ratio:1">
      <img src="/assets/images/products/${c.img}" alt="${c.name}"
           loading="lazy" class="collection-card-bg">
      <div class="collection-card-overlay"></div>
      <div class="collection-card-content">
        <div class="collection-card-name">${c.name}</div>
      </div>
    </a>`).join('');
}
