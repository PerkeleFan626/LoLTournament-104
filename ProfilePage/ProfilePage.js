/**
 * ============================================================================
 * PROFILE PAGE: SUMMONER PROFILE, RANKED STATS & API-READY CARDS
 * ============================================================================
 */

// Step 1: Active Match History Filter State
let currentProfileMatchFilter = 'all';

// Step 2: Sample Empty State Placeholder Data Template (Ready for API)
const EMPTY_PROFILE_SCHEMA = {
  summoner: {
    name: "Summoner",
    tagLine: "NA1",
    region: "NA",
    level: 1,
    avatar: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2280%22%20height%3D%2280%22%20fill%3D%22%23091428%22%3E%3Crect%20width%3D%2280%22%20height%3D%2280%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2255%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%23c8aa6e%22%20font-size%3D%2232%22%3E%F0%9F%91%A4%3C%2Ftext%3E%3C%2Fsvg%3E",
    banner: "",
    status: "Online",
    teamTag: "—"
  },
  ranked: {
    solo: {
      tier: "UNRANKED",
      division: "",
      lp: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      emblem: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2250%22%20height%3D%2250%22%20fill%3D%22%230a1428%22%3E%3Ccircle%20cx%3D%2225%22%20cy%3D%2225%22%20r%3D%2220%22%20stroke%3D%22%23785a28%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2255%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%238a9ba8%22%20font-size%3D%2218%22%3E%E2%9A%94%EF%B8%8F%3C%2Ftext%3E%3C%2Fsvg%3E"
    },
    flex: {
      tier: "UNRANKED",
      division: "",
      lp: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      emblem: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2250%22%20height%3D%2250%22%20fill%3D%22%230a1428%22%3E%3Ccircle%20cx%3D%2225%22%20cy%3D%2225%22%20r%3D%2220%22%20stroke%3D%22%23785a28%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2255%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%238a9ba8%22%20font-size%3D%2218%22%3E%F0%9F%9B%A1%EF%B8%8F%3C%2Ftext%3E%3C%2Fsvg%3E"
    }
  },
  performance: {
    kda: "—",
    kp: "—",
    dpm: "—",
    vision: "—"
  },
  mastery: [],
  matches: [],
  trophies: []
};

// Step 3: Master Profile Page Renderer
function renderProfileView() {
  const profileSection = document.getElementById('view-profile');
  if (!profileSection) return;

  // Build the Base HTML structure with empty/placeholder cards
  renderEmptyProfileCards();

  // Setup Event Listeners (API refresh, copy ID, match filters)
  setupProfileActions();

  // Attempt to populate default state or empty state
  loadInitialProfileState();
}

// Step 4: Render Empty Cards & Base Layout
function renderEmptyProfileCards() {
  const profileSection = document.getElementById('view-profile');
  if (!profileSection) return;

  profileSection.innerHTML = `
    <div class="profile-container">

      <!-- 1. HERO IDENTITY & SUMMONER CARD -->
      <div class="profile-hero-card" id="profile-hero-card">
        <div class="profile-hero-banner">
          <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_7.jpg" alt="Profile Banner" class="profile-hero-banner-img" id="profile-banner-img" onerror="this.style.display='none';">
          <div class="profile-banner-overlay">
            <span class="badge badge-gold" id="profile-team-badge">TEAM: —</span>
          </div>
        </div>

        <div class="profile-hero-body">
          <div class="profile-identity-row">
            <div class="profile-avatar-wrapper">
              <div class="profile-avatar-frame">
                <img src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2280%22%20height%3D%2280%22%20fill%3D%22%23091428%22%3E%3Crect%20width%3D%2280%22%20height%3D%2280%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2255%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%23c8aa6e%22%20font-size%3D%2232%22%3E%F0%9F%91%A4%3C%2Ftext%3E%3C%2Fsvg%3E" 
                     alt="Summoner Avatar" 
                     class="profile-avatar-img" 
                     id="profile-avatar-img">
              </div>
              <span class="profile-level-badge" id="profile-level-badge">LVL --</span>
            </div>

            <div class="profile-identity-details">
              <div class="profile-name-line">
                <h2 class="profile-summoner-name" id="profile-summoner-name">— —</h2>
                <span class="profile-tagline" id="profile-tagline">#—</span>
              </div>
              <div class="profile-meta-pills">
                <span class="profile-region-pill" id="profile-region-pill">Region: —</span>
                <span class="profile-status-indicator" id="profile-status-pill">
                  <span class="profile-status-dot"></span>
                  <span id="profile-status-text">Standby</span>
                </span>
              </div>
            </div>
          </div>

          <div class="profile-hero-actions">
            <button class="btn btn-gold btn-sm" id="btn-refresh-profile" style="flex: 2;">
              <span>🔄 Sync API Data</span>
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-copy-riot-id" style="flex: 1;">
              <span>📋 Copy ID</span>
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-clear-profile" style="flex: 1;" title="Clear to Empty State">
              <span>🧹 Reset</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 2. API INTEGRATION NOTICE / STATUS CARD -->
      <div class="api-notice-card" id="api-status-banner">
        <div class="api-notice-content">
          <span class="api-notice-icon">⚡</span>
          <div>
            <div class="api-notice-title">API Population Ready</div>
            <div class="api-notice-desc">Cards are configured with target IDs for dynamic Riot / Tournament API integration.</div>
          </div>
        </div>
        <span class="badge badge-cyan">v1.0 API Ready</span>
      </div>

      <!-- 3. COMPETITIVE RANKED TIERS SECTION -->
      <div class="profile-section-heading">
        <h3 class="profile-section-title">
          <span>🛡️</span> Ranked Standing
        </h3>
        <span class="profile-section-sub">Current Season</span>
      </div>

      <div class="ranked-cards-grid">
        
        <!-- Ranked Solo/Duo Card -->
        <div class="ranked-overview-card" id="card-ranked-solo">
          <div class="ranked-queue-header">
            <span class="ranked-queue-name">Ranked Solo/Duo</span>
            <span class="badge badge-gold" id="ranked-solo-badge">Season 2026</span>
          </div>
          <div class="ranked-tier-body">
            <div class="ranked-emblem-slot" id="ranked-solo-emblem-slot">
              <span style="font-size: 22px;">⚔️</span>
            </div>
            <div class="ranked-info-col">
              <div class="ranked-tier-label" id="ranked-solo-tier">UNRANKED</div>
              <div class="ranked-lp-text" id="ranked-solo-lp">— LP</div>
              <div class="ranked-record-text" id="ranked-solo-record">0W 0L</div>
            </div>
          </div>
          <div class="ranked-progress-wrap">
            <div class="ranked-progress-labels">
              <span>Win Rate</span>
              <span id="ranked-solo-wr-text">—%</span>
            </div>
            <div class="ranked-progress-track">
              <div class="ranked-progress-fill" id="ranked-solo-wr-bar" style="width: 0%;"></div>
            </div>
          </div>
        </div>

        <!-- Ranked Flex Card -->
        <div class="ranked-overview-card" id="card-ranked-flex">
          <div class="ranked-queue-header">
            <span class="ranked-queue-name">Ranked Flex 5v5</span>
            <span class="badge badge-cyan" id="ranked-flex-badge">Team Queue</span>
          </div>
          <div class="ranked-tier-body">
            <div class="ranked-emblem-slot" id="ranked-flex-emblem-slot">
              <span style="font-size: 22px;">🛡️</span>
            </div>
            <div class="ranked-info-col">
              <div class="ranked-tier-label" id="ranked-flex-tier">UNRANKED</div>
              <div class="ranked-lp-text" id="ranked-flex-lp">— LP</div>
              <div class="ranked-record-text" id="ranked-flex-record">0W 0L</div>
            </div>
          </div>
          <div class="ranked-progress-wrap">
            <div class="ranked-progress-labels">
              <span>Win Rate</span>
              <span id="ranked-flex-wr-text">—%</span>
            </div>
            <div class="ranked-progress-track">
              <div class="ranked-progress-fill" id="ranked-flex-wr-bar" style="width: 0%;"></div>
            </div>
          </div>
        </div>

      </div>

      <!-- 4. LIFETIME PERFORMANCE STATS GRID -->
      <div class="profile-section-heading">
        <h3 class="profile-section-title">
          <span>📊</span> Combat Metrics
        </h3>
        <span class="profile-section-sub">Average / Match</span>
      </div>

      <div class="performance-metrics-grid" id="profile-metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">🎯</div>
          <div class="metric-value" id="metric-kda">—</div>
          <div class="metric-label">KDA Ratio</div>
          <div class="metric-sub" id="metric-kda-sub">--</div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">🔥</div>
          <div class="metric-value" id="metric-kp">—</div>
          <div class="metric-label">Kill Part.</div>
          <div class="metric-sub" id="metric-kp-sub">--</div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">⚡</div>
          <div class="metric-value" id="metric-dpm">—</div>
          <div class="metric-label">Dmg / Min</div>
          <div class="metric-sub" id="metric-dpm-sub">--</div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">👁️</div>
          <div class="metric-value" id="metric-vision">—</div>
          <div class="metric-label">Vision Score</div>
          <div class="metric-sub" id="metric-vision-sub">--</div>
        </div>
      </div>

      <!-- 5. TOP CHAMPION MASTERY CARD -->
      <div class="profile-card" id="card-champion-mastery">
        <div class="profile-section-heading" style="margin-top: 0;">
          <h3 class="profile-section-title">
            <span>👑</span> Top Champion Mastery
          </h3>
          <span class="badge badge-gold" id="mastery-count-badge">0 Champs</span>
        </div>

        <div class="mastery-list-container" id="profile-mastery-list">
          <!-- Empty Placeholder State -->
          <div class="empty-placeholder-card">
            <span class="empty-placeholder-icon">🔮</span>
            <div class="empty-placeholder-title">No Champion Mastery Loaded</div>
            <div class="empty-placeholder-text">Mastery scores, champion avatars, and top roles will populate when API data is fetched.</div>
          </div>
        </div>
      </div>

      <!-- 6. RECENT MATCH HISTORY CARD -->
      <div class="profile-card" id="card-match-history">
        <div class="profile-section-heading" style="margin-top: 0;">
          <h3 class="profile-section-title">
            <span>⚔️</span> Match History
          </h3>
          <span class="profile-section-sub">Recent Encounters</span>
        </div>

        <!-- Match Filter Pills -->
        <div class="match-filters-row" id="profile-match-filters">
          <button class="match-filter-pill active" data-match-filter="all">All Modes</button>
          <button class="match-filter-pill" data-match-filter="solo">Ranked Solo</button>
          <button class="match-filter-pill" data-match-filter="flex">Ranked Flex</button>
          <button class="match-filter-pill" data-match-filter="clash">🏆 Clash / Cups</button>
        </div>

        <div class="match-history-list" id="profile-match-list">
          <!-- Empty Placeholder State -->
          <div class="empty-placeholder-card">
            <span class="empty-placeholder-icon">📜</span>
            <div class="empty-placeholder-title">No Matches Logged</div>
            <div class="empty-placeholder-text">Recent tournament games and ranked match details will populate from your API endpoint.</div>
          </div>
        </div>
      </div>

      <!-- 7. TOURNAMENT TROPHY & CLASH CABINET -->
      <div class="profile-card" id="card-trophy-cabinet">
        <div class="profile-section-heading" style="margin-top: 0;">
          <h3 class="profile-section-title">
            <span>🏆</span> Trophy Cabinet
          </h3>
          <span class="badge badge-gold" id="trophy-count-badge">0 Trophies</span>
        </div>

        <div class="trophy-cabinet-grid" id="profile-trophy-grid">
          <div class="trophy-pedestal-slot empty">
            <span class="trophy-icon">🏆</span>
            <span class="trophy-title">Open Cup Slot</span>
            <span class="trophy-date">Unclaimed</span>
          </div>
          <div class="trophy-pedestal-slot empty">
            <span class="trophy-icon">🥇</span>
            <span class="trophy-title">Clash Split Slot</span>
            <span class="trophy-date">Unclaimed</span>
          </div>
          <div class="trophy-pedestal-slot empty">
            <span class="trophy-icon">🎖️</span>
            <span class="trophy-title">Invitational Slot</span>
            <span class="trophy-date">Unclaimed</span>
          </div>
        </div>
      </div>

    </div>
  `;
}

// Step 5: Setup Interactive Actions & Event Listeners
function setupProfileActions() {
  // 1. Sync / Refresh API Button
  const btnRefresh = document.getElementById('btn-refresh-profile');
  if (btnRefresh) {
    btnRefresh.onclick = () => {
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();
      btnRefresh.innerHTML = '<span>⏳ Fetching API...</span>';
      btnRefresh.disabled = true;

      // Simulate API fetch or populate from state / external source
      setTimeout(() => {
        const state = (typeof getState === 'function') ? getState() : null;
        const currentSummoner = state?.currentUser;

        if (currentSummoner) {
          // Populate with mock API response based on current summoner
          const mockApiPayload = generateMockApiResponse(currentSummoner);
          populateProfileData(mockApiPayload);

          if (typeof soundEngine !== 'undefined') soundEngine.playSuccess();
          if (typeof showToast === 'function') {
            showToast(`Profile data synced for ${mockApiPayload.summoner.name}!`, '✨');
          }
        } else {
          if (typeof showToast === 'function') {
            showToast('API endpoint ready! Feed data using populateProfileData(payload)', 'ℹ️');
          }
        }

        btnRefresh.innerHTML = '<span>🔄 Sync API Data</span>';
        btnRefresh.disabled = false;
      }, 700);
    };
  }

  // 2. Copy Riot ID Button
  const btnCopy = document.getElementById('btn-copy-riot-id');
  if (btnCopy) {
    btnCopy.onclick = () => {
      const name = document.getElementById('profile-summoner-name')?.innerText || 'Summoner';
      const tag = document.getElementById('profile-tagline')?.innerText || '#NA1';
      const fullId = `${name}${tag}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullId).then(() => {
          if (typeof soundEngine !== 'undefined') soundEngine.playClick();
          if (typeof showToast === 'function') showToast(`Copied ${fullId} to clipboard!`, '📋');
        }).catch(() => {
          if (typeof showToast === 'function') showToast(`Riot ID: ${fullId}`, '📋');
        });
      } else {
        if (typeof showToast === 'function') showToast(`Riot ID: ${fullId}`, '📋');
      }
    };
  }

  // 3. Clear / Reset to Empty State Button
  const btnClear = document.getElementById('btn-clear-profile');
  if (btnClear) {
    btnClear.onclick = () => {
      if (typeof soundEngine !== 'undefined') soundEngine.playBan();
      clearProfileCards();
      if (typeof showToast === 'function') {
        showToast('Profile cards reset to empty state', '🧹');
      }
    };
  }

  // 4. Match History Filter Pills
  const matchFilters = document.getElementById('profile-match-filters');
  if (matchFilters) {
    matchFilters.querySelectorAll('.match-filter-pill').forEach(pill => {
      pill.onclick = () => {
        if (typeof soundEngine !== 'undefined') soundEngine.playClick();
        matchFilters.querySelectorAll('.match-filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentProfileMatchFilter = pill.dataset.matchFilter || 'all';

        // Re-filter match list if data exists
        const list = document.getElementById('profile-match-list');
        if (list) {
          const cards = list.querySelectorAll('.match-card-item');
          if (cards.length > 0) {
            cards.forEach(card => {
              const queue = card.dataset.queueType;
              if (currentProfileMatchFilter === 'all' || queue === currentProfileMatchFilter) {
                card.style.display = 'flex';
              } else {
                card.style.display = 'none';
              }
            });
          }
        }
      };
    });
  }
}

// Step 6: Initial Profile State Loader
function loadInitialProfileState() {
  const state = (typeof getState === 'function') ? getState() : null;
  const user = state?.currentUser;

  if (user) {
    // If local state exists, populate basic header information while leaving cards empty or ready for API
    const elName = document.getElementById('profile-summoner-name');
    const elTag = document.getElementById('profile-tagline');
    const elAvatar = document.getElementById('profile-avatar-img');
    const elTeam = document.getElementById('profile-team-badge');
    const elLevel = document.getElementById('profile-level-badge');
    const elRegion = document.getElementById('profile-region-pill');
    const elStatus = document.getElementById('profile-status-text');

    if (elName) elName.innerText = user.name || 'Summoner';
    if (elTag) elTag.innerText = user.tag || '#NA1';
    if (elAvatar && user.avatar) elAvatar.src = user.avatar;
    if (elTeam) elTeam.innerText = `TEAM: ${user.teamTag || 'ARC'}`;
    if (elLevel) elLevel.innerText = `LVL 485`;
    if (elRegion) elRegion.innerText = `Region: NA`;
    if (elStatus) elStatus.innerText = `In Lobby`;
  }
}

// Step 7: Core Public API Hook — Populate All Profile Cards Dynamically
/**
 * Call this function to populate the profile page with data from any API endpoint.
 * @param {Object} data - Structured profile data matching the schema
 */
function populateProfileData(data) {
  if (!data) return;

  // 1. Populate Summoner Identity Header
  if (data.summoner) {
    const s = data.summoner;
    const elName = document.getElementById('profile-summoner-name');
    const elTag = document.getElementById('profile-tagline');
    const elAvatar = document.getElementById('profile-avatar-img');
    const elLevel = document.getElementById('profile-level-badge');
    const elTeam = document.getElementById('profile-team-badge');
    const elRegion = document.getElementById('profile-region-pill');
    const elStatus = document.getElementById('profile-status-text');

    if (elName && s.name) elName.innerText = s.name;
    if (elTag && s.tagLine) elTag.innerText = s.tagLine.startsWith('#') ? s.tagLine : `#${s.tagLine}`;
    if (elAvatar && s.avatar) elAvatar.src = s.avatar;
    if (elLevel && s.level) elLevel.innerText = `LVL ${s.level}`;
    if (elTeam && s.teamTag) elTeam.innerText = `TEAM: ${s.teamTag}`;
    if (elRegion && s.region) elRegion.innerText = `Region: ${s.region}`;
    if (elStatus && s.status) elStatus.innerText = s.status;
  }

  // 2. Populate Ranked Solo/Duo
  if (data.ranked?.solo) {
    const solo = data.ranked.solo;
    const elTier = document.getElementById('ranked-solo-tier');
    const elLp = document.getElementById('ranked-solo-lp');
    const elRec = document.getElementById('ranked-solo-record');
    const elWr = document.getElementById('ranked-solo-wr-text');
    const elBar = document.getElementById('ranked-solo-wr-bar');
    const elEmblem = document.getElementById('ranked-solo-emblem-slot');

    if (elTier) elTier.innerText = `${solo.tier} ${solo.division || ''}`.trim();
    if (elLp) elLp.innerText = `${solo.lp} LP`;
    if (elRec) elRec.innerText = `${solo.wins}W ${solo.losses}L`;
    if (elWr) elWr.innerText = `${solo.winRate}%`;
    if (elBar) elBar.style.width = `${solo.winRate}%`;
    if (elEmblem) {
      elEmblem.innerHTML = solo.emblem ? `<img src="${solo.emblem}" alt="${solo.tier}" class="ranked-emblem-img">` : `<span style="font-size:22px;">👑</span>`;
    }
  }

  // 3. Populate Ranked Flex
  if (data.ranked?.flex) {
    const flex = data.ranked.flex;
    const elTier = document.getElementById('ranked-flex-tier');
    const elLp = document.getElementById('ranked-flex-lp');
    const elRec = document.getElementById('ranked-flex-record');
    const elWr = document.getElementById('ranked-flex-wr-text');
    const elBar = document.getElementById('ranked-flex-wr-bar');
    const elEmblem = document.getElementById('ranked-flex-emblem-slot');

    if (elTier) elTier.innerText = `${flex.tier} ${flex.division || ''}`.trim();
    if (elLp) elLp.innerText = `${flex.lp} LP`;
    if (elRec) elRec.innerText = `${flex.wins}W ${flex.losses}L`;
    if (elWr) elWr.innerText = `${flex.winRate}%`;
    if (elBar) elBar.style.width = `${flex.winRate}%`;
    if (elEmblem) {
      elEmblem.innerHTML = flex.emblem ? `<img src="${flex.emblem}" alt="${flex.tier}" class="ranked-emblem-img">` : `<span style="font-size:22px;">🛡️</span>`;
    }
  }

  // 4. Populate Combat Performance Metrics
  if (data.performance) {
    const p = data.performance;
    const elKda = document.getElementById('metric-kda');
    const elKp = document.getElementById('metric-kp');
    const elDpm = document.getElementById('metric-dpm');
    const elVis = document.getElementById('metric-vision');

    if (elKda && p.kda) elKda.innerText = p.kda;
    if (elKp && p.kp) elKp.innerText = p.kp;
    if (elDpm && p.dpm) elDpm.innerText = p.dpm;
    if (elVis && p.vision) elVis.innerText = p.vision;
  }

  // 5. Populate Champion Mastery List
  if (Array.isArray(data.mastery) && data.mastery.length > 0) {
    const masteryContainer = document.getElementById('profile-mastery-list');
    const countBadge = document.getElementById('mastery-count-badge');
    if (countBadge) countBadge.innerText = `${data.mastery.length} Champions`;

    if (masteryContainer) {
      masteryContainer.innerHTML = data.mastery.map(champ => `
        <div class="mastery-row-card">
          <div class="mastery-champ-info">
            <div class="mastery-avatar-slot">
              <img src="${champ.icon || 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ahri.png'}" alt="${champ.name}" class="mastery-avatar-img">
            </div>
            <div class="mastery-name-col">
              <div class="mastery-champ-name">${champ.name}</div>
              <div class="mastery-role-tag">${champ.role || 'Mid / Mage'}</div>
            </div>
          </div>
          <div class="mastery-stats-col">
            <div class="mastery-points-val">${champ.points ? champ.points.toLocaleString() : '0'} pts</div>
            <div class="mastery-level-pill">
              <span>👑</span> Lvl ${champ.level || 7}
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // 6. Populate Match History List
  if (Array.isArray(data.matches) && data.matches.length > 0) {
    const matchList = document.getElementById('profile-match-list');
    if (matchList) {
      matchList.innerHTML = data.matches.map(m => {
        const isWin = m.result?.toUpperCase() === 'VICTORY' || m.win === true;
        const itemIcons = m.items || [null, null, null, null, null, null];

        return `
          <div class="match-card-item ${isWin ? 'victory' : 'defeat'}" data-queue-type="${m.queueType || 'solo'}">
            <div class="match-champ-badge-group">
              <div class="match-champ-avatar">
                <img src="${m.championIcon || 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ahri.png'}" alt="${m.championName || 'Champ'}">
              </div>
              <div class="match-meta-col">
                <span class="match-result-badge">${isWin ? 'Victory' : 'Defeat'}</span>
                <span class="match-queue-type">${m.queueLabel || 'Ranked Solo'}</span>
              </div>
            </div>

            <div class="match-kda-col">
              <div class="match-kda-numbers">${m.kills || 0}/${m.deaths || 0}/${m.assists || 0}</div>
              <div class="match-kda-ratio">${m.kdaRatio || '3.50'} KDA</div>
            </div>

            <div class="match-items-grid">
              ${itemIcons.slice(0, 6).map(it => `
                <div class="match-item-slot">
                  ${it ? `<img src="${it}" alt="Item">` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 7. Populate Trophy Showcase
  if (Array.isArray(data.trophies) && data.trophies.length > 0) {
    const trophyGrid = document.getElementById('profile-trophy-grid');
    const trophyCountBadge = document.getElementById('trophy-count-badge');
    if (trophyCountBadge) trophyCountBadge.innerText = `${data.trophies.length} Trophies`;

    if (trophyGrid) {
      trophyGrid.innerHTML = data.trophies.map(t => `
        <div class="trophy-pedestal-slot">
          <span class="trophy-icon">${t.icon || '🏆'}</span>
          <span class="trophy-title">${t.title || 'Tournament Cup'}</span>
          <span class="trophy-date">${t.date || '2026'}</span>
        </div>
      `).join('');
    }
  }
}

// Step 8: Reset Cards to Empty Placeholder State
function clearProfileCards() {
  renderEmptyProfileCards();
  setupProfileActions();
}

// Step 9: Mock API Generator Helper (Used for API Simulation & Testing)
function generateMockApiResponse(currentUser) {
  return {
    summoner: {
      name: currentUser?.name || "FakerJr",
      tagLine: currentUser?.tag || "#NA1",
      region: "NA",
      level: 485,
      avatar: currentUser?.avatar || "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ahri.png",
      status: "In Queue (Clash Bracket)",
      teamTag: currentUser?.teamTag || "ARC"
    },
    ranked: {
      solo: {
        tier: currentUser?.rank || "GRANDMASTER",
        division: "I",
        lp: currentUser?.lp || 485,
        wins: 142,
        losses: 79,
        winRate: 64,
        emblem: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/ranked-emblems/grandmaster.png"
      },
      flex: {
        tier: "CHALLENGER",
        division: "I",
        lp: 620,
        wins: 58,
        losses: 12,
        winRate: 83,
        emblem: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/ranked-emblems/challenger.png"
      }
    },
    performance: {
      kda: "4.82",
      kp: "72.4%",
      dpm: "748",
      vision: "42.5"
    },
    mastery: [
      {
        name: "Ahri",
        role: "Mid / Mage",
        points: 482900,
        level: 10,
        icon: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ahri.png"
      },
      {
        name: "LeBlanc",
        role: "Mid / Assassin",
        points: 312450,
        level: 9,
        icon: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Leblanc.png"
      },
      {
        name: "Syndra",
        role: "Mid / Burst Mage",
        points: 215800,
        level: 8,
        icon: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Syndra.png"
      }
    ],
    matches: [
      {
        queueType: "clash",
        queueLabel: "🏆 Worlds Clash Split 1",
        championName: "Ahri",
        championIcon: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ahri.png",
        result: "VICTORY",
        win: true,
        kills: 14,
        deaths: 2,
        assists: 11,
        kdaRatio: "12.50",
        items: [
          "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3089.png",
          "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3157.png",
          "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/4645.png",
          "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3020.png",
          "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3135.png",
          "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3165.png"
        ]
      },
      {
        queueType: "solo",
        queueLabel: "Ranked Solo",
        championName: "LeBlanc",
        championIcon: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Leblanc.png",
        result: "VICTORY",
        win: true,
        kills: 18,
        deaths: 4,
        assists: 8,
        kdaRatio: "6.50",
        items: [
          "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3089.png",
          "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3157.png",
          "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3020.png",
          "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/4645.png"
        ]
      },
      {
        queueType: "flex",
        queueLabel: "Ranked Flex 5v5",
        championName: "Syndra",
        championIcon: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Syndra.png",
        result: "DEFEAT",
        win: false,
        kills: 6,
        deaths: 5,
        assists: 4,
        kdaRatio: "2.00",
        items: [
          "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3020.png",
          "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3157.png"
        ]
      }
    ],
    trophies: [
      {
        icon: "🏆",
        title: "Worlds Clash Split 1",
        date: "Feb 2026"
      },
      {
        icon: "🥇",
        title: "Piltover Hextech Cup",
        date: "Jan 2026"
      },
      {
        icon: "👑",
        title: "Grandmaster Tier Cup",
        date: "Dec 2025"
      }
    ]
  };
}
