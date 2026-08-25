# Project Context: League of Legends Tournament Hub (LoLTournament-104)

## 1. Project Overview
**LoLTournament-104** is a high-performance, mobile-first web application engineered for organizing, participating in, and tracking League of Legends tournaments, clash events, team rosters, and esports drafting. It features a dynamic esports tournament feed, category filters, interactive registration, a comprehensive 168+ champion tournament draft engine, responsive simulator controls, and procedural Hextech Web Audio sound synthesis.

- **Repository**: `PerkeleFan626/LoLTournament-104`
- **Tech Stack**: HTML5, Vanilla CSS3 (Custom Hextech Design System), Vanilla JavaScript (ES6+)
- **Target Platform**: Mobile-First (Base: iPhone 15 Pro Max 430px viewport; Desktop simulator toggle up to 768px wide)
- **Data Layer**: Reactive client-side `localStorage` state management
- **Zero Dependencies**: Pure web standards with zero external frameworks or runtime dependencies

---

## 2. Comprehensive Directory & File Structure

```text
LoLTournament-104/
├── globals/                         # 🌐 UNIVERSAL TOKENS, CORE STATE & UTILITIES
│   ├── globals.css                  # Universal design tokens (fonts, colors, reset, layout shells, buttons, badges, toasts)
│   ├── globals.js                   # Central state (DEFAULT_STATE), persistence (getState/saveState), SoundEngine, showToast
│   └── GLOBALS_JS_GUIDE.md          # Step-by-step guide for hand-writing globals.js
│
├── Header/                          # 🔝 HEADER COMPONENT (Top Bar & Controls)
│   ├── Header.html                  # Top app bar & desktop simulator notch HTML snippet
│   ├── Header.css                   # Header bar, avatar frame, rank pill & controls styling
│   ├── Header.js                    # View mode toggle (430px ↔ 768px), audio toggle, user profile populator
│   └── HEADER_JS_GUIDE.md           # Step-by-step guide for hand-writing Header.js
│
├── fotter/                          # 🔻 FOOTER COMPONENT (Bottom Navigation Bar)
│   ├── fotter.html                  # Sticky bottom 5-tab navigation bar HTML snippet (<nav class="bottom-nav-bar">)
│   ├── fotter.css                   # Glassmorphic bottom navigation & glowing active line styling
│   ├── fotter.js                    # Bottom tab click listeners & active tab-view switcher
│   └── FOTTER_JS_GUIDE.md           # Step-by-step guide for hand-writing fotter.js
│
├── TournamentPage/                  # 🏆 TOURNAMENT PAGE MODULE
│   ├── TournamentPage.html          # Tournament page section markup (action bar, filter pills, card feed, create modal)
│   ├── TournamentPage.css           # Styles for tournament cards, banners, metadata grids, avatar stacks & modal sheet
│   ├── TournamentPage.js            # Tournament filter categories, dynamic card rendering, registration & cup creation
│   └── TOURNAMENT_JS_GUIDE.md       # Step-by-step guide for hand-writing TournamentPage.js
│
├── DraftPage/                       # ⚡ DRAFT TOOL MODULE
│   ├── DraftPage.html               # Draft Tool section markup (status announcer, blue/red panels, 6 role tabs, champ grid)
│   ├── DraftPage.css                # Styles for pick/ban slots, active turn glows, 6 role tabs, search bar, champion grid
│   ├── DraftPage.js                 # Complete 168+ LoL champion database, 6 tabs, live search, manual start & turn state machine
│   └── DRAFT_JS_GUIDE.md            # Step-by-step guide for hand-writing DraftPage.js
│
├── contextFiles/                    # 📖 PROJECT CONTEXT & AGENT GUIDELINES
│   ├── CONTEXT.md                   # Complete architectural, state, component, and technical specification
│   └── GEMINI.md                    # Agent guidelines, coding rules, and conventions
│
└── index.html                       # 📱 MASTER SHELL: Assembles Header, active Page body, Draft Tool, Footer, and Scripts
```

---

## 3. Component & Module Specifications

### 1. `globals/` (Universal Foundation)
- **`globals.css`**: Defines CSS root tokens, global resets, custom scrollbars, master layout containers (`.app-viewport-wrapper`, `.mobile-device-shell`, `.app-content-scroll`, `.tab-view`), shared button variants (`.btn`, `.btn-primary`, `.btn-gold`, `.btn-cyan`, `.btn-secondary`, `.btn-sm`, `.btn-block`), shared badges (`.badge`, `.badge-gold`, `.badge-cyan`, `.badge-live`), and toast notifications (`#toast-container`, `.toast-message`).
- **`globals.js`**:
  - `DEFAULT_STATE`: Master mock data containing `currentUser`, `teams`, and `tournaments`.
  - `getState()` / `saveState(state)`: LocalStorage persistence engine with key `nexus_clash_state`.
  - `SoundEngine`: Synthesizes Web Audio oscillators without external audio files:
    - `playClick()`: Crisp mechanical UI click (sine wave drop).
    - `playShimmer()` / `playSuccess()`: Hextech magic victory fanfare (ascending arpeggio).
    - `playBan()`: Deep sawtooth low-frequency lock sound.
    - `playLockIn()`: Harmonic chord progression for champion lock-in.
    - `toggleSound()` / `isMuted()`: Audio mute toggle persisted in `lol_hub_sound_muted`.
  - `showToast(message, icon)`: Floating popup notification with auto-dismissal.

### 2. `Header/` (Top Navigation Bar & Simulator Controls)
- **`Header.html` / `Header.css` / `Header.js`**:
  - Device speaker notch for desktop simulator mode.
  - User profile badge displaying summoner avatar, name, team tag pill, and rank/LP.
  - Quick action controls:
    - **Sound Toggle** (`#btn-toggle-audio`): Mutes/unmutes audio effects (`🔊` ↔ `🔇`).
    - **View Mode Toggle** (`#btn-toggle-viewmode`): Toggles `.wide-mode` on `#viewport-wrapper` between compact phone (430px) and wide view (768px).
    - **Notifications Bell** (`#btn-toggle-notifs`): Triggers status alert feedback.
  - Handled via `renderHeader(slotId)` and `setupHeader()`.

### 3. `fotter/` (Bottom Navigation Tab Bar)
- **`fotter.html` / `fotter.css` / `fotter.js`**:
  - 5 Navigation Tabs: `Tourneys` (`#view-tournaments`), `My Team` (`view-teams`), `Draft Tool` (`#view-draft`), `Recruit` (`view-scrims`), `Profile` (`view-profile`).
  - Active tab highlighted in gold with glowing cyan underline (`::after`).
  - Dynamically activates target `.tab-view` element inside `#content-container` and triggers respective render routines (`renderTournaments()`, `renderDraftView()`).
  - Handled via `renderFotter(slotId)` and `setupBottomNavigation()`.

### 4. `TournamentPage/` (Tournaments Feed & Modals)
- **`TournamentPage.html` / `TournamentPage.css` / `TournamentPage.js`**:
  - Category filter pills: `All Tourneys`, `🔴 Live & Active`, `Open Signups`, `My Team's Cups`.
  - Dynamic tournament cards with splash art banner, status badges (`🔴 LIVE STAGE`, `SIGNUPS OPEN`, `🏆 CONCLUDED`), format metadata grid, and registered team avatar badges.
  - Interactive Team Registration: Join / Leave actions updating `registeredTeams` array and saving to `localStorage`.
  - "+ Create Cup" bottom modal sheet overlay (`#modal-create-tourney`) with form submission and validation.

### 5. `DraftPage/` (Hextech Pro Draft Engine)
- **`DraftPage.html` / `DraftPage.css` / `champions.json` / Modular JS Architecture**:
  - **`champions.json`**: Modular JSON database holding the full 168+ champion roster with roles (`All`, `Top`, `Djungle`, `Mid`, `ADC`, `Support`) and DDragon image keys.
  - **`draftState.js`**: Core state store (`draftState`), 20-step sequence definitions (`DRAFT_SEQUENCE`), role slots (`ROLE_SLOTS`), JSON loader (`loadChampionsDatabase`), and availability validation.
  - **`draftTimer.js`**: 30-second turn countdown timer (`startTurnTimer`, `stopTurnTimer`), gauge DOM updater (`updateTimerUI`), and timeout auto-resolution (`handleTurnTimeout`).
  - **`draftEngine.js`**: Match session lifecycle (`startDraftSession`, `resetDraftSession`, `completeDraftSession`), pick/ban logic (`handleChampionSelect`), and auto-pick helper (`autoPickNextChampion`).
  - **`draftUI.js`**: DOM rendering engine for the header/announcer, blue/red arena pick/ban slots (`renderDraftArena`), and filtered champion grid (`renderChampionGrid`) with URL-encoded SVG fallbacks.
  - **`DraftPage.js`**: Master controller handling button delegation, role tab switching, live substring search, and DOM initialization.

### 6. `index.html` (Master Single-Page Application Shell)
- Assembles `#header-slot`, scrollable `#content-container` (holding `#view-tournaments` and `#view-draft`), `#footer-slot`, and `#toast-container`.
- Imports all stylesheets and loads modular scripts in correct dependency order (`globals.js` $\rightarrow$ `Header.js` $\rightarrow$ `fotter.js` $\rightarrow$ `TournamentPage.js` $\rightarrow$ `draftState.js` $\rightarrow$ `draftTimer.js` $\rightarrow$ `draftEngine.js` $\rightarrow$ `draftUI.js` $\rightarrow$ `DraftPage.js`).

---

## 4. State Models & Data Schemas

### 1. Global App State (`DEFAULT_STATE`)
```javascript
{
  currentUser: {
    id: "user_current",
    name: "FakerJr",
    tag: "#NA1",
    avatar: "https://ddragon.leagueoflegends.com/cdn/14.16.1/img/champion/Ahri.png",
    rank: "GRANDMASTER",
    lp: 485,
    teamId: "team_arcane_blades",
    teamTag: "ARC"
  },
  teams: [
    {
      id: "team_arcane_blades",
      name: "Arcane Blades",
      tag: "ARC",
      logo: { icon: "⚔️", bgColor: "#091428", borderColor: "#c8aa6e" }
    },
    {
      id: "team_dragon_slayers",
      name: "Dragon Slayers",
      tag: "DRG",
      logo: { icon: "🐉", bgColor: "#180a0a", borderColor: "#e84057" }
    },
    // ...
  ],
  tournaments: [
    {
      id: "tourney_worlds_clash",
      name: "Worlds Challenger Invitational Split 1",
      status: "IN_PROGRESS", // "IN_PROGRESS" | "REGISTRATION" | "COMPLETED"
      format: "single_elimination",
      maxTeams: 8,
      matchFormat: "BO3",
      minRank: "DIAMOND",
      banner: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_7.jpg",
      prizePool: "$1,500 RP + Trophy",
      region: "NA East",
      registeredTeams: ["team_arcane_blades", "team_dragon_slayers"]
    },
    // ...
  ]
}
```

### 2. Draft Engine State (`draftState`)
```javascript
{
  status: "IDLE", // "IDLE" (Lobby Ready), "IN_PROGRESS", "COMPLETED"
  currentStepIndex: 0, // 0 to 19 in DRAFT_SEQUENCE
  activeRoleFilter: "All", // "All" | "Top" | "Djungle" | "Mid" | "ADC" | "Support"
  searchQuery: "",
  blueTeam: {
    name: "Arcane Blades",
    tag: "ARC",
    bans: [null, null, null, null, null],
    picks: [null, null, null, null, null]
  },
  redTeam: {
    name: "Dragon Slayers",
    tag: "DRG",
    bans: [null, null, null, null, null],
    picks: [null, null, null, null, null]
  }
}
```

---

## 5. UI/UX Design System & Hextech Tokens

### CSS Variables
- **Surface & Backgrounds**:
  - `--bg-deep`: `#02070d`
  - `--bg-base`: `#060e18`
  - `--bg-surface`: `#0a1428`
  - `--bg-surface-elevated`: `#0f1e36`
  - `--bg-surface-light`: `#162846`
  - `--bg-glass`: `rgba(10, 20, 40, 0.92)`
- **Hextech Gold Palette**:
  - `--gold-primary`: `#c8aa6e`
  - `--gold-light`: `#f0e6d2`
  - `--gold-bright`: `#ffd875`
  - `--gold-dark`: `#785a28`
  - `--gold-border`: `rgba(200, 170, 110, 0.35)`
  - `--gold-glow`: `rgba(200, 170, 110, 0.25)`
  - `--gold-gradient`: `linear-gradient(180deg, #d8b678 0%, #a47d37 100%)`
- **Arcane Magic & Faction Colors**:
  - `--magic-cyan`: `#0ac8b9`
  - `--magic-cyan-light`: `#4df4e6`
  - `--blue-side`: `#1f8ecd`
  - `--red-side`: `#e84057`
- **Typography**:
  - Headings / Brand: `--font-title`: `'Cinzel', serif`
  - UI / Controls / Body: `--font-ui`: `'Outfit', -apple-system, sans-serif`

---

## 6. Step-by-Step Hand-Coding Guides Reference

All modules include a step-by-step hand-building guide for development and review:
1. **Globals Guide**: [`globals/GLOBALS_JS_GUIDE.md`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/globals/GLOBALS_JS_GUIDE.md) — Covers `DEFAULT_STATE`, persistence, `SoundEngine`, and `showToast`.
2. **Header Guide**: [`Header/HEADER_JS_GUIDE.md`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/Header/HEADER_JS_GUIDE.md) — Covers header templates, slot injection, simulator toggle, audio mute, and profile binding.
3. **Footer Guide**: [`fotter/FOTTER_JS_GUIDE.md`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/fotter/FOTTER_JS_GUIDE.md) — Covers navigation templates, slot injection, tab click handlers, and `.tab-view` active switching.
4. **Tournament Page Guide**: [`TournamentPage/TOURNAMENT_JS_GUIDE.md`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/TournamentPage/TOURNAMENT_JS_GUIDE.md) — Covers filter pill state, dynamic card rendering, modal form handling, and team registration.
5. **Draft Page Guide**: [`DraftPage/DRAFT_JS_GUIDE.md`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/DraftPage/DRAFT_JS_GUIDE.md) — Covers champion database, 6 role tabs, live search, manual start button, and 20-step tournament ban/pick state machine.

---

## 7. Architecture & Coding Rules

1. **Strict Separation of Concerns**: Keep component HTML, CSS, and JS strictly in their dedicated directory. Never place page-specific styles or logic in `globals/` or `index.html`.
2. **Safe Function Invocations**: Guard calls to global utilities (`typeof soundEngine !== 'undefined'`, `typeof showToast === 'function'`, `typeof getState === 'function'`).
3. **Reactive LocalStorage**: Any action modifying state (e.g. creating cups, joining/leaving tournaments) must save to `localStorage` via `saveState()` and immediately re-render affected components.
4. **Web Standards & Performance**: No external libraries (React, Vue, jQuery, etc.) or external audio file downloads. Keep the footprint minimal, blazing fast, and mobile optimized.
