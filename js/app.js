/**
 * app.js — Main Application Entry Point
 * iW99 Mobile Gaming Platform
 */

// Supabase client — anon key is public and safe for frontend use
const _supa = window.supabase.createClient(
  'https://qkotyjmeizhneyyubpqx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrb3R5am1laXpobmV5eXVicHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MTkxMDMsImV4cCI6MjA5NjI5NTEwM30.XCqoOB6PMxD7jwALdjBx2au7UJOhMC5tl658QAO-Nc8'
);

// Fake-email helper: batman123 → batman123@iw99.com
function toEmail(username) {
  return username.trim().toLowerCase() + '@iw99.com';
}

document.addEventListener('DOMContentLoaded', async function () {
  BannerCarousel.init('bannerTrack', 'bannerDots');
  ModalManager.init();
  CategoryManager.init('gameGrid');
  initBottomNav();
  initActionIcons();
  initForms();
  initTableSearch();

  // Restore session on page load
  const { data } = await _supa.auth.getSession();
  updateAuthUI(data.session);

  // React to login/logout events
  _supa.auth.onAuthStateChange((_event, session) => {
    updateAuthUI(session);
  });
});

/* ── Auth UI state ── */
function updateAuthUI(session) {
  const loginBtn = document.querySelector('.login-btn');
  if (!loginBtn) return;
  if (session?.user) {
    const uname = session.user.user_metadata?.username
                  || session.user.email?.split('@')[0]
                  || 'User';
    loginBtn.textContent = uname;
    loginBtn.title = 'Click to log out';
    loginBtn.onclick = async () => {
      await _supa.auth.signOut();
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
  const signinTab  = document.getElementById('signinTab');
  const signupTab  = document.getElementById('signupTab');
  clearFeedback(signinForm);
  clearFeedback(signupForm);
  if (tab === 'signin') {
    signinForm.style.display = '';
    signupForm.style.display = 'none';
    signinTab.classList.add('active');
    signupTab.classList.remove('active');
  } else {
    signinForm.style.display = 'none';
    signupForm.style.display = '';
    signupTab.classList.add('active');
    signinTab.classList.remove('active');
  }
}

/* ── Action Icons ── */
function initActionIcons() {
  document.querySelectorAll('.action-icon-item').forEach(item => {
    item.addEventListener('click', function () {
      const modal = this.dataset.modal;
      if (modal) ModalManager.open(modal);
      const circle = this.querySelector('.action-icon-circle');
      if (circle) {
        circle.style.transform = 'scale(0.88)';
        setTimeout(() => { circle.style.transform = ''; }, 150);
      }
    });
  });

  const loginBtn = document.querySelector('.login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      // onclick is managed by updateAuthUI; fallback only
    });
  }
}

/* ── Forms ── */
function initForms() {

  // ── Sign In ──
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn  = this.querySelector('[type="submit"]');
      const user = this.querySelector('[name="username"]').value.trim();
      const pass = this.querySelector('[name="password"]').value;
      if (!user || !pass) return showFormError(this, 'Username and password required');
      btn.disabled = true;
      btn.textContent = 'Signing in…';
      const { data, error } = await _supa.auth.signInWithPassword({
        email: toEmail(user),
        password: pass,
      });
      btn.disabled = false;
      btn.textContent = 'Sign In';
      if (error) return showFormError(this, 'Invalid username or password');
      showFormSuccess(this, 'Welcome back, ' + (data.user.user_metadata?.username || user) + '!');
      setTimeout(() => ModalManager.close('loginModal'), 1200);
    });
  }

  // ── Sign Up ──
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
      const { data, error } = await _supa.auth.signUp({
        email: toEmail(user),
        password: pass,
        options: { data: { username: user, phone } },
      });
      btn.disabled = false;
      btn.textContent = 'Create Account';
      if (error) {
        if (error.message.includes('already registered')) {
          return showFormError(this, 'Username already taken');
        }
        return showFormError(this, error.message || 'Signup failed');
      }
      showFormSuccess(this, 'Account created! Welcome, ' + user + '!');
      setTimeout(() => ModalManager.close('loginModal'), 1500);
    });
  }

  // ── Password Reset ──
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


/* ══════════════════════════════════════
   BOTTOM NAV — new 5-button logic
══════════════════════════════════════ */
function initBottomNav() {
  const items = document.querySelectorAll('.nav-item');
  items.forEach(item => {
    item.addEventListener('click', async function (e) {
      e.preventDefault();
      const nav   = this.dataset.nav;
      const modal = this.dataset.modal;

      // Home button
      if (nav === 'home') {
        ModalManager.closeAll();
        items.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        return;
      }

      // Account: show profile if logged in, else login
      if (nav === 'account') {
        const { data } = await _supa.auth.getSession();
        if (data.session?.user) {
          await populateAccountModal(data.session.user);
          ModalManager.open('accountModal');
        } else {
          ModalManager.open('loginModal');
        }
        return;
      }

      // Agent / Deposit / Promotion: open their modal
      if (modal) {
        ModalManager.open(modal);
      }
    });
  });
}

/* ── Deposit tab switcher ── */
function switchDepositTab(btn, tab) {
  document.querySelectorAll('#depositModal .modal-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('depositKpay').style.display    = tab === 'kpay'    ? '' : 'none';
  document.getElementById('depositWavepay').style.display = tab === 'wavepay' ? '' : 'none';
  document.getElementById('depositBank').style.display    = tab === 'bank'    ? '' : 'none';
}

/* ── Account modal content ── */
async function populateAccountModal(user) {
  const body  = document.getElementById('accountModalBody');
  if (!body) return;
  const uname = user.user_metadata?.username || user.email?.split('@')[0] || 'User';
  const phone = user.user_metadata?.phone    || '—';
  const since = user.created_at ? new Date(user.created_at).toLocaleDateString() : '—';
  body.innerHTML = `
    <div style="text-align:center;margin-bottom:20px;">
      <div style="width:64px;height:64px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 10px;">
        ${uname.charAt(0).toUpperCase()}
      </div>
      <div style="font-size:18px;font-weight:700;color:var(--text-primary);">${uname}</div>
    </div>
    <div class="summary-card" style="margin-bottom:8px;">
      <div><div class="s-label">Phone</div><div class="s-value" style="font-size:14px;">${phone}</div></div>
      <span style="font-size:20px;">📱</span>
    </div>
    <div class="summary-card" style="margin-bottom:16px;">
      <div><div class="s-label">Member Since</div><div class="s-value" style="font-size:14px;">${since}</div></div>
      <span style="font-size:20px;">📅</span>
    </div>
    <button class="btn-primary" onclick="handleLogout()" style="background:#ef4444;">Log Out</button>
  `;
}

async function handleLogout() {
  await _supa.auth.signOut();
  ModalManager.close('accountModal');
}

