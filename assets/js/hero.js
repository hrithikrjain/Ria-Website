/* ============================================================
   RIA ART JEWELLERY — HERO SLIDESHOW
   ============================================================ */

(function () {
  const slides   = document.querySelectorAll('.hero-slide');
  const dots     = document.querySelectorAll('.hero-dot');
  const counter  = document.getElementById('heroCurrentNum');
  const prevBtn  = document.getElementById('heroPrev');
  const nextBtn  = document.getElementById('heroNext');

  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = ((n % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
    if (counter) counter.textContent = String(current + 1).padStart(2, '0');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() {
    timer = setInterval(next, 5000);
  }
  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  nextBtn?.addEventListener('click', () => { next(); resetTimer(); });
  prevBtn?.addEventListener('click', () => { prev(); resetTimer(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.dot, 10));
      resetTimer();
    });
  });

  // Touch/swipe support
  let touchStartX = 0;
  const heroEl = document.getElementById('hero');
  heroEl?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  heroEl?.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) {
      if (delta < 0) next(); else prev();
      resetTimer();
    }
  }, { passive: true });

  startTimer();
})();
