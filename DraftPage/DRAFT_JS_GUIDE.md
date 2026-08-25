# ⚡ Modular `DraftPage/` Architecture: Multi-File Guide

**Modular JavaScript Structure**:
The Draft Tool has been split from one large script into 5 dedicated, single-responsibility JavaScript files:

| Module File | Purpose & Responsibilities |
| :--- | :--- |
| [`DraftPage/draftState.js`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/DraftPage/draftState.js) | Central draft state store (`draftState`), 20-step tournament sequence (`DRAFT_SEQUENCE`), role metadata (`ROLE_SLOTS`), availability validation (`isChampionUnavailable`), and dynamic JSON loader (`loadChampionsDatabase()`). |
| [`DraftPage/draftTimer.js`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/DraftPage/draftTimer.js) | 30-second turn countdown timer (`startTurnTimer`, `stopTurnTimer`), DOM gauge updates (`updateTimerUI`), and timeout auto-resolution (`handleTurnTimeout`). |
| [`DraftPage/draftEngine.js`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/DraftPage/draftEngine.js) | Match session management (`startDraftSession`, `resetDraftSession`, `completeDraftSession`), champion selection (`handleChampionSelect`), and auto-pick helper (`autoPickNextChampion`). |
| [`DraftPage/draftUI.js`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/DraftPage/draftUI.js) | DOM rendering for draft header/announcer, blue/red arena pick/ban slots (`renderDraftArena`), 6-tab/search champion grid (`renderChampionGrid`), and avatar/fallback generators. |
| [`DraftPage/DraftPage.js`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/DraftPage/DraftPage.js) | Master entry point, button delegation listeners (`setupDraftControls`), role tab switcher (`setupRoleTabs`), search engine input binding (`setupChampionSearch`), and DOMContentLoaded initializer (`initDraftView()`). |
| [`DraftPage/champions.json`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/DraftPage/champions.json) | Complete 168+ champion dataset in JSON format with roles and image keys. |

---

## 🎯 Official LoL Tournament Draft Rules (20 Steps)

- **Phase 1 Bans (6 bans)**: Blue Ban 1, Red Ban 1, Blue Ban 2, Red Ban 2, Blue Ban 3, Red Ban 3 (30s each)
- **Phase 1 Picks (6 picks)**: Blue Pick 1, Red Pick 1, Red Pick 2, Blue Pick 2, Blue Pick 3, Red Pick 3 (30s each)
- **Phase 2 Bans (4 bans)**: Red Ban 4, Blue Ban 4, Red Ban 5, Blue Ban 5 (30s each - Red bans first in Phase 2)
- **Phase 2 Picks (4 picks)**: Red Pick 4, Blue Pick 4, Blue Pick 5, Red Pick 5 (30s each - Red picks first in Phase 2)
