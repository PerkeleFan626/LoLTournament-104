# 🌐 Hand-Building `globals/globals.js`: Step-by-Step Guide
**Target File to Write**: [`globals/globals.js`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/globals/globals.js)  
**Purpose**: Central data store, persistent browser storage, Web Audio sound synthesizer, and shared toast notifications.

---

## 🎯 Overview of What You Will Build

`globals.js` provides the foundational utilities shared across every page:
1. **`DEFAULT_STATE`**: The master mock data (current user, teams, tournaments).
2. **`getState()` & `saveState()`**: LocalStorage persistence so data remains saved across browser refreshes.
3. **`SoundEngine` Class**: Generates Hextech sound effects dynamically in code without needing external `.mp3` files.
4. **`showToast()`**: A floating popup notification utility.

---

## 🪜 Step 1: Define the `DEFAULT_STATE` Data Structure

### Why We Use It
When a user opens the app for the very first time, `localStorage` is empty. Having a structured `DEFAULT_STATE` ensures the application immediately has realistic data (user profile, teams, tournaments) to display.

### Code to Write:
```javascript
// Step 1: Initial Mock State
const DEFAULT_STATE = {
  currentUser: {
    id: 'user_current',
    name: 'FakerJr',
    tag: '#NA1',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.16.1/img/champion/Ahri.png',
    rank: 'GRANDMASTER',
    lp: 485,
    teamId: 'team_arcane_blades',
    teamTag: 'ARC'
  },
  teams: [
    {
      id: 'team_arcane_blades',
      name: 'Arcane Blades',
      tag: 'ARC',
      logo: { icon: '⚔️', bgColor: '#091428', borderColor: '#c8aa6e' }
    },
    {
      id: 'team_dragon_slayers',
      name: 'Dragon Slayers',
      tag: 'DRG',
      logo: { icon: '🐉', bgColor: '#180a0a', borderColor: '#e84057' }
    },
    {
      id: 'team_piltover_enforcers',
      name: 'Piltover Enforcers',
      tag: 'PLT',
      logo: { icon: '⚡', bgColor: '#0a1e28', borderColor: '#0ac8b9' }
    },
    {
      id: 'team_shadow_order',
      name: 'Shadow Order',
      tag: 'SHD',
      logo: { icon: '🌑', bgColor: '#0a0d18', borderColor: '#8a50b8' }
    },
    {
      id: 'team_frostguard',
      name: 'Frostguard Tribe',
      tag: 'ICE',
      logo: { icon: '❄️', bgColor: '#0b162a', borderColor: '#4df4e6' }
    }
  ],
  tournaments: [
    {
      id: 'tourney_worlds_clash',
      name: 'Worlds Challenger Invitational Split 1',
      status: 'IN_PROGRESS', // Options: 'IN_PROGRESS', 'REGISTRATION', 'COMPLETED'
      format: 'single_elimination',
      maxTeams: 8,
      matchFormat: 'BO3',
      minRank: 'DIAMOND',
      banner: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_7.jpg',
      prizePool: '$1,500 RP + Trophy',
      region: 'NA East',
      registeredTeams: ['team_arcane_blades', 'team_dragon_slayers', 'team_piltover_enforcers', 'team_shadow_order', 'team_frostguard']
    },
    {
      id: 'tourney_hextech_open',
      name: 'Piltover Hextech Premier Cup',
      status: 'REGISTRATION',
      format: 'single_elimination',
      maxTeams: 8,
      matchFormat: 'BO1',
      minRank: 'PLATINUM',
      banner: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jayce_0.jpg',
      prizePool: '$800 RP',
      region: 'NA',
      registeredTeams: ['team_dragon_slayers', 'team_piltover_enforcers']
    },
    {
      id: 'tourney_noxus_arena',
      name: 'Noxian Gladiator Grand Cup',
      status: 'COMPLETED',
      format: 'single_elimination',
      maxTeams: 4,
      matchFormat: 'BO5',
      minRank: 'MASTER',
      banner: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Darius_0.jpg',
      prizePool: '$2,000 RP',
      region: 'NA',
      registeredTeams: ['team_arcane_blades', 'team_dragon_slayers', 'team_shadow_order']
    }
  ]
};
```

### 🔍 Line-by-Line Explanation:
- `const DEFAULT_STATE = { ... };`: Defines a constant object holding three core keys: `currentUser`, `teams`, and `tournaments`.
- `currentUser`: Represents the logged-in player, including summoner name, rank tier, LP, and team affiliation (`teamId`).
- `teams`: An array of team objects with unique IDs, names, tags, and logo emblem styling.
- `tournaments`: An array of tournament objects containing `status` (`IN_PROGRESS`, `REGISTRATION`, `COMPLETED`), `registeredTeams` array, format, and prize pool.

---

## 🪜 Step 2: LocalStorage State Helpers (`getState` & `saveState`)

### Why We Use It
Browsers only store plain text in `localStorage`. We use `JSON.stringify()` to convert JavaScript objects into text, and `JSON.parse()` to convert stored text back into live JavaScript objects.

### Code to Write:
```javascript
// Step 2: Persistence Helpers
const STORAGE_KEY = 'nexus_clash_state';

function getState() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
    return DEFAULT_STATE;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse state from localStorage, falling back to default:', e);
    return DEFAULT_STATE;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
```

### 🔍 Line-by-Line Explanation:
1. `const STORAGE_KEY = 'nexus_clash_state';`: Constant key name used to identify our data in the browser's storage table.
2. `function getState() {`: Reads current state from `localStorage`.
3. `const data = localStorage.getItem(STORAGE_KEY);`: Requests stored string data.
4. `if (!data) { ... }`: If `data` is `null` (first visit), initializes `localStorage` with `DEFAULT_STATE` and returns it.
5. `try { return JSON.parse(data); } catch (e) { ... }`: Safely parses the JSON string. If corrupted, falls back to `DEFAULT_STATE` rather than crashing.
6. `function saveState(state) { localStorage.setItem(...) }`: Takes a JavaScript object, stringifies it, and saves it to storage.

---

## 🪜 Step 3: Web Audio API Synthesizer (`SoundEngine`)

### Why We Use It
External sound files (`.mp3` / `.wav`) can fail to load or add network lag. With the browser's native **Web Audio API**, we generate pure sound waves directly through code oscillators.

### Code to Write:
```javascript
// Step 3: Web Audio Synthesizer Class
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playClick() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playShimmer() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime + (i * 0.04);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    });
  }
}

// Global instance available across all modules
const soundEngine = new SoundEngine();
```

### 🔍 Line-by-Line Explanation:
1. `class SoundEngine`: Defines our synthesizer class.
2. `ensureContext()`: Browsers require user interaction before playing audio. This initializes or resumes the `AudioContext` on the first user tap.
3. `toggleSound()`: Inverts `this.enabled` (`true` $\leftrightarrow$ `false`) to mute/unmute audio.
4. `playClick()`:
   - `this.ctx.createOscillator()` creates a sound wave generator.
   - `osc.frequency.setValueAtTime(750, now)` and `exponentialRampToValueAtTime(320, now + 0.05)` drops pitch from 750Hz to 320Hz in 50ms, producing a crisp mechanical button click.
   - `gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)` fades out volume to prevent audio popping.
5. `playShimmer()`: Plays 4 ascending musical frequencies staggered by 40ms (`i * 0.04`) to create a magical Hextech crystal sound.

---

## 🪜 Step 4: Shared Toast Notification Utility (`showToast`)

### Why We Use It
Provides a clean, universal way to notify the user whenever an action occurs (e.g. "Tournament Created", "Joined Team", "Audio Muted").

### Code to Write:
```javascript
// Step 4: Toast Feedback Notification
function showToast(message, icon = '✨') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  // Auto fade-out and remove after 2.6 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}
```

### 🔍 Line-by-Line Explanation:
1. `function showToast(message, icon = '✨')`: Function with a default icon parameter.
2. `const container = document.getElementById('toast-container');`: Finds the toast container on the page.
3. `if (!container) return;`: Guard check preventing errors if the container is missing.
4. `const toast = document.createElement('div');`: Dynamically builds a new `<div>` element in memory.
5. `toast.className = 'toast-message';`: Assigns the Hextech styled card CSS class.
6. `container.appendChild(toast);`: Injects the toast into the visible screen.
7. `setTimeout(..., 2600)`: Waits 2.6 seconds, starts fading out the toast, and then removes it with `toast.remove()` after 300ms.
