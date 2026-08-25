/**
 * ============================================================================
 * DRAFT MODULE: UI RENDERING, BOARD PRESENTATION & CHAMPION AVATARS
 * ============================================================================
 */

// Helper: Reliable Champion Avatar URL using latest DDragon patch (14.24.1)
function getChampionAvatar(champ) {
  if (!champ) return '';
  const imgKey = champ.img || champ.id;
  return `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${imgKey}.png`;
}

// Fallback: Clean URL-encoded SVG showing ONLY the champion's name (no initials, no leaking HTML quotes)
function getChampionFallbackSvg(champName) {
  const cleanName = (champName || 'Champion').replace(/[^\w\s.-]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="#0f1e36" rx="4"/><rect x="2" y="2" width="76" height="76" fill="none" stroke="#c8aa6e" stroke-width="1.2" rx="3"/><text x="50%" y="53%" dominant-baseline="middle" text-anchor="middle" fill="#f0e6d2" font-family="sans-serif" font-weight="700" font-size="9.5">${cleanName}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Master Render Routine for the Draft Tool View
function renderDraftView() {
  renderDraftHeader();
  renderDraftArena();
  renderChampionGrid();
}

// Render Header, Timer & Announcer Status
function renderDraftHeader() {
  const statusBadge = document.getElementById('draft-status-badge');
  const announcer = document.getElementById('draft-announcer');
  const startBtn = document.getElementById('btn-start-draft');
  const currentStep = draftState.status === 'IN_PROGRESS' ? DRAFT_SEQUENCE[draftState.currentStepIndex] : null;

  if (statusBadge) {
    if (draftState.status === 'IDLE') {
      statusBadge.innerText = 'LOBBY READY';
      statusBadge.className = 'draft-phase-badge';
    } else if (draftState.status === 'IN_PROGRESS') {
      statusBadge.innerText = `${currentStep ? currentStep.label : 'LIVE'}`;
      statusBadge.className = 'draft-phase-badge live-turn';
    } else {
      statusBadge.innerText = 'DRAFT COMPLETE';
      statusBadge.className = 'draft-phase-badge';
    }
  }

  if (announcer) {
    if (draftState.status === 'IDLE') {
      announcer.className = 'draft-announcer-banner';
      announcer.innerHTML = `<span>⏳ Manual Start Required</span> <span>Click '▶️ Start Draft' to begin 30s turn timer</span>`;
    } else if (draftState.status === 'IN_PROGRESS' && currentStep) {
      announcer.className = `draft-announcer-banner ${currentStep.side}-turn`;
      const sideText = currentStep.side === 'blue' ? '🔵 Blue Side' : '🔴 Red Side';
      const actionText = currentStep.phase === 'ban' ? 'Banning a Champion...' : `Picking ${ROLE_SLOTS[currentStep.slotIndex]?.label || 'Pick'}...`;
      announcer.innerHTML = `<span>${sideText} is ${actionText}</span> <span>Turn ${draftState.currentStepIndex + 1} / 20</span>`;
    } else {
      announcer.className = 'draft-announcer-banner';
      announcer.innerHTML = `<span>🏆 Match Lineups Locked!</span> <span>Both team comps ready to battle</span>`;
    }
  }

  if (startBtn) {
    if (draftState.status === 'IDLE') {
      startBtn.style.display = 'inline-flex';
      startBtn.className = 'btn btn-gold btn-sm';
      startBtn.innerHTML = '<span>▶️ Start Draft</span>';
    } else {
      startBtn.style.display = 'none';
    }
  }

  if (typeof updateTimerUI === 'function') {
    updateTimerUI();
  }
}

// Render Blue & Red Team Picks & Bans on the Arena Board
function renderDraftArena() {
  const currentStep = draftState.status === 'IN_PROGRESS' ? DRAFT_SEQUENCE[draftState.currentStepIndex] : null;

  // Blue Bans
  for (let i = 0; i < 5; i++) {
    const slotEl = document.getElementById(`blue-ban-${i}`);
    if (!slotEl) continue;
    const champ = draftState.blueTeam.bans[i];
    const isActive = currentStep && currentStep.phase === 'ban' && currentStep.side === 'blue' && currentStep.slotIndex === i;

    slotEl.className = `ban-slot ${champ ? 'filled' : 'empty'} ${isActive ? 'active-target' : ''}`;
    if (champ) {
      const avatarUrl = getChampionAvatar(champ);
      const fallbackSvg = getChampionFallbackSvg(champ.name);
      slotEl.innerHTML = `<img src="${avatarUrl}" alt="${champ.name}" onerror="this.onerror=null; this.src='${fallbackSvg}';">`;
    } else {
      slotEl.innerHTML = '';
    }
  }

  // Red Bans
  for (let i = 0; i < 5; i++) {
    const slotEl = document.getElementById(`red-ban-${i}`);
    if (!slotEl) continue;
    const champ = draftState.redTeam.bans[i];
    const isActive = currentStep && currentStep.phase === 'ban' && currentStep.side === 'red' && currentStep.slotIndex === i;

    slotEl.className = `ban-slot ${champ ? 'filled' : 'empty'} ${isActive ? 'active-target' : ''}`;
    if (champ) {
      const avatarUrl = getChampionAvatar(champ);
      const fallbackSvg = getChampionFallbackSvg(champ.name);
      slotEl.innerHTML = `<img src="${avatarUrl}" alt="${champ.name}" onerror="this.onerror=null; this.src='${fallbackSvg}';">`;
    } else {
      slotEl.innerHTML = '';
    }
  }

  // Blue Picks (5 slots: Top, Djungle, Mid, ADC, Support)
  for (let i = 0; i < 5; i++) {
    const slotEl = document.getElementById(`blue-pick-${i}`);
    if (!slotEl) continue;
    const champ = draftState.blueTeam.picks[i];
    const role = ROLE_SLOTS[i];
    const isActive = currentStep && currentStep.phase === 'pick' && currentStep.side === 'blue' && currentStep.slotIndex === i;

    slotEl.className = `pick-slot ${!champ ? 'empty' : ''} ${isActive ? 'active-target-blue' : ''}`;
    
    const imgSrc = champ ? getChampionAvatar(champ) : getChampionFallbackSvg(role.label);
    const fallbackSrc = champ ? getChampionFallbackSvg(champ.name) : getChampionFallbackSvg(role.label);

    slotEl.innerHTML = `
      <img src="${imgSrc}" class="pick-champ-img" alt="${champ ? champ.name : role.label}" onerror="this.onerror=null; this.src='${fallbackSrc}';">
      <div class="pick-slot-info">
        <div class="pick-role-tag">${role.icon} ${role.label}</div>
        <div class="pick-champ-name">${champ ? champ.name : 'Awaiting Pick...'}</div>
      </div>
    `;
  }

  // Red Picks (5 slots: Top, Djungle, Mid, ADC, Support)
  for (let i = 0; i < 5; i++) {
    const slotEl = document.getElementById(`red-pick-${i}`);
    if (!slotEl) continue;
    const champ = draftState.redTeam.picks[i];
    const role = ROLE_SLOTS[i];
    const isActive = currentStep && currentStep.phase === 'pick' && currentStep.side === 'red' && currentStep.slotIndex === i;

    slotEl.className = `pick-slot ${!champ ? 'empty' : ''} ${isActive ? 'active-target-red' : ''}`;
    
    const imgSrc = champ ? getChampionAvatar(champ) : getChampionFallbackSvg(role.label);
    const fallbackSrc = champ ? getChampionFallbackSvg(champ.name) : getChampionFallbackSvg(role.label);

    slotEl.innerHTML = `
      <img src="${imgSrc}" class="pick-champ-img" alt="${champ ? champ.name : role.label}" onerror="this.onerror=null; this.src='${fallbackSrc}';">
      <div class="pick-slot-info">
        <div class="pick-role-tag">${role.icon} ${role.label}</div>
        <div class="pick-champ-name">${champ ? champ.name : 'Awaiting Pick...'}</div>
      </div>
    `;
  }
}

// Render Champion Grid with 6-Tab & Search Filtering
function renderChampionGrid() {
  const gridContainer = document.getElementById('draft-champ-grid');
  const countLabel = document.getElementById('draft-champ-count');
  if (!gridContainer) return;

  const roleFilter = draftState.activeRoleFilter;
  const search = draftState.searchQuery;

  const filtered = LOL_CHAMPIONS_DB.filter(champ => {
    const roleMatch = (roleFilter === 'All') || (Array.isArray(champ.roles) && champ.roles.includes(roleFilter));
    const searchMatch = !search || champ.name.toLowerCase().includes(search);
    return roleMatch && searchMatch;
  });

  if (countLabel) {
    countLabel.innerText = `${filtered.length} Champions`;
  }

  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 28px 12px; color: var(--text-muted);">
        <div style="font-size: 24px; margin-bottom: 4px;">🔍</div>
        <div style="font-size: 12px; font-weight: 600; color: var(--gold-light);">No Champions Found</div>
        <div style="font-size: 10.5px;">Try adjusting your search query or role tab filter.</div>
      </div>
    `;
    return;
  }

  const blueBans = new Set(draftState.blueTeam.bans.filter(Boolean).map(c => c.id));
  const redBans = new Set(draftState.redTeam.bans.filter(Boolean).map(c => c.id));
  const bluePicks = new Set(draftState.blueTeam.picks.filter(Boolean).map(c => c.id));
  const redPicks = new Set(draftState.redTeam.picks.filter(Boolean).map(c => c.id));

  let html = '';
  filtered.forEach(champ => {
    const isBanned = blueBans.has(champ.id) || redBans.has(champ.id);
    const isPicked = bluePicks.has(champ.id) || redPicks.has(champ.id);

    let stateClass = '';
    if (isBanned) stateClass = 'banned';
    else if (isPicked) stateClass = 'picked';

    const avatarUrl = getChampionAvatar(champ);
    const fallbackSvg = getChampionFallbackSvg(champ.name);

    html += `
      <div class="champ-card ${stateClass}" data-champ-id="${champ.id}" title="${champ.name} (${(champ.roles || []).join(', ')})">
        <img src="${avatarUrl}" alt="${champ.name}" class="champ-card-avatar" onerror="this.onerror=null; this.src='${fallbackSvg}';">
        <span class="champ-card-name">${champ.name}</span>
      </div>
    `;
  });

  gridContainer.innerHTML = html;

  gridContainer.querySelectorAll('.champ-card').forEach(card => {
    card.onclick = () => {
      const champId = card.dataset.champId;
      const champ = LOL_CHAMPIONS_DB.find(c => c.id === champId);
      if (champ && typeof handleChampionSelect === 'function') {
        handleChampionSelect(champ);
      }
    };
  });
}
