/* ============================================================
   RIA ART JEWELLERY — OCCASION PAGE LOGIC
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Support both legacy data-occasion pages and URL-based template (/occasions/slug)
  let occ = document.body.dataset.occasion;

  if (!occ) {
    const pathParts = window.location.pathname.split('/');
    const slug = pathParts[pathParts.length - 1].replace(/\.html$/, '');
    if (slug && slug !== 'occasion-template') {
      // Convert slug to display name (bridal → Bridal, party-wear → Party Wear)
      occ = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      loadOccasionMeta(slug);
    }
  }

  if (!occ) return;

  const products = (window.RIA_PRODUCTS || []).filter(p => (p.occasions || []).includes(occ));
  renderOccasionGrid(products, occ);
});

function loadOccasionMeta(slug) {
  fetch('/assets/data/occasions.json')
    .then(r => r.json())
    .then(occasions => {
      const o = occasions.find(x => x.slug === slug);
      if (!o) return;
      const heroImg = document.querySelector('.hero-bg img');
      if (heroImg && o.hero_image) { heroImg.src = o.hero_image; heroImg.alt = o.name; }
      const heroTitle = document.querySelector('.collection-hero-title');
      if (heroTitle && o.subtitle) heroTitle.textContent = o.subtitle;
      const heroSub = document.querySelector('.collection-hero-subtitle');
      if (heroSub && o.description) heroSub.textContent = o.description;
      const heroMicro = document.querySelector('.hero-micro');
      if (heroMicro) heroMicro.textContent = o.name.toUpperCase();
      const sectionTitle = document.getElementById('occasion-section-title');
      if (sectionTitle) sectionTitle.textContent = 'Jewellery for ' + o.name;
      const tipsSection = document.getElementById('occasion-tips');
      if (tipsSection && o.styling_tips) {
        const tipsEl = document.getElementById('occasion-tips-text');
        if (tipsEl) tipsEl.textContent = o.styling_tips;
        tipsSection.style.display = '';
      }
      document.title = (o.meta_title || o.name + ' Jewellery | Ria Art Jewellery');
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && o.meta_description) metaDesc.setAttribute('content', o.meta_description);
    })
    .catch(() => {});
}

function renderOccasionGrid(products, occ) {
  const grid = document.getElementById('occasion-grid');
  const showing = document.querySelector('.filter-showing');
  if (showing) showing.textContent = 'Showing ' + products.length + ' pieces';
  if (!grid) return;

  const waNum = typeof WA_NUMBER !== 'undefined' ? WA_NUMBER : '919869939003';

  if (!products.length) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:48px;color:var(--ria-text-muted);font-family:\'Cormorant Garamond\',serif">Coming soon.</p>';
    return;
  }

  grid.innerHTML = products.map(p => {
    const price = getOccDisplayPrice(p);
    const hasModel = p.images && p.images.length > 1;
    const waText = encodeURIComponent(
      'Hi! I\'m interested in "' + p.title + '" from Ria Art Jewellery.\n' +
      'Product: ' + p.title + '\n' +
      'Category: ' + p.category + '\n' +
      'Link: ' + window.location.origin + '/products/' + p.slug + '.html\n\n' +
      'Please confirm availability. Thank you!'
    );
    return '<article class="product-card hover-lift reveal" data-slug="' + p.slug + '" data-occasions="' + (p.occasions || []).join(',') + '">' +
      '<a href="/products/' + p.slug + '.html" class="product-card-link">' +
        '<div class="product-card-image-wrap">' +
          '<img src="/assets/images/products/' + p.images[0] + '" alt="' + p.title + '" loading="lazy" class="product-card-image product-img-n" onerror="this.style.opacity=\'0\'">' +
          (hasModel ? '<img src="/assets/images/products/' + p.images[1] + '" alt="' + p.title + '" loading="lazy" class="product-card-image product-img-m" onerror="this.style.opacity=\'0\'">' : '') +
          (p.bestseller ? '<span class="badge badge-best">Bestseller</span>' : '') +
        '</div>' +
      '</a>' +
      '<div class="product-card-hover-overlay" aria-hidden="true">' +
        '<a href="/products/' + p.slug + '.html" class="product-hover-view">View Details</a>' +
        '<a href="https://wa.me/' + waNum + '?text=' + waText + '" class="product-hover-wa" target="_blank" rel="noopener">Enquire</a>' +
      '</div>' +
      '<div class="product-card-body product-card-body--slim">' +
        '<h3 class="product-card-name"><a href="/products/' + p.slug + '.html">' + p.title + '</a></h3>' +
        '<p class="product-card-price"><span class="price-amt">' + price + '</span></p>' +
      '</div>' +
    '</article>';
  }).join('');

  const obs = new IntersectionObserver(
    e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add('visible'); }),
    { threshold: 0.08 }
  );
  grid.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

function getOccDisplayPrice(p) {
  const fmt = n => '₹' + Number(n).toLocaleString('en-IN');
  if (!p) return '';
  if (p.pricing_type === 'single')   return fmt(p.price || 0);
  if (p.pricing_type === 'sgm')      return fmt(p.sgm_price || 0) + ' / finish';
  if (p.pricing_type === 'quantity') return 'From ' + fmt(Math.min(...(p.quantity_variants || []).map(v => v.price)));
  if (p.pricing_type === 'colour')   return 'From ' + fmt(Math.min(...(p.colour_variants || []).map(v => v.price)));
  return fmt(p.price || 0);
}
