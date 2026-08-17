# Project Context: League of Legends Tournament 104 (LoLTournament-104)

## 1. Project Overview
**LoLTournament-104** is a web-based tournament management and spectator platform designed for organizing, tracking, and viewing League of Legends competitive events. It provides players, organizers, and fans with interactive brackets, team rosters, live match tracking, and tournament standings.

- **Repository**: `PerkeleFan626/LoLTournament-104`
- **Primary Tech Stack**: HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+)
- **Target Platform**: Responsive Web (Desktop, Tablet, Mobile)
- **Data Layer**: LocalStorage / Modular JSON Mock Data (client-side state management)

---

## 2. Goals & Objectives
1. **Seamless Tournament Management**: Allow tournament organizers to generate brackets, seed teams, update match scores, and track tournament progression.
2. **Engaging Spectator Hub**: Provide fans and participants with clear schedules, team statistics, player profiles, and match outcomes.
3. **Premium Hextech Aesthetics**: Deliver an immersive, clean UI inspired by modern esports platforms and League of Legends design language without visual clutter.
4. **Lightweight & Fast**: Built with pure vanilla technologies for optimal performance, zero heavy dependencies, and clean maintainability.

---

## 3. Key Feature Specifications

### A. Tournament Bracket & Schedule
- **Interactive Bracket**: Single elimination / double elimination bracket visualization.
- **Match Schedule**: Chronological list of upcoming, live, and completed matches with filters by stage/team.
- **Match Detail Modal / View**:
  - Blue vs. Red side teams
  - Game scores (Best of 1, 3, or 5)
  - Champion picks & bans
  - Match MVPs and key stats (KDA, gold difference, objectives)

### B. Team & Player Rosters
- **Team Profiles**: Team name, logo/tag, regional seed, win/loss record, current tournament standing.
- **Player Cards**: Summoner name, primary role (`TOP`, `JGL`, `MID`, `BOT`, `SUP`), signature champions, and player statistics.

### C. Standings & Leaderboards
- Group stage / Swiss stage / league table standings.
- Points, series score, individual game differential, head-to-head records.

### D. Organizer / Admin Controls
- Add/Edit teams and players.
- Input match outcomes and individual game results.
- Auto-advance winning teams through bracket rounds.
- Reset tournament state or load sample tournament presets.

---

## 4. Technical Stack & Architecture

### Technology Breakdown
- **Markup**: Semantic HTML5 (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`) with structured ARIA roles for accessibility.
- **Styling**: Vanilla CSS utilizing CSS Custom Properties (CSS variables) for theme tokens, Flexbox, and CSS Grid layouts.
- **Application Logic**: Vanilla ES6+ JavaScript modules (`import`/`export`), custom event dispatching, and state-driven DOM rendering.
- **Persistence**: `localStorage` persistence layer to maintain tournament data across browser refreshes.

### Directory Structure Convention
```text
LoLTournament-104/
├── index.html              # Main single-page application entrypoint
├── CONTEXT.md              # Project context, rules, and specifications
├── README.md               # Quickstart and overview
├── css/
│   ├── main.css            # Core styling, reset, typography & utility classes
│   ├── components/         # Component-specific styles (brackets, cards, modals)
│   └── theme.css           # Color variables, gradients, and tokens
├── js/
│   ├── app.js              # Application entrypoint and router/tab controller
│   ├── state.js            # Central state management & local storage sync
│   ├── data/               # Mock data (default teams, champions, schedule)
│   └── components/         # DOM render functions (brackets, standings, teams)
└── assets/
    ├── icons/              # Role icons (Top, Jungle, Mid, ADC, Support)
    └── images/             # Team badges, banner graphics, and placeholders
```

---

## 5. UI/UX & Design Tokens

### Color Palette (Hextech / Esports Theme)
- **Deep Background**: `#091428` (Hextech Void Black/Blue)
- **Surface / Card Background**: `#0A1428` / `#1E282D` (Deep Navy & Slate)
- **Border / Divider**: `#32383E` / `#463714` (Muted Metallic / Subtle Gold)
- **Gold Accent (Primary)**: `#C89B3C` (Hextech Gold)
- **Gold Hover / Bright**: `#F0E6D2` (Light Gold / Pale Parchment)
- **Blue Accent (Active / Blue Side)**: `#0AC8B9` (Hextech Magic Cyan)
- **Red Accent (Danger / Red Side)**: `#E84057` (Noxus Crimson)
- **Text Primary**: `#F0E6D2`
- **Text Secondary**: `#A09B8C`

### Typography & Spacing
- **Font Family**: Modern sans-serif (`Inter`, `Segoe UI`, or `Roboto`) paired with display headings (`Cinzel` or `Beaufort for LOL` style).
- **Responsive Breakpoints**:
  - Mobile: `< 640px`
  - Tablet: `640px - 1024px`
  - Desktop: `> 1024px`

---

## 6. Development Workflow & Conventions
1. **Modularity**: Keep DOM manipulation separate from state mutation logic.
2. **Accessibility**: All interactive elements must have clear focus states, semantic labels, and keyboard navigation support.
3. **No External Framework Dependencies**: Keep everything native to vanilla web standards for speed, simplicity, and ease of deployment.
