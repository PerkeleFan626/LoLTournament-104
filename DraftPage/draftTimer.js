/**
 * ============================================================================
 * DRAFT MODULE: 30-SECOND TURN COUNTDOWN TIMER & TIMEOUT AUTO-RESOLUTION
 * ============================================================================
 */

// Start 30-Second Countdown for current turn
function startTurnTimer() {
  if (draftState.timerInterval) {
    clearInterval(draftState.timerInterval);
    draftState.timerInterval = null;
  }

  draftState.timeRemaining = 30;
  updateTimerUI();

  draftState.timerInterval = setInterval(() => {
    draftState.timeRemaining--;

    if (draftState.timeRemaining <= 0) {
      clearInterval(draftState.timerInterval);
      draftState.timerInterval = null;
      handleTurnTimeout();
    } else {
      updateTimerUI();
    }
  }, 1000);
}

// Stop countdown timer
function stopTurnTimer() {
  if (draftState.timerInterval) {
    clearInterval(draftState.timerInterval);
    draftState.timerInterval = null;
  }
}

// Update DOM elements for the timer badge and progress bar
function updateTimerUI() {
  const timerBadge = document.getElementById('draft-timer-badge');
  const timerFill = document.getElementById('draft-timer-bar');

  if (timerBadge) {
    timerBadge.innerHTML = `<span>⏱️</span> <span>${draftState.timeRemaining}s</span>`;
    if (draftState.timeRemaining <= 6) {
      timerBadge.classList.add('timer-urgent');
      if (typeof soundEngine !== 'undefined' && draftState.timeRemaining <= 3) {
        soundEngine.playClick();
      }
    } else {
      timerBadge.classList.remove('timer-urgent');
    }
  }

  if (timerFill) {
    const percentage = Math.max(0, Math.min(100, (draftState.timeRemaining / 30) * 100));
    timerFill.style.width = `${percentage}%`;
    if (draftState.timeRemaining <= 6) {
      timerFill.classList.add('timer-urgent-fill');
    } else {
      timerFill.classList.remove('timer-urgent-fill');
    }
  }
}

// Auto-resolve turn when 30-second timer hits 0
function handleTurnTimeout() {
  if (draftState.status !== 'IN_PROGRESS') return;

  const currentStep = DRAFT_SEQUENCE[draftState.currentStepIndex];

  if (currentStep.phase === 'ban') {
    let available = LOL_CHAMPIONS_DB.filter(c => !isChampionUnavailable(c.id));
    const randomBan = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null;
    
    if (randomBan) {
      const targetTeam = currentStep.side === 'blue' ? draftState.blueTeam : draftState.redTeam;
      targetTeam.bans[currentStep.slotIndex] = randomBan;
      if (typeof soundEngine !== 'undefined') soundEngine.playBan();
      if (typeof showToast === 'function') {
        showToast(`⏱️ Time expired! Auto-banned ${randomBan.name}.`, '⏰');
      }
    }
  } else {
    const targetRole = ROLE_SLOTS[currentStep.slotIndex].role;
    let available = LOL_CHAMPIONS_DB.filter(c => !isChampionUnavailable(c.id));
    let roleMatches = available.filter(c => Array.isArray(c.roles) && c.roles.includes(targetRole));
    const autoPick = roleMatches.length > 0 ? roleMatches[0] : available[0];

    if (autoPick) {
      const targetTeam = currentStep.side === 'blue' ? draftState.blueTeam : draftState.redTeam;
      targetTeam.picks[currentStep.slotIndex] = autoPick;
      if (typeof soundEngine !== 'undefined') soundEngine.playLockIn();
      if (typeof showToast === 'function') {
        showToast(`⏱️ Time expired! Auto-locked ${autoPick.name}.`, '⏰');
      }
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
