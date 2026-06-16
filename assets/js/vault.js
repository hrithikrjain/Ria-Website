/* ============================================================
   RIA ART JEWELLERY — SHOPPING CART (localStorage)
   ============================================================ */

const CART_KEY = 'ria_vault'; // keep same localStorage key for continuity
const CART_MAX = 20;

function getCart()       { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } }
function saveCart(items) { localStorage.setItem(CART_KEY, JSON.stringify(items)); }

/* ── Shared price formatter ── handles both old pricing_type ('single','sgm','quantity','colour')
   from products-data.js AND new format ('Single Price','SGM Finish Variants', etc.) from products.json */
window.getDisplayPrice = function(p) {
  if (!p) return '';
  const fmt = n => '₹' + Number(n).toLocaleString('en-IN');
  const t = p.pricing_type;
  if (t === 'single'   || t === 'Single Price')        return fmt(p.price || 0);
  if (t === 'sgm'      || t === 'SGM Finish Variants') return fmt(p.sgm_price || 0) + ' / finish';
  if (t === 'quantity' || t === 'Quantity Variants') {
    const vv = p.quantity_variants || [];
    return vv.length ? 'From ' + fmt(Math.min(...vv.map(v => v.price))) : '';
  }
  if (t === 'colour'   || t === 'Colour Variants') {
    const vv = p.colour_variants || [];
    return vv.length ? 'From ' + fmt(Math.min(...vv.map(v => v.price))) : '';
  }
  return p.price ? fmt(p.price) : '';
};

/* ── Add to cart ── */
window.addToCart = function(product, selectedVariant, btn) {
  const items = getCart();
  if (items.length >= CART_MAX) {
    showToast('Cart is full (max 20 items). Remove something first.');
    return;
  }

  const sv = selectedVariant || {};
  let variantLabel = '';
  let price = null;
  const t = product.pricing_type;

  if ((t === 'SGM Finish Variants' || t === 'sgm') && sv.finishes && sv.finishes.length) {
    variantLabel = sv.finishes.map(f => '1 pc ' + f + ' Finish').join(' / ');
    price = sv.price;
  } else if ((t === 'Colour Variants' || t === 'colour') && sv.colour) {
    variantLabel = sv.colour;
    price = sv.price;
  } else if ((t === 'Quantity Variants' || t === 'quantity') && sv.label) {
    variantLabel = sv.label;
    price = sv.price;
  } else if (t === 'Single Price' || t === 'single') {
    price = product.price;
  } else if (product.price) {
    price = product.price;
  }

  const id = product.slug + '__' + (variantLabel || 'default');
  if (items.find(i => i.id === id)) {
    showToast('Already in your cart!');
    return;
  }

  // Ensure full image path
  const rawImg = (product.images && product.images[0]) || '';
  const imgSrc = rawImg.startsWith('/') ? rawImg : '/assets/images/products/' + rawImg;

  items.push({
    id,
    slug:     product.slug,
    title:    product.title,
    category: product.category,
    image:    imgSrc,
    variant:  variantLabel || '',
    price:    price,
    waLink:   window.buildWALink ? window.buildWALink(product, selectedVariant) : '#',
  });

  saveCart(items);
  updateCartBadge();
  renderCartDrawer();
  animateCartBtn(btn);
  showToast('Added to cart!');
};
window.addToVault = window.addToCart; // backward-compat alias

window.removeFromCart = function(id) {
  const items = getCart().filter(i => i.id !== id);
  saveCart(items);
  updateCartBadge();
  renderCartDrawer();
};
window.removeFromVault = window.removeFromCart;

window.confirmCartRemove = function(id, title) {
  const el = document.querySelector('.vault-item[data-id="' + id.replace(/"/g, '&quot;') + '"]');
  if (!el) return;
  el.innerHTML = `
    <div style="padding:6px 0;display:flex;flex-direction:column;gap:8px;width:100%">
      <p style="font-size:.82rem;color:var(--ria-text-primary);margin:0">Remove from cart?</p>
      <div style="display:flex;gap:8px">
        <button onclick="renderCartDrawer()"
                style="flex:1;padding:7px 4px;border:1px solid var(--ria-border-medium);border-radius:var(--radius-sm);cursor:pointer;font-size:.78rem;background:transparent;color:var(--ria-text-primary)">Cancel</button>
        <button onclick="window.removeFromCart('${id.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}')"
                style="flex:1;padding:7px 4px;background:#8B3A2A;color:#fff;border:none;border-radius:var(--radius-sm);cursor:pointer;font-size:.78rem">Remove</button>
      </div>
    </div>`;
};

window.clearCart  = function() { saveCart([]); updateCartBadge(); renderCartDrawer(); };
window.clearVault = window.clearCart;

/* ── Badge update ── */
function updateCartBadge() {
  const count = getCart().length;
  document.querySelectorAll('.vault-badge, .cart-badge').forEach(badge => {
    badge.textContent = count > 0 ? count : '';
    badge.setAttribute('data-count', count);
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}
window.updateVaultBadge = updateCartBadge;

/* ── Render cart drawer ── */
function renderCartDrawer() {
  const body   = document.getElementById('cartDrawerBody')   || document.getElementById('vaultDrawerBody');
  const footer = document.getElementById('cartDrawerFooter') || document.getElementById('vaultDrawerFooter');
  if (!body) return;

  const items = getCart();

  if (!items.length) {
    body.innerHTML = `
      <div class="vault-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>Your cart is empty</p>
        <span style="font-size:.82rem">Add pieces you love to enquire about them all at once.</span>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = '';

  body.innerHTML = items.map(item => {
    const imgSrc = item.image && item.image.startsWith('/')
      ? item.image
      : '/assets/images/products/' + (item.image || '');
    const price  = item.price ? '₹' + item.price.toLocaleString('en-IN') : '';
    const safeId = item.id.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const safeTitle = item.title.replace(/\\/g, '\\\\').replace(/'/g, "\\'").slice(0, 50);
    return `
      <div class="vault-item" data-id="${item.id.replace(/"/g, '&quot;')}">
        <img src="${imgSrc}" alt="${item.title}" class="vault-item-img" loading="lazy"
             onerror="this.style.opacity='0.25'">
        <div class="vault-item-info">
          <div class="vault-item-name">${item.title}</div>
          ${item.variant ? `<div class="vault-item-variant">${item.variant}</div>` : ''}
          ${price ? `<div class="vault-item-price">${price}</div>` : ''}
        </div>
        <button class="vault-item-remove"
                onclick="window.confirmCartRemove('${safeId}','${safeTitle}')"
                aria-label="Remove ${item.title}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>`;
  }).join('');

  // Total
  const total   = items.reduce((s, i) => s + (i.price || 0), 0);
  const totalEl = document.getElementById('cartTotal') || document.getElementById('vaultTotal');
  if (totalEl) totalEl.textContent = total ? '₹' + total.toLocaleString('en-IN') : '—';

  // WA link
  const waBtn = document.getElementById('cartWABtn') || document.getElementById('vaultWABtn');
  if (waBtn && window.buildVaultWALink) waBtn.href = window.buildVaultWALink(items);
}
window.renderVaultDrawer = renderCartDrawer;
window.renderCartDrawer  = renderCartDrawer;

function animateCartBtn(btn) {
  if (!btn) return;
  btn.classList.add('saved');
  document.querySelectorAll('.vault-badge, .cart-badge').forEach(b => {
    b.classList.add('animate-bounce');
    setTimeout(() => b.classList.remove('animate-bounce'), 600);
  });
}

function showToast(msg) {
  let toast = document.getElementById('riaToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'riaToast';
    toast.style.cssText = [
      'position:fixed', 'bottom:80px', 'left:50%',
      'transform:translateX(-50%) translateY(12px)',
      'background:var(--ria-text-primary)', 'color:var(--ria-white)',
      'padding:10px 20px', 'border-radius:var(--radius-full)',
      'font-size:.82rem', 'z-index:calc(var(--z-nav) + 200)',
      'opacity:0', 'transition:all .3s var(--ease-smooth)',
      'white-space:nowrap', 'pointer-events:none',
    ].join(';');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(12px)';
  }, 2500);
}

/* ── Drawer open/close ── */
function openCart() {
  ['cartDrawer',  'vaultDrawer' ].forEach(id => document.getElementById(id)?.classList.add('open'));
  ['cartOverlay', 'vaultOverlay'].forEach(id => document.getElementById(id)?.classList.add('open'));
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  ['cartDrawer',  'vaultDrawer' ].forEach(id => document.getElementById(id)?.classList.remove('open'));
  ['cartOverlay', 'vaultOverlay'].forEach(id => document.getElementById(id)?.classList.remove('open'));
  document.body.style.overflow = '';
}
window.openVault  = openCart;
window.closeVault = closeCart;

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderCartDrawer();

  (document.getElementById('cartBtn')      || document.getElementById('vaultBtn'))
    ?.addEventListener('click', openCart);
  (document.getElementById('cartCloseBtn') || document.getElementById('vaultCloseBtn'))
    ?.addEventListener('click', closeCart);
  (document.getElementById('cartOverlay')  || document.getElementById('vaultOverlay'))
    ?.addEventListener('click', closeCart);
});
