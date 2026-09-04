/**
 * ============================================================================
 * DRAFT MODULE: STATE STORE, DATA LOADER & RULES CONFIGURATION
 * ============================================================================
 */

// 1. Champion Database loaded dynamically from DraftPage/champions.json
let LOL_CHAMPIONS_DB = [];

// Asynchronously load champions data directly from JSON file
async function loadChampionsDatabase() {
  // Ordered list of paths to attempt
  const candidatePaths = [
    'DraftPage/champions.json',
    './champions.json',
    'https://ddragon.leagueoflegends.com/cdn/14.24.1/data/en_US/champion.json' // Remote fallback
  ];

  for (const path of candidatePaths) {
    try {
      const res = await fetch(path);
      if (!res.ok) continue; // Try next path if 404/500

      const data = await res.json();
      
      // Handle both custom arrays [...] and Riot's { data: { ... } } structure
      const parsedList = Array.isArray(data) ? data : Object.values(data.data || {});

      if (parsedList.length > 0) {
        LOL_CHAMPIONS_DB = parsedList;
        if (typeof renderDraftView === 'function') renderDraftView();
        return; // Success! Exit early
      }
    } catch (err) {
      console.warn(`Failed loading champions from "${path}":`, err.message);
    }
  }

  console.error('CRITICAL: All champion database paths failed to load.');
}

// 2. Official Standard League of Legends 10-Ban Tournament Draft Rules (20 Steps)
const DRAFT_SEQUENCE = [
  // Phase 1: First Ban Phase (6 bans)
  { phase: 'ban', side: 'blue', slotIndex: 0, label: 'Blue Ban 1', phaseName: 'Phase 1 Bans' },
  { phase: 'ban', side: 'red', slotIndex: 0, label: 'Red Ban 1', phaseName: 'Phase 1 Bans' },
  { phase: 'ban', side: 'blue', slotIndex: 1, label: 'Blue Ban 2', phaseName: 'Phase 1 Bans' },
  { phase: 'ban', side: 'red', slotIndex: 1, label: 'Red Ban 2', phaseName: 'Phase 1 Bans' },
  { phase: 'ban', side: 'blue', slotIndex: 2, label: 'Blue Ban 3', phaseName: 'Phase 1 Bans' },
  { phase: 'ban', side: 'red', slotIndex: 2, label: 'Red Ban 3', phaseName: 'Phase 1 Bans' },

  // Phase 2: First Pick Phase (6 picks)
  { phase: 'pick', side: 'blue', slotIndex: 0, label: 'Blue Pick 1', phaseName: 'Phase 1 Picks' },
  { phase: 'pick', side: 'red', slotIndex: 0, label: 'Red Pick 1', phaseName: 'Phase 1 Picks' },
  { phase: 'pick', side: 'red', slotIndex: 1, label: 'Red Pick 2', phaseName: 'Phase 1 Picks' },
  { phase: 'pick', side: 'blue', slotIndex: 1, label: 'Blue Pick 2', phaseName: 'Phase 1 Picks' },
  { phase: 'pick', side: 'blue', slotIndex: 2, label: 'Blue Pick 3', phaseName: 'Phase 1 Picks' },
  { phase: 'pick', side: 'red', slotIndex: 2, label: 'Red Pick 3', phaseName: 'Phase 1 Picks' },

  // Phase 3: Second Ban Phase (4 bans - Red bans first!)
  { phase: 'ban', side: 'red', slotIndex: 3, label: 'Red Ban 4', phaseName: 'Phase 2 Bans' },
  { phase: 'ban', side: 'blue', slotIndex: 3, label: 'Blue Ban 4', phaseName: 'Phase 2 Bans' },
  { phase: 'ban', side: 'red', slotIndex: 4, label: 'Red Ban 5', phaseName: 'Phase 2 Bans' },
  { phase: 'ban', side: 'blue', slotIndex: 4, label: 'Blue Ban 5', phaseName: 'Phase 2 Bans' },

  // Phase 4: Second Pick Phase (4 picks - Red picks first!)
  { phase: 'pick', side: 'red', slotIndex: 3, label: 'Red Pick 4', phaseName: 'Phase 2 Picks' },
  { phase: 'pick', side: 'blue', slotIndex: 3, label: 'Blue Pick 4', phaseName: 'Phase 2 Picks' },
  { phase: 'pick', side: 'blue', slotIndex: 4, label: 'Blue Pick 5', phaseName: 'Phase 2 Picks' },
  { phase: 'pick', side: 'red', slotIndex: 4, label: 'Red Pick 5', phaseName: 'Phase 2 Picks' }
];

// Roles metadata for the 5 pick slots
const ROLE_SLOTS = [
  { role: 'Top', label: 'Top', icon: '🛡️' },
  { role: 'Djungle', label: 'Djungle', icon: '🌿' },
  { role: 'Mid', label: 'Mid', icon: '⚡' },
  { role: 'ADC', label: 'ADC', icon: '🏹' },
  { role: 'Support', label: 'Support', icon: '💖' }
];

// 3. Draft Engine State Model
const draftState = {
  status: 'IDLE', // 'IDLE', 'IN_PROGRESS', 'COMPLETED'
  currentStepIndex: 0,
  activeRoleFilter: 'All', // 'All', 'Top', 'Djungle', 'Mid', 'ADC', 'Support'
  searchQuery: '',
  timeRemaining: 30, // 30-Second Tournament Countdown
  timerInterval: null,
  blueTeam: {
    name: 'Arcane Blades',
    tag: 'ARC',
    bans: [null, null, null, null, null],
    picks: [null, null, null, null, null]
  },
  redTeam: {
    name: 'Dragon Slayers',
    tag: 'DRG',
    bans: [null, null, null, null, null],
    picks: [null, null, null, null, null]
  }
};

// Helper: Check if a champion is banned or picked
function isChampionUnavailable(champId) {
  const allBlueBans = draftState.blueTeam.bans.filter(Boolean).map(c => c.id);
  const allRedBans = draftState.redTeam.bans.filter(Boolean).map(c => c.id);
  const allBluePicks = draftState.blueTeam.picks.filter(Boolean).map(c => c.id);
  const allRedPicks = draftState.redTeam.picks.filter(Boolean).map(c => c.id);

  return allBlueBans.includes(champId) ||
         allRedBans.includes(champId) ||
         allBluePicks.includes(champId) ||
         allRedPicks.includes(champId);
}
