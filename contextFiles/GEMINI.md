# Project Guidelines & Rules: LoLTournament-104

## Component & Folder Architecture Rules
The project strictly enforces modular separation across folders:

1. **`globals/`**:
   - `globals.css`: Contains ONLY universal design tokens (fonts, colors, gradients, reset, shared button/badge primitives).
   - `globals.js`: Contains ONLY universal state store (`DEFAULT_STATE`), persistence (`getState`, `saveState`), `SoundEngine`, and `showToast`.

2. **`Header/`**:
   - `Header.html`: Contains ONLY the HTML for the top application bar and desktop simulator notch.
   - `Header.css`: Contains ONLY styles impacting the top header bar and controls.
   - `Header.js`: Contains ONLY logic for header buttons (view mode toggle, audio toggle, notifications, profile populator).

3. **`fotter/`**:
   - `fotter.html`: Contains ONLY the HTML for the bottom navigation bar (`<nav class="bottom-nav-bar">`).
   - `fotter.css`: Contains ONLY styles impacting the bottom navigation bar.
   - `fotter.js`: Contains ONLY logic for tab switching and active states.

4. **Page Modules (e.g. `TournamentPage/`, `TeamsPage/`, etc.)**:
   - `[PageName].html`: Contains ONLY the HTML specific to that page body (e.g. `<section id="view-tournaments">...`).
   - `[PageName].css`: Contains ONLY styles impacting that specific page.
   - `[PageName].js`: Contains ONLY JavaScript logic impacting that specific page.

5. **`index.html`**:
   - Master layout shell bringing together the Header, active Page, and Footer components.
