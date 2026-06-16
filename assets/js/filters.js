/* ============================================================
   RIA ART JEWELLERY — FILTER SYSTEM
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.filter-panel')) initFilters();
});

const FILTER_KEY = 'ria_filters';

function initFilters() {
  const filterBtn = document.querySelector('.filter-open-btn');
  const filterPanel = document.querySelector('.filter-panel');
  const filterOverlay = document.querySelector('.filter-overlay');
  const clearBtn = document.querySelector('.filter-clear');

  const closeFilter = () => {
    filterPanel.classList.remove('open');
    filterOverlay && filterOverlay.classList.remove('open');
  };
  filterBtn && filterBtn.addEventListener('click', () => {
    filterPanel.classList.add('open');
    filterOverlay && filterOverlay.classList.add('open');
  });
  filterOverlay && filterOverlay.addEventListener('click', closeFilter);
  document.querySelector('.filter-panel-close') && document.querySelector('.filter-panel-close').addEventListener('click', closeFilter);
  clearBtn && clearBtn.addEventListener('click', clearFilters);

  // Chips
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      applyFilters();
    });
  });

  // Restore session state
  const saved = getFilterState();
  if (saved) {
    Object.entries(saved).forEach(([group, vals]) => {
      vals.forEach(v => {
        const chip = document.querySelector(`.filter-chip[data-group="${group}"][data-val="${v}"]`);
        chip && chip.classList.add('active');
      });
    });
    applyFilters();
  }
}

function getFilterState() {
  try { return JSON.parse(sessionStorage.getItem(FILTER_KEY)); }
  catch { return null; }
}

function saveFilterState(state) {
  try { sessionStorage.setItem(FILTER_KEY, JSON.stringify(state)); } catch {}
}

function applyFilters() {
  const active = {};
  document.querySelectorAll('.filter-chip.active').forEach(c => {
    const g = c.dataset.group;
    if (!active[g]) active[g] = [];
    active[g].push(c.dataset.val);
  });
  saveFilterState(active);

  const total = Object.values(active).reduce((s, v) => s + v.length, 0);
  const countBadge = document.querySelector('.filter-count-badge');
  if (countBadge) {
    countBadge.textContent = total;
    countBadge.classList.toggle('visible', total > 0);
  }
  const clearBtn = document.querySelector('.filter-clear');
  clearBtn && (clearBtn.style.display = total > 0 ? '' : 'none');

  // Filter products in DOM — cards have data-slug (not data-product)
  const cards = document.querySelectorAll('.product-card[data-slug]');
  let visible = 0;
  cards.forEach(card => {
    const show = matchesFilters(card, active);
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  const showing = document.querySelector('.filter-showing');
  if (showing) showing.textContent = `Showing ${visible} of ${cards.length} pieces`;
}

function matchesFilters(card, active) {
  if (!Object.keys(active).length) return true;
  const data = card.dataset;
  for (const [group, vals] of Object.entries(active)) {
    if (!vals.length) continue;
    let match = false;
    if (group === 'category') match = vals.includes(data.category);
    else if (group === 'occasion') match = vals.some(v => (data.occasions || '').split(',').map(s => s.trim()).includes(v));
    else if (group === 'style') match = vals.some(v => (data.style || '').split(',').map(s => s.trim()).includes(v));
    else if (group === 'metal') match = vals.includes(data.metal);
    else if (group === 'price') match = vals.includes(data.priceBand);
    if (!match) return false;
  }
  return true;
}

function clearFilters() {
  document.querySelectorAll('.filter-chip.active').forEach(c => c.classList.remove('active'));
  saveFilterState({});
  applyFilters();
}
