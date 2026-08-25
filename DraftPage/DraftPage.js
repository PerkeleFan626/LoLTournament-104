/**
 * ============================================================================
 * DRAFT TOOL CONTROLLER: EVENT BINDINGS, SEARCH ENGINE & INITIALIZATION
 * ============================================================================
 * Assembles:
 * - draftState.js  -> State store, DRAFT_SEQUENCE & champions data loader
 * - draftTimer.js  -> 30s turn countdown timer & timeout resolution
 * - draftEngine.js -> Draft match session, pick/ban logic & auto-pick
 * - draftUI.js     -> Rendering routines for board, timer badge & champ grid
 */

// Master Initialization on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  initDraftView();
});

async function initDraftView() {
  setupDraftControls();
  setupRoleTabs();
  setupChampionSearch();
  if (typeof renderDraftView === 'function') renderDraftView();
  if (typeof loadChampionsDatabase === 'function') await loadChampionsDatabase();
}

// Attach Control Button Handlers
function setupDraftControls() {
  document.addEventListener('click', (e) => {
    const startBtn = e.target.closest('#btn-start-draft');
    if (startBtn) {
      e.preventDefault();
      if (typeof soundEngine !== 'undefined') soundEngine.playShimmer();
      if (typeof startDraftSession === 'function') startDraftSession();
      return;
    }

    const resetBtn = e.target.closest('#btn-reset-draft');
    if (resetBtn) {
      e.preventDefault();
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();
      if (typeof resetDraftSession === 'function') resetDraftSession();
      return;
    }

    const autoPickBtn = e.target.closest('#btn-auto-pick');
    if (autoPickBtn) {
      e.preventDefault();
      if (typeof draftState !== 'undefined' && draftState.status !== 'IN_PROGRESS') {
        if (typeof showToast === 'function') {
          showToast("Click '▶️ Start Draft' first!", '⚠️');
        }
        return;
      }
      if (typeof autoPickNextChampion === 'function') autoPickNextChampion();
      return;
    }
  });
}

// Setup the 6 Role Tabs (All, Top, Djungle, Mid, ADC, Support)
function setupRoleTabs() {
  const tabsContainer = document.getElementById('draft-role-tabs');
  if (!tabsContainer) return;

  tabsContainer.querySelectorAll('.role-tab-btn').forEach(tab => {
    tab.onclick = () => {
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();

      tabsContainer.querySelectorAll('.role-tab-btn').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (typeof draftState !== 'undefined') {
        draftState.activeRoleFilter = tab.dataset.role || 'All';
      }
      if (typeof renderChampionGrid === 'function') renderChampionGrid();
    };
  });
}

// Setup Search Engine Input
function setupChampionSearch() {
  const searchInput = document.getElementById('draft-champ-search');
  if (!searchInput) return;

  searchInput.oninput = (e) => {
    if (typeof draftState !== 'undefined') {
      draftState.searchQuery = e.target.value.trim().toLowerCase();
    }
    if (typeof renderChampionGrid === 'function') renderChampionGrid();
  };
}
