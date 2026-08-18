# 🔝 Hand-Building `Header/Header.js`: Step-by-Step Guide
**Target File to Write**: [`Header/Header.js`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/Header/Header.js)  
**Dependencies**: Uses `getState()`, `soundEngine`, and `showToast()` from [`globals/globals.js`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/globals/globals.js).

---

## 🎯 Overview of What You Will Build

`Header.js` controls everything inside the top application bar:
1. **`HEADER_HTML_TEMPLATE`**: The reusable HTML string for the header bar.
2. **`renderHeader(slotId)`**: Injects the header HTML into `#header-slot`.
3. **`setupViewModeToggle()`**: Toggles between **Slim Phone Mode (430px)** and **Wide View (768px)**.
4. **`setupAudioToggle()`**: Toggles Hextech audio effects (🔊 $\leftrightarrow$ 🔇).
5. **`setupNotificationsButton()`**: Handles notification bell clicks.
6. **`renderHeaderUserProfile()`**: Dynamically updates summoner avatar, name, team tag, and rank in the top bar.

---

## 🪜 Step 1: Define the `HEADER_HTML_TEMPLATE` Constant

### Why We Use It
Storing the HTML markup as a template string allows `Header.js` to automatically mount the top bar into any page container (`#header-slot`) without duplicating markup across HTML files.

### Code to Write:
```javascript
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
        <img src="https://ddragon.leagueoflegends.com/cdn/14.16.1/img/champion/Ahri.png" alt="User Avatar" class="top-avatar-img" id="top-bar-avatar" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\' fill=\\'%23091428\\'><rect width=\\'40\\' height=\\'40\\'/><text x=\\'50%\\' y=\\'55%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%23c8aa6e\\' font-size=\\'16\\'>👑</text></svg>'">
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
```

---

## 🪜 Step 2: Component Slot Injector & Setup Function

### Why We Use It
Checks if the slot exists, mounts the HTML markup into the DOM if it's empty, and then initializes the interactive button listeners.

### Code to Write:
```javascript
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
  renderHeaderUserProfile();
}
```

### 🔍 Line-by-Line Explanation:
1. `const slot = document.getElementById(slotId);`: Finds the placeholder `<div id="header-slot">`.
2. `if (slot && !slot.innerHTML.trim())`: Ensures we only inject the HTML if the slot is currently empty, avoiding duplicate headers.
3. `slot.innerHTML = HEADER_HTML_TEMPLATE;`: Mounts the HTML elements into the visible page.
4. `setupHeader();`: Calls each individual event handler setup function.

---

## 🪜 Step 3: Device Viewport Mode Toggle (`setupViewModeToggle`)

### Why We Use It
Allows switching between a compact mobile phone layout (**430px**) and a wide preview layout (**768px**) on desktop monitors.

### Code to Write:
```javascript
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
```

### 🔍 Line-by-Line Explanation:
1. `document.getElementById('btn-toggle-viewmode')`: Finds the 📱 button.
2. `document.getElementById('viewport-wrapper')`: Finds the outer container wrapper.
3. `viewportWrapper.classList.toggle('wide-mode')`: Toggles `.wide-mode` CSS class which sets `max-width: 768px`.
4. `showToast(...)`: Shows a floating confirmation message.

---

## 🪜 Step 4: Audio Toggle Control (`setupAudioToggle`)

### Why We Use It
Gives the user full control to mute or enable UI sound effects.

### Code to Write:
```javascript
// Step 4: Hextech Audio Toggle
function setupAudioToggle() {
  const audioBtn = document.getElementById('btn-toggle-audio');
  const audioIcon = document.getElementById('audio-icon');

  if (audioBtn && typeof soundEngine !== 'undefined') {
    audioBtn.onclick = () => {
      const enabled = soundEngine.toggleSound();
      if (audioIcon) audioIcon.innerText = enabled ? '🔊' : '🔇';
      if (typeof showToast === 'function') {
        showToast(enabled ? 'Hextech Audio Enabled' : 'Audio Muted', enabled ? '🔊' : '🔇');
      }
    };
  }
}
```

### 🔍 Line-by-Line Explanation:
1. `soundEngine.toggleSound()`: Flips audio state in our sound synthesizer.
2. `audioIcon.innerText = enabled ? '🔊' : '🔇'`: Updates the button icon dynamically.

---

## 🪜 Step 5: Notifications Bell Button (`setupNotificationsButton`)

### Why We Use It
Provides feedback when checking tournament alerts or notifications.

### Code to Write:
```javascript
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
```

---

## 🪜 Step 6: User Profile Header Populator (`renderHeaderUserProfile`)

### Why We Use It
Reads the current user's profile from state (name, avatar, LP, team tag) and injects it into the top header badge so it's always up to date.

### Code to Write:
```javascript
// Step 6: Populate Top User Profile from State
function renderHeaderUserProfile() {
  if (typeof getState !== 'function') return;

  const state = getState();
  const user = state.currentUser;
  if (!user) return;

  const userTeam = state.teams.find(t => t.id === user.teamId);

  const topAvatar = document.getElementById('top-bar-avatar');
  const topName = document.getElementById('top-bar-name');
  const topRankLabel = document.getElementById('top-rank-label');

  if (topAvatar && user.avatar) topAvatar.src = user.avatar;
  if (topName) {
    topName.innerHTML = `${user.name} <span class="badge badge-gold" id="top-bar-team-tag">${userTeam ? userTeam.tag : 'FA'}</span>`;
  }
  if (topRankLabel) {
    topRankLabel.innerText = `${user.rank} ${user.lp} LP`;
  }
}
```

### 🔍 Line-by-Line Explanation:
1. `const state = getState();`: Loads data from `localStorage`.
2. `const userTeam = state.teams.find(...)`: Finds the user's team object to display their 3-letter team tag (e.g. `ARC`).
3. Updates the avatar `src`, summoner name `innerHTML`, and rank label text directly.
