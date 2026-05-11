(() => {
  const data = window.MONEYPOLY_DATA;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  const baseMangoPrices = { mangoes: 1, shells: 0.5, gold: 25, dollars: 1, sats: 0.002, slips: 22.5, water: 2, fish: 4, cows: 10, shelter: 20 };
  const moneyResources = ['shells', 'gold', 'slips', 'dollars', 'sats'];

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



  const workshopRounds = [
    { min: 0, title: 'Round 1: Barter only', objective: 'Trade cards/goods you have but do not need for goods you need. No money yet.', prompt: ['Who has something useful but cannot find the right match?', 'What makes double coincidence of wants hard?'] },
    { min: 2, title: 'Round 2: Changed needs', objective: 'Needs shift mid-game. Matching gets harder because wants matter in barter; later boards focus more on pricing, savings, and preserving wealth.', prompt: ['What changed when needs moved?', 'Did valuable goods automatically become good money?'] },
    { min: 4, title: 'Round 3: Commodity money introduced', objective: 'Shells, coffee beans, and beads begin acting as local money — but acceptance grows unevenly.', prompt: ['Why does a widely accepted good reduce failed trades?', 'What happens when a table refuses your commodity?'] },
    { min: 7, title: 'Bonus: Future planning', objective: 'You can preview next-round needs. Saving and pre-positioning helps generational wealth.', prompt: ['Who saved before the need arrived?', 'How does planning across time change wealth?'] },
    { min: 9, title: 'Bonus: Inflation + scarcity', objective: 'Extra shells enter circulation and scarce face-card goods cost more.', prompt: ['Did more money create more goods?', 'What happened to prices when everyone needed scarce goods?'] },
    { min: 11, title: 'Bonus: Divisibility + fungibility', objective: 'Large indivisible goods need a money changer, and some traders accept coffee beans but reject shells.', prompt: ['Why does divisibility matter for small transactions?', 'Are two “money” goods equally useful if acceptance differs?'] }
  ];
  const commodityNames = { shells: 'shells', mangoes: 'coffee beans', fish: 'beads' };
  const cityBranches = ['Florence', 'Venice', 'Rome'];

  const eraProfiles = {
    barter: {
      name: 'Barter', money: null, purchasingPower: 'No unit', debasement: 'No money to debase', seizure: 'Goods can be stolen', portability: 1,
      lesson: 'Direct barter requires a double coincidence of wants. It may help you survive today, but it is a weak path for building generational wealth.'
    },
    commodity: {
      name: 'Commodity Money', money: 'shells', purchasingPower: 'Usually helpful, but supply shocks can dilute shells', debasement: 'Possible if more shells flood in', seizure: 'Physical shells can be taken', portability: 3,
      lesson: 'Shells improve trade because many people accept one common good, but weak commodity money can still be diluted or damaged before wealth reaches the next generation.'
    },
    gold: {
      name: 'Gold Money',
      modeLabel: 'Hard commodity money edition',
      title: 'Gold becomes hard money',
      copy: 'Gold is scarce, durable, divisible, and hard to produce. This era asks why people moved from everyday commodities into harder savings money.',
      cardTitle: 'Gold Money: hard commodity money',
      cardCopy: 'Gold coins are scarce and durable, so they store value better than food or shells. Now test the physical tradeoffs: weight, clipping, theft, and confiscation.',
      money: 'gold', startingMoney: 3, purchasingPower: 'Strong unless coins are clipped', debasement: 'Coin clipping lowers trust', seizure: 'Physical confiscation/theft risk', portability: 3,
      lesson: 'Gold is hard commodity money and can store wealth across generations, but it is heavy to move and vulnerable to physical seizure.'
    },

    medici: {
      name: 'Credit & Ledgers',
      modeLabel: 'Credit & Ledgers / Medici Banking edition',
      title: 'Medici credit and ledgers',
      copy: 'Gold is valuable but heavy and risky. Deposit it with a trusted branch, receive signed credit slips, and test fees, reserves, bank runs, and ledger trust.',
      cardTitle: 'Credit & Ledgers: Medici banking',
      cardCopy: 'Use signed slips to move wealth safely between cities. Slips avoid bandits, but they only work when branches trust the ledger and hold enough reserves.',
      money: 'slips', startingMoney: 0, purchasingPower: 'Strong when branches honour the ledger', debasement: 'Bad loans and over-issued slips weaken trust', seizure: 'Rulers can pressure banks; physical gold can be robbed', portability: 4,
      lesson: 'Credit and ledgers made money more portable before modern fiat, but trust is fragile: reserves, signatures, city branches, and reputation matter.'
    },
    fiat: {
      name: 'Fiat Money',
      modeLabel: 'Fiat / paper money edition',
      title: 'Paper claims and government money',
      copy: 'Fiat money is useful and familiar, but its rules depend on institutions. This era introduces banking, leaders, controls, and money printing.',
      cardTitle: 'Fiat Money: paper promises',
      cardCopy: 'Dollars are convenient legal tender, but they are trust-based. Printing, bank busts, inflation, and account freezes change the game.',
      money: 'dollars', startingMoney: 40, purchasingPower: 'Falls when supply expands', debasement: 'Money printing raises prices', seizure: 'Accounts can freeze or debank', portability: 5,
      lesson: 'Fiat makes payment easy, but generational wealth is fragile when purchasing power depends on policy, banks, and money printing.'
    },
    bitcoin: {
      name: 'Bitcoin Money',
      modeLabel: 'Bitcoin / digital electronic money edition',
      title: 'Digital money with a fixed supply',
      copy: 'Bitcoin is digital electronic money with a hard cap. Crises can still happen around people, but the money itself is not printed or locally debased.',
      cardTitle: 'Bitcoin Money: hardest digital money',
      cardCopy: 'Sats move digitally and the supply cannot be inflated. Crises can damage goods, homes, and harvests — but the sats you saved are not debased.',
      money: 'sats', startingMoney: 30000, purchasingPower: 'Supply cannot be printed away', debasement: 'No money-printing debasement', seizure: 'Authorities may freeze property, not self-custodied sats', portability: 5,
      lesson: 'Bitcoin is sound digital money: crises can reduce goods in hand, but sats saved for the future are not printed away or locally frozen, making them stronger generational savings.'
    }
  };

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
    commodityUnlocked: false,
    purchasingPower: 100,
    debasementEvents: 0,
    seizureEvents: 0,
    portabilityHits: 0,
    freezeTurns: 0,
    seedProtected: true,
    accessLost: false,
    workshopPhase: workshopRounds[0],
    nextNeeds: ['water', 'shelter'],
    commodityAcceptance: 0,
    regionMoneyPreference: 'shells',
    divisibilityEvent: false,
    branchCity: 'Florence',
    bankReserves: { Florence: 4, Venice: 3, Rome: 2 },
    creditSlips: 0,
    feesPaid: 0,
    signedSlip: true,
    reserveStress: 0,
    bankRunRisk: 0,
    ledgerEntries: []
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
    on('[data-action="start-gold"]', 'click', () => startMoneyEra('gold'));
    on('[data-action="start-medici"]', 'click', () => startMoneyEra('medici'));
    on('[data-action="start-fiat"]', 'click', () => startMoneyEra('fiat'));
    on('[data-action="start-bitcoin"]', 'click', () => startMoneyEra('bitcoin'));
    on('[data-action="next-round"]', 'click', nextRound);
    on('[data-action="suggest-trade"]', 'click', suggestTrade);
    on('[data-action="trade"]', 'click', attemptManualTrade);
    on('[data-action="trade-here"]', 'click', tradeHere);
    on('[data-action="accept-offer"]', 'click', acceptOffer);
    on('[data-action="sell-for-shells"]', 'click', sellForMoney);
    on('[data-action="skip-trade"]', 'click', skipTrade);
    on('[data-action="preview-commodity"]', 'click', previewCommodity);
    on('[data-action="open-rules"]', 'click', () => {
      const modal = $('[data-rules-modal]');
      if (modal?.showModal) modal.showModal();
      else alert('Roll dice to move. Collect goods. Barter for water and shelter. Every 3 rounds, an event changes the market.');
    });
    on('[data-action="open-comparison"]', 'click', openComparison);
    on('[data-action="open-facilitator"]', 'click', openFacilitator);
    on('[data-trader-b]', 'change', syncTradeResourceAvailability);
    on('[data-sell-resource]', 'change', updateShellExchange);
    on('[data-sell-quantity]', 'input', updateShellExchange);
  }


  function resetWorkshopState() {
    state.workshopPhase = workshopRounds[0];
    state.nextNeeds = ['water', 'shelter'];
    state.commodityAcceptance = state.mode === 'commodity' ? 2 : 0;
    state.regionMoneyPreference = 'shells';
    state.divisibilityEvent = false;
    state.branchCity = 'Florence';
    state.bankReserves = { Florence: 4, Venice: 3, Rome: 2 };
    state.creditSlips = 0;
    state.feesPaid = 0;
    state.signedSlip = true;
    state.reserveStress = 0;
    state.bankRunRisk = 0;
    state.ledgerEntries = [];
  }

  function updateWorkshopPhase() {
    const phase = [...workshopRounds].reverse().find((round) => state.round >= round.min) || workshopRounds[0];
    const changed = state.workshopPhase?.title !== phase.title;
    state.workshopPhase = phase;
    if (state.mode === 'barter' && state.round >= 2) {
      human().wants = ['cows', 'water'];
      state.players[1].wants = ['shelter', 'fish'];
      state.players[2].wants = ['mangoes', 'shelter'];
      state.players[3].wants = ['water', 'cows'];
    }
    if (['commodity', 'medici'].includes(state.mode) || state.round >= 4) {
      state.commodityAcceptance = Math.min(5, Math.max(state.commodityAcceptance, 1 + Math.floor(state.round / 3)));
    }
    if (state.round >= 7) state.nextNeeds = state.round % 2 ? ['water', 'fish'] : ['shelter', 'cows'];
    if (state.round >= 11) state.divisibilityEvent = true;
    if (changed && state.round > 0) setCard(phase.title, `${phase.objective} Facilitator prompt: ${phase.prompt[0]}`, false);
  }

  function renderWorkshopPanel() {
    const title = $('[data-workshop-title]');
    if (!title) return;
    const phase = state.workshopPhase || workshopRounds[0];
    title.textContent = state.mode === 'medici' ? 'Workshop 2: Credit and Ledgers with the Medici' : phase.title;
    $('[data-workshop-copy]').textContent = state.mode === 'medici'
      ? `City: ${state.branchCity}. Bank reserves F/V/R: ${state.bankReserves.Florence}/${state.bankReserves.Venice}/${state.bankReserves.Rome}. Signed slips avoid bandits, but redemption depends on ledger trust and reserves.`
      : phase.objective;
    $('[data-workshop-prompts]').innerHTML = (state.mode === 'medici'
      ? ['Why are paper slips safer than carrying gold?', 'What makes the signature and ledger trustworthy?', 'What happens if too many people redeem at once?']
      : phase.prompt).map((item) => `<li>${item}</li>`).join('');
    const future = $('[data-future-panel]');
    if (future) future.innerHTML = `<strong>Future planning preview</strong><br>Next generation likely needs: ${state.nextNeeds.map(label).join(', ')}. Save or pre-position these to improve the wealth score.`;
  }

  function compactHaveNeed(player) {
    const have = Object.entries(player.inventory)
      .filter(([, amount]) => amount > 0)
      .slice(0, 6)
      .map(([resource, amount]) => `<span>${data.resources[resource].icon} ${formatAmount(resource, amount)} ${label(resource)}</span>`).join('') || '<span>Nothing spare</span>';
    if (state.mode === 'barter') {
      const need = [...new Set([...missingNeeds(player), ...(player.wants || [])])].slice(0, 5).map((resource) => `<span>${data.resources[resource].icon} ${label(resource)}</span>`).join('') || '<span>Needs met</span>';
      return `<div class="have-need-grid"><div class="mini-card"><strong>Have</strong>${have}</div><div class="mini-card"><strong>Need / wants</strong>${need}</div></div>`;
    }
    const survival = missingNeeds(player).length
      ? missingNeeds(player).map((resource) => `<span>${data.resources[resource].icon} Need ${label(resource)}</span>`).join('')
      : '<span>Survival needs met</span>';
    const money = currentMoneyResource();
    const moneyLine = money ? `<span>${data.resources[money].icon} ${formatAmount(money, player.inventory[money] || 0)} ${label(money)} saved</span>` : '';
    return `<div class="have-need-grid"><div class="mini-card"><strong>Have</strong>${have}</div><div class="mini-card"><strong>Survival + savings</strong>${survival}${moneyLine}<span>Next gen: ${state.nextNeeds.map(label).join(', ')}</span></div></div>`;
  }

  function mediciStatusLine() {
    if (state.mode !== 'medici') return '';
    return `<p class="ledger-line">🏦 Medici ledger: ${formatAmount('gold', human().inventory.gold || 0)} gold carried · ${formatAmount('slips', human().inventory.slips || 0)} signed slips · fees paid ${formatAmount('slips', state.feesPaid)} · reserve stress ${state.reserveStress} · bank run risk ${state.bankRunRisk}.</p>`;
  }

  function openComparison() {
    const target = $('[data-comparison-cards]');
    if (target) target.innerHTML = `<div class="comparison-grid standalone">${Object.entries(eraProfiles).map(([key, profile]) => `
      <article class="comparison-card ${key === state.mode ? 'active' : ''}">
        <h3>${profile.name}</h3>
        <p><b>Purchasing power:</b> ${profile.purchasingPower}</p>
        <p><b>Debasement:</b> ${profile.debasement}</p>
        <p><b>Seize/freeze:</b> ${profile.seizure}</p>
        <p><b>Carry/divide/use:</b> ${profile.portability}/5</p>
        <p>${profile.lesson}</p>
      </article>`).join('')}</div>`;
    const modal = $('[data-comparison-modal]');
    if (modal?.showModal) modal.showModal();
  }

  function openFacilitator() {
    const modal = $('[data-facilitator-modal]');
    if (modal?.showModal) modal.showModal();
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
    state.purchasingPower = 100;
    state.debasementEvents = 0;
    state.seizureEvents = 0;
    state.portabilityHits = 0;
    state.freezeTurns = 0;
    state.seedProtected = true;
    state.accessLost = false;
    resetWorkshopState();
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
    state.purchasingPower = 100;
    state.debasementEvents = 0;
    state.seizureEvents = 0;
    state.portabilityHits = 0;
    state.freezeTurns = 0;
    state.seedProtected = true;
    state.accessLost = false;
    resetWorkshopState();
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
    renderShellExchange(state.proposedOffer);
  }


  function startMoneyEra(era) {
    const info = eraProfiles[era];
    if (!info) return;
    state.mode = era;
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
    state.purchasingPower = 100;
    state.debasementEvents = 0;
    state.seizureEvents = 0;
    state.portabilityHits = 0;
    state.freezeTurns = 0;
    state.seedProtected = era === 'bitcoin';
    state.accessLost = false;
    resetWorkshopState();
    state.players = clone(data.players).map((player, index) => ({ ...player, position: index * 10 }));
    state.players.forEach((player, index) => {
      moneyResources.forEach((resource) => { player.inventory[resource] = 0; });
      if (info.money) player.inventory[info.money] = index === 0 ? info.startingMoney : Math.max(1, Math.round(info.startingMoney * 0.6));
      if (era === 'medici') {
        player.inventory.gold = index === 0 ? 4 : 2;
        player.inventory.slips = index === 0 ? 1 : 1;
      }
    });
    $('[data-results]').classList.add('hidden');
    $('[data-commodity-preview]').textContent = '';
    toggleCommodityButton(true);
    updateBoardDescription();
    setCard(info.cardTitle, info.cardCopy, false);
    setLandingAction(null);
    $('[data-turn-copy]').textContent = `${info.name}: roll dice, buy essentials with ${label(info.money)}, and watch how this money handles crises.`;
    updateControls(true);
    renderAll();
    renderShellExchange(null);
  }

  function nextRound() {
    if (!state.started) return;
    state.round += 1;
    updateWorkshopPhase();
    harvestMangoes();
    rollDice();
    moveHuman();
    moveNeighbours();
    resolveLandingSpace(human());
    consumeSurvivalNeeds();
    renderAll();
    renderShellExchange(state.proposedOffer);
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
    } else if (state.mode === 'fiat') {
      human().inventory.dollars = (human().inventory.dollars || 0) + 2;
      state.shellsEarned = 0;
    } else if (state.mode === 'bitcoin') {
      state.shellsEarned = 0;
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
    const moneyNote = state.mode === 'commodity' ? ` and earned ${state.shellsEarned} shell${state.shellsEarned === 1 ? '' : 's'}` : state.mode === 'fiat' ? ' and received 2 new dollars of income' : '';
    $('[data-turn-copy]').textContent = `Maya harvested ${state.mangoHarvest} mango${state.mangoHarvest === 1 ? '' : 'es'}${moneyNote}. You rolled ${roll} and landed on ${boardSpaces[player.position].name}.`;
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
    const reasonText = reason === 'crisis' ? 'You hit a crisis space.' : 'Three trades have passed.';

    if (state.mode === 'gold') return triggerGoldEvent(event, reasonText);
    if (state.mode === 'medici') return triggerMediciEvent(event, reasonText);
    if (state.mode === 'fiat') return triggerFiatEvent(event, reasonText);
    if (state.mode === 'bitcoin') return triggerBitcoinEvent(event, reasonText);

    state.marketShock = { ...event, remainingTrades: 3 };
    if (event.damage === 'mangoes') {
      human().inventory.mangoes = Math.floor((human().inventory.mangoes || 0) / 2);
    }
    if (event.shellInflation) {
      state.shellInflation = { remainingTrades: 3, multiplier: 2 };
    }
    setCard(`${event.icon} ${event.title}`, `${reasonText} ${event.description} ${event.shellInflation ? 'For the next 3 offers, goods priced in shells cost 2× more.' : `For the next 3 trade offers, ${label(event.scarce)} costs 50% more.`}`, true);
    $('[data-trade-feedback]').textContent = event.shellInflation ? `${event.title}: shell prices doubled for the next 3 offers.` : `${event.title}: ${label(event.scarce)} now costs 50% more for the next 3 offers.`;
  }

  function triggerGoldEvent(event, reasonText) {
    const cycle = state.tradeAttempts + state.round;
    if (cycle % 3 === 0) {
      state.debasementEvents += 1;
      state.purchasingPower = Math.max(65, state.purchasingPower - 12);
      state.marketShock = { title: 'Coin clipping', icon: '✂️', scarce: 'gold', multiplier: 1.25, remainingTrades: 3 };
      setCard('✂️ Coin clipping', `${reasonText} Some coins are clipped. Traders now demand extra gold because trust in coin weight fell.`, true);
      $('[data-trade-feedback]').textContent = 'Coin clipping: gold prices are 25% higher for the next 3 offers.';
    } else {
      state.seizureEvents += 1;
      state.portabilityHits += 1;
      human().inventory.gold = Math.max(0, (human().inventory.gold || 0) - 1);
      setCard('🛡️ Road toll and theft risk', `${reasonText} Carrying wealth physically has risk. You lost 1 gold coin to a toll/confiscation attempt.`, true);
      $('[data-trade-feedback]').textContent = 'Physical-risk event: gold stores value, but moving it invites theft or seizure.';
    }
  }


  function triggerMediciEvent(event, reasonText) {
    const player = human();
    const cycle = (state.tradeAttempts + state.round) % 4;
    if (cycle === 0) {
      const lost = Math.min(1, player.inventory.gold || 0);
      player.inventory.gold = Math.max(0, (player.inventory.gold || 0) - lost);
      state.seizureEvents += lost ? 1 : 0;
      setCard('🗡️ Bandits on the road', `${reasonText} Bandits can rob physical gold${lost ? ` — you lost ${lost} gold.` : ', but you carried no gold.'} Signed paper slips were not useful to steal and stayed safe.`, true);
      $('[data-trade-feedback]').textContent = 'Bandit risk: paper credit can move wealth more safely than heavy gold.';
      return;
    }
    if (cycle === 1) {
      state.bankRunRisk += 1;
      state.reserveStress += 1;
      Object.keys(state.bankReserves).forEach((city) => { state.bankReserves[city] = Math.max(0, state.bankReserves[city] - 1); });
      setCard('🏦 Bank run', `${reasonText} Too many people redeem at once. Branch reserves fall; slips still exist, but trust is stressed.`, true);
      $('[data-trade-feedback]').textContent = 'Bank run: credit depends on reserves and reputation, not just paper.';
      return;
    }
    if (cycle === 2) {
      state.branchCity = cityBranches[(cityBranches.indexOf(state.branchCity) + 1) % cityBranches.length];
      setCard('📍 Wrong-city redemption', `${reasonText} You travelled to ${state.branchCity}. A slip signed in one branch may need ledger confirmation before another branch redeems it.`, true);
      $('[data-trade-feedback]').textContent = 'Ledger network lesson: credit travels only as far as trust and recordkeeping.';
      return;
    }
    state.seizureEvents += 1;
    state.freezeTurns = 1;
    setCard('👑 Ruler pressures the bank', `${reasonText} A ruler threatens a temporary freeze. The ledger is powerful, but political pressure can interrupt redemption.`, true);
    $('[data-trade-feedback]').textContent = 'Ruler pressure: trusted intermediaries can be coerced.';
  }

  function triggerFiatEvent(event, reasonText) {
    const cycle = state.tradeAttempts + state.round;
    if (cycle % 2 === 0) {
      const stimulus = 12;
      human().inventory.dollars = (human().inventory.dollars || 0) + stimulus;
      state.purchasingPower = Math.max(45, state.purchasingPower - 15);
      state.debasementEvents += 1;
      state.marketShock = { title: 'Money printing', icon: '🖨️', scarce: 'dollars', multiplier: 1.35, remainingTrades: 3 };
      setCard('🖨️ Stimulus and inflation', `${reasonText} You received ${stimulus} dollars, but more money chases the same goods. Prices rise for the next 3 offers.`, true);
      $('[data-trade-feedback]').textContent = 'Money printing: you have more dollars, but each dollar buys less.';
    } else {
      state.seizureEvents += 1;
      state.freezeTurns = 1;
      setCard('🏦 Bank freeze / debanking', `${reasonText} A bank/policy shock freezes your account for one trade. Fiat is convenient, but permissions matter.`, true);
      $('[data-trade-feedback]').textContent = 'Freeze risk: you may need to skip or barter until the account unfreezes.';
    }
  }

  function triggerBitcoinEvent(event, reasonText) {
    const player = human();
    const cycle = (state.tradeAttempts + state.round) % 4;
    if (cycle === 0) {
      const before = player.inventory.shelter || 0;
      player.inventory.shelter = Math.min(before, 1);
      state.seizureEvents += 1;
      setCard('🏛️ New housing decree', `${reasonText} A new government freezes housing assets and limits shelter to 1 per person. You lost ${Math.max(0, before - player.inventory.shelter)} shelter, but your sats were not frozen or debased.`, true);
      $('[data-trade-feedback]').textContent = 'Bitcoin lesson: authorities can interfere with property, but self-custodied sats are still savings you can use later.';
      return;
    }
    if (cycle === 1) {
      const before = player.inventory.mangoes || 0;
      player.inventory.mangoes = Math.floor(before / 2);
      state.marketShock = { title: 'Pest outbreak', icon: '🐛', scarce: 'mangoes', multiplier: 1.5, remainingTrades: 3 };
      setCard('🐛 Pest outbreak', `${reasonText} Mango production was cut in half. You lost ${before - player.inventory.mangoes} mangoes, but no sats were printed away. This is why saving in sats protects value beyond today’s harvest.`, true);
      $('[data-trade-feedback]').textContent = 'Pests damaged food in hand; sats stayed intact.';
      return;
    }
    if (cycle === 2) {
      const before = player.inventory.water || 0;
      player.inventory.water = Math.floor(before / 2);
      state.marketShock = { title: 'Contaminated water', icon: '💧', scarce: 'water', multiplier: 1.5, remainingTrades: 3 };
      setCard('💧 Contaminated water', `${reasonText} Half your water supply was contaminated. You lost ${before - player.inventory.water} water, but your sats still measure saved value.`, true);
      $('[data-trade-feedback]').textContent = 'Water got reduced; sats were not debased.';
      return;
    }
    const before = player.inventory.cows || 0;
    player.inventory.cows = Math.max(0, before - 1);
    state.marketShock = { ...event, remainingTrades: 3 };
    setCard(`${event.icon} ${event.title}`, `${reasonText} A real-world crisis reduced goods in hand${before ? ' — you lost 1 cow.' : '.'} Goods are scarce, but sats were not printed or locally frozen.`, true);
    $('[data-trade-feedback]').textContent = `${event.title}: goods/assets took the hit; Bitcoin savings stayed intact.`;
  }

  function priceMultiplier(resource, pay = null) {
    if (pay === 'shells' && resource !== 'shells' && state.shellInflation) return state.shellInflation.multiplier;
    if (state.mode === 'fiat' && pay === 'dollars') return Math.max(1, 100 / Math.max(35, state.purchasingPower));
    if (state.mode === 'gold' && pay === 'gold' && state.marketShock?.scarce === 'gold') return state.marketShock.multiplier;
    if (state.mode === 'medici' && pay === 'slips') return state.reserveStress ? 1 + (state.reserveStress * 0.15) : 1;
    return state.marketShock?.scarce === resource && !state.marketShock.shellInflation ? state.marketShock.multiplier : 1;
  }

  function shockLine(resource, pay = null) {
    if (pay === 'shells' && state.shellInflation) return `<p class="shock-line">🐚 Shell rush: goods priced in shells cost 2× more for ${state.shellInflation.remainingTrades} more offer${state.shellInflation.remainingTrades === 1 ? '' : 's'}.</p>`;
    if (state.mode === 'fiat' && pay === 'dollars' && state.purchasingPower < 100) return `<p class="shock-line">🖨️ Purchasing power meter: ${state.purchasingPower}/100. Goods require more dollars now.</p>`;
    if (state.mode === 'gold' && pay === 'gold' && state.marketShock?.scarce === 'gold') return `<p class="shock-line">✂️ Clipped coins: traders demand extra gold for ${state.marketShock.remainingTrades} more offer${state.marketShock.remainingTrades === 1 ? '' : 's'}.</p>`;
    if (state.mode === 'medici' && pay === 'slips') return `<p class="ledger-line">📜 Signed Medici slips pay safely, minus a 10% banking fee when you create them. Branch reserve stress: ${state.reserveStress}.</p>`;
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
    const skipButton = $('[data-action="skip-trade"]');
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
      <span class="eyebrow">${eraProfiles[state.mode]?.money ? `${eraProfiles[state.mode].name} offer` : 'Proposed trade'}</span>
      <h3>${space.trader || space.name} offers</h3>
      <div class="deal-equation"><strong>${formatAmount(proposal.receive, proposal.receiveQty)} ${data.resources[proposal.receive].icon} ${label(proposal.receive)}</strong><span>for</span><strong>${formatAmount(proposal.pay, proposal.payQty)} ${data.resources[proposal.pay].icon} ${label(proposal.pay)}</strong></div>
      ${compactHaveNeed(human())}
      <p>Base market: ${proposal.baseText}. This offer is ${proposal.discountPercent}% under base${proposal.crisisApplied ? ', then crisis pricing' : ''}.</p>
      ${relativePriceLine(proposal.pay)}
      <p class="${proposal.canAfford ? 'afford-line' : 'cannot-afford-line'}">${proposal.canAfford ? 'You can afford this trade.' : `You cannot afford this yet. Save more ${label(proposal.pay)} and come back later.`}</p>
      <p>${proposal.goodDeal ? 'This looks useful for your survival needs.' : 'This may be expensive, but barter is messy.'}</p>
      ${proposal.acceptance?.copy ? `<p class="acceptance-line">${proposal.acceptance.copy}</p>` : ''}
      ${state.divisibilityEvent ? `<p class="acceptance-line">🪓 Divisibility event: large goods like shelter/cows are hard to split. Money changers and smaller units make exact payment easier.</p>` : ''}
      ${mediciStatusLine()}
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
    const eraMoney = eraProfiles[state.mode]?.money;
    if (state.mode === 'commodity') {
      const preferred = commodityPreferenceFor(space);
      if (payable.includes(preferred)) {
        payable.splice(payable.indexOf(preferred), 1);
        payable.unshift(preferred);
      }
    } else if (eraMoney && receive !== eraMoney) {
      const existing = payable.indexOf(eraMoney);
      if (existing > -1) payable.splice(existing, 1);
      payable.unshift(eraMoney);
    }
    const candidates = payable.map((resource) => {
      const acceptability = commodityAcceptability(space, resource);
      const costInMangoes = baseMangoPrices[receive] * receiveQty * discount * priceMultiplier(receive, resource) * acceptability.multiplier;
      const rawQty = costInMangoes / baseMangoPrices[resource];
      const payQty = priceQuantity(resource, rawQty);
      const inventory = player.inventory[resource] || 0;
      return { resource, payQty, inventory, sufficient: inventory >= payQty, notAll: inventory > payQty };
    });
    const choice = (eraMoney ? candidates.find((candidate) => candidate.resource === eraMoney) : null)
      || candidates.find((candidate) => candidate.sufficient && candidate.notAll)
      || candidates.find((candidate) => candidate.sufficient)
      || candidates.find((candidate) => candidate.resource === 'mangoes')
      || candidates[0]
      || { resource: 'mangoes', payQty: priceQuantity('mangoes', baseMangoPrices[receive] * receiveQty), inventory: 0, sufficient: false };
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
      crisisApplied: priceMultiplier(receive, choice.resource) > 1,
      acceptance: commodityAcceptability(space, choice.resource)
    };
  }


  function commodityPreferenceFor(space) {
    if (state.mode !== 'commodity') return eraProfiles[state.mode]?.money || 'mangoes';
    const index = boardSpaces.indexOf(space);
    if (index % 5 === 0) return 'fish'; // beads at this table
    if (index % 4 === 0) return 'mangoes'; // coffee beans at this table
    return 'shells';
  }

  function commodityAcceptability(space, pay) {
    if (state.mode !== 'commodity') return { accepted: true, multiplier: 1, copy: '' };
    const preferred = commodityPreferenceFor(space);
    const acceptsShells = pay === 'shells' && (state.commodityAcceptance >= 3 || preferred === 'shells');
    const accepted = pay === preferred || acceptsShells;
    return {
      accepted,
      multiplier: accepted ? 1 : 1.6,
      copy: accepted
        ? `${label(pay)} accepted at this table. Acceptance is spreading, but preferences still differ.`
        : `${label(pay)} is not this table’s preferred commodity (${commodityNames[preferred] || label(preferred)}). The trader demands a steep premium — fungibility/acceptability problem.`
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
    return `${formatAmount(receive, receiveQty)} ${label(receive)} ≈ ${formatAmount(pay, payUnits)} ${label(pay)}`;
  }

  function priceQuantity(resource, rawQty) {
    if (resource === 'sats') return Math.max(100, Math.ceil(rawQty / 100) * 100);
    if (resource === 'gold' || resource === 'slips') return Math.max(0.1, Math.ceil(rawQty * 10) / 10);
    if (resource === 'dollars') return Math.max(1, Math.ceil(rawQty));
    return Math.max(1, Math.round(rawQty));
  }

  function formatAmount(resource, amount) {
    const value = Number(amount || 0);
    if (resource === 'sats') return String(Math.round(value));
    if (resource === 'gold' || resource === 'slips') return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '');
    if (resource === 'dollars') return String(Math.round(value));
    return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '');
  }

  function relativePriceLine(pay) {
    if (pay === 'gold') return '<p class="price-line">⚖️ Relative pricing: 1 gold coin ≈ 25 mangoes / 25 dollars. Small goods should cost fractions of a coin, not a whole coin.</p>';
    if (pay === 'slips') return '<p class="price-line">📜 Relative pricing: 1 credit slip is a paper claim worth about 0.9 gold after the 10% fee, so small goods use fractional slips.</p>';
    if (pay === 'dollars') return '<p class="price-line">💵 Relative pricing: dollars are the unit of account here — mango $1, water about $2, cow about $10, shelter about $20 before shocks.</p>';
    if (pay === 'sats') return '<p class="price-line">₿ Relative pricing: sats are tiny units, so even small goods can be priced without forcing a full large coin.</p>';
    return '';
  }

  function currentMoneyResource() {
    return eraProfiles[state.mode]?.money || null;
  }

  function renderShellExchange(proposal = state.proposedOffer) {
    const box = $('[data-shell-exchange]');
    if (!box) return;
    const targetMoney = currentMoneyResource();
    if (!targetMoney) {
      box.classList.add('hidden');
      return;
    }
    box.classList.remove('hidden');
    const heading = box.querySelector('.eyebrow');
    const button = $('[data-action="sell-for-shells"]');
    if (heading) heading.textContent = `${label(targetMoney)} changer`;
    if (button) button.textContent = `Sell for ${label(targetMoney)}`;
    const select = $('[data-sell-resource]');
    const current = select.value;
    select.innerHTML = Object.entries(human().inventory)
      .filter(([resource, amount]) => resource !== targetMoney && amount > 0 && baseMangoPrices[resource])
      .map(([resource, amount]) => `<option value="${resource}">${data.resources[resource].icon} ${label(resource)} (${amount})</option>`).join('');
    if (current && Array.from(select.options).some((option) => option.value === current)) select.value = current;
    updateShellExchange();
  }

  function updateShellExchange() {
    const copy = $('[data-shell-exchange-copy]');
    const qtyInput = $('[data-sell-quantity]');
    const targetMoney = currentMoneyResource();
    if (!copy || !qtyInput || !targetMoney) return;
    const resource = $('[data-sell-resource]')?.value;
    if (!resource) {
      copy.textContent = `You have nothing available to sell for ${label(targetMoney)}.`;
      return;
    }
    const max = human().inventory[resource] || 0;
    qtyInput.max = String(max);
    let units = Math.max(1, Math.floor(Number(qtyInput.value) || 1));
    if (units > max) units = max;
    qtyInput.value = String(units);
    const moneyRaised = moneyFor(resource, units, targetMoney);
    const proposal = state.proposedOffer;
    const extra = proposal?.pay === targetMoney
      ? ` Current offer costs ${formatAmount(targetMoney, proposal.payQty)} ${label(targetMoney)}; you have ${formatAmount(targetMoney, human().inventory[targetMoney] || 0)}.`
      : '';
    const unavailable = moneyRaised <= 0 ? ` This is not enough value for a signed ${label(targetMoney)} claim yet — sell a larger bundle.` : '';
    copy.textContent = `Sell ${formatAmount(resource, units)} ${label(resource)} for ${formatAmount(targetMoney, moneyRaised)} ${label(targetMoney)}. This is separate from the landing offer.${extra}${unavailable}`;
  }

  function moneyFor(resource, units, targetMoney) {
    const valueInMangoes = units * baseMangoPrices[resource];
    const raw = valueInMangoes / baseMangoPrices[targetMoney];
    return priceQuantity(targetMoney, raw);
  }

  function sellForMoney() {
    const targetMoney = currentMoneyResource();
    const resource = $('[data-sell-resource]')?.value;
    const qtyInput = $('[data-sell-quantity]');
    if (!targetMoney || !resource || !qtyInput) return;
    const max = human().inventory[resource] || 0;
    const units = Math.max(1, Math.min(max, Math.floor(Number(qtyInput.value) || 1)));
    if (!max || units > max) {
      $('[data-trade-feedback]').textContent = `You do not have enough ${label(resource)} to sell.`;
      return;
    }
    let moneyRaised = moneyFor(resource, units, targetMoney);
    if (state.mode === 'medici' && targetMoney === 'slips') {
      const fee = Math.max(0.01, Math.round(moneyRaised * 0.1 * 100) / 100);
      moneyRaised = Math.max(0, Math.round((moneyRaised - fee) * 100) / 100);
      state.feesPaid = Math.round((state.feesPaid + fee) * 100) / 100;
      state.signedSlip = true;
      state.ledgerEntries.push(`Deposited ${formatAmount(resource, units)} ${label(resource)} for ${formatAmount('slips', moneyRaised)} signed slips; fee ${formatAmount('slips', fee)}.`);
    }
    if (moneyRaised <= 0) {
      $('[data-trade-feedback]').textContent = `That bundle is not valuable enough for a signed ${label(targetMoney)} claim. Sell more goods or choose a higher-value item.`;
      return;
    }
    human().inventory[resource] -= units;
    human().inventory[targetMoney] = (human().inventory[targetMoney] || 0) + moneyRaised;
    if (state.proposedOffer?.pay === targetMoney) {
      state.proposedOffer.canAfford = (human().inventory[targetMoney] || 0) >= state.proposedOffer.payQty;
      $('[data-action="accept-offer"]').disabled = !state.proposedOffer.canAfford;
      refreshAffordabilityLine(state.proposedOffer);
    }
    $('[data-trade-feedback]').textContent = `Sold ${formatAmount(resource, units)} ${label(resource)} for ${formatAmount(targetMoney, moneyRaised)} ${label(targetMoney)}. This was just a money exchange, not the purchase.`;
    renderHumanPanel();
    syncTradeResourceAvailability();
    renderShellExchange(state.proposedOffer);
  }

  function refreshAffordabilityLine(proposal) {
    const line = document.querySelector('.cannot-afford-line, .afford-line');
    if (!line || !proposal) return;
    proposal.canAfford = (human().inventory[proposal.pay] || 0) >= proposal.payQty;
    line.className = proposal.canAfford ? 'afford-line' : 'cannot-afford-line';
    line.textContent = proposal.canAfford
      ? 'You can afford this trade now.'
      : `You cannot afford this yet. Save more ${label(proposal.pay)} and come back later.`;
  }

  function acceptOffer() {
    const proposal = state.proposedOffer;
    if (!proposal) return;
    const player = human();
    const feedback = $('[data-trade-feedback]');
    if (state.mode === 'fiat' && state.freezeTurns > 0 && proposal.pay === 'dollars') {
      state.freezeTurns -= 1;
      state.tradeAttempts += 1;
      state.failedTrades += 1;
      feedback.textContent = 'Payment failed: your fiat account was frozen for this trade.';
      maybeTriggerTradeEvent();
      renderAll();
      return;
    }
    if (state.mode === 'bitcoin' && state.accessLost && proposal.pay === 'sats') {
      feedback.textContent = 'Access problem: recover your custody habit by rolling through one more event, then try again.';
      state.accessLost = false;
      renderAll();
      return;
    }
    if ((player.inventory[proposal.pay] || 0) < proposal.payQty) {
      feedback.textContent = `You cannot afford this yet. Keep harvesting mangoes and save for a later trade.`;
      renderAll();
      return;
    }
    if (state.mode === 'medici' && proposal.pay === 'slips') {
      if (!state.signedSlip) {
        state.failedTrades += 1;
        feedback.textContent = 'Payment failed: the branch manager did not sign this slip. Trust requires verification.';
        renderAll();
        return;
      }
      const reserveCity = state.branchCity;
      if ((state.bankReserves[reserveCity] || 0) <= 0) {
        state.failedTrades += 1;
        state.reserveStress += 1;
        feedback.textContent = `${reserveCity} branch has no reserves. The slip is a claim, but redemption fails during reserve stress.`;
        maybeTriggerTradeEvent();
        renderAll();
        return;
      }
      if (state.freezeTurns > 0) {
        state.freezeTurns -= 1;
        state.failedTrades += 1;
        feedback.textContent = 'A ruler pressured the bank. Redemption is temporarily frozen even though the ledger still records your claim.';
        renderAll();
        return;
      }
      state.bankReserves[reserveCity] = Math.max(0, state.bankReserves[reserveCity] - 0.25);
      state.ledgerEntries.push(`Paid ${formatAmount(proposal.pay, proposal.payQty)} signed slips in ${reserveCity} for ${formatAmount(proposal.receive, proposal.receiveQty)} ${label(proposal.receive)}.`);
    }
    if (state.mode === 'gold' && proposal.pay === 'gold' && proposal.payQty > 1) {
      state.portabilityHits += 1;
      feedback.textContent = 'Heavy gold trade: carrying several coins slowed the deal, but it still settled.';
    }
    state.tradeAttempts += 1;
    countShockOffer();
    player.inventory[proposal.pay] -= proposal.payQty;
    player.inventory[proposal.receive] = (player.inventory[proposal.receive] || 0) + proposal.receiveQty;
    state.successfulTrades += 1;
    if (!(state.mode === 'gold' && proposal.pay === 'gold' && proposal.payQty > 1)) feedback.textContent = `Accepted: you traded ${formatAmount(proposal.pay, proposal.payQty)} ${label(proposal.pay)} for ${formatAmount(proposal.receive, proposal.receiveQty)} ${label(proposal.receive)}.`;
    setCard('Offer accepted', offerLesson(), false);
    setLandingAction(null);
    maybeTriggerTradeEvent();
    renderAll();
    scheduleAutoRoll();
  }


  function offerLesson() {
    if (state.mode === 'commodity') return 'Shells worked as commodity money: the trader accepted them even without needing your mangoes.';
    if (state.mode === 'gold') return 'Gold settled the trade because it is scarce and trusted, though physical coins create handling risk.';
    if (state.mode === 'medici') return 'A signed credit slip settled without carrying heavy gold — because the trader trusted the Medici ledger and branch reserves.';
    if (state.mode === 'fiat') return 'Dollars settled quickly because the market accepts legal-tender paper, as long as accounts stay usable.';
    if (state.mode === 'bitcoin') return 'Sats settled digitally. Lightning-style payment is fast, while self-custody keeps responsibility with you.';
    return 'A barter deal worked because you accepted the exact terms from this trader.';
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
    $('[data-trade-feedback]').textContent = 'You skipped this trade. Rolling to the next trader...';
    setCard('Trade skipped', state.mode === 'commodity' ? 'No deal. Shells stay in your wallet and you move to the next offer.' : 'Sometimes the best barter move is no deal. Waiting for the right counterparty matters.', false);
    setLandingAction(null);
    scheduleAutoRoll();
  }

  function scheduleAutoRoll() {
    if (!state.started || state.round >= 15) return;
    updateControls(false);
    window.setTimeout(() => {
      if (!state.started) return;
      updateControls(true);
      nextRound();
    }, 650);
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
      copy.textContent = 'Shells are broadly accepted. Survive first, then see whether shell savings can preserve wealth for the next generation when crises hit.';
    } else if (['gold', 'medici', 'fiat', 'bitcoin'].includes(state.mode)) {
      const info = eraProfiles[state.mode];
      mode.textContent = info.modeLabel;
      title.textContent = info.title;
      copy.textContent = info.copy;
    } else {
      mode.textContent = 'Barter edition';
      title.textContent = 'Survive, then build wealth';
      copy.textContent = 'Move from trader to trader. Survival matters, but the bigger test is whether this system can help Maya save wealth for future generations.';
    }
  }

  function finishGame() {
    state.started = false;
    updateControls(false);
    const player = human();
    const missing = missingNeeds(player);
    const profile = eraProfiles[state.mode] || eraProfiles.barter;
    const survived = missing.length === 0;
    const portabilityScore = Math.max(1, (profile.portability || 2) - state.portabilityHits);
    $('[data-results]').classList.remove('hidden');
    toggleCommodityButton(true);
    $('[data-result-summary]').textContent = survived
      ? `You survived the ${profile.name} board with food, water, and shelter after ${state.tradeAttempts} trade attempts. Now compare whether this money helped Maya preserve wealth for future generations.`
      : `You ended the ${profile.name} board short on ${missing.map(label).join(', ')} after ${state.tradeAttempts} trade attempts. Survival comes first before generational wealth is possible.`;
    const lessons = [
      `Survived: ${survived ? 'Yes' : 'No — missing ' + missing.map(label).join(', ')}`,
      `Trades: ${state.successfulTrades} successful, ${state.failedTrades} failed`,
      `Purchasing power: ${state.mode === 'fiat' ? state.purchasingPower + '/100' : profile.purchasingPower}`,
      `Debasement: ${state.debasementEvents ? state.debasementEvents + ' event(s)' : profile.debasement}`,
      `Seize/freeze risk: ${state.seizureEvents ? state.seizureEvents + ' event(s)' : profile.seizure}`,
      `Portability / divisibility / ease of use: ${portabilityScore}/5`,
      state.mode === 'medici' ? `Ledger trust: signed slips ${human().inventory.slips || 0}, branch reserves F/V/R ${state.bankReserves.Florence}/${state.bankReserves.Venice}/${state.bankReserves.Rome}, bank run risk ${state.bankRunRisk}` : null,
      `Generational wealth test: ${generationalWealthSummary(profile, portabilityScore)}`,
      `Lesson: ${profile.lesson}`
    ];
    $('[data-result-lessons]').innerHTML = lessons.filter(Boolean).map((lesson) => `<li>${lesson}</li>`).join('') + comparisonHtml(state.mode);
    setCard(`${profile.name} round complete`, profile.lesson, false);
  }

  function generationalWealthSummary(profile, portabilityScore) {
    const weakDebasement = String(profile.debasement).toLowerCase().includes('printing') || String(profile.debasement).toLowerCase().includes('dilute');
    const weakSeizure = String(profile.seizure).toLowerCase().includes('seiz') || String(profile.seizure).toLowerCase().includes('freeze') || String(profile.seizure).toLowerCase().includes('stolen');
    if (profile.name === 'Bitcoin Money') return 'Strong — savings in sats are not printed away, and self-custody helps pass value forward.';
    if (profile.name === 'Credit & Ledgers') return 'Moderate-strong while trust holds — portable signed claims help, but bank runs and reserves can break the promise.';
    if (profile.name === 'Gold Money') return 'Good but physical — durable savings, with transport and seizure risks.';
    if (weakDebasement || weakSeizure || portabilityScore < 3) return 'Weak — survival may be possible, but passing wealth forward is fragile.';
    return 'Moderate — useful for trade, but test how it handles crisis across generations.';
  }

  function comparisonHtml(activeMode = state.mode) {
    return `<li class="comparison-block"><strong>Same needs, different money systems</strong><div class="comparison-grid">${Object.entries(eraProfiles).map(([key, profile]) => `
      <article class="comparison-card ${key === activeMode ? 'active' : ''}">
        <h3>${profile.name}</h3>
        <p><b>Purchasing power:</b> ${profile.purchasingPower}</p>
        <p><b>Debasement:</b> ${profile.debasement}</p>
        <p><b>Freeze/seizure:</b> ${profile.seizure}</p>
        <p><b>Use score:</b> ${profile.portability}/5</p>
        <p><b>Generational wealth:</b> ${generationalWealthSummary(profile, profile.portability)}</p>
      </article>`).join('')}</div></li>`;
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
    renderWorkshopPanel();
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
        <div><strong>${player.name}</strong><small>${player.role}</small><small>Wants ${wantLabels(player)}</small>${compactHaveNeed(player)}</div>
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
    $$('[data-action="next-round"], [data-action="suggest-trade"], [data-action="trade"], [data-action="trade-here"], [data-action="sell-for-shells"]').forEach((button) => { button.disabled = !enabled; });
    $$('[data-action="accept-offer"]').forEach((button) => { button.disabled = !enabled || !state.proposedOffer?.canAfford; });
    $$('[data-action="skip-trade"]').forEach((button) => { button.disabled = !enabled || !state.currentOffer; });
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
