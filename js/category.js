/**
 * category.js — Game Category Manager
 * Batman688 Mobile Gaming Platform
 *
 * Handles:
 *   - Left sidebar category selection & active state
 *   - Game grid filtering by category
 *   - Game card data & rendering
 */

const CategoryManager = (function () {

  // ── Game provider data ────────────────────────────────────
  const PROVIDERS = {
    slot: [
      { name: 'PRAGMATIC\nPLAY', img: 'https://images-utils.filev33344411.xyz/websites/batman/game/PP_SLOT.webp',       fallback: 'https://images-utils.filev33344411.xyz/websites/batman/game/AP_SLOT.webp' },
      { name: 'Live22',          img: 'https://images-utils.filev33344411.xyz/websites/batman/game/LIVE22_SLOT.webp?11', badgeColor: '#a855f7' },
      { name: 'AP',              img: 'https://images-utils.filev33344411.xyz/websites/batman/game/AP_SLOT.webp',        badgeColor: '#ecbf24' },
      { name: 'FAT 🐼\nPANDA',  img: 'https://images-utils.filev33344411.xyz/websites/batman/game/FATPANDA_LOGO.webp' },
      { name: 'PG',              img: 'https://images-utils.filev33344411.xyz/websites/batman/game/PG_SLOT.webp',        badgeColor: '#ecbf24' },
      { name: 'JILI',            img: null,  bg: 'linear-gradient(135deg,#1a0a00,#3a1500)', icon: '🎲', badgeColor: '#ecbf24' },
      { name: 'PLAY\nBOX',      img: 'https://images-utils.filev33344411.xyz/websites/batman/game/PLAYBOX_SLOT.webp' },
      { name: 'YGR',             img: 'https://images-utils.filev33344411.xyz/websites/batman/game/YGR.webp',            badgeColor: '#ecbf24' },
      { name: 'AFB',             img: 'https://images-utils.filev33344411.xyz/websites/batman/game/AFB_SLOT.webp',       badgeColor: '#ecbf24' },
      { name: 'FC\nFACHAI',     img: 'https://images-utils.filev33344411.xyz/websites/batman/game/FACHAI.webp' },
      { name: 'CQ9',             img: 'https://images-utils.filev33344411.xyz/websites/batman/game/CQ9.webp',            badgeColor: '#ecbf24' },
      { name: 'AFRICAN\nBUFFALO',img: 'https://images-utils.filev33344411.xyz/websites/batman/game/af.webp' },
    ],
    gameshow: [
      { name: 'LIVE\nCAZINO',   img: 'https://images-utils.filev33344411.xyz/websites/batman/game/AP_SLOT.webp' },
      { name: 'DREAM\nCATCHER', img: null, bg: 'linear-gradient(135deg,#0d1b2a,#1b2838)', icon: '🎡', badgeColor: '#ecbf24' },
    ],
    buffalo: [
      { name: 'BUFFALO\nGOLD',  img: 'https://images-utils.filev33344411.xyz/websites/batman/game/AFB_SLOT.webp' },
      { name: 'AFRICAN\nBUFFALO', img: 'https://images-utils.filev33344411.xyz/websites/batman/game/af.webp' },
    ],
    arcade: [
      { name: 'ARCADE\n1',      img: null, bg: 'linear-gradient(135deg,#1a0020,#2d0038)', icon: '🕹️', badgeColor: '#c700f8' },
      { name: 'ARCADE\n2',      img: null, bg: 'linear-gradient(135deg,#001a20,#002d38)', icon: '👾', badgeColor: '#00d4ff' },
    ],
    live: [
      { name: 'LIVE\nDEALER',   img: 'https://images-utils.filev33344411.xyz/websites/batman/game/LIVE22_SLOT.webp?11' },
    ],
    fish: [
      { name: 'FISH\nGAME',     img: null, bg: 'linear-gradient(135deg,#001a10,#002d20)', icon: '🐟', badgeColor: '#00d4aa' },
    ],
    sport: [
      { name: 'SPORTS\nBETTING',img: null, bg: 'linear-gradient(135deg,#001020,#002040)', icon: '⚽', badgeColor: '#4ade80' },
    ],
    lottery: [
      { name: 'LOTTERY',         img: null, bg: 'linear-gradient(135deg,#200010,#400020)', icon: '🎱', badgeColor: '#f9ec31' },
    ],
    favorite: [
      { name: 'PG',              img: 'https://images-utils.filev33344411.xyz/websites/batman/game/PG_SLOT.webp', badgeColor: '#ecbf24' },
      { name: 'JILI',            img: null, bg: 'linear-gradient(135deg,#1a0a00,#3a1500)', icon: '🎲', badgeColor: '#ecbf24' },
    ],
  };

  let activeCategory = 'slot';
  let gridEl = null;

  // ── Init ──────────────────────────────────────────────────
  function init(gridId = 'gameGrid') {
    gridEl = document.getElementById(gridId);
    if (!gridEl) return;

    document.querySelectorAll('.cat-item').forEach(item => {
      item.addEventListener('click', function () {
        const cat = this.dataset.cat || 'slot';
        setCategory(cat);
      });
    });

    renderGrid(activeCategory);
  }

  // ── Set active category ───────────────────────────────────
  function setCategory(cat) {
    activeCategory = cat;

    document.querySelectorAll('.cat-item').forEach(el => {
      el.classList.toggle('active', el.dataset.cat === cat);
    });

    renderGrid(cat);
  }

  // ── Render game grid ──────────────────────────────────────
  function renderGrid(cat) {
    if (!gridEl) return;
    const providers = PROVIDERS[cat] || PROVIDERS['slot'];

    gridEl.innerHTML = providers.map(p => buildCard(p)).join('');

    // Attach click handlers
    gridEl.querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('click', () => onCardClick(card));
    });
  }

  // ── Build a single card HTML ──────────────────────────────
  function buildCard(p) {
    const badgeStyle = p.badgeColor
      ? `style="color:${p.badgeColor};"` : '';

    if (p.img) {
      return `
        <div class="game-card" role="button" aria-label="${p.name.replace('\n',' ')}">
          <img src="${p.img}"
               onerror="this.src='${p.fallback || p.img}'"
               alt="${p.name.replace('\n',' ')}"
               loading="lazy">
          <div class="card-overlay"></div>
          <div class="provider-badge" ${badgeStyle}>${p.name.replace('\n','<br>')}</div>
        </div>`;
    } else {
      return `
        <div class="game-card" role="button" aria-label="${p.name.replace('\n',' ')}"
             style="background:${p.bg || 'var(--bg-card)'}">
          <div class="game-card-placeholder">
            <span class="ph-icon">${p.icon || '🎮'}</span>
            <span class="ph-label">${p.name.replace('\n','<br>')}</span>
          </div>
          <div class="card-overlay"></div>
          <div class="provider-badge" ${badgeStyle}>${p.name.replace('\n','<br>')}</div>
        </div>`;
    }
  }

  // ── Card click ────────────────────────────────────────────
  function onCardClick(card) {
    card.style.transition = 'transform 0.15s ease';
    card.style.transform  = 'scale(0.92)';
    setTimeout(() => { card.style.transform = ''; }, 150);
    // Future: navigate to game or open game modal
  }

  // ── Public API ────────────────────────────────────────────
  return { init, setCategory };

})();
