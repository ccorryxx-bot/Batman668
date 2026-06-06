/**
 * app.js — Main Application Entry Point
 * Batman688 Mobile Gaming Platform
 */

// Update this to your deployed Replit domain for production
const API_URL = 'https://4c38c430-53aa-42fc-8fcb-899f2de4ed73-00-3ihaf109tb0jc.sisko.replit.dev/api';

document.addEventListener('DOMContentLoaded', function () {
  BannerCarousel.init('bannerTrack', 'bannerDots');
  ModalManager.init();
  CategoryManager.init('gameGrid');
  initBottomNav();
  initActionIcons();
  initForms();
  initTableSearch();
  updateAuthUI();
});

/* ── Auth UI state ── */
function updateAuthUI() {
  const token    = localStorage.getItem('batman_token');
  const username = localStorage.getItem('batman_user');
  const loginBtn = document.querySelector('.login-btn');
  if (!loginBtn) return;
  if (token && username) {
    loginBtn.textContent = username;
    loginBtn.title = 'Click to log out';
    loginBtn.onclick = () => {
      localStorage.removeItem('batman_token');
      localStorage.removeItem('batman_user');
      updateAuthUI();
    };
  } else {
    loginBtn.textContent = 'လာ့ဂျင်';
    loginBtn.title = '';
    loginBtn.onclick = () => ModalManager.open('loginModal');
  }
}

/* ── Auth Tab Switcher ── */
function switchAuthTab(tab) {
  const signinForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn   = this.querySelector('[type="submit"]');
      const user  = this.querySelector('[name="username"]').value.trim();
      const phone = this.querySelector('[name="phone"]').value.trim();
      const pass  = this.querySelector('[name="password"]').value;
      const conf  = this.querySelector('[name="confirmPassword"]').value;
      if (!user || !phone || !pass || !conf) return showFormError(this, 'All fields are required');
      if (pass !== conf) return showFormError(this, 'Passwords do not match');
      if (user.length < 3) return showFormError(this, 'Username must be at least 3 characters');
      if (phone.length < 6) return showFormError(this, 'Enter a valid phone number');
      if (pass.length < 6) return showFormError(this, 'Password must be at least 6 characters');
      btn.disabled = true;
      btn.textContent = 'Creating…';
      try {
        const res  = await fetch(API_URL + '/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user, phone, password: pass }),
        });
        const data = await res.json();
        if (!res.ok) return showFormError(this, data.error || 'Signup failed');
        localStorage.setItem('batman_token', data.token);
        localStorage.setItem('batman_user', data.username);
        showFormSuccess(this, 'Account created! Welcome, ' + data.username + '!');
        setTimeout(() => { ModalManager.close('loginModal'); updateAuthUI(); }, 1500);
      } catch (_) {
        showFormError(this, 'Network error. Please try again.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Create Account';
      }
    });
  }
    });
  }

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
      this.textContent = 'Searching…';
      setTimeout(() => { this.textContent = 'Search'; }, 1200);
    });
  });
}

/* ── Utility ── */
function showFormError(form, msg) {
  clearFeedback(form);
  const el = document.createElement('p');
  el.className = 'form-feedback error';
  el.style.cssText = 'color:#f87171;font-size:12px;margin-top:-8px;margin-bottom:10px;';
  el.textContent = '⚠ ' + msg;
  const btn = form.querySelector('.btn-primary');
  if (btn) form.insertBefore(el, btn);
}

function showFormSuccess(form, msg) {
  clearFeedback(form);
  const el = document.createElement('p');
  el.className = 'form-feedback success';
  el.style.cssText = 'color:#4ade80;font-size:12px;margin-top:-8px;margin-bottom:10px;';
  el.textContent = '✓ ' + msg;
  const btn = form.querySelector('.btn-primary');
  if (btn) form.insertBefore(el, btn);
}

function clearFeedback(form) {
  if (!form) return;
  form.querySelectorAll('.form-feedback').forEach(el => el.remove());
}
