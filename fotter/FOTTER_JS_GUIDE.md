# 🔻 Hand-Building `fotter/fotter.js`: Step-by-Step Guide
**Target File to Write**: [`fotter/fotter.js`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/fotter/fotter.js)  
**Dependencies**: Uses `soundEngine` and `showToast()` from [`globals/globals.js`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/globals/globals.js).

---

## 🎯 Overview of What You Will Build

`fotter.js` controls the sticky bottom navigation bar:
1. **`FOOTER_HTML_TEMPLATE`**: The reusable HTML string for the 5 footer tab buttons.
2. **`renderFotter(slotId)`**: Injects the footer navigation bar into `#footer-slot`.
3. **`setupBottomNavigation()`**: Adds click listeners to all 5 tabs (`Tourneys`, `My Team`, `Draft Tool`, `Recruit`, `Profile`), managing the active gold/cyan glow highlight and toast feedback.

---

## 🪜 Step 1: Define the `FOOTER_HTML_TEMPLATE` Constant

### Why We Use It
Encapsulates the footer navigation HTML in a modular template string so it can be dynamically rendered into `#footer-slot`.

### Code to Write:
```javascript
// Step 1: Footer HTML Template
const FOOTER_HTML_TEMPLATE = `
  <nav class="bottom-nav-bar" aria-label="Main Navigation">
    <button class="bottom-nav-item active" data-tab-target="view-tournaments" id="tab-tournaments-label">
      <span class="nav-icon">🏆</span>
      <span class="nav-label">Tourneys</span>
    </button>
    <button class="bottom-nav-item" data-tab-target="view-teams" id="tab-teams-label">
      <span class="nav-icon">⚔️</span>
      <span class="nav-label">My Team</span>
    </button>
    <button class="bottom-nav-item" data-tab-target="view-draft" id="tab-draft-label">
      <span class="nav-icon">⚡</span>
      <span class="nav-label">Draft Tool</span>
    </button>
    <button class="bottom-nav-item" data-tab-target="view-scrims" id="tab-scrims-label">
      <span class="nav-icon">🎯</span>
      <span class="nav-label">Recruit</span>
    </button>
    <button class="bottom-nav-item" data-tab-target="view-profile" id="tab-profile-label">
      <span class="nav-icon">👤</span>
      <span class="nav-label">Profile</span>
    </button>
  </nav>
`;
```

---

## 🪜 Step 2: Component Slot Injector (`renderFotter`)

### Why We Use It
Finds the `#footer-slot` placeholder and injects the navigation bar before attaching click handlers.

### Code to Write:
```javascript
// Step 2: Footer Mounting Function
function renderFotter(slotId = 'footer-slot') {
  const slot = document.getElementById(slotId);
  if (slot && !slot.innerHTML.trim()) {
    slot.innerHTML = FOOTER_HTML_TEMPLATE;
  }
  setupBottomNavigation();
}
```

### 🔍 Line-by-Line Explanation:
1. `const slot = document.getElementById(slotId);`: Finds the placeholder `div` with ID `footer-slot`.
2. `if (slot && !slot.innerHTML.trim())`: Checks if the slot exists and is currently empty.
3. `slot.innerHTML = FOOTER_HTML_TEMPLATE;`: Injects the navigation bar HTML.
4. `setupBottomNavigation();`: Attaches click handlers to the newly injected buttons.

---

## 🪜 Step 3: Tab Navigation Click Listeners (`setupBottomNavigation`)

### Why We Use It
Listens for user taps on each of the 5 navigation tabs, clears the active class from other tabs, highlights the selected tab with the golden icon and cyan glowing line, and triggers toast feedback.

### Code to Write:
```javascript
// Step 3: Navigation Tab Click Handlers
function setupBottomNavigation() {
  const navItems = document.querySelectorAll('.bottom-nav-item');

  navItems.forEach(button => {
    button.onclick = () => {
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();

      // 1. Remove active state from all items
      navItems.forEach(item => item.classList.remove('active'));

      // 2. Add active state to clicked button
      button.classList.add('active');

      // 3. Extract label and display toast feedback
      const tabLabel = button.querySelector('.nav-label')?.innerText || 'Tab';
      if (tabLabel !== 'TOURNEYS' && typeof showToast === 'function') {
        showToast(`${tabLabel} View selected (Tournament Hub is active)`, '🧭');
      }
    };
  });
}
```

### 🔍 Line-by-Line Explanation:
1. `document.querySelectorAll('.bottom-nav-item')`: Queries all 5 navigation buttons.
2. `navItems.forEach(button => ...)`: Loops through each button to attach the `.onclick` handler.
3. `soundEngine.playClick()`: Plays metallic audio click feedback.
4. `navItems.forEach(item => item.classList.remove('active'))`: Deactivates all other navigation buttons.
5. `button.classList.add('active')`: Sets the active state on the clicked button.
6. `button.querySelector('.nav-label')?.innerText`: Uses optional chaining to safely read the tab's name.
7. `showToast(...)`: Shows a feedback message.
