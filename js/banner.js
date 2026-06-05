/**
 * banner.js — Banner Carousel Module
 * Batman688 Mobile Gaming Platform
 *
 * Features:
 *   - Auto-advance every 3.5s
 *   - Touch/swipe support
 *   - Dot indicator sync
 *   - Pauses on user interaction, resumes after 5s
 */

const BannerCarousel = (function () {

  let track, slides, dotsEl, current = 0, total = 0, autoTimer = null;
  const AUTO_DELAY = 3500;
  const RESUME_DELAY = 5000;
  const SWIPE_THRESHOLD = 40;

  // ── Init ──────────────────────────────────────────────────
  function init(trackId = 'bannerTrack', dotsId = 'bannerDots') {
    track  = document.getElementById(trackId);
    dotsEl = document.getElementById(dotsId);
    if (!track || !dotsEl) return;

    slides = track.querySelectorAll('.banner-slide');
    total  = slides.length;
    if (total === 0) return;

    buildDots();
    goTo(0, false);
    startAuto();
    bindTouch();
  }

  // ── Build dot indicators ──────────────────────────────────
  function buildDots() {
    dotsEl.innerHTML = '';
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'b-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
      btn.addEventListener('click', () => {
        clearAuto();
        goTo(i);
        scheduleResume();
      });
      dotsEl.appendChild(btn);
    });
  }

  // ── Navigate to slide ─────────────────────────────────────
  function goTo(idx, animate = true) {
    current = ((idx % total) + total) % total;
    track.style.transition = animate
      ? 'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)'
      : 'none';
    track.style.transform  = `translateX(-${current * 100}%)`;

    dotsEl.querySelectorAll('.b-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  // ── Auto-advance ──────────────────────────────────────────
  function startAuto() {
    clearAuto();
    autoTimer = setInterval(() => goTo(current + 1), AUTO_DELAY);
  }

  function clearAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  function scheduleResume() {
    clearAuto();
    setTimeout(startAuto, RESUME_DELAY);
  }

  // ── Touch / Swipe ─────────────────────────────────────────
  function bindTouch() {
    const wrapper = track.parentElement;
    let startX = 0, startY = 0, isDragging = false;

    wrapper.addEventListener('touchstart', e => {
      startX     = e.touches[0].clientX;
      startY     = e.touches[0].clientY;
      isDragging = true;
      clearAuto();
    }, { passive: true });

    wrapper.addEventListener('touchend', e => {
      if (!isDragging) return;
      isDragging = false;
      const dx = startX - e.changedTouches[0].clientX;
      const dy = startY - e.changedTouches[0].clientY;
      // Only swipe horizontally (not a vertical scroll)
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        goTo(current + (dx > 0 ? 1 : -1));
      }
      scheduleResume();
    }, { passive: true });
  }

  // ── Public API ────────────────────────────────────────────
  return { init, goTo, startAuto, clearAuto };

})();
