/**
 * ============================================================================
 * HEADER: TOP APP BAR, CONTROLS & PROFILE POPULATOR
 * ============================================================================
 */

// Step 1: Header HTML Template
const HEADER_HTML_TEMPLATE = `
  <!-- Simulated Phone Speaker Notch for Desktop Simulator -->
  <div class="device-notch" aria-hidden="true">
    <div class="device-speaker"></div>
  </div>

  <!-- Top Application Header Bar -->
  <header class="top-app-bar">
    <div class="top-profile-badge" id="top-user-profile-btn" title="Summoner Profile">
      <div class="top-avatar-frame">
        <img src="https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ahri.png" alt="User Avatar" class="top-avatar-img" id="top-bar-avatar" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20fill%3D%22%23091428%22%3E%3Crect%20width%3D%2240%22%20height%3D%2240%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2255%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%23c8aa6e%22%20font-size%3D%2216%22%3E%F0%9F%91%91%3C%2Ftext%3E%3C%2Fsvg%3E';">
      </div>
      <div class="top-user-info">
        <span class="top-summoner-name" id="top-bar-name">
          FakerJr <span class="badge badge-gold" id="top-bar-team-tag">ARC</span>
        </span>
        <div class="top-rank-pill" id="top-bar-rank">
          <span id="top-rank-icon">👑</span>
          <span id="top-rank-label">Grandmaster 485 LP</span>
        </div>
      </div>
    </div>

    <div class="top-app-controls">
      <!-- Sound Toggle -->
      <button class="top-icon-btn" id="btn-toggle-audio" title="Toggle Hextech Audio" aria-label="Toggle Sound">
        <span id="audio-icon">🔊</span>
      </button>
      
      <!-- Viewport Mode Toggle (Mobile / Wide layout simulator) -->
      <button class="top-icon-btn" id="btn-toggle-viewmode" title="Toggle Mobile / Wide View" aria-label="Toggle View Size">
        <span id="viewmode-icon">📱</span>
      </button>

      <!-- Notifications Bell -->
      <button class="top-icon-btn" id="btn-toggle-notifs" title="Notifications" aria-label="Notifications">
        <span>🔔</span>
        <span class="notif-badge-count" id="notif-badge" style="display:none;">0</span>
      </button>
    </div>
  </header>
`;

// Step 2: Header Mounting Function
function renderHeader(slotId = 'header-slot') {
  const slot = document.getElementById(slotId);
  if (slot && !slot.innerHTML.trim()) {
    slot.innerHTML = HEADER_HTML_TEMPLATE;
  }
  setupHeader();
}

function setupHeader() {
  setupViewModeToggle();
  setupAudioToggle();
  setupNotificationsButton();
  setupTopProfileClick();
  renderHeaderUserProfile();
}

// Step 3: Device Viewport Mode Toggle (Slim ↔ Wide)
function setupViewModeToggle() {
  const viewModeBtn = document.getElementById('btn-toggle-viewmode');
  const viewportWrapper = document.getElementById('viewport-wrapper');

  if (viewModeBtn && viewportWrapper) {
    viewModeBtn.onclick = () => {
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();

      // Toggle the 'wide-mode' class on the container
      viewportWrapper.classList.toggle('wide-mode');
      const isWide = viewportWrapper.classList.contains('wide-mode');

      // Update hover tooltip
      viewModeBtn.title = isWide ? 'Switch to Compact Phone View' : 'Switch to Wide View';
      
      // Trigger toast feedback
      if (typeof showToast === 'function') {
        showToast(isWide ? 'Switched to Wide View (768px)' : 'Switched to Compact Phone View (430px)', '📱');
      }
    };
  }
}

// Step 4: Hextech Audio Toggle
function setupAudioToggle() {
  const audioBtn = document.getElementById('btn-toggle-audio');
  const audioIcon = document.getElementById('audio-icon');

  if (audioBtn && typeof soundEngine !== 'undefined') {
    // Sync initial state
    if (audioIcon) {
      audioIcon.innerText = soundEngine.isMuted() ? '🔇' : '🔊';
    }

    audioBtn.onclick = () => {
      const enabled = soundEngine.toggleSound();
      if (audioIcon) audioIcon.innerText = enabled ? '🔊' : '🔇';
      if (typeof showToast === 'function') {
        showToast(enabled ? 'Hextech Audio Enabled' : 'Audio Muted', enabled ? '🔊' : '🔇');
      }
    };
  }
}

// Step 5: Notifications Button Handler
function setupNotificationsButton() {
  const notifBtn = document.getElementById('btn-toggle-notifs');
  if (notifBtn) {
    notifBtn.onclick = () => {
      if (typeof soundEngine !== 'undefined') soundEngine.playShimmer();
      if (typeof showToast === 'function') {
        showToast('All tournament notifications caught up! 0 unread.', '🔔');
      }
    };
  }
}

// Step 6: Populate Top User Profile from State
function renderHeaderUserProfile() {
  if (typeof getState !== 'function') return;

  const state = getState();
  const user = state.currentUser;
  if (!user) return;

  const userTeam = (state.teams || []).find(t => t.id === user.teamId);

  const topAvatar = document.getElementById('top-bar-avatar');
  const topName = document.getElementById('top-bar-name');
  const topRankLabel = document.getElementById('top-rank-label');

  if (topAvatar && user.avatar) topAvatar.src = user.avatar;
  if (topName) {
    topName.innerHTML = `${user.name} <span class="badge badge-gold" id="top-bar-team-tag">${userTeam ? userTeam.tag : 'ARC'}</span>`;
  }
  if (topRankLabel) {
    topRankLabel.innerText = `${user.rank} ${user.lp} LP`;
  }
}

// Step 7: Top Profile Badge Click -> Switch to Profile Tab
function setupTopProfileClick() {
  const profileBtn = document.getElementById('top-user-profile-btn');
  if (profileBtn) {
    profileBtn.style.cursor = 'pointer';
    profileBtn.onclick = () => {
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();

      // Find profile nav button in footer
      const profileNavBtn = document.querySelector('.bottom-nav-item[data-tab-target="view-profile"]');
      if (profileNavBtn) {
        profileNavBtn.click();
      } else {
        const targetView = document.getElementById('view-profile');
        if (targetView) {
          document.querySelectorAll('.tab-view').forEach(view => view.classList.remove('active'));
          targetView.classList.add('active');
          if (typeof renderProfileView === 'function') renderProfileView();
        }
      }
    };
  }
}

