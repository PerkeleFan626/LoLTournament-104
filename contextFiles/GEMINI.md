# Project Guidelines & Rules: LoLTournament-104

## 1. Strict Modular Architecture Rules
The project enforces strict separation of concerns across dedicated folders:

1. **`globals/`**:
   - `globals.css`: Universal design tokens (fonts, Hextech colors, gradients, reset, shared button/badge primitives, toast styles).
   - `globals.js`: Master state store (`DEFAULT_STATE`), persistence (`getState`, `saveState`), `SoundEngine` class, and `showToast`.
   - `GLOBALS_JS_GUIDE.md`: Step-by-step guide for hand-writing `globals.js`.

2. **`Header/`**:
   - `Header.html`: HTML for the top application bar and desktop simulator notch.
   - `Header.css`: Styles impacting only the top header bar, avatar badge, rank pill, and quick controls.
   - `Header.js`: `renderHeader(slotId)`, view mode toggle (430px ↔ 768px), audio toggle, notification button, and profile populator.
   - `HEADER_JS_GUIDE.md`: Step-by-step guide for hand-writing `Header.js`.

3. **`fotter/`**:
   - `fotter.html`: HTML for the bottom navigation bar (`<nav class="bottom-nav-bar">`).
   - `fotter.css`: Styles for sticky bottom navigation, active tab highlight, and glowing cyan line.
   - `fotter.js`: `renderFotter(slotId)` and tab switching logic (`setupBottomNavigation`).
   - `FOTTER_JS_GUIDE.md`: Step-by-step guide for hand-writing `fotter.js`.

4. **Page Modules (e.g. `TournamentPage/`, `DraftPage/`, `TeamsPage/`, etc.)**:
   - `[PageName].html`: HTML specific to that page body (e.g. `<section id="view-tournaments">`, `<section id="view-draft">`).
   - `[PageName].css`: Styles impacting only that specific page (e.g. tournament cards, draft arena).
   - `[PageName].js`: JavaScript logic impacting only that specific page (filters, card feed rendering, pick/ban turns).
   - `[PAGENAME]_JS_GUIDE.md`: Step-by-step guide for hand-writing that page's script.

5. **`index.html`**:
   - Master layout shell assembling `#header-slot`, the active page in `#content-container`, `#footer-slot`, and `#toast-container`.

---

## 2. Core Development Conventions

- **Vanilla Web Standards Only**: HTML5, Vanilla CSS3, Vanilla ES6+ JavaScript. Zero heavy frameworks or external runtimes.
- **Safe API Invocations**: Guard calls to global utilities (`typeof soundEngine !== 'undefined'`, `typeof showToast === 'function'`).
- **Reactive LocalStorage**: Persist state changes via `saveState(state)` and immediately re-render dynamic elements.
- **Mobile-First Design**: Optimized for 430px base viewport width with toggleable 768px wide desktop preview.
