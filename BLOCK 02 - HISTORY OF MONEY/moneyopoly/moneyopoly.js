(() => {
  const data = window.MONEYOPOLY_DATA;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  const baseMangoPrices = { mangoes: 1, shells: 0.5, water: 2, fish: 4, cows: 10, shelter: 20 };

  const boardSpaces = [
    { name: 'GO', type: 'start', icon: '🏘️', color: '#ffffff' },
    { name: 'Mango Grove', type: 'trade', icon: '🥭', color: '#8B4513', trader: 'Mango farmer', offers: ['mangoes'] },
    { name: 'Community Need', type: 'trade', icon: '📦', trader: 'Community trader', offers: ['water', 'shelter'], color: '#ffffff' },
    { name: 'Banana Path', type: 'trade', icon: '🍌', color: '#8B4513', trader: 'Fruit seller', offers: ['mangoes'] },
    { name: 'Spoilage Tax', type: 'trade', icon: '🧾', trader: 'Tax collector', offers: ['shelter'], color: '#ffffff' },
    { name: 'Trade Route', type: 'trade', icon: '🛤️', color: '#ffffff', trader: 'Route broker', offers: ['water', 'fish'] },
    { name: 'River Well', type: 'trade', icon: '💧', color: '#87CEEB', trader: 'Water keeper', offers: ['water'] },
    { name: 'Chance', type: 'trade', icon: '❓', trader: 'Travelling trader', offers: ['mangoes', 'cows', 'water', 'shelter'], color: '#ffffff' },
    { name: 'Spring Water', type: 'trade', icon: '💧', color: '#87CEEB', trader: 'Water keeper', offers: ['water'] },
    { name: 'Rain Barrel', type: 'trade', icon: '💧', color: '#87CEEB', trader: 'Rain collector', offers: ['water'] },
    { name: 'Just Visiting', type: 'corner', icon: '🧱', color: '#ffffff' },
    { name: 'Small Hut', type: 'trade', icon: '🏠', color: '#FF0080', trader: 'Builder', offers: ['shelter'] },
    { name: 'Tool Maker', type: 'trade', icon: '🛠️', color: '#ffffff', trader: 'Tool maker', offers: ['shelter', 'cows'] },
    { name: 'Wood Shelter', type: 'trade', icon: '🏠', color: '#FF0080', trader: 'Builder', offers: ['shelter'] },
    { name: 'Stone Shelter', type: 'trade', icon: '🏠', color: '#FF0080', trader: 'Stone mason', offers: ['shelter'] },
    { name: 'Cattle Trail', type: 'trade', icon: '🐄', color: '#ffffff', trader: 'Trail herder', offers: ['cows'] },
    { name: 'Pasture', type: 'trade', icon: '🐄', color: '#FFA500', trader: 'Cattle herder', offers: ['cows'] },
    { name: 'Community Need', type: 'trade', icon: '📦', trader: 'Community trader', offers: ['water', 'shelter'], color: '#ffffff' },
    { name: 'Dairy Herd', type: 'trade', icon: '🐄', color: '#FFA500', trader: 'Cattle herder', offers: ['cows'] },
    { name: 'Open Market', type: 'trade', icon: '🧺', color: '#FFA500', trader: 'Market vendor', offers: ['mangoes', 'fish', 'water', 'shelter'] },
    { name: 'Free Trade', type: 'corner', icon: '🅿️', color: '#ffffff' },
    { name: 'Fishing Camp', type: 'trade', icon: '🐟', color: '#FF0000', trader: 'Fishing camp', offers: ['fish'] },
    { name: 'Chance', type: 'trade', icon: '❓', trader: 'Travelling trader', offers: ['mangoes', 'cows', 'water', 'shelter'], color: '#ffffff' },
    { name: 'Grain Field', type: 'trade', icon: '🌾', color: '#FF0000', trader: 'Grain farmer', offers: ['mangoes'] },
    { name: 'Hunting Ground', type: 'trade', icon: '🏹', color: '#FF0000', trader: 'Hunter', offers: ['cows'] },
    { name: 'River Port', type: 'trade', icon: '⛵', color: '#ffffff', trader: 'River porter', offers: ['water', 'fish'] },
    { name: 'Clay Bricks', type: 'trade', icon: '🧱', color: '#FFFF00', trader: 'Brick maker', offers: ['shelter'] },
    { name: 'Timber Lot', type: 'trade', icon: '🪵', color: '#FFFF00', trader: 'Timber seller', offers: ['shelter'] },
    { name: 'Water Works', type: 'trade', icon: '🚰', color: '#ffffff', trader: 'Water works', offers: ['water'] },
    { name: 'Granary', type: 'trade', icon: '🏚️', color: '#FFFF00', trader: 'Granary keeper', offers: ['mangoes', 'shelter'] },
    { name: 'Go To Crisis', type: 'corner', icon: '🚨', color: '#ffffff' },
    { name: 'Highland Well', type: 'trade', icon: '💧', color: '#008000', trader: 'Highland water keeper', offers: ['water'] },
    { name: 'Mountain Shelter', type: 'trade', icon: '🏠', color: '#008000', trader: 'Mountain builder', offers: ['shelter'] },
    { name: 'Community Need', type: 'trade', icon: '📦', trader: 'Community trader', offers: ['water', 'shelter'], color: '#ffffff' },
    { name: 'Stone House', type: 'trade', icon: '🏠', color: '#008000', trader: 'Stone house builder', offers: ['shelter'] },
    { name: 'Caravan', type: 'trade', icon: '🐪', color: '#ffffff', trader: 'Caravan merchant', offers: ['cows', 'water', 'shelter'] },
    { name: 'Chance', type: 'trade', icon: '❓', trader: 'Travelling trader', offers: ['mangoes', 'cows', 'water', 'shelter'], color: '#ffffff' },
    { name: 'Big Mango Farm', type: 'trade', icon: '🥭', color: '#0000FF', trader: 'Big mango farm', offers: ['mangoes'] },
    { name: 'Scarcity Shock', type: 'trade', icon: '⚠️', trader: 'Scarcity trader', offers: ['water', 'cows'], color: '#ffffff' },
    { name: 'Market Boardwalk', type: 'trade', icon: '👑', color: '#0000FF', trader: 'Prime merchant', offers: ['fish', 'water', 'shelter', 'cows'] }
  ];

  const crisisEvents = [
    {
      title: 'Drought', icon: '☀️', scarce: 'water', multiplier: 1.5,
      description: 'The river is low. Water sellers charge 50% more for every litre.'
    },
    {
      title: 'Fire', icon: '🔥', scarce: 'shelter', multiplier: 1.5,
      description: 'Several homes burned. Builders charge 50% more because everyone needs shelter.'
    },
    {
      title: 'Flood', icon: '🌊', scarce: 'mangoes', multiplier: 1.5,
      description: 'Fields are underwater. Food is harder to find, so food costs 50% more.'
    },
    {
      title: 'Pest outbreak', icon: '🐛', scarce: 'fish', multiplier: 1.5, damage: 'mangoes',
      description: 'Pests hit the mango crop. Your mango stock is cut in half, and preserved fish costs 50% more in trade.'
    },
    {
      title: 'Shell rush', icon: '🐚', scarce: 'shells', multiplier: 2, shellInflation: true,
      description: 'A foreigner arrives with piles of shells. Shell money is diluted, so goods priced in shells cost twice as much.'
    }
  ];

  const state = {
    started: false,
    round: 0,
    failedTrades: 0,
    successfulTrades: 0,
    tradeAttempts: 0,
    players: [],
    lastEventIndex: -1,
    lastRoll: [1, 1],
    currentOffer: null,
    proposedOffer: null,
    marketShock: null,
    shellInflation: null,
    mangoHarvest: 0,
    shellsEarned: 0,
    mode: 'barter',
    commodityUnlocked: false
  };

  function init() {
    bindActions();
    fillTradeControls();
    startGame();
  }

  function on(selector, event, handler) {
    $$(selector).forEach((element) => element.addEventListener(event, handler));
  }

  function bindActions() {
    on('[data-action="start"]', 'click', startGame);
    on('[data-action="start-commodity"]', 'click', startCommodityGame);
    on('[data-action="next-round"]', 'click', nextRound);
    on('[data-action="suggest-trade"]', 'click', suggestTrade);
    on('[data-action="trade"]', 'click', attemptManualTrade);
    on('[data-action="trade-here"]', 'click', tradeHere);
    on('[data-action="accept-offer"]', 'click', acceptOffer);
    on('[data-action="sell-for-shells"]', 'click', sellForShells);
    on('[data-action="skip-trade"], [data-action="sell-for-shells"]', 'click', skipTrade);
    on('[data-action="preview-commodity"]', 'click', previewCommodity);
    on('[data-action="open-rules"]', 'click', () => {
      const modal = $('[data-rules-modal]');
      if (modal?.showModal) modal.showModal();
      else alert('Roll dice to move. Collect goods. Barter for water and shelter. Every 3 rounds, an event changes the market.');
    });
    on('[data-trader-b]', 'change', syncTradeResourceAvailability);
    on('[data-sell-resource]', 'change', updateShellExchange);
  }

  function startGame() {
    state.mode = 'barter';
    state.commodityUnlocked = false;
    state.started = true;
    state.round = 0;
    state.failedTrades = 0;
    state.successfulTrades = 0;
    state.tradeAttempts = 0;
    state.lastEventIndex = -1;
    state.lastRoll = [1, 1];
    state.currentOffer = null;
    state.proposedOffer = null;
    state.marketShock = null;
    state.shellInflation = null;
    state.mangoHarvest = 0;
    state.shellsEarned = 0;
    state.players = clone(data.players).map((player, index) => ({ ...player, position: index * 10 }));
    $('[data-results]').classList.add('hidden');
    $('[data-commodity-preview]').textContent = '';
    toggleCommodityButton(true);
    updateBoardDescription();
    setCard('Welcome to Barter Market', 'There is no money yet. Roll dice to visit traders, then barter from your starting balance into water and shelter.', false);
    setLandingAction(null);
    $('[data-turn-copy]').textContent = 'Roll dice to visit the next trader.';
    updateControls(true);
    renderAll();
  }

  function startCommodityGame() {
    state.mode = 'commodity';
    state.started = true;
    state.round = 0;
    state.failedTrades = 0;
    state.successfulTrades = 0;
    state.tradeAttempts = 0;
    state.lastEventIndex = -1;
    state.lastRoll = [1, 1];
    state.currentOffer = null;
    state.proposedOffer = null;
    state.marketShock = null;
    state.shellInflation = null;
    state.mangoHarvest = 0;
    state.shellsEarned = 0;
    state.players = clone(data.players).map((player, index) => ({ ...player, position: index * 10 }));
    state.players.forEach((player, index) => {
      player.inventory.shells = index === 0 ? 8 : 6;
    });
    $('[data-results]').classList.add('hidden');
    $('[data-commodity-preview]').textContent = '';
    toggleCommodityButton(true);
    updateBoardDescription();
    setCard('Commodity Money: Shells', 'Shells are now widely accepted. Traders prefer shells, so you can buy goods without needing the exact barter match.', false);
    setLandingAction(null);
    $('[data-turn-copy]').textContent = 'Level 2: roll dice and use shells as basic commodity money.';
    updateControls(true);
    renderAll();
  }

  function nextRound() {
    if (!state.started) return;
    state.round += 1;
    harvestMangoes();
    rollDice();
    moveHuman();
    moveNeighbours();
    resolveLandingSpace(human());
    consumeSurvivalNeeds();
    renderAll();
    if (state.round >= 15) finishGame();
  }

  function harvestMangoes() {
    const amount = Math.floor(Math.random() * 3) + 1;
    state.mangoHarvest = amount;
    human().inventory.mangoes = (human().inventory.mangoes || 0) + amount;
    if (state.mode === 'commodity') {
      const shellsEarned = Math.max(1, Math.floor(amount / 2));
      human().inventory.shells = (human().inventory.shells || 0) + shellsEarned;
      state.shellsEarned = shellsEarned;
    } else {
      state.shellsEarned = 0;
    }
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
    const previous = player.position;
    player.position = (player.position + roll) % boardSpaces.length;
    if (state.mode === 'barter' && player.position < previous) unlockCommodityMoney();
    $('[data-turn-copy]').textContent = state.mode === 'commodity' ? `Maya harvested ${state.mangoHarvest} mango${state.mangoHarvest === 1 ? '' : 'es'} and earned ${state.shellsEarned} shell${state.shellsEarned === 1 ? '' : 's'}. You rolled ${roll} and landed on ${boardSpaces[player.position].name}.` : `Maya harvested ${state.mangoHarvest} mango${state.mangoHarvest === 1 ? '' : 'es'}. You rolled ${roll} and landed on ${boardSpaces[player.position].name}.`;
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
    if (space.type === 'start') {
      if (!quiet && player.id === human().id) {
        setCard('🏘️ GO', 'You passed the village. Your balances stay intact — now find someone willing to trade.', false);
        setLandingAction(null);
      }
      return;
    }
    if (space.type === 'corner') {
      if (!quiet && player.id === human().id) {
        if (space.name === 'Go To Crisis') {
          triggerEvent('crisis');
        } else {
          setCard(`${space.icon} ${space.name}`, 'Corner space. No automatic trade here. Roll again when ready.', false);
        }
        setLandingAction(null);
      }
      return;
    }
    if (!quiet && player.id === human().id) {
      const offers = (space.offers || Object.keys(data.resources)).map(label).join(', ');
      setCard(`${space.icon} ${space.trader || space.name}`, `You arrived at ${space.name}. This trader can offer: ${offers}. Trade here or skip and roll again.`, false);
      setLandingAction(space);
      syncTradePartnerForSpace(space);
    }
  }

  function consumeSurvivalNeeds() {
    // In this version, rolls do not drain balances. Goods only move through trades or event cards.
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

  function triggerEvent(reason = 'trade') {
    state.lastEventIndex = (state.lastEventIndex + 1) % crisisEvents.length;
    const event = crisisEvents[state.lastEventIndex];
    state.marketShock = { ...event, remainingTrades: 3 };
    if (event.damage === 'mangoes') {
      human().inventory.mangoes = Math.floor((human().inventory.mangoes || 0) / 2);
    }
    if (event.shellInflation) {
      state.shellInflation = { remainingTrades: 3, multiplier: 2 };
    }
    const reasonText = reason === 'crisis' ? 'You hit a crisis space.' : 'Three trades have passed.';
    setCard(`${event.icon} ${event.title}`, `${reasonText} ${event.description} ${event.shellInflation ? 'For the next 3 offers, goods priced in shells cost 2× more.' : `For the next 3 trade offers, ${label(event.scarce)} costs 50% more.`}`, true);
    $('[data-trade-feedback]').textContent = event.shellInflation ? `${event.title}: shell prices doubled for the next 3 offers.` : `${event.title}: ${label(event.scarce)} now costs 50% more for the next 3 offers.`;
  }

  function priceMultiplier(resource, pay = null) {
    if (pay === 'shells' && resource !== 'shells' && state.shellInflation) return state.shellInflation.multiplier;
    return state.marketShock?.scarce === resource && !state.marketShock.shellInflation ? state.marketShock.multiplier : 1;
  }

  function shockLine(resource, pay = null) {
    if (pay === 'shells' && state.shellInflation) return `<p class="shock-line">🐚 Shell rush: goods priced in shells cost 2× more for ${state.shellInflation.remainingTrades} more offer${state.shellInflation.remainingTrades === 1 ? '' : 's'}.</p>`;
    if (state.marketShock?.scarce !== resource || state.marketShock?.shellInflation) return '';
    return `<p class="shock-line">${state.marketShock.icon} ${state.marketShock.title}: ${label(resource)} costs 50% more for ${state.marketShock.remainingTrades} more offer${state.marketShock.remainingTrades === 1 ? '' : 's'}.</p>`;
  }

  function countShockOffer() {
    if (state.shellInflation) {
      state.shellInflation.remainingTrades -= 1;
      if (state.shellInflation.remainingTrades <= 0) state.shellInflation = null;
    }
    if (!state.marketShock) return;
    state.marketShock.remainingTrades -= 1;
    if (state.marketShock.remainingTrades <= 0) {
      const ended = state.marketShock.title;
      state.marketShock = null;
      $('[data-trade-feedback]').textContent = `${ended} pressure eased. Prices are back to normal.`;
    }
  }

  function setLandingAction(space) {
    state.currentOffer = space || null;
    state.proposedOffer = null;
    const title = $('[data-landing-title]');
    const copy = $('[data-landing-copy]');
    const offer = $('[data-landing-offer]');
    const acceptButton = $('[data-action="accept-offer"]');
    const skipButton = $('[data-action="skip-trade"], [data-action="sell-for-shells"]');
    if (!space?.offers?.length) {
      title.textContent = 'No trader here';
      copy.textContent = 'Roll again when you are ready to visit the next trading space.';
      offer.innerHTML = '<span class="offer-chip muted">No offer on this space</span>';
      acceptButton.disabled = true;
      skipButton.disabled = true;
      renderShellExchange(null);
      return;
    }

    const proposal = makeProposal(space);
    state.proposedOffer = proposal;
    title.textContent = `${space.icon} ${space.trader || space.name}`;
    copy.textContent = `You landed at ${space.name}. This trader makes one offer. Accept it or skip and roll again.`;
    offer.innerHTML = `<div class="deal-card">
      <span class="eyebrow">${state.mode === 'commodity' ? 'Commodity money offer' : 'Proposed trade'}</span>
      <h3>${space.trader || space.name} offers</h3>
      <div class="deal-equation"><strong>${proposal.receiveQty} ${data.resources[proposal.receive].icon} ${label(proposal.receive)}</strong><span>for</span><strong>${proposal.payQty} ${data.resources[proposal.pay].icon} ${label(proposal.pay)}</strong></div>
      <p>Base market: ${proposal.baseText}. This offer is ${proposal.discountPercent}% under base${proposal.crisisApplied ? ', then +50% crisis pricing' : ''}.</p>
      <p class="${proposal.canAfford ? 'afford-line' : 'cannot-afford-line'}">${proposal.canAfford ? 'You can afford this trade.' : `You cannot afford this yet. Save more ${label(proposal.pay)} and come back later.`}</p>
      <p>${proposal.goodDeal ? 'This looks useful for your survival needs.' : 'This may be expensive, but barter is messy.'}</p>
      ${shockLine(proposal.receive, proposal.pay)}
    </div>`;
    $('[data-give-a]').value = proposal.pay;
    $('[data-give-b]').value = proposal.receive;
    acceptButton.disabled = !proposal.canAfford;
    skipButton.disabled = false;
    renderShellExchange(proposal);
  }

  function makeProposal(space) {
    const player = human();
    const receive = space.offers[(state.round + state.tradeAttempts) % space.offers.length];
    const receiveQty = proposedReceiveQty(receive);
    const discount = 0.9 + (Math.random() * 0.1); // market offers are 0–10% below base
    const payable = Object.keys(data.resources).filter((resource) => resource !== receive && (player.inventory[resource] || 0) > 0);
    if (state.mode === 'commodity' && receive !== 'shells' && !payable.includes('shells')) payable.unshift('shells');
    const candidates = payable.map((resource) => {
      const costInMangoes = baseMangoPrices[receive] * receiveQty * discount * priceMultiplier(receive, resource);
      const payQty = Math.max(1, Math.round(costInMangoes / baseMangoPrices[resource]));
      const inventory = player.inventory[resource] || 0;
      return { resource, payQty, inventory, sufficient: inventory >= payQty, notAll: inventory > payQty };
    });
    const choice = (state.mode === 'commodity' ? candidates.find((candidate) => candidate.resource === 'shells') : null)
      || candidates.find((candidate) => candidate.sufficient && candidate.notAll)
      || candidates.find((candidate) => candidate.sufficient)
      || candidates.find((candidate) => candidate.resource === 'mangoes')
      || candidates[0]
      || { resource: 'mangoes', payQty: Math.max(1, Math.round(baseMangoPrices[receive] * receiveQty)), inventory: 0, sufficient: false };
    const goodDeal = missingNeeds(player).includes(receive) || receive === 'fish';
    const baseText = basePriceText(receive, receiveQty, choice.resource);
    const discountPercent = Math.round((1 - discount) * 100);
    return {
      receive,
      receiveQty,
      pay: choice.resource,
      payQty: choice.payQty,
      canAfford: (player.inventory[choice.resource] || 0) >= choice.payQty,
      goodDeal,
      baseText,
      discountPercent,
      crisisApplied: priceMultiplier(receive, choice.resource) > 1
    };
  }

  function proposedReceiveQty(resource) {
    if (resource === 'water') return Math.floor(Math.random() * 3) + 1;
    if (resource === 'fish') return Math.floor(Math.random() * 3) + 1;
    if (resource === 'mangoes') return Math.floor(Math.random() * 5) + 1;
    return 1;
  }

  function basePriceText(receive, receiveQty, pay) {
    const receiveValue = baseMangoPrices[receive] * receiveQty;
    const payUnits = receiveValue / baseMangoPrices[pay];
    const formattedPay = Number.isInteger(payUnits) ? payUnits : payUnits.toFixed(1);
    return `${receiveQty} ${label(receive)} ≈ ${formattedPay} ${label(pay)}`;
  }

  function renderShellExchange(proposal) {
    const box = $('[data-shell-exchange]');
    if (!box) return;
    if (state.mode !== 'commodity' || !proposal || proposal.pay !== 'shells' || proposal.canAfford) {
      box.classList.add('hidden');
      return;
    }
    box.classList.remove('hidden');
    const select = $('[data-sell-resource]');
    select.innerHTML = Object.entries(human().inventory)
      .filter(([resource, amount]) => resource !== 'shells' && amount > 0)
      .map(([resource, amount]) => `<option value="${resource}">${data.resources[resource].icon} ${label(resource)} (${amount})</option>`).join('');
    updateShellExchange();
  }

  function updateShellExchange() {
    const proposal = state.proposedOffer;
    const copy = $('[data-shell-exchange-copy]');
    if (!proposal || !copy) return;
    const resource = $('[data-sell-resource]')?.value;
    if (!resource) {
      copy.textContent = 'You have nothing available to sell for shells.';
      return;
    }
    const neededShells = Math.max(0, proposal.payQty - (human().inventory.shells || 0));
    const units = Math.ceil((neededShells * baseMangoPrices.shells) / baseMangoPrices[resource]);
    const shellsRaised = Math.round((units * baseMangoPrices[resource]) / baseMangoPrices.shells);
    copy.textContent = `Sell ${units} ${label(resource)} for about ${shellsRaised} Shells, then buy ${proposal.receiveQty} ${label(proposal.receive)} for ${proposal.payQty} Shells.`;
  }

  function sellForShells() {
    const proposal = state.proposedOffer;
    const resource = $('[data-sell-resource]')?.value;
    if (!proposal || !resource) return;
    const neededShells = Math.max(0, proposal.payQty - (human().inventory.shells || 0));
    const units = Math.ceil((neededShells * baseMangoPrices.shells) / baseMangoPrices[resource]);
    if ((human().inventory[resource] || 0) < units) {
      $('[data-trade-feedback]').textContent = `You do not have enough ${label(resource)} to raise the needed shells.`;
      return;
    }
    const shellsRaised = Math.round((units * baseMangoPrices[resource]) / baseMangoPrices.shells);
    human().inventory[resource] -= units;
    human().inventory.shells = (human().inventory.shells || 0) + shellsRaised;
    $('[data-trade-feedback]').textContent = `Sold ${units} ${label(resource)} for ${shellsRaised} Shells. You can now accept the offer if you have enough shells.`;
    state.proposedOffer.canAfford = (human().inventory.shells || 0) >= proposal.payQty;
    $('[data-action="accept-offer"]').disabled = !state.proposedOffer.canAfford;
    renderAll();
    renderShellExchange(state.proposedOffer);
  }

  function acceptOffer() {
    const proposal = state.proposedOffer;
    if (!proposal) return;
    const player = human();
    const feedback = $('[data-trade-feedback]');
    if ((player.inventory[proposal.pay] || 0) < proposal.payQty) {
      feedback.textContent = `You cannot afford this yet. Keep harvesting mangoes and save for a later trade.`;
      renderAll();
      return;
    }
    state.tradeAttempts += 1;
    countShockOffer();
    player.inventory[proposal.pay] -= proposal.payQty;
    player.inventory[proposal.receive] = (player.inventory[proposal.receive] || 0) + proposal.receiveQty;
    state.successfulTrades += 1;
    feedback.textContent = `Accepted: you traded ${proposal.payQty} ${label(proposal.pay)} for ${proposal.receiveQty} ${label(proposal.receive)}.`;
    setCard('Offer accepted', state.mode === 'commodity' ? 'Shells worked as commodity money: the trader accepted them even without needing your mangoes.' : 'A barter deal worked because you accepted the exact terms from this trader.', false);
    setLandingAction(null);
    maybeTriggerTradeEvent();
    renderAll();
  }

  function tradeHere() {
    if (!state.currentOffer) return;
    const requested = $('[data-give-b]').value;
    if (!state.currentOffer.offers.includes(requested)) {
      $('[data-trade-feedback]').textContent = `This space does not offer ${label(requested)}. Pick one of the highlighted offers.`;
      return;
    }
    attemptManualTrade();
  }

  function skipTrade() {
    $('[data-trade-feedback]').textContent = 'You skipped this trade. Roll again when ready.';
    setCard('Trade skipped', 'Sometimes the best barter move is no deal. Without money, waiting for the right counterparty matters.', false);
    setLandingAction(null);
  }

  function attemptManualTrade() {
    if (!state.started) return;
    const a = human();
    const b = state.players.find((player) => player.id === $('[data-trader-b]').value);
    const giveA = $('[data-give-a]').value;
    const giveB = $('[data-give-b]').value;
    const feedback = $('[data-trade-feedback]');

    state.tradeAttempts += 1;
    countShockOffer();

    if (!b || a.id === b.id) {
      feedback.textContent = 'Pick a neighbour to trade with.';
      return;
    }
    if ((a.inventory[giveA] || 0) < 1 || (b.inventory[giveB] || 0) < 1) {
      state.failedTrades += 1;
      feedback.textContent = 'Trade failed: someone does not have the good they promised.';
      maybeTriggerTradeEvent();
      renderAll();
      return;
    }
    const aWants = a.wants.includes(giveB) || missingNeeds(a).includes(giveB);
    const bWants = b.wants.includes(giveA) || missingNeeds(b).includes(giveA);
    if (!aWants || !bWants) {
      state.failedTrades += 1;
      feedback.textContent = `${b.name} says no. They want ${wantLabels(b)}, not necessarily ${label(giveA)}.`;
      setCard('Trade rejected', 'This is the double coincidence problem: both sides must want exactly what the other side has.', true);
      maybeTriggerTradeEvent();
      renderAll();
      return;
    }

    transfer(a, b, giveA, giveB);
    state.successfulTrades += 1;
    feedback.textContent = `Deal! You traded ${label(giveA)} for ${b.name}'s ${label(giveB)}.`;
    setCard('Trade accepted', 'A barter trade worked because both wants lined up at the same time.', false);
    maybeTriggerTradeEvent();
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

  function maybeTriggerTradeEvent() {
    if (state.tradeAttempts > 0 && state.tradeAttempts % 3 === 0) {
      triggerEvent();
    }
  }

  function unlockCommodityMoney() {
    if (state.commodityUnlocked) return;
    state.commodityUnlocked = true;
    toggleCommodityButton(true);
    setCard('🐚 Commodity Money unlocked', 'You completed a full lap in barter. Next level: shells become widely accepted as basic commodity money.', false);
    $('[data-trade-feedback]').textContent = 'New level unlocked: Play Commodity Money with shells.';
  }

  function toggleCommodityButton(show = true) {
    $$('[data-action="start-commodity"]').forEach((button) => {
      button.hidden = false;
      button.disabled = false;
    });
  }

  function updateBoardDescription() {
    const mode = $('[data-board-mode]');
    const title = $('[data-board-title]');
    const copy = $('[data-board-copy]');
    if (!mode || !title || !copy) return;
    if (state.mode === 'commodity') {
      mode.textContent = 'Commodity money edition';
      title.textContent = 'Trade with shells';
      copy.textContent = 'Shells are broadly accepted. Sell goods into shells, buy what you need, and watch crises change shell prices.';
    } else {
      mode.textContent = 'Barter edition';
      title.textContent = 'Survive without money';
      copy.textContent = 'Move from trader to trader. Save mangoes, accept or skip offers, and feel why direct barter is hard.';
    }
  }

  function finishGame() {
    state.started = false;
    updateControls(false);
    const player = human();
    const missing = missingNeeds(player);
    $('[data-results]').classList.remove('hidden');
    toggleCommodityButton(true);
    $('[data-result-summary]').textContent = missing.length === 0
      ? (state.mode === 'commodity' ? `You survived with food, water, and shelter. Shells helped complete ${state.successfulTrades} trades.` : `You survived with food, water, and shelter. Even then, the market recorded ${state.failedTrades} failed barter attempts.`)
      : `You ended short on ${missing.map(label).join(', ')}. The market recorded ${state.tradeAttempts} trade attempts, including ${state.failedTrades} failed barter attempts and ${state.successfulTrades} successful trades.`;
    const lessons = state.mode === 'commodity'
      ? [
        'Shells acted as basic commodity money.',
        'Sellers could accept shells without needing your exact good.',
        'Pricing in a common good makes offers easier to compare.',
        'The next lesson can test what happens when shell supply expands.'
      ]
      : [
        'Barter feels like a board game with no common scoring unit.',
        'Useful goods are not always saleable goods.',
        'Direct trade fails when wants do not line up.',
        'Events after every 3 trades show why markets want a common medium of exchange.'
      ];
    $('[data-result-lessons]').innerHTML = lessons.map((lesson) => `<li>${lesson}</li>`).join('');
    setCard(state.mode === 'commodity' ? 'Commodity round complete' : 'Game complete', state.mode === 'commodity' ? 'Shells made trade easier because they became broadly accepted.' : 'Now you have felt the problem. The next era asks: what if one good becomes accepted by everyone?', false);
  }

  function previewCommodity() {
    $('[data-commodity-preview]').textContent = 'Commodity preview: shells become the first common money. Traders quote prices in shells and accept them broadly, so you do not need the exact good they personally want.';
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
      const pos = boardPosition(index);
      const colorBar = space.color && space.color !== '#ffffff' ? `<span class="color-bar" style="background:${space.color}"></span>` : '';
      return `<button class="board-space ${pos.side} ${space.type} ${tokens ? 'active' : ''}" style="grid-column:${pos.col};grid-row:${pos.row}" title="${space.name}">
        ${colorBar}
        <span class="space-icon">${space.icon}</span>
        <strong>${space.name}</strong>
        <small>${spaceLabel(space)}</small>
        <span class="tokens">${tokens}</span>
      </button>`;
    }).join('');
  }

  function boardPosition(index) {
    if (index <= 10) return { col: 11 - index, row: 11, side: index === 0 || index === 10 ? 'corner' : 'bottom' };
    if (index <= 20) return { col: 1, row: 21 - index, side: index === 20 ? 'corner' : 'left' };
    if (index <= 30) return { col: index - 19, row: 1, side: index === 30 ? 'corner' : 'top' };
    return { col: 11, row: index - 29, side: index === 39 ? 'right' : 'right' };
  }

  function spaceLabel(space) {
    if (space.type === 'trade') return 'Trade here';
    if (space.type === 'start') return 'Collect mangoes';
    return 'Corner';
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

  function syncTradePartnerForSpace(space) {
    if (!space?.offers?.length) return;
    const preferred = state.players.slice(1).find((player) => space.offers.some((resource) => (player.inventory[resource] || 0) > 0));
    if (preferred) $('[data-trader-b]').value = preferred.id;
    syncTradeResourceAvailability();
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
    const attempts = $('[data-trade-attempts]');
    if (attempts) attempts.textContent = state.tradeAttempts;
  }

  function setCard(title, copy, danger) {
    $('[data-event-title]').textContent = title;
    $('[data-event-copy]').textContent = copy;
    $('[data-event-card]').classList.toggle('danger', danger);
  }

  function updateControls(enabled) {
    $$('[data-action="next-round"], [data-action="suggest-trade"], [data-action="trade"], [data-action="trade-here"], [data-action="accept-offer"], [data-action="skip-trade"], [data-action="sell-for-shells"]').forEach((button) => { button.disabled = !enabled; });
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
