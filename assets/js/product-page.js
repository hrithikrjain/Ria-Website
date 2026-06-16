/* ============================================================
   RIA ART JEWELLERY — PRODUCT DETAIL PAGE
   Reads data-slug from <body> and renders full product page
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Support both URL-based slug (/products/slug) and legacy data-slug attribute
  const pathSlug = window.location.pathname.split('/').pop().replace(/\.html$/, '');
  const slug = (pathSlug && pathSlug !== 'product-template') ? pathSlug : document.body.dataset.slug;
  if (!slug) return;
  const product = (window.RIA_PRODUCTS || []).find(p => p.slug === slug);
  if (!product) { document.getElementById('product-container').innerHTML = '<p style="padding:80px 24px;text-align:center;color:var(--ria-text-muted)">Product not found.</p>'; return; }
  renderProduct(product);
  renderRelatedProducts(product);
});

let currentProduct = null;
let selectedVariant = {};

function renderProduct(p) {
  currentProduct = p;
  selectedVariant = {};

  // Gallery
  const mainImg = document.getElementById('gallery-main-img');
  const thumbs  = document.getElementById('gallery-thumbs');
  if (mainImg && p.images.length) {
    mainImg.src = `/assets/images/products/${p.images[0]}`;
    mainImg.alt = p.title;
  }
  if (thumbs) {
    thumbs.innerHTML = p.images.map((img, i) =>
      `<div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-img="/assets/images/products/${img}" onclick="switchImage(this)">
        <img src="/assets/images/products/${img}" alt="${p.title}" loading="lazy">
      </div>`
    ).join('');
  }

  // Hover zoom
  setupZoom();

  // Breadcrumb
  const bc = document.getElementById('breadcrumb');
  if (bc) {
    const catSlug = slugify(p.category);
    bc.innerHTML = `<a href="/index.html">Home</a> › <a href="/collections/${catSlug}">${p.category}</a> › ${p.title}`;
  }

  // Page title + meta
  document.title = `${p.title} | Ria Art Jewellery`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', `${p.title} — ${p.category} from Ria Art Jewellery Mumbai. Handcrafted premium imitation jewellery. ${(p.occasions||[]).join(', ')}.`);

  // Title
  const title = document.getElementById('product-title');
  if (title) title.textContent = p.title;

  // Badges
  const badgeEl = document.getElementById('product-badges');
  if (badgeEl) {
    const badges = [];
    if (p.bestseller) badges.push('<span class="badge badge-gold" style="position:static;display:inline-block;margin-right:6px">Bestseller</span>');
    if (p.new_arrival) badges.push('<span class="badge badge-new" style="position:static;display:inline-block">New Arrival</span>');
    badgeEl.innerHTML = badges.join('');
  }

  // Availability badge
  const availEl = document.getElementById('availability-badge');
  if (availEl) {
    const avMap = { 'Limited Stock': 'badge-limited', 'Last Few Pieces': 'badge-rose', 'Made to Order': 'badge-blue' };
    availEl.innerHTML = p.availability && p.availability !== 'Available'
      ? `<span class="badge ${avMap[p.availability] || 'badge-amber'}" style="position:static;display:inline-block;margin-bottom:12px">${p.availability}${p.availability === 'Made to Order' ? ' — 3–5 days' : ''}</span>`
      : '';
  }

  // Variants
  renderVariants(p);

  // Price
  updatePrice(p);

  // Description
  const descEl = document.getElementById('product-desc');
  if (descEl) descEl.textContent = p.description || `Beautiful ${p.title.toLowerCase()} from Ria Art Jewellery. Handcrafted with premium quality materials, anti-tarnish finish, and nickel-free plating. Perfect for ${(p.occasions||[]).join(', ')} occasions.`;

  // Occasion tags
  const occasionsEl = document.getElementById('product-occasions');
  if (occasionsEl) occasionsEl.innerHTML = (p.occasions||[]).map(o => `<span class="tag">${o}</span>`).join('');

  // Style + Metal
  const styleEl = document.getElementById('product-style');
  if (styleEl) styleEl.innerHTML = [...(p.style||[]), p.metal].map(s => `<span class="tag tag-gold">${s}</span>`).join('');

  // Scarcity
  const scarcityEl = document.getElementById('scarcity-signal');
  if (scarcityEl) scarcityEl.style.display = p.bestseller ? '' : 'none';

  // Bridal notice
  const bridalEl = document.getElementById('bridal-notice');
  if (bridalEl) bridalEl.style.display = (p.occasions||[]).includes('Bridal') ? '' : 'none';

  // Lifetime bead guarantee
  const beadEl = document.getElementById('bead-guarantee');
  const beadCategories = ['Ghrom Mala','Mangal Sutra','Necklace Set','Long Set','Bridal Set'];
  if (beadEl) beadEl.style.display = beadCategories.includes(p.category) ? '' : 'none';

  // WhatsApp button
  const waBtn = document.getElementById('wa-btn');
  if (waBtn) waBtn.onclick = () => sendProductWhatsApp(p);

  // Cart button (support both old id="vault-btn" and new id="cart-btn")
  const cartBtn = document.getElementById('cart-btn') || document.getElementById('vault-btn');
  if (cartBtn) {
    cartBtn.textContent = 'Add to Cart';
    cartBtn.onclick = () => {
      if (window.addToCart) window.addToCart(p, selectedVariant, cartBtn);
    };
  }

  // JSON-LD
  const basePrice = p.pricing_type === 'single' ? p.price
    : p.pricing_type === 'sgm' ? (p.sgm_price || 0)
    : p.pricing_type === 'quantity' ? (p.quantity_variants[0]?.price || 0)
    : (p.colour_variants?.[0]?.price || 0);
  const ld = {
    "@context":"https://schema.org","@type":"Product",
    "name": p.title,
    "image": `/assets/images/products/${p.images[0]}`,
    "description": `${p.title} — ${p.category} from Ria Art Jewellery Mumbai. Handcrafted premium imitation jewellery.`,
    "brand": { "@type":"Brand","name":"Ria Art Jewellery" },
    "offers": {
      "@type":"Offer","priceCurrency":"INR","price": basePrice,
      "availability":"https://schema.org/InStock",
      "seller":{"@type":"Organization","name":"Ria Art Jewellery"}
    }
  };
  const ldEl = document.getElementById('product-ld');
  if (ldEl) ldEl.textContent = JSON.stringify(ld);
}

function renderVariants(p) {
  const varEl = document.getElementById('variant-section');
  if (!varEl) return;

  if (p.pricing_type === 'single') {
    varEl.innerHTML = '';
    return;
  }

  if (p.pricing_type === 'quantity') {
    varEl.innerHTML = `<div class="variant-section">
      <span class="variant-label">HOW MANY PIECES?</span>
      <div class="variant-options" id="qty-options">
        ${p.quantity_variants.map((v, i) =>
          `<button class="variant-btn${i===0?' active':''}" data-label="${v.label}" data-price="${v.price}"
            onclick="selectQuantity(this, ${v.price}, '${v.label}')">
            ${v.label} — ${RIA_FORMAT_PRICE(v.price)}
          </button>`
        ).join('')}
      </div>
    </div>`;
    if (p.quantity_variants.length) {
      selectedVariant = { label: p.quantity_variants[0].label, price: p.quantity_variants[0].price };
    }
    return;
  }

  if (p.pricing_type === 'colour') {
    varEl.innerHTML = `<div class="variant-section">
      <span class="variant-label">SELECT COLOUR</span>
      <div class="variant-options" id="colour-options">
        ${p.colour_variants.map((v, i) =>
          `<button class="variant-btn${i===0?' active':''}" data-colour="${v.colour}" data-price="${v.price}"
            onclick="selectColour(this, ${v.price}, '${v.colour}')">
            ${v.colour} — ${RIA_FORMAT_PRICE(v.price)}
          </button>`
        ).join('')}
      </div>
    </div>`;
    if (p.colour_variants.length) {
      selectedVariant = { colour: p.colour_variants[0].colour, price: p.colour_variants[0].price };
    }
    return;
  }

  if (p.pricing_type === 'sgm') {
    const sp = p.sgm_price || 0;
    varEl.innerHTML = `<div class="variant-section">
      <span class="variant-label">SELECT FINISH (CAN CHOOSE MULTIPLE)</span>
      <div style="display:flex;flex-direction:column;gap:8px" id="sgm-options">
        <label class="sgm-option active" data-finish="Silver">
          <input type="checkbox" checked style="display:none" onchange="updateSGM()">
          <div class="sgm-checkbox"></div>
          <div class="sgm-label"><strong>S</strong> — Silver Finish</div>
        </label>
        <label class="sgm-option" data-finish="Gold">
          <input type="checkbox" style="display:none" onchange="updateSGM()">
          <div class="sgm-checkbox"></div>
          <div class="sgm-label"><strong>G</strong> — Gold Finish</div>
        </label>
        <label class="sgm-option" data-finish="Copper Brown">
          <input type="checkbox" style="display:none" onchange="updateSGM()">
          <div class="sgm-checkbox"></div>
          <div class="sgm-label"><strong>M</strong> — Copper Brown (Meenakari)</div>
        </label>
      </div>
      <p style="margin-top:10px;font-size:.8rem;color:var(--ria-text-muted)">${RIA_FORMAT_PRICE(sp)} per finish — select multiple finishes to increase quantity</p>
    </div>`;
    selectedVariant = { finishes: ['Silver'], price: sp };

    // Setup SGM toggles
    document.querySelectorAll('.sgm-option').forEach(opt => {
      opt.addEventListener('click', function() {
        const cb = this.querySelector('input');
        cb.checked = !cb.checked;
        this.classList.toggle('active', cb.checked);
        updateSGM();
      });
    });
  }
}

window.selectQuantity = function(btn, price, label) {
  document.querySelectorAll('#qty-options .variant-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedVariant = { label, price };
  updatePriceDisplay(price);
};

window.selectColour = function(btn, price, colour) {
  document.querySelectorAll('#colour-options .variant-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedVariant = { colour, price };
  updatePriceDisplay(price);
};

window.updateSGM = function() {
  const opts = document.querySelectorAll('.sgm-option');
  const finishes = [];
  opts.forEach(o => { if (o.querySelector('input').checked) finishes.push(o.dataset.finish); });
  const count = Math.max(1, finishes.length);
  const total = (currentProduct.sgm_price || 0) * count;
  selectedVariant = { finishes, price: total };
  const priceEl = document.getElementById('price-display');
  if (priceEl) priceEl.innerHTML = `${RIA_FORMAT_PRICE(currentProduct.sgm_price)} × ${count} finish${count>1?'es':''} = <strong>${RIA_FORMAT_PRICE(total)}</strong>`;
};

function updatePrice(p) {
  const el = document.getElementById('price-display');
  if (!el) return;
  if (p.pricing_type === 'single') { el.textContent = RIA_FORMAT_PRICE(p.price); return; }
  if (p.pricing_type === 'quantity') { el.textContent = RIA_FORMAT_PRICE(p.quantity_variants[0]?.price || 0); return; }
  if (p.pricing_type === 'colour') { el.textContent = RIA_FORMAT_PRICE(p.colour_variants?.[0]?.price || 0); return; }
  if (p.pricing_type === 'sgm') { el.textContent = p.sgm_price ? RIA_FORMAT_PRICE(p.sgm_price) + ' per finish' : 'Price on request'; }
}

function updatePriceDisplay(price) {
  const el = document.getElementById('price-display');
  if (el) el.textContent = RIA_FORMAT_PRICE(price);
}

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function setupZoom() {
  const wrap = document.querySelector('.product-gallery-main');
  const mainImg = document.getElementById('gallery-main-img');
  if (!wrap || !mainImg) return;
  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(2);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(2);
    mainImg.style.transformOrigin = `${x}% ${y}%`;
    mainImg.style.transform = 'scale(1.8)';
  });
  wrap.addEventListener('mouseleave', () => { mainImg.style.transform = 'scale(1)'; });
}

window.switchImage = function(thumb) {
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
  const mainImg = document.getElementById('gallery-main-img');
  if (mainImg) { mainImg.src = thumb.dataset.img; mainImg.style.transform = 'scale(1)'; }
};

function sendProductWhatsApp(p) {
  const sv = selectedVariant;
  let variantLine = '';
  if (p.pricing_type === 'sgm' && sv.finishes) variantLine = `\n✨ Selected Finishes: ${sv.finishes.join(', ')} (${sv.finishes.length} finish${sv.finishes.length>1?'es':''})`;
  else if (p.pricing_type === 'colour' && sv.colour) variantLine = `\n🎨 Selected Colour: ${sv.colour}`;
  else if (p.pricing_type === 'quantity' && sv.label) variantLine = `\n📦 Quantity: ${sv.label}`;
  const price = sv.price || (p.pricing_type === 'single' ? p.price : null);
  const msg = `Hi! I'm interested in a piece from Ria Art Jewellery 💛\n\n🪙 Product: ${p.title}\n💰 Price: ${price ? RIA_FORMAT_PRICE(price) : 'Please share price'}${variantLine}\n🏷️ Category: ${p.category}\n🔗 Product Link: ${window.location.href}\n\nPlease confirm availability and details. Thank you!`;
  window.open(`https://wa.me/919869939003?text=${encodeURIComponent(msg)}`, '_blank');
}

function getDisplayPrice(p) {
  const fmt = n => '₹' + Number(n).toLocaleString('en-IN');
  if (!p) return '';
  if (p.pricing_type === 'single')   return fmt(p.price || 0);
  if (p.pricing_type === 'sgm')      return fmt(p.sgm_price || 0) + ' / finish';
  if (p.pricing_type === 'quantity') return 'From ' + fmt(Math.min(...(p.quantity_variants || []).map(v => v.price)));
  if (p.pricing_type === 'colour')   return 'From ' + fmt(Math.min(...(p.colour_variants || []).map(v => v.price)));
  return fmt(p.price || 0);
}

function renderRelatedProducts(p) {
  const el = document.getElementById('related-products');
  if (!el) return;
  const related = (window.RIA_PRODUCTS||[])
    .filter(r => r.slug !== p.slug && (r.category === p.category || (r.occasions||[]).some(o => (p.occasions||[]).includes(o))))
    .slice(0, 4);
  el.innerHTML = related.map(r => {
    const price    = getDisplayPrice(r);
    const hasModel = r.images && r.images.length > 1;
    return `<article class="product-card${hasModel ? '' : ' no-model'}" data-slug="${r.slug}">
      <a href="/products/${r.slug}" class="product-card-link">
        <div class="product-card-image-wrap">
          <img src="/assets/images/products/${r.images[0]}"
               alt="${r.title}" loading="lazy"
               class="product-card-image product-img-n">
          ${hasModel
            ? `<img src="/assets/images/products/${r.images[1]}"
                   alt="${r.title}" loading="lazy"
                   class="product-card-image product-img-m">`
            : ''}
        </div>
      </a>
      <div class="product-card-body product-card-body--slim">
        <h3 class="product-card-name">
          <a href="/products/${r.slug}">${r.title}</a>
        </h3>
        <p class="product-card-price"><span class="price-amt">${price}</span></p>
      </div>
    </article>`;
  }).join('');
}
