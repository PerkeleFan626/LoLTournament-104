/**
 * ============================================================================
 * FOOTER: STICKY BOTTOM NAVIGATION BAR CONTROLLER
 * ============================================================================
 */

// Step 1: Footer HTML Template
const FOOTER_HTML_TEMPLATE = `
  <nav class="bottom-nav-bar" aria-label="Main Navigation">
    <button class="bottom-nav-item active" data-tab-target="view-tournaments" id="tab-tournaments-label">
      <span class="nav-icon">🏆</span>
      <span class="nav-label">Tourneys</span>
    </button>
    <button class="bottom-nav-item" data-tab-target="view-teams" id="tab-teams-label">
      <span class="nav-icon">⚔️</span>
      <span class="nav-label">My Team</span>
    </button>
    <button class="bottom-nav-item" data-tab-target="view-draft" id="tab-draft-label">
      <span class="nav-icon">⚡</span>
      <span class="nav-label">Draft Tool</span>
    </button>
    <button class="bottom-nav-item" data-tab-target="view-scrims" id="tab-scrims-label">
      <span class="nav-icon">🎯</span>
      <span class="nav-label">Recruit</span>
    </button>
    <button class="bottom-nav-item" data-tab-target="view-profile" id="tab-profile-label">
      <span class="nav-icon">👤</span>
      <span class="nav-label">Profile</span>
    </button>
  </nav>
`;

// Step 2: Footer Mounting Function
function renderFotter(slotId = 'footer-slot') {
  const slot = document.getElementById(slotId);
  if (slot && !slot.innerHTML.trim()) {
    slot.innerHTML = FOOTER_HTML_TEMPLATE;
  }
  setupBottomNavigation();
}

// Step 3: Navigation Tab Click Handlers & View Switching
function setupBottomNavigation() {
  const navItems = document.querySelectorAll('.bottom-nav-item');

  navItems.forEach(button => {
    button.onclick = () => {
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();

      // 1. Remove active state from all nav buttons
      navItems.forEach(item => item.classList.remove('active'));

      // 2. Add active state to clicked button
      button.classList.add('active');

      // 3. Tab target element ID
      const targetId = button.dataset.tabTarget;
      const targetView = targetId ? document.getElementById(targetId) : null;
      const tabLabel = button.querySelector('.nav-label')?.innerText || 'Tab';

      if (targetView) {
        // Switch active tab view in the content container
        document.querySelectorAll('.tab-view').forEach(view => view.classList.remove('active'));
        targetView.classList.add('active');

        // Trigger view-specific renderers if available
        if (targetId === 'view-tournaments' && typeof renderTournaments === 'function') {
          renderTournaments();
        } else if (targetId === 'view-draft' && typeof renderDraftView === 'function') {
          renderDraftView();
        } else if (targetId === 'view-profile' && typeof renderProfileView === 'function') {
          renderProfileView();
        }
      } else {
        if (typeof showToast === 'function') {
          showToast(`${tabLabel} module is in active development!`, '🧭');
        }
      }
    };
  });
}
