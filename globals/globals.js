/**
 * ============================================================================
 * GLOBALS: CENTRAL STATE STORE, PERSISTENCE, AUDIO ENGINE & SHARED UTILITIES
 * ============================================================================
 */

// 1. Initial Mock State
const DEFAULT_STATE = {
  currentUser: {
    id: 'user_current',
    name: 'FakerJr',
    tag: '#NA1',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ahri.png',
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
      status: 'IN_PROGRESS',
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

// 2. Persistence Helpers
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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

// 3. Web Audio API Synthesizer Class
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('lol_hub_sound_muted') !== 'true';
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) this.ctx = new AudioContextClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    localStorage.setItem('lol_hub_sound_muted', (!this.enabled).toString());
    return this.enabled;
  }

  isMuted() {
    return !this.enabled;
  }

  playClick() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
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
    } catch (e) {
      // Ignore audio failure
    }
  }

  playShimmer() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
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
    } catch (e) {
      // Ignore audio failure
    }
  }

  playSuccess() {
    this.playShimmer();
  }

  playBan() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {
      // Ignore audio failure
    }
  }

  playLockIn() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [440, 554.37, 659.25].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + (i * 0.05);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      });
    } catch (e) {
      // Ignore audio failure
    }
  }
}

// Global Sound Engine Instance
const soundEngine = new SoundEngine();

// 4. Shared Toast Notification Utility
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
