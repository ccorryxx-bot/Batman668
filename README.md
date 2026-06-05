# Batman668 🦇

**Batman688 Mobile Gaming Platform — Pixel-perfect Modular UI Replica**

A high-fidelity, modular HTML/CSS/JS replica of the Batman688 mobile gaming platform.  
Achieves **~95%+ visual accuracy** and is structured for easy maintenance and extension.

---

## 🗂 Project Structure

```
Batman668/
├── index.html              ← Main entry point (HTML shell + all 5 modals)
├── css/
│   ├── base.css            ← Design tokens, CSS variables, reset, typography
│   ├── layout.css          ← Header, banner, action row, notice bar, bottom nav
│   ├── components.css      ← Game grid, cards, wallet bar, category items
│   └── modals.css          ← All 5 bottom-sheet modals + form elements
├── js/
│   ├── banner.js           ← Carousel module (auto-scroll, swipe, dots)
│   ├── modal.js            ← Modal manager (open/close, overlay, escape key)
│   ├── category.js         ← Category sidebar + game grid renderer
│   └── app.js              ← Main initializer + form logic + nav
└── README.md
```

---

## 📱 Pages & Modals

| Screen | Trigger | Description |
|--------|---------|-------------|
| **Home Page** | Default | Banner carousel, action row, notice, category sidebar, game grid |
| **Login Modal** | `လော့ဂ်အင်` button | Username + password form, remember me, forgot password |
| **Password Reset Modal** | Bottom nav 🔐 | Old/new/confirm password with validation |
| **History Modal** | Bottom nav 🕐 | Date range filter + transaction table with +/- amounts |
| **Summary Modal** | Bottom nav 📊 | Balance, deposit, withdraw, winnings in card grid |
| **Game Log Modal** | Bottom nav 🎮 | Date filter + results table with WIN/LOSE/DRAW tabs |

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#121212` | Body, header |
| `--bg-secondary` | `#1d1e20` | Bottom nav, modal sheets |
| `--bg-card` | `#2b2c2e` | Category items, card bg |
| `--gold` | `#ecbf24` | Active states, buttons, accents |
| `--gold-light` | `#f9ec31` | Labels, active nav text |
| `--success` | `#4ade80` | Win status |
| `--danger` | `#f87171` | Lose status |

---

## ⚙️ Tech Stack

- **HTML5** — Semantic structure with ARIA labels
- **Tailwind CSS** (CDN) — Utility classes
- **Custom CSS** (4 modules) — Design system, layout, components, modals
- **Vanilla JavaScript** (4 modules) — No frameworks, no build step
- **Mobile-first** — Optimized for 360px–480px viewports

---

## 🚀 Usage

```bash
# Just open in any browser — no build step needed
open index.html
```

Or deploy to **GitHub Pages**:  
`Settings → Pages → Deploy from branch: main / root`  
Live URL: `https://ccorryxx-bot.github.io/Batman668/`

---

## 📦 Module Details

### `js/banner.js` — BannerCarousel
- Auto-advances every **3.5s**
- Touch/swipe support with direction detection
- Dot indicators sync with current slide
- Pauses on user interaction, resumes after 5s

### `js/modal.js` — ModalManager
- Bottom-sheet animation (`slideUp`)
- Click overlay to close
- Escape key support
- `openModal(id)` / `closeModal(id)` global helpers

### `js/category.js` — CategoryManager
- Left sidebar active state
- Dynamically renders game grid from provider data
- 9 categories: slot, gameshow, buffalo, arcade, favorite, live, fish, sport, lottery

### `js/app.js` — App Entry
- Initializes all modules on `DOMContentLoaded`
- Bottom nav routing (modal open or home reset)
- Form validation for login & password reset
- Inline feedback (error/success messages)

---

*UI replicated from m.batman688.com — for educational/portfolio purposes.*
