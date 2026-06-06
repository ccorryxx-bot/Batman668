/**
 * modal.js — Bottom Sheet Modal Manager
 * iW99 Mobile Gaming Platform
 *
 * Handles: open, close, overlay-click-to-close,
 *          bottom-nav active state sync, escape key
 */

const ModalManager = (function () {

  const registry = {};   // id → overlay element

  // ── Register all overlays on DOMContentLoaded ─────────────
  function init() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      const id = overlay.id;
      registry[id] = overlay;

      // Click outside sheet to close
      overlay.addEventListener('click', e => {
        if (e.target === overlay) close(id);
      });

      // Close buttons inside the modal
      overlay.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => close(id));
      });
    });

    // Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeAll();
    });
  }

  // ── Open a modal ──────────────────────────────────────────
  function open(id) {
    const overlay = registry[id] || document.getElementById(id);
    if (!overlay) return console.warn(`[Modal] "${id}" not found`);
    registry[id] = overlay;

    // Close others first
    closeAll();

    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Re-trigger animation if already open
    const sheet = overlay.querySelector('.modal-sheet');
    if (sheet) {
      sheet.style.animation = 'none';
      sheet.offsetHeight;            // reflow
      sheet.style.animation = '';
    }
  }

  // ── Close a specific modal ────────────────────────────────
  function close(id) {
    const overlay = registry[id] || document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  // ── Close all open modals ─────────────────────────────────
  function closeAll() {
    Object.values(registry).forEach(o => o.classList.remove('show'));
    document.body.style.overflow = '';
  }

  // ── Toggle a modal ────────────────────────────────────────
  function toggle(id) {
    const overlay = registry[id] || document.getElementById(id);
    if (!overlay) return;
    overlay.classList.contains('show') ? close(id) : open(id);
  }

  // ── Public API ────────────────────────────────────────────
  return { init, open, close, closeAll, toggle };

})();

// Global shorthand functions used in HTML onclick attributes
function openModal(id)  { ModalManager.open(id);  }
function closeModal(id) { ModalManager.close(id); }
