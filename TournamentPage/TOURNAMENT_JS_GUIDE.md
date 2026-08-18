# 🏆 Hand-Building `TournamentPage/TournamentPage.js`: Step-by-Step Guide
**Target File to Write**: [`TournamentPage/TournamentPage.js`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/TournamentPage/TournamentPage.js)  
**Dependencies**: Uses `getState()`, `saveState()`, `soundEngine`, `showToast()`, `renderHeader()`, and `renderFotter()`.

---

## 🎯 Overview of What You Will Build

`TournamentPage.js` is dedicated **strictly to tournament operations**:
1. **`currentFilter` State**: Tracks the active category (`all`, `live`, `registration`, `my`).
2. **`setupFilterPills()`**: Handles switching between category filter pills.
3. **`renderTournaments()`**: Generates dynamic tournament cards with banners, metadata, registered team avatars, and interactive buttons.
4. **`setupTournamentModals()`**: Handles opening, closing, and submitting the "+ Create Cup" modal sheet.
5. **Page Initialization**: Automatically boots on `DOMContentLoaded`.

---

## 🪜 Step 1: Track Active Filter State

### Why We Use It
We need a runtime variable to remember which category the user selected so `renderTournaments()` knows which items to display.

### Code to Write:
```javascript
// Step 1: Active Filter State Variable
let currentFilter = 'all';
```

---

## 🪜 Step 2: Master Page Initialization (`DOMContentLoaded`)

### Why We Use It
Ensures the browser has finished constructing the DOM tree before we query elements or render cards.

### Code to Write:
```javascript
// Step 2: Master Page Initialization
document.addEventListener('DOMContentLoaded', () => {
  // 1. Mount Header into #header-slot
  if (typeof renderHeader === 'function') {
    renderHeader('header-slot');
  }

  // 2. Mount Footer into #footer-slot
  if (typeof renderFotter === 'function') {
    renderFotter('footer-slot');
  }

  // 3. Initialize Tournament features
  setupFilterPills();
  setupTournamentModals();
  renderTournaments();
});
```

### 🔍 Line-by-Line Explanation:
1. `document.addEventListener('DOMContentLoaded', ...)`: Triggers when the HTML page is ready in memory.
2. `renderHeader('header-slot')`: Injects the top header component from `Header/Header.js`.
3. `renderFotter('footer-slot')`: Injects the footer navigation bar from `fotter/fotter.js`.
4. Calls our tournament setup functions.

---

## 🪜 Step 3: Filter Pills System (`setupFilterPills`)

### Why We Use It
Lets players filter the feed by `All Tourneys`, `🔴 Live & Active`, `Open Signups`, or `My Team's Cups`.

### Code to Write:
```javascript
// Step 3: Filter Pills Setup
function setupFilterPills() {
  const filterRow = document.getElementById('tourney-filter-row');
  if (!filterRow) return;

  filterRow.querySelectorAll('.filter-pill').forEach(pill => {
    pill.onclick = () => {
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();

      // Clear active class from all pills
      filterRow.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      // Update active filter and re-render tournament list
      currentFilter = pill.dataset.tourneyFilter;
      renderTournaments();
    };
  });
}
```

### 🔍 Line-by-Line Explanation:
1. `const filterRow = document.getElementById('tourney-filter-row');`: Finds the horizontal filter bar.
2. `filterRow.querySelectorAll('.filter-pill').forEach(...)`: Iterates over every filter pill button.
3. `filterRow.querySelectorAll(...).forEach(p => p.classList.remove('active'))`: Clears active styling from other pills.
4. `pill.classList.add('active')`: Highlights the tapped pill in gold.
5. `currentFilter = pill.dataset.tourneyFilter`: Reads the `data-tourney-filter` HTML attribute (`all`, `live`, `registration`, `my`).
6. `renderTournaments()`: Redraws the tournament list matching the newly selected filter.

---

## 🪜 Step 4: Dynamic Tournament Card Renderer (`renderTournaments`)

### Why We Use It
This is the heart of the tournament page. It reads data from state, filters it, formats dynamic HTML template strings, attaches button click handlers, and renders everything into `#tournament-list-container`.

### Code to Write:
```javascript
// Step 4: Tournament Cards Feed Renderer
function renderTournaments() {
  const container = document.getElementById('tournament-list-container');
  if (!container) return;

  const state = (typeof getState === 'function') ? getState() : { currentUser: {}, teams: [], tournaments: [] };
  const user = state.currentUser || {};
  const allTourneys = state.tournaments || [];

  // 1. Filter the tournaments array
  let filtered = allTourneys;
  if (currentFilter === 'live') {
    filtered = allTourneys.filter(t => t.status === 'IN_PROGRESS');
  } else if (currentFilter === 'registration') {
    filtered = allTourneys.filter(t => t.status === 'REGISTRATION');
  } else if (currentFilter === 'my') {
    filtered = allTourneys.filter(t => user.teamId && t.registeredTeams && t.registeredTeams.includes(user.teamId));
  }

  // 2. Empty State View
  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 42px 16px; color: var(--text-muted);">
        <div style="font-size: 36px; margin-bottom: 8px;">🛡️</div>
        <h3 style="color: var(--gold-light); font-size: 15px; font-weight:700;">No Tournaments Found</h3>
        <p style="font-size: 12px; margin-top: 4px;">No tournaments match this filter category.</p>
      </div>
    `;
    return;
  }

  // 3. Build HTML Cards
  let html = '';
  filtered.forEach(tourney => {
    const isRegistered = user.teamId && tourney.registeredTeams && tourney.registeredTeams.includes(user.teamId);
    const isLive = tourney.status === 'IN_PROGRESS';
    const isDone = tourney.status === 'COMPLETED';

    // Retrieve registered team objects for avatar badges
    const registeredTeamsData = (tourney.registeredTeams || []).map(teamId => {
      return state.teams.find(t => t.id === teamId);
    }).filter(Boolean);

    html += `
      <div class="tourney-card" data-tourney-id="${tourney.id}">
        <div class="tourney-banner-container">
          <img src="${tourney.banner}" alt="${tourney.name}" class="tourney-banner-img" onerror="this.src='https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_7.jpg'">
          <div class="tourney-banner-overlay">
            <div class="tourney-badges-top">
              <span class="tourney-prize-badge">💎 ${tourney.prizePool}</span>
              <span class="badge ${isLive ? 'badge-live' : isDone ? 'badge-gold' : 'badge-cyan'}">
                ${isLive ? '🔴 LIVE STAGE' : isDone ? '🏆 CONCLUDED' : 'SIGNUPS OPEN'}
              </span>
            </div>
            <h3 class="tourney-title">${tourney.name}</h3>
          </div>
        </div>

        <div class="tourney-card-body">
          <div class="tourney-meta-grid">
            <div class="tourney-meta-item">
              <span class="meta-lbl">Format</span>
              <span class="meta-val">${tourney.matchFormat || 'BO3'} ${tourney.format === 'single_elimination' ? 'Bracket' : 'Cup'}</span>
            </div>
            <div class="tourney-meta-item">
              <span class="meta-lbl">Min Rank</span>
              <span class="meta-val">${tourney.minRank || 'Any'}</span>
            </div>
            <div class="tourney-meta-item">
              <span class="meta-lbl">Region</span>
              <span class="meta-val">${tourney.region || 'NA'}</span>
            </div>
          </div>

          <div class="tourney-registered-bar">
            <span style="color:var(--text-muted);">
              Teams: <strong>${(tourney.registeredTeams || []).length} / ${tourney.maxTeams || 8}</strong>
            </span>
            <div class="registered-avatars">
              ${registeredTeamsData.slice(0, 5).map(t => `
                <div class="team-avatar-mini" title="${t.name}" style="background:${t.logo?.bgColor || '#091428'}; border-color:${t.logo?.borderColor || '#c8aa6e'};">
                  ${t.logo?.icon || '🛡️'}
                </div>
              `).join('')}
              ${registeredTeamsData.length > 5 ? `<div class="team-avatar-mini">+${registeredTeamsData.length - 5}</div>` : ''}
            </div>
          </div>

          <div style="display:flex; gap:8px;">
            <button class="btn btn-primary btn-sm btn-open-tourney" data-tourney-id="${tourney.id}" style="flex:2;">
              <span>${isLive ? '⚔️ Enter Live Bracket' : '🏆 View Tournament'}</span>
            </button>
            ${!isRegistered && tourney.status === 'REGISTRATION' ? `
              <button class="btn btn-gold btn-sm btn-register-tourney" data-tourney-id="${tourney.id}" style="flex:1;">
                <span>+ Join</span>
              </button>
            ` : isRegistered ? `
              <button class="btn btn-secondary btn-sm" style="flex:1; border-color:var(--magic-cyan); color:var(--magic-cyan);" disabled>
                <span>✓ Joined</span>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // 4. Attach Click Handlers to Newly Created Buttons
  container.querySelectorAll('.btn-open-tourney').forEach(btn => {
    btn.onclick = () => {
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();
      const tourneyId = btn.dataset.tourneyId;
      const tourney = state.tournaments.find(t => t.id === tourneyId);
      if (typeof showToast === 'function') {
        showToast(`Opening: ${tourney ? tourney.name : 'Tournament Bracket'}`, '🏆');
      }
    };
  });

  container.querySelectorAll('.btn-register-tourney').forEach(btn => {
    btn.onclick = () => {
      if (typeof soundEngine !== 'undefined') soundEngine.playShimmer();
      const tourneyId = btn.dataset.tourneyId;
      const currentState = getState();
      const targetTourney = currentState.tournaments.find(t => t.id === tourneyId);

      if (targetTourney && !targetTourney.registeredTeams.includes(currentState.currentUser.teamId)) {
        targetTourney.registeredTeams.push(currentState.currentUser.teamId);
        saveState(currentState);
        if (typeof showToast === 'function') {
          showToast(`Registered team for ${targetTourney.name}!`, '🎉');
        }
        renderTournaments(); // Re-renders so the button switches to "✓ Joined"
      }
    };
  });
}
```

### 🔍 Line-by-Line Explanation:
1. `const state = getState()`: Fetches live data from storage.
2. `allTourneys.filter(...)`: Filters tournaments matching the active category.
3. `registeredTeamsData`: Looks up the logo icon and color of each registered team to display them in an overlapping circle badge stack.
4. `container.innerHTML = html`: Renders all cards in one single fast DOM update.
5. `.btn-register-tourney`: Pushes the user's `teamId` into `registeredTeams`, saves with `saveState()`, and re-renders the cards so the button instantly changes to `✓ Joined`.

---

## 🪜 Step 5: Tournament Creation Modal Sheet (`setupTournamentModals`)

### Why We Use It
Opens and closes the "+ Create Cup" modal sheet, validates form input, creates a new tournament object, prepends it with `.unshift()`, and updates storage.

### Code to Write:
```javascript
// Step 5: Create Tournament Modal Form Handlers
function setupTournamentModals() {
  const openCreateBtn = document.getElementById('btn-open-create-tourney');
  const modal = document.getElementById('modal-create-tourney');
  const form = document.getElementById('form-create-tourney');

  if (openCreateBtn && modal) {
    openCreateBtn.onclick = () => {
      if (typeof soundEngine !== 'undefined') soundEngine.playShimmer();
      modal.classList.add('active');
    };
  }

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.onclick = () => {
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();
      const modalId = btn.dataset.closeModal;
      document.getElementById(modalId)?.classList.remove('active');
    };
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        if (typeof soundEngine !== 'undefined') soundEngine.playClick();
        overlay.classList.remove('active');
      }
    };
  });

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault(); // Prevent browser reload
      const nameInput = document.getElementById('tourney-name-input');
      const formatSelect = document.getElementById('tourney-format-select');
      const teamsSelect = document.getElementById('tourney-teams-select');
      const matchSelect = document.getElementById('tourney-match-select');
      const rankSelect = document.getElementById('tourney-rank-select');
      const prizeInput = document.getElementById('tourney-prize-input');

      if (!nameInput.value.trim()) return;

      const currentState = (typeof getState === 'function') ? getState() : DEFAULT_STATE;
      const newTourney = {
        id: 'tourney_' + Date.now(),
        name: nameInput.value.trim(),
        status: 'REGISTRATION',
        format: formatSelect.value,
        maxTeams: parseInt(teamsSelect.value, 10),
        matchFormat: matchSelect.value,
        minRank: rankSelect.value,
        banner: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_7.jpg',
        prizePool: prizeInput.value.trim() || '$1,000 RP',
        region: 'NA',
        registeredTeams: [currentState.currentUser.teamId]
      };

      // Add to top of list and save
      currentState.tournaments.unshift(newTourney);
      if (typeof saveState === 'function') saveState(currentState);

      modal.classList.remove('active');
      form.reset();

      if (typeof soundEngine !== 'undefined') soundEngine.playShimmer();
      if (typeof showToast === 'function') {
        showToast(`Tournament "${newTourney.name}" created!`, '🏆');
      }
      renderTournaments();
    };
  }
}
```

### 🔍 Line-by-Line Explanation:
1. `modal.classList.add('active')`: Slides up the bottom sheet modal.
2. `e.preventDefault()`: Prevents default HTML form submission from refreshing the browser.
3. `id: 'tourney_' + Date.now()`: Uses the current timestamp to guarantee a unique ID.
4. `currentState.tournaments.unshift(newTourney)`: Inserts the new tournament at the **beginning** of the array so it appears at the top of the feed.
5. `saveState(currentState)`: Persists the new tournament in `localStorage`.
6. `renderTournaments()`: Immediately renders the new tournament card in the list.
