/**
 * app.js — Main Application Entry Point
 * Batman688 Mobile Gaming Platform
 *
 * Initializes all modules on DOMContentLoaded.
 * Handles: bottom nav, action icons, form submissions.
 */

document.addEventListener('DOMContentLoaded', function () {

  // ── 1. Banner Carousel ──────────────────────────────────
  BannerCarousel.init('bannerTrack', 'bannerDots');

  // ── 2. Modal Manager ────────────────────────────────────
  ModalManager.init();

  // ── 3. Category / Game Grid ─────────────────────────────
  CategoryManager.init('gameGrid');

  // ── 4. Bottom Navigation ────────────────────────────────
  initBottomNav();

  // ── 5. Action Row icons (header) ────────────────────────
  initActionIcons();

  // ── 6. Form interactions ────────────────────────────────
  initForms();

  // ── 7. History / Game Log search buttons ────────────────
  initTableSearch();

});

/* ── Bottom Nav ── */
function initBottomNav() {
  const items = document.querySelectorAll('.nav-item');
  items.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      const modal = this.dataset.modal;
      if (modal) {
        ModalManager.open(modal);
        return;
      }
      // Home — deactivate all modals, mark active
      ModalManager.closeAll();
      items.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

/* ── Action Icons in action row ── */
function initActionIcons() {
  document.querySelectorAll('.action-icon-item').forEach(item => {
    item.addEventListener('click', function () {
      const modal = this.dataset.modal;
      if (modal) ModalManager.open(modal);
      // Icon ripple feedback
      const circle = this.querySelector('.action-icon-circle');
      if (circle) {
        circle.style.transform = 'scale(0.88)';
        setTimeout(() => { circle.style.transform = ''; }, 150);
      }
    });
  });

  // Login button
  const loginBtn = document.querySelector('.login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => ModalManager.open('loginModal'));
  }
}

/* ── Form submissions ── */
function initForms() {
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const user = this.querySelector('[name="username"]').value.trim();
      const pass = this.querySelector('[name="password"]').value;
      if (!user || !pass) return showFormError(this, 'Username and password required');
      // TODO: connect to authentication API
      showFormSuccess(this, 'Logging in…');
    });
  }

  // Password reset form
  const pwForm = document.getElementById('passwordForm');
  if (pwForm) {
    pwForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const np = this.querySelector('[name="newPassword"]').value;
      const cp = this.querySelector('[name="confirmPassword"]').value;
      if (np !== cp) return showFormError(this, 'Passwords do not match');
      if (np.length < 6) return showFormError(this, 'Password must be at least 6 characters');
      showFormSuccess(this, 'Password updated!');
    });
  }
}

/* ── History / Game Log search ── */
function initTableSearch() {
  document.querySelectorAll('.search-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const form   = this.closest('.modal-body');
      const fromEl = form && form.querySelector('[name="fromDate"]');
      const toEl   = form && form.querySelector('[name="toDate"]');
      // TODO: fetch data from API with fromEl.value / toEl.value
      this.textContent = 'Searching…';
      setTimeout(() => { this.textContent = 'Search'; }, 1200);
    });
  });
}

/* ── Utility: show inline form feedback ── */
function showFormError(form, msg) {
  clearFeedback(form);
  const el = document.createElement('p');
  el.className  = 'form-feedback error';
  el.style.cssText = 'color:#f87171;font-size:12px;margin-top:-8px;margin-bottom:10px;';
  el.textContent = '⚠ ' + msg;
  form.insertBefore(el, form.querySelector('.btn-primary'));
}

function showFormSuccess(form, msg) {
  clearFeedback(form);
  const el = document.createElement('p');
  el.className  = 'form-feedback success';
  el.style.cssText = 'color:#4ade80;font-size:12px;margin-top:-8px;margin-bottom:10px;';
  el.textContent = '✓ ' + msg;
  form.insertBefore(el, form.querySelector('.btn-primary'));
}

function clearFeedback(form) {
  form.querySelectorAll('.form-feedback').forEach(el => el.remove());
}
