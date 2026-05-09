(() => {
  const data = window.MONEYOPOLY_DATA;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const clone = (value) => JSON.parse(JSON.stringify(value));

  const state = {
    started: false,
    round: 0,
    failedTrades: 0,
    successfulTrades: 0,
    players: clone(data.players).map((player, index) => ({ ...player, position: index * 2 })),
    lastEventIndex: -1,
    demoTimer: null
  };

  const resourceOptions = () => Object.entries(data.resources)
    .map(([key, resource]) => `<option value="${key}">${resource.icon} ${resource.label}</option>`).join('');

  function init() {
    renderTrack();
    renderPlayers();
    fillTradeControls();
    bindActions();
    startGame();
  }

  function bindActions() {
    $$('[data-action="start"]').forEach((button) => button.addEventListener('click', startGame));
    $('[data-action="next-round"]').addEventListener('click', nextRound);
    $('[data-action="suggest-trade"]').addEventListener('click', suggestTrade);
    $('[data-action="trade"]').addEventListener('click', attemptManualTrade);
    $('[data-action="reset"]').addEventListener('click', resetGame);
    $('[data-action="demo"]').addEventListener('click', autoplayDemo);
    $('[data-action="preview-commodity"]').addEventListener('click', previewCommodity);
    ['[data-trader-a]', '[data-trader-b]'].forEach((selector) => $(selector).addEventListener('change', syncTradeResourceAvailability));
  }

  function startGame() {
    resetGame(false);
    state.started = true;
    $('[data-event-banner]').textContent = 'The market opens. Everyone has valuable goods, but no common money yet.';
    updateControls(true);
    renderAll();
  }

  function resetGame(render = true) {
    clearInterval(state.demoTimer);
    state.started = false;
    state.round = 0;
    state.failedTrades = 0;
    state.successfulTrades = 0;
    state.players = clone(data.players).map((player, index) => ({ ...player, position: index * 2 }));
    state.lastEventIndex = -1;
    $('[data-results]').classList.add('hidden');
    $('[data-trade-feedback]').textContent = 'The market is live — try a trade or press Next round.';
    $('[data-commodity-preview]').textContent = '';
    $('[data-event-banner]').classList.remove('danger');
    if (render) {
      $('[data-event-banner]').textContent = 'Game is ready. Press Next round to play, or Restart game to reset the market.';
      updateControls(false);
      renderAll();
    }
  }

  function nextRound() {
    if (!state.started) return;
    state.round += 1;
    movePlayers();
    consumeSurvivalNeeds();
    attemptAutoTrades();
    if (state.round % 3 === 0) triggerEvent();
    else {
      $('[data-event-banner]').classList.remove('danger');
      $('[data-event-banner]').textContent = `Round ${state.round}: players move, consume survival needs, and try direct barter.`;
    }
    renderAll();
    if (state.round >= 12) finishGame();
  }

  function movePlayers() {
    state.players.forEach((player, index) => {
      const roll = ((state.round + index) % 3) + 1;
      player.position = (player.position + roll) % data.board.length;
    });
  }

  function consumeSurvivalNeeds() {
    state.players.forEach((player) => {
      Object.entries(player.survival).forEach(([resource, amount]) => {
        player.inventory[resource] = Math.max(0, (player.inventory[resource] || 0) - amount);
      });
    });
  }

  function attemptAutoTrades() {
    const needy = state.players.filter((player) => missingNeeds(player).length > 0);
    needy.forEach((buyer) => {
      const needed = missingNeeds(buyer)[0];
      const seller = state.players.find((player) => player.id !== buyer.id && (player.inventory[needed] || 0) > 1);
      if (!seller) return failTrade();
      const offered = surplusResource(buyer);
      if (!offered) return failTrade();
      const sellerWantsOffer = seller.wants.includes(offered) || missingNeeds(seller).includes(offered);
      if (!sellerWantsOffer) return failTrade();
      transfer(buyer, seller, offered, needed);
      state.successfulTrades += 1;
    });
  }

  function failTrade() {
    state.failedTrades += 1;
  }

  function missingNeeds(player) {
    return Object.keys(player.survival).filter((resource) => (player.inventory[resource] || 0) < 1);
  }

  function surplusResource(player) {
    return Object.keys(data.resources).find((resource) => (player.inventory[resource] || 0) > (player.survival[resource] || 0) + 1);
  }

  function transfer(playerA, playerB, giveA, giveB) {
    playerA.inventory[giveA] -= 1;
    playerB.inventory[giveA] = (playerB.inventory[giveA] || 0) + 1;
    playerB.inventory[giveB] -= 1;
    playerA.inventory[giveB] = (playerA.inventory[giveB] || 0) + 1;
  }

  function triggerEvent() {
    state.lastEventIndex = (state.lastEventIndex + 1) % data.events.length;
    const event = data.events[state.lastEventIndex];
    event.effects.forEach((effect) => {
      state.players.forEach((player) => {
        player.inventory[effect.resource] = Math.max(0, (player.inventory[effect.resource] || 0) + effect.delta);
      });
    });
    const effectText = event.effects.map((effect) => `${data.resources[effect.resource].label} ${effect.delta}`).join(', ');
    const banner = $('[data-event-banner]');
    banner.classList.add('danger');
    banner.textContent = `${event.icon} Event: ${event.title}. ${event.description} (${effectText})`;
  }

  function attemptManualTrade() {
    if (!state.started) return;
    const a = state.players.find((player) => player.id === $('[data-trader-a]').value);
    const b = state.players.find((player) => player.id === $('[data-trader-b]').value);
    const giveA = $('[data-give-a]').value;
    const giveB = $('[data-give-b]').value;
    const feedback = $('[data-trade-feedback]');

    if (!a || !b || a.id === b.id) {
      feedback.textContent = 'Pick two different traders.';
      return;
    }
    if ((a.inventory[giveA] || 0) < 1 || (b.inventory[giveB] || 0) < 1) {
      state.failedTrades += 1;
      feedback.textContent = 'Trade failed: one side does not have the good they promised.';
      renderAll();
      return;
    }
    const aWants = a.wants.includes(giveB) || missingNeeds(a).includes(giveB);
    const bWants = b.wants.includes(giveA) || missingNeeds(b).includes(giveA);
    if (!aWants || !bWants) {
      state.failedTrades += 1;
      feedback.textContent = `Trade failed: no double coincidence of wants. ${a.name} wants ${wantLabels(a)}; ${b.name} wants ${wantLabels(b)}.`;
      renderAll();
      return;
    }

    transfer(a, b, giveA, giveB);
    state.successfulTrades += 1;
    feedback.textContent = `Trade worked: ${a.name} gave ${label(giveA)} for ${b.name}'s ${label(giveB)}.`;
    renderAll();
  }

  function suggestTrade() {
    const suggestions = [];
    state.players.forEach((a) => {
      state.players.forEach((b) => {
        if (a.id === b.id) return;
        const giveA = surplusResource(a);
        const giveB = surplusResource(b);
        if (!giveA || !giveB) return;
        if ((a.wants.includes(giveB) || missingNeeds(a).includes(giveB)) && (b.wants.includes(giveA) || missingNeeds(b).includes(giveA))) {
          suggestions.push(`${a.name} could trade ${label(giveA)} with ${b.name} for ${label(giveB)}.`);
        }
      });
    });
    $('[data-trade-feedback]').textContent = suggestions[0] || 'No clean direct trade exists right now. That is the lesson: valuable goods can still get stuck.';
  }

  function autoplayDemo() {
    startGame();
    clearInterval(state.demoTimer);
    state.demoTimer = setInterval(() => {
      if (state.round >= 12) return clearInterval(state.demoTimer);
      nextRound();
    }, 900);
  }

  function finishGame() {
    state.started = false;
    updateControls(false);
    const survivors = state.players.filter((player) => missingNeeds(player).length === 0).length;
    $('[data-results]').classList.remove('hidden');
    $('[data-result-summary]').textContent = `${survivors} of ${state.players.length} players ended with food, water, and shelter covered. The market recorded ${state.failedTrades} failed barter attempts and ${state.successfulTrades} successful trades.`;
    $('[data-result-lessons]').innerHTML = [
      'Barter needs matching wants at the same time.',
      'Perishable and hard-to-divide goods make saving difficult.',
      'Events change what people need, so a good medium of exchange becomes valuable.',
      'The next era introduces commodity money to reduce failed trades.'
    ].map((lesson) => `<li>${lesson}</li>`).join('');
    $('[data-event-banner]').classList.remove('danger');
    $('[data-event-banner]').textContent = 'Game complete. Scroll to the debrief to connect the experience to the history of money.';
  }

  function previewCommodity() {
    $('[data-commodity-preview]').textContent = 'Preview rule: shells are now accepted by everyone because everyone believes someone else will accept them later. Trade no longer requires direct wants every time — but now we can test what happens if shells become easy to find.';
  }

  function renderAll() {
    renderTrack();
    renderPlayers();
    syncStats();
    syncTradeResourceAvailability();
    updateLesson();
  }

  function renderTrack() {
    $('[data-track]').innerHTML = data.board.map((space, index) => {
      const tokens = state.players.filter((player) => player.position === index)
        .map((player) => `<span class="token" title="${player.name}">${player.icon}</span>`).join('');
      return `<div class="space ${tokens ? 'active' : ''}"><strong>${space}</strong><small>${index % 3 === 2 ? 'Event risk' : 'Trade space'}</small><div class="tokens">${tokens}</div></div>`;
    }).join('');
  }

  function renderPlayers() {
    $('[data-players]').innerHTML = state.players.map((player) => {
      const needs = missingNeeds(player);
      const inventory = Object.entries(data.resources).map(([key, resource]) => {
        const amount = player.inventory[key] || 0;
        return `<div class="item ${amount === 0 ? 'zero' : ''}"><span>${resource.icon} ${resource.label}</span><strong>${amount}</strong></div>`;
      }).join('');
      const needChips = Object.keys(player.survival).map((resource) => {
        const met = !needs.includes(resource);
        return `<span class="need-chip ${met ? 'met' : ''}">${met ? '✓' : '!'} ${label(resource)}</span>`;
      }).join('');
      return `<article class="player-card ${needs.length ? 'needs-help' : ''}">
        <div class="player-top"><div><span class="eyebrow">${player.role}</span><h3>${player.name}</h3></div><span class="player-icon">${player.icon}</span></div>
        <div class="inventory">${inventory}</div>
        <div><strong>Survival needs</strong><div class="needs">${needChips}</div></div>
        <p class="small">Prefers: ${wantLabels(player)}</p>
      </article>`;
    }).join('');
  }

  function fillTradeControls() {
    const playerOptions = () => state.players.map((player) => `<option value="${player.id}">${player.icon} ${player.name}</option>`).join('');
    $('[data-trader-a]').innerHTML = playerOptions();
    $('[data-trader-b]').innerHTML = playerOptions();
    $('[data-trader-b]').selectedIndex = 1;
    $('[data-give-a]').innerHTML = resourceOptions();
    $('[data-give-b]').innerHTML = resourceOptions();
    syncTradeResourceAvailability();
  }

  function syncTradeResourceAvailability() {
    const a = state.players.find((player) => player.id === $('[data-trader-a]').value) || state.players[0];
    const b = state.players.find((player) => player.id === $('[data-trader-b]').value) || state.players[1];
    markOptions('[data-give-a]', a);
    markOptions('[data-give-b]', b);
  }

  function markOptions(selector, player) {
    $$(selector + ' option').forEach((option) => {
      const amount = player.inventory[option.value] || 0;
      option.disabled = amount < 1;
      option.textContent = `${data.resources[option.value].icon} ${data.resources[option.value].label} (${amount})`;
    });
    const select = $(selector);
    if (select.selectedOptions[0]?.disabled) {
      const firstAvailable = Array.from(select.options).find((option) => !option.disabled);
      if (firstAvailable) select.value = firstAvailable.value;
    }
  }

  function syncStats() {
    $('[data-round]').textContent = state.round;
    $('[data-failed-trades]').textContent = state.failedTrades;
    $('[data-friction-meter]').value = Math.min(12, state.failedTrades);
    $('[data-friction-label]').textContent = state.failedTrades < 3 ? 'Low so far' : state.failedTrades < 8 ? 'Painful now' : 'Market is stuck';
  }

  function updateLesson() {
    const title = $('[data-lesson-title]');
    const copy = $('[data-lesson-copy]');
    if (state.failedTrades >= 8) {
      title.textContent = 'This is why money emerges.';
      copy.textContent = 'A common medium of exchange lets people accept something even if they do not need it personally, because they expect others to accept it later.';
    } else if (state.round >= 3) {
      title.textContent = 'Events make barter even harder.';
      copy.textContent = 'When droughts, floods, and pests change needs suddenly, direct barter becomes fragile and slow.';
    } else {
      title.textContent = 'Before money, trade is fragile.';
      copy.textContent = 'In barter, having value is not enough. You need someone who wants exactly what you have and has exactly what you need.';
    }
  }

  function updateControls(enabled) {
    $$('[data-action="next-round"], [data-action="suggest-trade"], [data-action="trade"]').forEach((button) => { button.disabled = !enabled; });
  }

  function label(resource) {
    return data.resources[resource]?.label || resource;
  }

  function wantLabels(player) {
    return player.wants.map(label).join(', ');
  }

  init();
})();
