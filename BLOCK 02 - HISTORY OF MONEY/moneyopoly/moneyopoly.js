(() => {
  const data = window.MONEYOPOLY_DATA;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  const boardSpaces = [
    { name: 'Village Start', type: 'start', icon: '🏘️', gain: { mangoes: 1 } },
    { name: 'Mango Grove', type: 'resource', icon: '🥭', gain: { mangoes: 2 } },
    { name: 'Water Well', type: 'resource', icon: '💧', gain: { water: 1 } },
    { name: 'Market Square', type: 'trade', icon: '🤝' },
    { name: 'Builder Yard', type: 'resource', icon: '🏠', gain: { shelter: 1 } },
    { name: 'Event Card', type: 'event', icon: '❓' },
    { name: 'Pasture', type: 'resource', icon: '🐄', gain: { cows: 1 } },
    { name: 'Crowded Bazaar', type: 'trade', icon: '🧺' },
    { name: 'Dry River', type: 'event', icon: '☀️' },
    { name: 'Fruit Stand', type: 'resource', icon: '🥭', gain: { mangoes: 1 } },
    { name: 'Carpenter', type: 'resource', icon: '🪚', gain: { shelter: 1 } },
    { name: 'Trade Booth', type: 'trade', icon: '⚖️' },
    { name: 'Storm Clouds', type: 'event', icon: '🌧️' },
    { name: 'Spring', type: 'resource', icon: '💧', gain: { water: 2 } },
    { name: 'Cattle Pen', type: 'resource', icon: '🐄', gain: { cows: 1 } },
    { name: 'Night Market', type: 'trade', icon: '🏮' }
  ];

  const state = {
    started: false,
    round: 0,
    failedTrades: 0,
    successfulTrades: 0,
    players: [],
    lastEventIndex: -1,
    lastRoll: [1, 1]
  };

  function init() {
    bindActions();
    fillTradeControls();
    startGame();
  }

  function bindActions() {
    $$('[data-action="start"]').forEach((button) => button.addEventListener('click', startGame));
    $('[data-action="next-round"]').addEventListener('click', nextRound);
    $('[data-action="suggest-trade"]').addEventListener('click', suggestTrade);
    $('[data-action="trade"]').addEventListener('click', attemptManualTrade);
    $('[data-action="preview-commodity"]').addEventListener('click', previewCommodity);
    $('[data-action="open-rules"]').addEventListener('click', () => $('[data-rules-modal]').showModal());
    $('[data-trader-b]').addEventListener('change', syncTradeResourceAvailability);
  }

  function startGame() {
    state.started = true;
    state.round = 0;
    state.failedTrades = 0;
    state.successfulTrades = 0;
    state.lastEventIndex = -1;
    state.lastRoll = [1, 1];
    state.players = clone(data.players).map((player, index) => ({ ...player, position: index * 4 }));
    $('[data-results]').classList.add('hidden');
    $('[data-commodity-preview]').textContent = '';
    setCard('Welcome to Barter Market', 'There is no money yet. Roll dice, collect goods, and try to barter for water and shelter.', false);
    $('[data-turn-copy]').textContent = 'Roll dice to move around the market board.';
    updateControls(true);
    renderAll();
  }

  function nextRound() {
    if (!state.started) return;
    state.round += 1;
    rollDice();
    moveHuman();
    moveNeighbours();
    resolveLandingSpace(human());
    consumeSurvivalNeeds();
    attemptAutoTrades();
    if (state.round % 3 === 0) triggerEvent();
    renderAll();
    if (state.round >= 12) finishGame();
  }

  function rollDice() {
    const one = (state.round % 6) + 1;
    const two = ((state.round * 2 + 1) % 6) + 1;
    state.lastRoll = [one, two];
    $('[data-die-one]').textContent = diceFaces[one - 1];
    $('[data-die-two]').textContent = diceFaces[two - 1];
  }

  function moveHuman() {
    const player = human();
    const roll = state.lastRoll[0] + state.lastRoll[1];
    player.position = (player.position + roll) % boardSpaces.length;
    $('[data-turn-copy]').textContent = `You rolled ${roll} and landed on ${boardSpaces[player.position].name}.`;
  }

  function moveNeighbours() {
    state.players.slice(1).forEach((player, index) => {
      const roll = ((state.round + index) % 4) + 1;
      player.position = (player.position + roll) % boardSpaces.length;
      resolveLandingSpace(player, true);
    });
  }

  function resolveLandingSpace(player, quiet = false) {
    const space = boardSpaces[player.position];
    if (space.gain) {
      Object.entries(space.gain).forEach(([resource, amount]) => {
        player.inventory[resource] = (player.inventory[resource] || 0) + amount;
      });
      if (!quiet && player.id === human().id) {
        const gainText = Object.entries(space.gain).map(([resource, amount]) => `+${amount} ${label(resource)}`).join(', ');
        setCard(`${space.icon} ${space.name}`, `You collected ${gainText}. But goods alone are not money — you still need the right trading partner.`, false);
      }
    } else if (space.type === 'trade' && !quiet && player.id === human().id) {
      setCard(`${space.icon} ${space.name}`, 'You reached a trade space. Try to make a direct barter deal with another trader.', false);
    } else if (space.type === 'event' && !quiet && player.id === human().id) {
      triggerEvent();
    } else if (space.type === 'start' && !quiet && player.id === human().id) {
      player.inventory.mangoes += 1;
      setCard('🏘️ Village Start', 'You passed through the village and harvested one extra mango.', false);
    }
  }

  function consumeSurvivalNeeds() {
    state.players.forEach((player) => {
      if (state.round % 2 !== 0) return;
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

  function triggerEvent() {
    state.lastEventIndex = (state.lastEventIndex + 1) % data.events.length;
    const event = data.events[state.lastEventIndex];
    event.effects.forEach((effect) => {
      state.players.forEach((player) => {
        player.inventory[effect.resource] = Math.max(0, (player.inventory[effect.resource] || 0) + effect.delta);
      });
    });
    const effectText = event.effects.map((effect) => `${data.resources[effect.resource].label} ${effect.delta}`).join(', ');
    setCard(`${event.icon} ${event.title}`, `${event.description} Market effect: ${effectText}.`, true);
  }

  function attemptManualTrade() {
    if (!state.started) return;
    const a = human();
    const b = state.players.find((player) => player.id === $('[data-trader-b]').value);
    const giveA = $('[data-give-a]').value;
    const giveB = $('[data-give-b]').value;
    const feedback = $('[data-trade-feedback]');

    if (!b || a.id === b.id) {
      feedback.textContent = 'Pick a neighbour to trade with.';
      return;
    }
    if ((a.inventory[giveA] || 0) < 1 || (b.inventory[giveB] || 0) < 1) {
      state.failedTrades += 1;
      feedback.textContent = 'Trade failed: someone does not have the good they promised.';
      renderAll();
      return;
    }
    const aWants = a.wants.includes(giveB) || missingNeeds(a).includes(giveB);
    const bWants = b.wants.includes(giveA) || missingNeeds(b).includes(giveA);
    if (!aWants || !bWants) {
      state.failedTrades += 1;
      feedback.textContent = `${b.name} says no. They want ${wantLabels(b)}, not necessarily ${label(giveA)}.`;
      setCard('Trade rejected', 'This is the double coincidence problem: both sides must want exactly what the other side has.', true);
      renderAll();
      return;
    }

    transfer(a, b, giveA, giveB);
    state.successfulTrades += 1;
    feedback.textContent = `Deal! You traded ${label(giveA)} for ${b.name}'s ${label(giveB)}.`;
    setCard('Trade accepted', 'A barter trade worked because both wants lined up at the same time.', false);
    renderAll();
  }

  function suggestTrade() {
    const a = human();
    const suggestions = [];
    state.players.slice(1).forEach((b) => {
      const giveA = surplusResource(a);
      const giveB = surplusResource(b);
      if (!giveA || !giveB) return;
      if ((a.wants.includes(giveB) || missingNeeds(a).includes(giveB)) && (b.wants.includes(giveA) || missingNeeds(b).includes(giveA))) {
        suggestions.push(`Try ${label(giveA)} for ${b.name}'s ${label(giveB)}.`);
      }
    });
    $('[data-trade-feedback]').textContent = suggestions[0] || 'No clean direct trade exists right now. This is why markets start looking for money.';
  }

  function finishGame() {
    state.started = false;
    updateControls(false);
    const player = human();
    const missing = missingNeeds(player);
    $('[data-results]').classList.remove('hidden');
    $('[data-result-summary]').textContent = missing.length === 0
      ? `You survived with food, water, and shelter. Even then, the market recorded ${state.failedTrades} failed barter attempts.`
      : `You ended short on ${missing.map(label).join(', ')}. The market recorded ${state.failedTrades} failed barter attempts and ${state.successfulTrades} successful trades.`;
    $('[data-result-lessons]').innerHTML = [
      'Barter feels like a board game with no common scoring unit.',
      'Useful goods are not always saleable goods.',
      'Direct trade fails when wants do not line up.',
      'The next version introduces commodity money to make the market playable.'
    ].map((lesson) => `<li>${lesson}</li>`).join('');
    setCard('Game complete', 'Now you have felt the problem. The next era asks: what if one good becomes accepted by everyone?', false);
  }

  function previewCommodity() {
    $('[data-commodity-preview]').textContent = 'Commodity preview: shells become the first common money. You can accept shells even if you do not need them because everyone else accepts them too.';
  }

  function renderAll() {
    renderTrack();
    renderHumanPanel();
    renderPlayers();
    syncStats();
    syncTradeResourceAvailability();
  }

  function renderTrack() {
    const board = $('[data-track]');
    const center = board.querySelector('.board-center')?.outerHTML || '';
    board.innerHTML = center + boardSpaces.map((space, index) => {
      const tokens = state.players.filter((player) => player.position === index)
        .map((player) => `<span class="token ${player.id === human().id ? 'human-token' : ''}" title="${player.name}">${player.icon}</span>`).join('');
      return `<button class="board-space space-${index} ${space.type} ${tokens ? 'active' : ''}" title="${space.name}">
        <span class="space-icon">${space.icon}</span>
        <strong>${space.name}</strong>
        <small>${space.type === 'resource' ? 'Collect' : space.type === 'trade' ? 'Barter' : space.type === 'event' ? 'Event' : 'Start'}</small>
        <span class="tokens">${tokens}</span>
      </button>`;
    }).join('');
  }

  function renderHumanPanel() {
    const player = human();
    $('[data-human-inventory]').innerHTML = inventoryHtml(player);
    $('[data-human-needs]').innerHTML = needsHtml(player);
  }

  function renderPlayers() {
    $('[data-players]').innerHTML = state.players.slice(1).map((player) => {
      const needs = missingNeeds(player);
      return `<article class="neighbour ${needs.length ? 'needs-help' : ''}">
        <span class="neighbour-icon">${player.icon}</span>
        <div><strong>${player.name}</strong><small>${player.role}</small><small>Wants ${wantLabels(player)}</small></div>
      </article>`;
    }).join('');
  }

  function inventoryHtml(player) {
    return Object.entries(data.resources).map(([key, resource]) => {
      const amount = player.inventory[key] || 0;
      return `<div class="item ${amount === 0 ? 'zero' : ''}"><span>${resource.icon} ${resource.label}</span><strong>${amount}</strong></div>`;
    }).join('');
  }

  function needsHtml(player) {
    const missing = missingNeeds(player);
    return Object.keys(player.survival).map((resource) => {
      const met = !missing.includes(resource);
      return `<span class="need-chip ${met ? 'met' : ''}">${met ? '✓' : '!'} ${label(resource)}</span>`;
    }).join('');
  }

  function fillTradeControls() {
    $('[data-trader-b]').innerHTML = statePlayersForSelect().filter((player) => player.id !== 'maya')
      .map((player) => `<option value="${player.id}">${player.icon} ${player.name}</option>`).join('');
    $('[data-give-a]').innerHTML = resourceOptions();
    $('[data-give-b]').innerHTML = resourceOptions();
  }

  function statePlayersForSelect() {
    return state.players.length ? state.players : clone(data.players);
  }

  function resourceOptions() {
    return Object.entries(data.resources)
      .map(([key, resource]) => `<option value="${key}">${resource.icon} ${resource.label}</option>`).join('');
  }

  function syncTradeResourceAvailability() {
    const a = human();
    const b = state.players.find((player) => player.id === $('[data-trader-b]').value) || state.players[1];
    markOptions('[data-give-a]', a);
    markOptions('[data-give-b]', b);
  }

  function markOptions(selector, player) {
    $$(selector + ' option').forEach((option) => {
      const amount = player?.inventory?.[option.value] || 0;
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
    $('[data-successful-trades]').textContent = state.successfulTrades;
  }

  function setCard(title, copy, danger) {
    $('[data-event-title]').textContent = title;
    $('[data-event-copy]').textContent = copy;
    $('[data-event-card]').classList.toggle('danger', danger);
  }

  function updateControls(enabled) {
    $$('[data-action="next-round"], [data-action="suggest-trade"], [data-action="trade"]').forEach((button) => { button.disabled = !enabled; });
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

  function failTrade() {
    state.failedTrades += 1;
  }

  function human() {
    return state.players[0];
  }

  function label(resource) {
    return data.resources[resource]?.label || resource;
  }

  function wantLabels(player) {
    return player.wants.map(label).join(', ');
  }

  init();
})();
