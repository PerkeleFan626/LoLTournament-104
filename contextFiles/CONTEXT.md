# Project Context: League of Legends Tournament Hub (LoLTournament-104)

## 1. Project Overview
**LoLTournament-104** is a mobile-first web application designed for organizing, participating in, and tracking League of Legends tournaments and team clashes. It features an esports tournament hub, interactive brackets, team creation, live match feeds, and Hextech sound synthesis.

- **Repository**: `PerkeleFan626/LoLTournament-104`
- **Tech Stack**: HTML5, Vanilla CSS3 (Custom Hextech Design System), Vanilla JavaScript (ES6+)
- **Target Platform**: Mobile-First (iPhone 15 Pro Max 430px base, with tablet/wide preview mode up to 768px)
- **Data Layer**: Centralized `localStorage` reactive state management

---

## 2. Strict Modular Folder Architecture
The project strictly enforces complete separation of concerns into dedicated component folders:

```text
LoLTournament-104/
├── globals/                     # 🌐 UNIVERSAL VALUES & CORE UTILITIES ONLY
│   ├── globals.css              # Universal design tokens (fonts, colors, reset, shared button/badge primitives)
│   ├── globals.js               # Central state store (DEFAULT_STATE), persistence (getState/saveState), SoundEngine, showToast
│   └── GLOBALS_JS_GUIDE.md      # Step-by-step guide for hand-writing globals.js
│
├── Header/                      # 🔝 HEADER COMPONENT ONLY
│   ├── Header.html              # Top app bar & desktop simulator notch HTML
│   ├── Header.css               # Header bar, avatar frame, rank pill & controls styling
│   ├── Header.js                # View mode toggle (slim/wide), audio toggle & user profile populator
│   └── HEADER_JS_GUIDE.md       # Step-by-step guide for hand-writing Header.js
│
├── fotter/                      # 🔻 FOOTER COMPONENT ONLY
│   ├── fotter.html              # Sticky bottom 5-tab navigation bar HTML (<nav class="bottom-nav-bar">)
│   ├── fotter.css               # Glassmorphic bottom navigation & glowing active line styling
│   ├── fotter.js                # Bottom tab click listeners & active state management
│   └── FOTTER_JS_GUIDE.md       # Step-by-step guide for hand-writing fotter.js
│
├── TournamentPage/              # 🏆 TOURNAMENT PAGE MODULE ONLY
│   ├── TournamentPage.html      # ONLY contains the Tournament page body (feeds, filters & create cup modal)
│   ├── TournamentPage.css       # ONLY styles impacting tournament cards, banners, meta-grids & modal sheet
│   ├── TournamentPage.js        # ONLY logic impacting tournament filtering, card rendering & registration
│   └── TOURNAMENT_JS_GUIDE.md   # Step-by-step guide for hand-writing TournamentPage.js
│
├── contextFiles/                # 📖 PROJECT CONTEXT & RULES
│   ├── CONTEXT.md               # Architecture, specification and technical reference
│   └── GEMINI.md                # Agent guidelines, coding conventions, and rules
│
└── index.html                   # 📱 MASTER SHELL: Assembles Header, active Page body, and Footer
```

---

## 3. Component & Folder Rules

1. **`globals/`**:
   - `globals.css`: Contains **only** shared tokens (Google Fonts `Cinzel` & `Outfit`, Hextech colors, CSS resets, and reusable utility classes).
   - `globals.js`: Contains **only** shared state (`DEFAULT_STATE`), persistence functions (`getState()`, `saveState()`), the Web Audio `SoundEngine` class, and `showToast()`.
2. **`Header/`**:
   - `Header.html`: Contains **only** the top application bar and desktop phone notch markup.
   - `Header.css`: Contains **only** styles affecting the header, controls, profile badge, and simulator notch.
   - `Header.js`: Contains **only** logic for the view mode simulator toggle (430px $\leftrightarrow$ 768px), audio toggle, notification bell, and user profile populator.
3. **`fotter/`**:
   - `fotter.html`: Contains **only** the bottom navigation markup with 5 navigation tabs (`Tourneys`, `My Team`, `Draft Tool`, `Recruit`, `Profile`).
   - `fotter.css`: Contains **only** styles affecting the sticky bottom bar, active states, and glowing cyan indicator.
   - `fotter.js`: Contains **only** logic for bottom navigation tab switching and feedback.
4. **`TournamentPage/`**:
   - `TournamentPage.html`: Contains **only** the tournament section markup (`#view-tournaments`), action header, filter pills, dynamic card feed container, and modal sheet.
   - `TournamentPage.css`: Contains **only** styles for tournament cards, banners, metadata grids, avatar stacks, and modal form inputs.
   - `TournamentPage.js`: Contains **only** tournament logic (filter category handling, dynamic card rendering, team join logic, and tournament creation form submission).
5. **`index.html`**:
   - Master layout shell assembling the Header, Tournament Page, and Footer modules.

---

## 4. UI/UX Design System & Hextech Tokens

### Colors
- **Void Deep Background**: `--bg-deep` (`#02070d`), `--bg-base` (`#060e18`)
- **Surface / Cards**: `--bg-surface` (`#0a1428`), `--bg-surface-elevated` (`#0f1e36`)
- **Hextech Gold**: `--gold-primary` (`#c8aa6e`), `--gold-light` (`#f0e6d2`), `--gold-bright` (`#ffd875`), `--gold-dark` (`#785a28`)
- **Arcane Cyan**: `--magic-cyan` (`#0ac8b9`), `--magic-cyan-light` (`#4df4e6`)
- **Team Sides**: Blue Side (`#1f8ecd`), Red Side / Noxus Crimson (`#e84057`)

### Typography
- **Headings & Titles**: `Cinzel`, serif
- **Body & UI Controls**: `Outfit`, sans-serif

---

## 5. Development Conventions & Hand-Coding Workflows
- All `.js` files are hand-coded using the step-by-step guides located in each respective directory:
  - [`globals/GLOBALS_JS_GUIDE.md`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/globals/GLOBALS_JS_GUIDE.md)
  - [`Header/HEADER_JS_GUIDE.md`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/Header/HEADER_JS_GUIDE.md)
  - [`fotter/FOTTER_JS_GUIDE.md`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/fotter/FOTTER_JS_GUIDE.md)
  - [`TournamentPage/TOURNAMENT_JS_GUIDE.md`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/TournamentPage/TOURNAMENT_JS_GUIDE.md)
- Vanilla web standards only: zero heavy frameworks, fast load times, and clean modular code.
