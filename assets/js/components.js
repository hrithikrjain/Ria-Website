/* ============================================================
   RIA ART JEWELLERY — SHARED COMPONENTS
   Injects announcement bar, nav, vault drawer, floating WA, footer
   ============================================================ */

(function() {

  /* ── ANNOUNCEMENT BAR + NAV ── */
  const NAV_HTML = `
<div class="announcement-bar" role="marquee" aria-label="Site announcements">
  <div class="ticker-wrap">
    <div class="ticker-content">
      ✦ FREE DELIVERY ON ORDERS ABOVE ₹2,000 ✦ NEW ARRIVALS — BRIDAL SETS NOW LIVE ✦ HANDCRAFTED JEWELLERY BY SKILLED KARIGARS ✦ LIFETIME GUARANTEE ON BEADS ✦ WHATSAPP FOR STYLING HELP: +91 98699 39003 ✦ NO EXCHANGE / NO RETURN AFTER ORDER CONFIRMATION ✦ FREE DELIVERY ON ORDERS ABOVE ₹2,000 ✦ NEW ARRIVALS — BRIDAL SETS NOW LIVE ✦ HANDCRAFTED JEWELLERY BY SKILLED KARIGARS ✦ LIFETIME GUARANTEE ON BEADS ✦ WHATSAPP FOR STYLING HELP: +91 98699 39003 ✦ NO EXCHANGE / NO RETURN AFTER ORDER CONFIRMATION
    </div>
  </div>
</div>

<nav class="site-nav" id="siteNav" role="navigation" aria-label="Main navigation">
  <div class="nav-inner">

    <a href="/index.html" class="nav-logo" aria-label="Ria Art Jewellery — Home">
      <img
        src="/assets/images/logo/logo.png"
        alt="Ria Art Jewellery"
        class="nav-logo-img"
        width="140"
        height="40"
        loading="eager"
        onerror="this.onerror=null;this.src='/assets/images/logo/logo.png';this.onerror=function(){this.parentElement.innerHTML='<span style=&quot;font-family:Cormorant Garamond,serif;font-size:1.1rem;font-weight:500;color:#1A1A1A;white-space:nowrap;&quot;>Ria Art Jewellery</span>';}"
      >
    </a>

    <ul class="nav-links" role="list">
      <li class="nav-item has-dropdown">
        <button class="nav-link nav-link-btn" aria-expanded="false" aria-haspopup="true">
          Collections <span class="nav-chevron" aria-hidden="true">›</span>
        </button>
        <div class="nav-dropdown collections-dropdown" role="menu">
          <div class="dropdown-group">
            <p class="dropdown-group-label">Bridal &amp; Occasion</p>
            <div class="dropdown-links">
              <a href="/collections/bridal-set.html" class="dropdown-link" role="menuitem">Bridal Set</a>
              <a href="/collections/choker.html" class="dropdown-link" role="menuitem">Choker</a>
              <a href="/collections/long-set.html" class="dropdown-link" role="menuitem">Long Set</a>
              <a href="/collections/necklace-set.html" class="dropdown-link" role="menuitem">Necklace Set</a>
              <a href="/collections/pendant-set.html" class="dropdown-link" role="menuitem">Pendant Set</a>
            </div>
          </div>
          <div class="dropdown-group">
            <p class="dropdown-group-label">Earrings &amp; Head</p>
            <div class="dropdown-links">
              <a href="/collections/ear-rings.html" class="dropdown-link" role="menuitem">Ear Rings</a>
              <a href="/collections/ear-chain.html" class="dropdown-link" role="menuitem">Ear Chain</a>
              <a href="/collections/ear-cup.html" class="dropdown-link" role="menuitem">Ear Cup</a>
              <a href="/collections/tops.html" class="dropdown-link" role="menuitem">Tops</a>
              <a href="/collections/nath.html" class="dropdown-link" role="menuitem">Nath</a>
              <a href="/collections/matha-pati.html" class="dropdown-link" role="menuitem">Matha Pati</a>
              <a href="/collections/tika-bor.html" class="dropdown-link" role="menuitem">Tika Bor</a>
              <a href="/collections/kilangi.html" class="dropdown-link" role="menuitem">Kilangi</a>
            </div>
          </div>
          <div class="dropdown-group">
            <p class="dropdown-group-label">Wrist &amp; Hand</p>
            <div class="dropdown-links">
              <a href="/collections/bangles.html" class="dropdown-link" role="menuitem">Bangles</a>
              <a href="/collections/kada-bracelet.html" class="dropdown-link" role="menuitem">Kada Bracelet</a>
              <a href="/collections/hath-panja.html" class="dropdown-link" role="menuitem">Hath Panja</a>
              <a href="/collections/hand-cup.html" class="dropdown-link" role="menuitem">Hand Cup</a>
            </div>
          </div>
          <div class="dropdown-group">
            <p class="dropdown-group-label">Waist, Foot &amp; More</p>
            <div class="dropdown-links">
              <a href="/collections/kamar-patta.html" class="dropdown-link" role="menuitem">Kamar Patta</a>
              <a href="/collections/payal.html" class="dropdown-link" role="menuitem">Payal</a>
              <a href="/collections/rings.html" class="dropdown-link" role="menuitem">Rings</a>
              <a href="/collections/mangal-sutra.html" class="dropdown-link" role="menuitem">Mangal Sutra</a>
              <a href="/collections/sindur-dabi.html" class="dropdown-link" role="menuitem">Sindur Dabi</a>
              <a href="/collections/ghrom-mala.html" class="dropdown-link" role="menuitem">Ghrom Mala</a>
              <a href="/collections/western-jewellery.html" class="dropdown-link" role="menuitem">Western Jewellery</a>
            </div>
          </div>
        </div>
      </li>

      <li class="nav-item has-dropdown">
        <button class="nav-link nav-link-btn" aria-expanded="false" aria-haspopup="true">
          Occasions <span class="nav-chevron" aria-hidden="true">›</span>
        </button>
        <div class="nav-dropdown occasions-dropdown" role="menu">
          <a href="/occasions/bridal.html" class="dropdown-link" role="menuitem">Bridal</a>
          <a href="/occasions/reception.html" class="dropdown-link" role="menuitem">Reception</a>
          <a href="/occasions/mehendi.html" class="dropdown-link" role="menuitem">Mehendi</a>
          <a href="/occasions/sangeet.html" class="dropdown-link" role="menuitem">Sangeet</a>
          <a href="/occasions/festive.html" class="dropdown-link" role="menuitem">Festive</a>
          <a href="/occasions/party-wear.html" class="dropdown-link" role="menuitem">Party Wear</a>
        </div>
      </li>

      <li class="nav-item">
        <a href="/pages/about.html" class="nav-link">About</a>
      </li>
      <li class="nav-item">
        <a href="/pages/contact.html" class="nav-link">Contact</a>
      </li>
    </ul>

    <div class="nav-icons">
      <div class="search-wrap">
        <button class="nav-icon-btn" id="searchBtn" aria-label="Search jewellery">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        <input class="search-input" id="searchInput" type="text" placeholder="Search jewellery…" aria-label="Search" autocomplete="off">
        <div class="search-dropdown" id="searchDropdown"></div>
      </div>

      <button class="nav-icon-btn vault-trigger" id="cartBtn" aria-label="Shopping Cart">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <span class="vault-badge" id="cartBadge" aria-live="polite"></span>
      </button>

      <a href="https://wa.me/919869939003" class="nav-whatsapp-btn" target="_blank" rel="noopener noreferrer" aria-label="Contact on WhatsApp">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill="#25D366"/><path fill="#FFFFFF" d="M12 4C7.582 4 4 7.582 4 12c0 1.418.373 2.748 1.024 3.896L4 20.5l4.736-1.24A7.948 7.948 0 0012 20c4.418 0 8-3.582 8-8S16.418 4 12 4z"/>
          <path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        </svg>
        <span>WhatsApp</span>
      </a>

      <button class="hamburger" id="hamburgerBtn" aria-label="Open menu" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

  </div>
</nav>

<div class="mobile-menu" id="mobileMenu" aria-hidden="true">
  <div class="mobile-menu-inner">
    <button class="mobile-menu-close" id="mobileMenuClose" aria-label="Close menu">&#10005;</button>
    <div class="mobile-nav-group">
      <button class="mobile-nav-heading" data-accordion="collections">
        Collections <span>+</span>
      </button>
      <div class="mobile-nav-accordion" id="acc-collections">
        <a href="/collections/bridal-set.html">Bridal Set</a>
        <a href="/collections/choker.html">Choker</a>
        <a href="/collections/necklace-set.html">Necklace Set</a>
        <a href="/collections/long-set.html">Long Set</a>
        <a href="/collections/ear-rings.html">Ear Rings</a>
        <a href="/collections/bangles.html">Bangles</a>
        <a href="/collections/kada-bracelet.html">Kada Bracelet</a>
        <a href="/collections/matha-pati.html">Matha Pati</a>
        <a href="/collections/mangal-sutra.html">Mangal Sutra</a>
        <a href="/collections/western-jewellery.html">Western Jewellery</a>
        <a href="/collections/pendant-set.html">Pendant Set</a>
        <a href="/collections/rings.html">Rings</a>
        <a href="/collections/payal.html">Payal</a>
        <a href="/collections/nath.html">Nath</a>
        <a href="/collections/kilangi.html">Kilangi</a>
        <a href="/collections/tika-bor.html">Tika Bor</a>
        <a href="/collections/ear-chain.html">Ear Chain</a>
        <a href="/collections/ear-cup.html">Ear Cup</a>
        <a href="/collections/tops.html">Tops</a>
        <a href="/collections/hath-panja.html">Hath Panja</a>
        <a href="/collections/hand-cup.html">Hand Cup</a>
        <a href="/collections/kamar-patta.html">Kamar Patta</a>
        <a href="/collections/sindur-dabi.html">Sindur Dabi</a>
        <a href="/collections/ghrom-mala.html">Ghrom Mala</a>
      </div>
    </div>
    <div class="mobile-nav-group">
      <button class="mobile-nav-heading" data-accordion="occasions">
        Occasions <span>+</span>
      </button>
      <div class="mobile-nav-accordion" id="acc-occasions">
        <a href="/occasions/bridal.html">Bridal</a>
        <a href="/occasions/reception.html">Reception</a>
        <a href="/occasions/mehendi.html">Mehendi</a>
        <a href="/occasions/sangeet.html">Sangeet</a>
        <a href="/occasions/festive.html">Festive</a>
        <a href="/occasions/party-wear.html">Party Wear</a>
      </div>
    </div>
    <a href="/pages/about.html" class="mobile-nav-link">About</a>
    <a href="/pages/contact.html" class="mobile-nav-link">Contact</a>
    <a href="https://wa.me/919869939003" class="mobile-nav-wa" target="_blank" rel="noopener">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#25D366"/><path fill="#FFFFFF" d="M12 4C7.582 4 4 7.582 4 12c0 1.418.373 2.748 1.024 3.896L4 20.5l4.736-1.24A7.948 7.948 0 0012 20c4.418 0 8-3.582 8-8S16.418 4 12 4z"/><path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
      WhatsApp Us
    </a>
  </div>
</div>`;

  /* ── VAULT DRAWER ── */
  const VAULT_HTML = `
<div class="vault-overlay" id="cartOverlay"></div>
<aside class="vault-drawer" id="cartDrawer" aria-label="Shopping Cart">
  <div class="vault-drawer-header">
    <div class="vault-drawer-head-row">
      <button class="vault-back-btn" id="cartCloseBtn" aria-label="Close cart">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      </button>
      <h2 class="vault-drawer-title">Your Shopping Cart</h2>
    </div>
    <p class="vault-drawer-subtext">Send your full selection to our stylist in one tap</p>
  </div>
  <div class="vault-drawer-body" id="cartDrawerBody"></div>
  <div class="vault-drawer-footer" id="cartDrawerFooter" style="display:none">
    <div class="vault-total">
      <span class="vault-total-label">Estimated Total</span>
      <span class="vault-total-price" id="cartTotal">&#8377;0</span>
    </div>
    <a class="btn btn-whatsapp btn-full vault-wa-btn" id="cartWABtn" href="https://wa.me/919869939003" target="_blank" rel="noopener">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#25D366"/><path fill="#FFFFFF" d="M12 4C7.582 4 4 7.582 4 12c0 1.418.373 2.748 1.024 3.896L4 20.5l4.736-1.24A7.948 7.948 0 0012 20c4.418 0 8-3.582 8-8S16.418 4 12 4z"/><path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
      Enquire All on WhatsApp
    </a>
  </div>
</aside>

<a class="floating-wa-btn" id="floatingWABtn" href="https://wa.me/919869939003" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
  <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#25D366"/><path fill="#FFFFFF" d="M12 4C7.582 4 4 7.582 4 12c0 1.418.373 2.748 1.024 3.896L4 20.5l4.736-1.24A7.948 7.948 0 0012 20c4.418 0 8-3.582 8-8S16.418 4 12 4z"/><path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
  <span>WhatsApp Us</span>
</a>

<a class="mobile-wa-sticky" id="mobileWASticky" href="https://wa.me/919869939003" target="_blank" rel="noopener noreferrer">
  <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#25D366"/><path fill="#FFFFFF" d="M12 4C7.582 4 4 7.582 4 12c0 1.418.373 2.748 1.024 3.896L4 20.5l4.736-1.24A7.948 7.948 0 0012 20c4.418 0 8-3.582 8-8S16.418 4 12 4z"/><path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
  Enquire on WhatsApp
</a>`;

  /* ── FOOTER ── */
  const FOOTER_HTML = `
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-brand-logo">
          <img src="/assets/images/logo/logo.png" alt="Ria Art Jewellery" class="footer-logo-img" onerror="this.src='/assets/images/logo/logo.png'">
        </div>
        <p class="footer-tagline">Crafted for your celebration</p>
        <p class="footer-desc">Premium handcrafted imitation jewellery for India's modern brides and festive occasions. Made with love in Mumbai.</p>
        <div class="footer-social">
          <a href="https://instagram.com/riaartjewellery" target="_blank" rel="noopener" aria-label="Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="https://wa.me/919869939003" target="_blank" rel="noopener" aria-label="WhatsApp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#25D366"/><path fill="#FFFFFF" d="M12 4C7.582 4 4 7.582 4 12c0 1.418.373 2.748 1.024 3.896L4 20.5l4.736-1.24A7.948 7.948 0 0012 20c4.418 0 8-3.582 8-8S16.418 4 12 4z"/><path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
          </a>
        </div>
      </div>
      <div>
        <span class="footer-col-title">Collections</span>
        <div class="footer-links">
          <a href="/collections/bridal-set.html" class="footer-link">Bridal Set</a>
          <a href="/collections/choker.html" class="footer-link">Choker</a>
          <a href="/collections/necklace-set.html" class="footer-link">Necklace Set</a>
          <a href="/collections/long-set.html" class="footer-link">Long Set</a>
          <a href="/collections/bangles.html" class="footer-link">Bangles</a>
          <a href="/collections/kada-bracelet.html" class="footer-link">Kada Bracelet</a>
          <a href="/collections/ear-rings.html" class="footer-link">Ear Rings</a>
          <a href="/collections/matha-pati.html" class="footer-link">Matha Pati</a>
          <a href="/collections/mangal-sutra.html" class="footer-link">Mangal Sutra</a>
          <a href="/collections/western-jewellery.html" class="footer-link">Western Jewellery</a>
        </div>
      </div>
      <div>
        <span class="footer-col-title">Occasions</span>
        <div class="footer-links">
          <a href="/occasions/bridal.html" class="footer-link">Bridal</a>
          <a href="/occasions/reception.html" class="footer-link">Reception</a>
          <a href="/occasions/mehendi.html" class="footer-link">Mehendi</a>
          <a href="/occasions/sangeet.html" class="footer-link">Sangeet</a>
          <a href="/occasions/festive.html" class="footer-link">Festive</a>
          <a href="/occasions/party-wear.html" class="footer-link">Party Wear</a>
        </div>
      </div>
      <div>
        <span class="footer-col-title">Help</span>
        <div class="footer-links">
          <a href="/pages/size-guide.html" class="footer-link">Size Guide</a>
          <a href="/pages/care-guide.html" class="footer-link">Care Guide</a>
          <a href="/pages/about.html" class="footer-link">About Us</a>
          <a href="/pages/contact.html" class="footer-link">Contact</a>
          <a href="/pages/policy.html" class="footer-link">Our Policy</a>
          <a href="https://wa.me/919869939003" target="_blank" rel="noopener" class="footer-link">WhatsApp Us</a>
        </div>
      </div>
      <div>
        <span class="footer-col-title">Visit Us</span>
        <address class="footer-address" style="font-style:normal;font-size:.82rem;color:#4A3728;line-height:1.7">
          Prabhu Plaza, Malad<br>
          Vijaykar Wadi Industrial<br>
          Malad West, Mumbai 400064<br>
          Maharashtra<br><br>
          <a href="tel:+919869939003" style="color:#B8860B">+91 98699 39003</a><br><br>
          Mon – Sun: 10:30 AM – 9:30 PM<br><br>
          <a href="https://maps.app.goo.gl/jaZG6xbwbKwr1CSB8" target="_blank" rel="noopener" style="color:#B8860B">View on Google Maps →</a>
        </address>
      </div>
    </div>
  </div>
  <div class="footer-policy-strip" style="background:#F5DDD6;padding:0.75rem 0;text-align:center;font-size:.78rem;color:#4A121A">
    <div class="container">
      No exchanges or returns after order confirmation. <a href="/pages/policy.html" style="color:#B8860B">Read our policy</a> &nbsp;|&nbsp;
      <strong>Lifetime Guarantee on all Beads</strong>
    </div>
  </div>
  <div class="footer-bottom" style="background:#2C1A04;padding:1rem 0">
    <div class="container" style="text-align:center;color:rgba(255,255,255,0.6);font-size:.75rem">
      &copy; 2025 Ria Art Jewellery. All rights reserved. | Made with love in Mumbai
    </div>
  </div>
</footer>`;

  /* ── INJECT INTO DOM ── */
  const body = document.body;

  const navDiv = document.createElement('div');
  navDiv.innerHTML = NAV_HTML;
  body.insertBefore(navDiv, body.firstChild);

  const vaultDiv = document.createElement('div');
  vaultDiv.innerHTML = VAULT_HTML;
  body.insertBefore(vaultDiv, body.children[1]);

  const footerDiv = document.createElement('div');
  footerDiv.innerHTML = FOOTER_HTML;
  body.appendChild(footerDiv);

  /* ── GLOBAL BACK BUTTON ──
     Injected on every page except homepage and product pages
     (product pages use product-page.js breadcrumb instead) */
  (function injectBackBtn() {
    const p = window.location.pathname;
    const isHome = p === '/' || p === '/index.html' || p.endsWith('/index.html');
    if (isHome) return;

    let label, href, useHistory = false;

    if (p.includes('/collections/index') || p === '/collections/' || p.endsWith('/collections')) {
      return; // collections index — no back needed
    } else if (p.includes('/collections/')) {
      label = 'Back to Home';
      href  = '/';
    } else if (p.includes('/products/')) {
      label = 'Back';
      useHistory = true;
      href = '/';
    } else {
      label = 'Back';
      useHistory = true;
      href = '/';
    }

    const btn = document.createElement('a');
    btn.className = 'global-back-btn';
    btn.setAttribute('aria-label', label);
    btn.href = href;

    if (useHistory) {
      btn.addEventListener('click', function(e) {
        if (window.history.length > 1 && document.referrer) {
          e.preventDefault();
          history.back();
        }
      });
    }

    btn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<line x1="19" y1="12" x2="5" y2="12"/>' +
        '<polyline points="12 19 5 12 12 5"/>' +
      '</svg>' + label;

    document.body.appendChild(btn);
  })();

})();
