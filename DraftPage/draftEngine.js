/**
 * ============================================================================
 * DRAFT MODULE: MATCH LIFECYCLE, PICK/BAN RULES & SELECTION HANDLERS
 * ============================================================================
 */

// Start a new 10-ban tournament draft session
function startDraftSession() {
  if (draftState.status === 'IN_PROGRESS') return;

  draftState.status = 'IN_PROGRESS';
  draftState.currentStepIndex = 0;
  draftState.timeRemaining = 30;

  draftState.blueTeam.bans = [null, null, null, null, null];
  draftState.blueTeam.picks = [null, null, null, null, null];
  draftState.redTeam.bans = [null, null, null, null, null];
  draftState.redTeam.picks = [null, null, null, null, null];

  startTurnTimer();

  if (typeof showToast === 'function') {
    showToast('⚔️ Tournament Draft Started! 30s Timer is Active.', '🎮');
  }

  renderDraftView();
}

// Reset draft back to initial lobby state
function resetDraftSession() {
  stopTurnTimer();
  draftState.status = 'IDLE';
  draftState.currentStepIndex = 0;
  draftState.timeRemaining = 30;
  draftState.blueTeam.bans = [null, null, null, null, null];
  draftState.blueTeam.picks = [null, null, null, null, null];
  draftState.redTeam.bans = [null, null, null, null, null];
  draftState.redTeam.picks = [null, null, null, null, null];

  if (typeof showToast === 'function') {
    showToast('Draft board reset to lobby state.', '🔄');
  }

  renderDraftView();
}

// Finalize and conclude draft session
function completeDraftSession() {
  stopTurnTimer();
  draftState.status = 'COMPLETED';
  if (typeof soundEngine !== 'undefined') soundEngine.playSuccess();
  if (typeof showToast === 'function') {
    showToast('🎉 Tournament Draft Complete! Lineups locked in.', '🏆');
  }
  renderDraftView();
}

// Core Selection Handler when a User Clicks a Champion Card
function handleChampionSelect(champ) {
  if (!champ) return;

  if (draftState.status === 'IDLE') {
    if (typeof soundEngine !== 'undefined') soundEngine.playClick();
    if (typeof showToast === 'function') {
      showToast(`Selected ${champ.name}. Press '▶️ Start Draft' to begin!`, 'ℹ️');
    }
    return;
  }

  if (draftState.status === 'COMPLETED') {
    if (typeof showToast === 'function') {
      showToast('Draft is already complete! Press 🔄 Reset to start a new match.', '🏆');
    }
    return;
  }

  if (isChampionUnavailable(champ.id)) {
    if (typeof showToast === 'function') {
      showToast(`${champ.name} has already been banned or picked!`, '🚫');
    }
    return;
  }

  const currentStep = DRAFT_SEQUENCE[draftState.currentStepIndex];
  const targetTeam = currentStep.side === 'blue' ? draftState.blueTeam : draftState.redTeam;

  if (currentStep.phase === 'ban') {
    targetTeam.bans[currentStep.slotIndex] = champ;
    if (typeof soundEngine !== 'undefined') soundEngine.playBan();
    if (typeof showToast === 'function') {
      showToast(`${currentStep.side.toUpperCase()} BANNED ${champ.name}!`, '🚫');
    }
  } else {
    targetTeam.picks[currentStep.slotIndex] = champ;
    if (typeof soundEngine !== 'undefined') soundEngine.playLockIn();
    if (typeof showToast === 'function') {
      showToast(`${currentStep.side.toUpperCase()} LOCKED ${champ.name}!`, '⚔️');
    }
  }

  draftState.currentStepIndex++;

  if (draftState.currentStepIndex >= DRAFT_SEQUENCE.length) {
    completeDraftSession();
  } else {
    startTurnTimer();
    renderDraftView();
  }
}

// Auto-pick helper for the current turn
function autoPickNextChampion() {
  if (draftState.status !== 'IN_PROGRESS') return;

  const currentStep = DRAFT_SEQUENCE[draftState.currentStepIndex];
  const targetRole = currentStep.phase === 'pick' ? ROLE_SLOTS[currentStep.slotIndex].role : null;

  let available = LOL_CHAMPIONS_DB.filter(c => !isChampionUnavailable(c.id));
  if (targetRole) {
    const roleMatches = available.filter(c => Array.isArray(c.roles) && c.roles.includes(targetRole));
    if (roleMatches.length > 0) available = roleMatches;
  }

  if (available.length > 0) {
    const randomChamp = available[Math.floor(Math.random() * available.length)];
    handleChampionSelect(randomChamp);
  }
}
