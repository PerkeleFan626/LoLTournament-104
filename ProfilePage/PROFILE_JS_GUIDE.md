# 👤 Hand-Building `ProfilePage/ProfilePage.js`: Step-by-Step Guide
**Target File to Write**: [`ProfilePage/ProfilePage.js`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/ProfilePage/ProfilePage.js)  
**Dependencies**: Uses `getState()`, `soundEngine`, and `showToast()` from [`globals/globals.js`](file:///D:/Users/Yoobee270829600/Documents/VS%20code/LoL-104/LoLTournament-104/globals/globals.js).

---

## 🎯 Overview of What You Will Build

`ProfilePage.js` controls the Summoner Profile and Competitive Statistics view:
1. **`renderProfileView()`**: Initializes the profile container with empty cards ready for API data.
2. **`renderEmptyProfileCards()`**: Mounts the base Hextech card hierarchy with clean DOM IDs and placeholder states.
3. **`populateProfileData(data)`**: The primary API data populator that accepts a structured JSON payload and dynamically fills in all empty slots (Summoner Identity, Ranked Solo/Duo, Ranked Flex, Combat Metrics, Champion Mastery, Match History, and Trophy Cabinet).
4. **`clearProfileCards()`**: Resets all cards to clean empty skeleton states.
5. **`setupProfileActions()`**: Handles Match History filters, API synchronization button, and Copy Riot ID actions.

---

## 📋 API Data Payload Schema Reference

When calling your API endpoint, format the JSON payload according to this schema before passing it to `populateProfileData(payload)`:

```javascript
{
  summoner: {
    name: "FakerJr",
    tagLine: "NA1",
    region: "NA",
    level: 485,
    avatar: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ahri.png",
    status: "Online",
    teamTag: "ARC"
  },
  ranked: {
    solo: {
      tier: "GRANDMASTER",
      division: "I",
      lp: 485,
      wins: 142,
      losses: 79,
      winRate: 64,
      emblem: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/ranked-emblems/grandmaster.png"
    },
    flex: {
      tier: "CHALLENGER",
      division: "I",
      lp: 620,
      wins: 58,
      losses: 12,
      winRate: 83,
      emblem: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/ranked-emblems/challenger.png"
    }
  },
  performance: {
    kda: "4.82",
    kp: "72.4%",
    dpm: "748",
    vision: "42.5"
  },
  mastery: [
    {
      name: "Ahri",
      role: "Mid / Mage",
      points: 482900,
      level: 10,
      icon: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ahri.png"
    }
  ],
  matches: [
    {
      queueType: "clash", // "solo" | "flex" | "clash"
      queueLabel: "🏆 Worlds Clash Split 1",
      championName: "Ahri",
      championIcon: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ahri.png",
      result: "VICTORY", // "VICTORY" | "DEFEAT"
      win: true,
      kills: 14,
      deaths: 2,
      assists: 11,
      kdaRatio: "12.50",
      items: [
        "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3089.png",
        "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3157.png"
      ]
    }
  ],
  trophies: [
    {
      icon: "🏆",
      title: "Worlds Clash Split 1",
      date: "Feb 2026"
    }
  ]
}
```

---

## 🪜 Step 1: Active Match Filter & Empty Schema

```javascript
// Step 1: Active Match History Filter State
let currentProfileMatchFilter = 'all';

// Step 2: Empty Schema Placeholder
const EMPTY_PROFILE_SCHEMA = {
  summoner: {
    name: "Summoner",
    tagLine: "NA1",
    region: "NA",
    level: 1,
    avatar: "data:image/svg+xml;utf8,...",
    status: "Standby",
    teamTag: "—"
  },
  ranked: { solo: { tier: "UNRANKED", lp: 0 }, flex: { tier: "UNRANKED", lp: 0 } },
  performance: { kda: "—", kp: "—", dpm: "—", vision: "—" },
  mastery: [],
  matches: [],
  trophies: []
};
```

---

## 🪜 Step 2: Core Renderers (`renderProfileView` & `renderEmptyProfileCards`)

### Why We Use It
Injects the clean card shells with targeted DOM element IDs ready for API population:

```javascript
function renderProfileView() {
  const profileSection = document.getElementById('view-profile');
  if (!profileSection) return;

  renderEmptyProfileCards();
  setupProfileActions();
  loadInitialProfileState();
}
```

---

## 🪜 Step 3: API Data Populator (`populateProfileData`)

### Why We Use It
This is the main entry point to feed real API data into the profile page. It updates the DOM elements cleanly:

```javascript
function populateProfileData(data) {
  if (!data) return;

  // 1. Identity Header
  if (data.summoner) {
    const s = data.summoner;
    document.getElementById('profile-summoner-name').innerText = s.name;
    document.getElementById('profile-tagline').innerText = s.tagLine.startsWith('#') ? s.tagLine : `#${s.tagLine}`;
    if (s.avatar) document.getElementById('profile-avatar-img').src = s.avatar;
    if (s.level) document.getElementById('profile-level-badge').innerText = `LVL ${s.level}`;
    if (s.teamTag) document.getElementById('profile-team-badge').innerText = `TEAM: ${s.teamTag}`;
  }

  // 2. Ranked Queues (Solo/Duo & Flex)
  if (data.ranked?.solo) {
    const solo = data.ranked.solo;
    document.getElementById('ranked-solo-tier').innerText = `${solo.tier} ${solo.division || ''}`.trim();
    document.getElementById('ranked-solo-lp').innerText = `${solo.lp} LP`;
    document.getElementById('ranked-solo-record').innerText = `${solo.wins}W ${solo.losses}L`;
    document.getElementById('ranked-solo-wr-text').innerText = `${solo.winRate}%`;
    document.getElementById('ranked-solo-wr-bar').style.width = `${solo.winRate}%`;
  }

  // 3. Combat Metrics
  if (data.performance) {
    const p = data.performance;
    document.getElementById('metric-kda').innerText = p.kda;
    document.getElementById('metric-kp').innerText = p.kp;
    document.getElementById('metric-dpm').innerText = p.dpm;
    document.getElementById('metric-vision').innerText = p.vision;
  }

  // 4. Dynamic Mastery List
  // 5. Dynamic Match History Cards
  // 6. Dynamic Trophy Showcase
}
```

---

## 🪜 Step 4: How to Connect Your Backend / Riot API

To fetch real player data from your backend API server or Riot Games API, create an async fetch handler like this:

```javascript
async function fetchAndPopulateSummoner(summonerName, tagLine) {
  try {
    const response = await fetch(`/api/summoner?name=${encodeURIComponent(summonerName)}&tag=${encodeURIComponent(tagLine)}`);
    if (!response.ok) throw new Error('Summoner not found');
    const apiData = await response.json();
    populateProfileData(apiData);
  } catch (error) {
    console.error('API Fetch failed:', error);
    showToast('Failed to fetch summoner data from API', '⚠️');
  }
}
```
