/* ============================================================
   RIA ART JEWELLERY — SEARCH
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const searchBtn      = document.getElementById('searchBtn');
  const searchInput    = document.getElementById('searchInput');
  const searchDropdown = document.getElementById('searchDropdown');

  if (!searchBtn || !searchInput) return;

  let products = [];

  // Lazy-load product data when search is first opened
  async function ensureProducts() {
    if (products.length) return;
    try {
      const res = await fetch('/assets/data/products.json');
      products = await res.json();
    } catch (e) {
      products = [];
    }
  }

  searchBtn.addEventListener('click', async () => {
    searchInput.classList.toggle('expanded');
    if (searchInput.classList.contains('expanded')) {
      await ensureProducts();
      searchInput.focus();
    } else {
      hideDropdown();
    }
  });

  searchInput.addEventListener('input', debounce(handleSearch, 200));
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') { searchInput.classList.remove('expanded'); hideDropdown(); }
    if (e.key === 'Enter') { goToSearchPage(); }
  });

  document.addEventListener('click', e => {
    if (!searchBtn.contains(e.target) && !searchInput.contains(e.target) && !searchDropdown?.contains(e.target)) {
      hideDropdown();
    }
  });

  function handleSearch() {
    const q = searchInput.value.trim().toLowerCase();
    if (!q || q.length < 2) { hideDropdown(); return; }

    // Score each product — higher = better match
    const scored = products.map(p => {
      const fields = [
        p.title,
        p.category,
        ...(p.occasions || []),
        ...(p.style || []),
        p.metal || '',
        p.price_band || '',
        p.slug || '',
      ].map(f => f.toLowerCase());

      let score = 0;
      const words = q.split(/\s+/).filter(Boolean);

      for (const field of fields) {
        // Exact contains → highest weight
        if (field.includes(q)) { score += 10; break; }
        // Every word appears somewhere → medium weight
        if (words.every(w => fields.some(f => f.includes(w)))) score += 5;
        // Any word appears → low weight
        if (words.some(w => field.includes(w))) score += 2;
        // Fuzzy: check if q chars appear in order in field
        if (score === 0 && fuzzyMatch(q, field)) score += 1;
      }
      return { p, score };
    }).filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(x => x.p);

    const results = scored;

    if (!results.length) { hideDropdown(); return; }
    showDropdown(results, q);
  }

  function showDropdown(results, q) {
    if (!searchDropdown) return;
    searchDropdown.innerHTML = results.map(p => {
      const price = window.getPriceDisplay ? window.getPriceDisplay(p) : '';
      return `
        <a href="/products/${p.slug}.html" class="search-result-item">
          <img src="${p.images[0]}" alt="${p.title}" class="search-result-img" loading="lazy">
          <div>
            <div class="search-result-name">${highlight(p.title, q)}</div>
            <div class="search-result-price">${price}</div>
          </div>
        </a>`;
    }).join('') +
    `<a href="/search.html?q=${encodeURIComponent(searchInput.value.trim())}" class="search-result-view">
      View all results →
    </a>`;
    searchDropdown.classList.add('visible');
  }

  function hideDropdown() {
    searchDropdown?.classList.remove('visible');
  }

  function goToSearchPage() {
    const q = searchInput.value.trim();
    if (q) window.location.href = `/search.html?q=${encodeURIComponent(q)}`;
  }

  function highlight(text, q) {
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;
    return text.slice(0, idx) + `<strong>${text.slice(idx, idx + q.length)}</strong>` + text.slice(idx + q.length);
  }

  function fuzzyMatch(query, text) {
    let qi = 0;
    for (let i = 0; i < text.length && qi < query.length; i++) {
      if (text[i] === query[qi]) qi++;
    }
    return qi === query.length;
  }

  function debounce(fn, delay) {
    let t;
    return function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), delay); };
  }
});

/* Shared price display used across products.js / search.js / product-page.js */
window.getPriceDisplay = function (p) {
  if (!p) return '';
  if (p.pricing_type === 'Single Price')        return '₹' + (p.price || 0).toLocaleString('en-IN');
  if (p.pricing_type === 'SGM Finish Variants') return '₹' + (p.sgm_price || 0).toLocaleString('en-IN') + ' / finish';
  if (p.pricing_type === 'Quantity Variants')   return 'From ₹' + Math.min(...(p.quantity_variants || []).map(v => v.price)).toLocaleString('en-IN');
  if (p.pricing_type === 'Colour Variants')     return 'From ₹' + Math.min(...(p.colour_variants || []).map(v => v.price)).toLocaleString('en-IN');
  return '';
};
