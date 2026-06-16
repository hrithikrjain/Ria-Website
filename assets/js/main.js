/* ============================================================
   RIA ART JEWELLERY — MAIN INIT
   Nav scroll, reveal observer, mobile menu, WhatsApp trigger
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. NAV SCROLL EFFECT ── */
  const nav           = document.getElementById('siteNav');
  const announcementH = 36;

  window.addEventListener('scroll', () => {
    const scrollY   = window.scrollY;
    const isMobile  = window.innerWidth <= 768;
    const threshold = isMobile ? window.innerHeight * 0.25 : window.innerHeight * 0.35;

    if (nav) {
      if (scrollY > announcementH) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }

    const floatingWA = document.getElementById('floatingWABtn');
    const mobileWA   = document.getElementById('mobileWASticky');
    if (scrollY > threshold) {
      floatingWA?.classList.add('visible');
      mobileWA?.classList.add('visible');
    } else {
      floatingWA?.classList.remove('visible');
      mobileWA?.classList.remove('visible');
    }
  }, { passive: true });

  /* ── 2. INTERSECTION OBSERVER — SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  window._revealObserver    = revealObserver;
  window._riaRevealObserver = revealObserver; // alias used by products.js
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── 3. MOBILE MENU ── */
  const hamburger  = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose  = document.getElementById('mobileMenuClose');

  function openMobileMenu() {
    mobileMenu?.classList.add('open');
    mobileMenu?.setAttribute('aria-hidden', 'false');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openMobileMenu);
  menuClose?.addEventListener('click', closeMobileMenu);

  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Mobile accordion
  mobileMenu?.querySelectorAll('.mobile-nav-heading').forEach(btn => {
    btn.addEventListener('click', () => {
      const id  = btn.dataset.accordion;
      const acc = document.getElementById('acc-' + id);
      if (!acc) return;
      const isOpen = acc.classList.contains('open');
      mobileMenu.querySelectorAll('.mobile-nav-accordion').forEach(a => a.classList.remove('open'));
      mobileMenu.querySelectorAll('.mobile-nav-heading span').forEach(s => s.textContent = '+');
      if (!isOpen) {
        acc.classList.add('open');
        btn.querySelector('span').textContent = '−';
      }
    });
  });

  /* ── 4. SMOOTH ANCHOR LINKS ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

});
