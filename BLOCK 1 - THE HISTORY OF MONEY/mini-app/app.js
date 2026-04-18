const GAME_COPY = {
  title: 'History of Money',
  subtitle: 'A fast interactive journey from barter to Bitcoin',
  soloDuration: '~5 min solo run',
  presenterDuration: '~10–15 min facilitated session',
};

const marketItems = {
  cow: {
    id: 'cow',
    emoji: '🐄',
    label: 'Cow',
    unitLabel: 'cow',
    pluralLabel: 'cows',
    defaultQty: 1,
    divisible: false,
    bulk: 'very bulky',
    moneyTraits: 'high value, but awkward and indivisible',
    description: 'Huge value, but hard to divide, move, or price into smaller everyday trades.',
  },
  apples: {
    id: 'apples',
    emoji: '🍎',
    label: 'Apples',
    unitLabel: 'apple',
    pluralLabel: 'apples',
    defaultQty: 500,
    divisible: true,
    bulk: 'bulky in large sacks',
    moneyTraits: 'divisible, but perishable and awkward in volume',
    description: 'Easy to count, but 500 apples is a lot to carry and they do not last forever.',
  },
  fish: {
    id: 'fish',
    emoji: '🐟',
    label: 'Fish',
    unitLabel: 'fish',
    pluralLabel: 'fish',
    defaultQty: 2,
    divisible: false,
    bulk: 'perishable bundle',
    moneyTraits: 'useful food, but spoils fast',
    description: 'Useful food, but it spoils quickly and is awkward for pricing other goods.',
  },
  shoes: {
    id: 'shoes',
    emoji: '👞',
    label: 'Shoes',
    unitLabel: 'pair of shoes',
    pluralLabel: 'pairs of shoes',
    defaultQty: 1,
    divisible: false,
    bulk: 'portable pair',
    moneyTraits: 'useful, but not a general money',
    description: 'Exactly what you need before winter, but a pair of shoes is not easy to split into smaller payments.',
  },
  grain: {
    id: 'grain',
    emoji: '🌾',
    label: 'Grain',
    unitLabel: 'sack of grain',
    pluralLabel: 'sacks of grain',
    defaultQty: 3,
    divisible: true,
    bulk: 'moderately bulky sacks',
    moneyTraits: 'widely useful, divisible by sack, but still bulky',
    description: 'A staple good lots of people want, though sacks still take space and effort to move.',
  },
  salt: {
    id: 'salt',
    emoji: '🧂',
    label: 'Salt',
    unitLabel: 'salt pouch',
    pluralLabel: 'salt pouches',
    defaultQty: 4,
    divisible: true,
    bulk: 'portable pouches',
    moneyTraits: 'portable, divisible, and widely wanted',
    description: 'Portable, divisible, and broadly useful. It starts to feel money-like.',
  },
  wool: {
    id: 'wool',
    emoji: '🧶',
    label: 'Wool Cloth',
    unitLabel: 'roll of wool cloth',
    pluralLabel: 'rolls of wool cloth',
    defaultQty: 2,
    divisible: false,
    bulk: 'soft bundle',
    moneyTraits: 'valuable, but less standardized',
    description: 'Warm and valuable, but not everyone wants exactly the same amount at the same time.',
  },
  pots: {
    id: 'pots',
    emoji: '🏺',
    label: 'Clay Pots',
    unitLabel: 'clay pot',
    pluralLabel: 'clay pots',
    defaultQty: 3,
    divisible: false,
    bulk: 'fragile stack',
    moneyTraits: 'useful, but fragile and uneven',
    description: 'Useful containers, but fragile and awkward for pricing many other things.',
  },
  shells: {
    id: 'shells',
    emoji: '🐚',
    label: 'Shells',
    unitLabel: 'string of shells',
    pluralLabel: 'strings of shells',
    defaultQty: 12,
    divisible: true,
    bulk: 'lightweight strings',
    moneyTraits: 'recognizable, but scarcity can change',
    description: 'Portable and familiar, but only useful as money if people trust the supply stays limited.',
  },
};

const barterScenario = {
  id: 'barter-market',
  title: 'Barter in the plaza',
  kicker: 'Round 1',
  intro:
    'You step into a busy market plaza before winter. People are walking, shouting prices, and guarding piles of real goods. You need shoes before you leave.',
  prompt:
    'Walk the plaza person by person. Tap anyone to inspect what they have, what they want, and why a trade may fail.',
  facilitatorNote:
    'Let the room “walk” the market out loud. Ask who to approach first, then inspect that person before deciding whether barter actually works.',
  audiencePrompt:
    'Ask the group: where does barter break first here — wants, quantity, or indivisibility?',
  lessonSummary:
    'Barter fails for more than one reason: the other person may want the wrong thing, the amounts may not match, big goods like cows are hard to split, and carrying awkward goods across many trades is exhausting.',
  playerStart: { itemId: 'cow', quantity: 1 },
  target: { itemId: 'shoes', quantity: 1 },
  people: [
    {
      id: 'toma',
      name: 'Toma the Orchard Keeper',
      role: 'Fruit seller',
      x: 22,
      y: 28,
      tone: 'tone-1',
      greeting: 'I have apples from the orchard. I need fish for my family supper.',
      offer: { itemId: 'apples', quantity: 500 },
      ask: { itemId: 'fish', quantity: 2 },
      tradeMode: 'exact',
      failureHint: 'Even though apples are countable, Toma does not want your cow at all. That is a wants mismatch.',
    },
    {
      id: 'mara',
      name: 'Mara the Potter',
      role: 'Potter',
      x: 60,
      y: 20,
      tone: 'tone-2',
      greeting: 'Three sturdy pots for anyone who brings me 500 apples. Pottery for produce.',
      offer: { itemId: 'pots', quantity: 3 },
      ask: { itemId: 'apples', quantity: 500 },
      tradeMode: 'exact',
      failureHint: 'Mara is open to trade, but only for a very specific amount of apples.',
    },
    {
      id: 'gita',
      name: 'Gita the Weaver',
      role: 'Weaver',
      x: 78,
      y: 48,
      tone: 'tone-3',
      greeting: 'Two rolls of wool cloth for three clay pots. No pots, no cloth.',
      offer: { itemId: 'wool', quantity: 2 },
      ask: { itemId: 'pots', quantity: 3 },
      tradeMode: 'exact',
      failureHint: 'You need exactly the right goods in exactly the right scale.',
    },
    {
      id: 'soren',
      name: 'Soren the Salt Merchant',
      role: 'Salt trader',
      x: 46,
      y: 58,
      tone: 'tone-4',
      greeting: 'I will swap four salt pouches for two rolls of wool cloth.',
      offer: { itemId: 'salt', quantity: 4 },
      ask: { itemId: 'wool', quantity: 2 },
      tradeMode: 'exact',
      failureHint: 'Salt starts to look useful because more people will take it later.',
    },
    {
      id: 'tala',
      name: 'Tala the Farmer',
      role: 'Farmer',
      x: 28,
      y: 70,
      tone: 'tone-5',
      greeting: 'I will give three sacks of grain if you bring me two salt pouches.',
      offer: { itemId: 'grain', quantity: 3 },
      ask: { itemId: 'salt', quantity: 2 },
      tradeMode: 'partial-ok',
      failureHint: 'Salt is divisible enough that Tala can accept part of your salt instead of all of it.',
    },
    {
      id: 'bako',
      name: 'Bako the Shoemaker',
      role: 'Shoemaker',
      x: 69,
      y: 74,
      tone: 'tone-6',
      greeting: 'One pair of winter shoes costs one sack of grain. I cannot cut shoes in half for change.',
      offer: { itemId: 'shoes', quantity: 1 },
      ask: { itemId: 'grain', quantity: 1 },
      tradeMode: 'partial-ok',
      failureHint: 'Shoes are indivisible. Even if values feel close, you cannot split one pair into tiny pieces to make exact change.',
    },
    {
      id: 'lina',
      name: 'Lina the Herder',
      role: 'Livestock trader',
      x: 12,
      y: 52,
      tone: 'tone-2',
      greeting: 'A whole cow? That is too much for what I have. I only need a pair of shoes, and I cannot give you “part of a cow” back as change.',
      offer: { itemId: 'fish', quantity: 2 },
      ask: { itemId: 'shoes', quantity: 1 },
      tradeMode: 'exact',
      failureHint: 'This is indivisibility directly: your cow may be valuable, but it is too lumpy for a smaller trade.',
    },
  ],
};

const rounds = [
  {
    id: 'commodity',
    title: 'Commodity money emerges',
    kicker: 'Round 2',
    prompt: 'After struggling through the plaza, your village starts using one good to trade through more often. Which good works best as money?',
    facilitatorNote:
      'Connect this back to the plaza. Which item solved the most friction: wants mismatch, scale mismatch, and indivisibility?',
    revealLabel: 'Reveal the stronger money',
    question: 'Which good is strongest money?',
    correctChoiceId: 'salt',
    choices: [
      {
        id: 'salt',
        label: 'Salt',
        detail: 'Portable, divisible, and already accepted by several traders in the plaza.',
        feedback:
          'Exactly. Salt starts working as money because it is useful, portable, divisible, and already widely wanted.',
      },
      {
        id: 'cow',
        label: 'Cow',
        detail: 'High value, but too indivisible and awkward for many everyday trades.',
        feedback:
          'A cow can store a lot of value, but it is terrible for making smaller, precise exchanges. That is a money weakness.',
      },
      {
        id: 'fish',
        label: 'Fish',
        detail: 'Useful, but spoils quickly and is hard to carry through time.',
        feedback:
          'Fish is valuable for eating, but weak money must be replaced often. Good money should survive time better than fish.',
      },
    ],
    summary: [
      'Commodity money emerges when one trade good becomes easier to pass on than all the others.',
      'The plaza made divisibility and broad acceptance feel important, not abstract.',
      'Money reduces the need for long barter chains of exact matches.',
    ],
    audiencePrompt: 'Ask the group which item they would rather carry across ten more trades: salt, a cow, or fish?',
  },
  {
    id: 'inflation',
    title: 'Supply shocks break trust',
    kicker: 'Round 3',
    prompt: 'Your town now uses shells as money. Then a ship arrives carrying huge sacks of identical shells. What changes first?',
    facilitatorNote:
      'Ask whether “more units” means “more wealth,” or whether it mainly changes pricing and trust.',
    revealLabel: 'Reveal the inflation lesson',
    question: 'What happens when supply explodes?',
    correctChoiceId: 'prices-up',
    choices: [
      {
        id: 'prices-up',
        label: 'Prices rise over time',
        detail: 'Each shell buys less once shells become much easier to get.',
        feedback:
          'Right. If money supply grows much faster than goods and services, each unit tends to lose purchasing power.',
      },
      {
        id: 'everyone-richer',
        label: 'Everyone becomes richer instantly',
        detail: 'Extra money units are not the same as extra real goods.',
        feedback:
          'Nominal balances can rise without real wealth increasing. More money does not magically create more shoes, grain, or fish.',
      },
      {
        id: 'nothing',
        label: 'Nothing changes',
        detail: 'Supply changes usually hit expectations and pricing quickly.',
        feedback:
          'Money depends on trust in scarcity and predictability. A sudden supply flood weakens both.',
      },
    ],
    summary: [
      'Strong money should be hard to produce unexpectedly.',
      'Easy supply growth tends to weaken purchasing power.',
      'People save into money because they trust it to hold value across time.',
    ],
    audiencePrompt: 'If shells suddenly became common on every beach, would you still save in them?',
  },
];

const properties = [
  {
    id: 'durable',
    title: 'Durable',
    description: 'It should survive time without rotting, spoiling, or falling apart.',
  },
  {
    id: 'portable',
    title: 'Portable',
    description: 'It should move easily from one place to another.',
  },
  {
    id: 'divisible',
    title: 'Divisible',
    description: 'It should handle both small and large payments cleanly.',
  },
  {
    id: 'verifiable',
    title: 'Verifiable',
    description: 'People should be able to check that it is real and trustworthy.',
  },
  {
    id: 'scarce',
    title: 'Scarce',
    description: 'New supply should be hard to create on demand.',
  },
  {
    id: 'acceptable',
    title: 'Widely accepted',
    description: 'Other people should expect they can trade it onward too.',
  },
];

const bridgePoints = [
  'Bitcoin is digital, but it tries to preserve strong-money traits in a new form.',
  'Its supply is predictable instead of being easy to expand suddenly.',
  'It is highly divisible, easy to verify, and can move globally.',
  'That is why many people see Bitcoin as a new chapter in the history of money.',
];

const presenterTips = [
  'Treat each participant as a real person in the market, not just a card on a screen.',
  'Inspect people before trading so the room can see why barter fails or succeeds.',
  'Use the trade log to name the exact failure mode: wants mismatch, scale mismatch, indivisibility, or awkward bulk.',
];

const state = {
  mode: 'solo',
  screen: 'landing',
  roundIndex: 0,
  selectedChoice: null,
  score: 0,
  history: [],
  selectedProperties: [],
  presenterReveal: false,
  showVotePanel: false,
  voteCounts: {},
  playerInventory: { ...barterScenario.playerStart },
  targetInventory: { ...barterScenario.target },
  marketCompleted: false,
  marketTradeCount: 0,
  marketLog: [],
  inspectedPersonId: null,
  marketPeople: [],
  failureBadgesSeen: [],
  conferenceParticipants: [],
  conferenceActiveParticipantId: null,
};

const app = document.getElementById('app');

function createInitialVotes() {
  return rounds.reduce((acc, round) => {
    acc[round.id] = round.choices.reduce((choiceAcc, choice) => {
      choiceAcc[choice.id] = 0;
      return choiceAcc;
    }, {});
    return acc;
  }, {});
}

function cloneOffer(offer) {
  return { itemId: offer.itemId, quantity: offer.quantity };
}

function buildMarketPeople() {
  return barterScenario.people.map((person) => ({ ...person, offer: cloneOffer(person.offer), ask: cloneOffer(person.ask) }));
}

function buildConferenceParticipants() {
  return barterScenario.people.map((person, index) => ({
    id: person.id,
    name: person.name,
    role: person.role,
    have: cloneOffer(person.offer),
    want: cloneOffer(person.ask),
    colorClass: `participant-tone-${(index % 6) + 1}`,
  }));
}

function resetVotes() {
  state.voteCounts = createInitialVotes();
}

function item(itemId) {
  return marketItems[itemId];
}

function pluralizeItemLabel(itemId, quantity) {
  const current = item(itemId);
  return quantity === 1 ? current.unitLabel : current.pluralLabel;
}

function quantityLabel(goods) {
  return `${goods.quantity} ${pluralizeItemLabel(goods.itemId, goods.quantity)}`;
}

function itemPhrase(itemId) {
  const current = item(itemId);
  return `${current.emoji} ${current.label}`;
}

function goodsPhrase(goods) {
  const current = item(goods.itemId);
  return `${current.emoji} ${quantityLabel(goods)}`;
}

function appendMarketLog(type, text, badge = null) {
  state.marketLog.unshift({ type, text, badge });
  if (badge && !state.failureBadgesSeen.includes(badge)) {
    state.failureBadgesSeen.push(badge);
  }
}

function resetMarketState() {
  state.playerInventory = { ...barterScenario.playerStart };
  state.targetInventory = { ...barterScenario.target };
  state.marketCompleted = false;
  state.marketTradeCount = 0;
  state.inspectedPersonId = barterScenario.people[0]?.id || null;
  state.marketPeople = buildMarketPeople();
  state.failureBadgesSeen = [];
  state.marketLog = [
    {
      type: 'start',
      text: `You enter the plaza holding ${goodsPhrase(state.playerInventory)} and needing ${goodsPhrase(state.targetInventory)}.`,
      badge: null,
    },
  ];
}

function resetConferenceParticipants() {
  state.conferenceParticipants = buildConferenceParticipants();
  state.conferenceActiveParticipantId = state.conferenceParticipants[0]?.id || null;
}

function resetProgress() {
  state.roundIndex = 0;
  state.selectedChoice = null;
  state.score = 0;
  state.history = [];
  state.selectedProperties = [];
  state.presenterReveal = false;
  state.showVotePanel = false;
  resetVotes();
  resetMarketState();
  resetConferenceParticipants();
}

function resetToLanding() {
  state.mode = 'solo';
  state.screen = 'landing';
  resetProgress();
  render();
}

function startSolo() {
  state.mode = 'solo';
  resetProgress();
  state.screen = 'market';
  render();
}

function startPresenter() {
  state.mode = 'presenter';
  resetProgress();
  state.screen = 'conferenceIntro';
  render();
}

function beginPresenterRun() {
  state.screen = 'market';
  state.presenterReveal = false;
  render();
}

function currentRound() {
  return rounds[state.roundIndex];
}

function getPerson(personId) {
  return state.marketPeople.find((entry) => entry.id === personId);
}

function inventoryMatches(goodsA, goodsB) {
  return goodsA.itemId === goodsB.itemId && goodsA.quantity === goodsB.quantity;
}

function evaluateTrade(person) {
  const player = state.playerInventory;

  if (player.itemId !== person.ask.itemId) {
    return {
      ok: false,
      reason: 'wants-mismatch',
      headline: `${person.name} does not want ${itemPhrase(player.itemId)}.`,
      detail: `${person.name} wants ${goodsPhrase(person.ask)}, not ${goodsPhrase(player)}. ${person.failureHint}`,
    };
  }

  const wantedQty = person.ask.quantity;
  const playerQty = player.quantity;
  const playerItem = item(player.itemId);

  if (person.tradeMode === 'exact' && playerQty !== wantedQty) {
    if (playerQty > wantedQty && !playerItem.divisible) {
      return {
        ok: false,
        reason: 'indivisibility',
        headline: `${goodsPhrase(player)} is too lumpy for this trade.`,
        detail: `${person.name} wants ${goodsPhrase(person.ask)}, but you only have ${goodsPhrase(player)}. ${playerItem.label} is indivisible here, so you cannot shave off “part of it” as change.`,
      };
    }

    return {
      ok: false,
      reason: 'scale-mismatch',
      headline: `The quantities do not line up.`,
      detail: `${person.name} wants ${goodsPhrase(person.ask)}, but you have ${goodsPhrase(player)}. Barter often stalls because scale and quantity do not match cleanly.`,
    };
  }

  if (person.tradeMode === 'partial-ok' && playerQty < wantedQty) {
    return {
      ok: false,
      reason: 'scale-mismatch',
      headline: `You do not have enough ${item(player.itemId).label.toLowerCase()}.`,
      detail: `${person.name} wants ${goodsPhrase(person.ask)}, but you only have ${goodsPhrase(player)}. Even when goods are divisible, quantity still matters.`,
    };
  }

  const consumedQty = person.tradeMode === 'partial-ok' ? wantedQty : playerQty;
  const remainingQty = playerQty - consumedQty;
  const nextInventory = cloneOffer(person.offer);

  return {
    ok: true,
    reason: remainingQty > 0 ? 'partial-trade' : 'exact-trade',
    consumedQty,
    remainingQty,
    nextInventory,
    awkwardness: playerItem.bulk,
  };
}

function marketPersonStatus(person) {
  if (state.marketCompleted && inventoryMatches(state.playerInventory, state.targetInventory)) {
    return person.offer.itemId === state.targetInventory.itemId ? 'target-hit' : 'closed';
  }

  const evaluation = evaluateTrade(person);
  if (evaluation.ok) return 'ready';
  if (evaluation.reason === 'wants-mismatch') return 'blocked';
  if (evaluation.reason === 'scale-mismatch') return 'quantity';
  if (evaluation.reason === 'indivisibility') return 'indivisible';
  return 'blocked';
}

function marketFailureLabel(reason) {
  switch (reason) {
    case 'wants-mismatch':
      return 'Wants mismatch';
    case 'scale-mismatch':
      return 'Scale mismatch';
    case 'indivisibility':
      return 'Indivisibility';
    case 'awkwardness':
      return 'Awkward bulk';
    default:
      return 'Barter friction';
  }
}

function inspectPerson(personId) {
  state.inspectedPersonId = personId;
  if (state.mode === 'presenter') {
    state.conferenceActiveParticipantId = personId;
  }
  render();
}

function markMarketHistory(success) {
  const prior = state.history.find((entry) => entry.roundId === barterScenario.id);
  if (prior) return;
  state.history.push({
    roundId: barterScenario.id,
    roundTitle: barterScenario.title,
    correct: success,
    choiceId: success ? 'route-found' : 'market-skipped',
    choice: success
      ? `Reached ${goodsPhrase(state.targetInventory)} in ${state.marketTradeCount} trades`
      : 'Skipped market challenge',
  });
  if (success) state.score += 1;
}

function tryTrade(personId) {
  if (state.marketCompleted) return;
  const person = getPerson(personId);
  if (!person) return;

  inspectPerson(personId);
  const result = evaluateTrade(person);

  if (!result.ok) {
    appendMarketLog('blocked', result.detail, result.reason);
    render();
    return;
  }

  const before = { ...state.playerInventory };
  state.playerInventory = result.nextInventory;
  state.marketTradeCount += 1;

  appendMarketLog(
    'trade',
    `Trade ${state.marketTradeCount}: You gave ${goodsPhrase({ itemId: before.itemId, quantity: result.consumedQty })} to ${person.name} and received ${goodsPhrase(result.nextInventory)}.`,
    null,
  );

  if (result.remainingQty > 0) {
    appendMarketLog(
      'note',
      `You would still be left holding ${result.remainingQty} ${pluralizeItemLabel(before.itemId, result.remainingQty)} in a more realistic market. Even partial trades create awkward leftovers to price and carry.`,
      'awkwardness',
    );
  } else if (item(before.itemId).bulk === 'very bulky') {
    appendMarketLog(
      'note',
      `${goodsPhrase(before)} was ${item(before.itemId).bulk}. Large barter goods are awkward to drag from one trade to the next.`,
      'awkwardness',
    );
  }

  if (inventoryMatches(state.playerInventory, state.targetInventory)) {
    state.marketCompleted = true;
    appendMarketLog(
      'success',
      `Success: you finally reached ${goodsPhrase(state.targetInventory)} after ${state.marketTradeCount} swaps across the plaza. ${barterScenario.lessonSummary}`,
      null,
    );
    markMarketHistory(true);
  }

  render();
}

function skipMarket() {
  if (!state.history.find((entry) => entry.roundId === barterScenario.id)) {
    state.history.push({
      roundId: barterScenario.id,
      roundTitle: barterScenario.title,
      correct: false,
      choiceId: 'market-skipped',
      choice: 'Skipped market challenge',
    });
  }
  state.screen = 'round';
  state.roundIndex = 0;
  render();
}

function continueFromMarket() {
  if (!state.marketCompleted) return;
  state.screen = 'round';
  state.roundIndex = 0;
  state.selectedChoice = null;
  state.presenterReveal = false;
  render();
}

function markHistory(round, choice) {
  const prior = state.history.find((entry) => entry.roundId === round.id);
  if (prior) return;
  state.history.push({
    roundId: round.id,
    roundTitle: round.title,
    correct: choice.id === round.correctChoiceId,
    choiceId: choice.id,
    choice: choice.label,
  });
  if (choice.id === round.correctChoiceId) state.score += 1;
}

function selectChoice(choiceId) {
  const round = currentRound();
  const choice = round.choices.find((entry) => entry.id === choiceId);
  if (!choice) return;

  state.selectedChoice = choice;
  markHistory(round, choice);
  if (state.mode === 'presenter') state.presenterReveal = false;
  render();
}

function toggleProperty(propertyId) {
  const selected = new Set(state.selectedProperties);
  if (selected.has(propertyId)) selected.delete(propertyId);
  else selected.add(propertyId);
  state.selectedProperties = [...selected];
  render();
}

function nextRound() {
  state.selectedChoice = null;
  state.presenterReveal = false;
  state.showVotePanel = false;

  if (state.roundIndex < rounds.length - 1) {
    state.roundIndex += 1;
    state.screen = 'round';
  } else {
    state.screen = 'recap';
  }
  render();
}

function goToBitcoinBridge() {
  state.screen = 'bitcoin';
  render();
}

function finishExperience() {
  state.screen = 'end';
  render();
}

function restartCurrentMode() {
  if (state.mode === 'presenter') startPresenter();
  else startSolo();
}

function resetCurrentRound() {
  const round = currentRound();
  state.selectedChoice = null;
  state.presenterReveal = false;
  state.history = state.history.filter((entry) => entry.roundId !== round.id);
  state.score = state.history.filter((entry) => entry.correct).length;
  render();
}

function resetMarketRound() {
  state.history = state.history.filter((entry) => entry.roundId !== barterScenario.id);
  state.score = state.history.filter((entry) => entry.correct).length;
  resetMarketState();
  resetConferenceParticipants();
  render();
}

function skipRound() {
  const round = currentRound();
  const prior = state.history.find((entry) => entry.roundId === round.id);
  if (!prior) {
    state.history.push({
      roundId: round.id,
      roundTitle: round.title,
      correct: false,
      choiceId: 'skipped',
      choice: 'Skipped',
    });
  }
  nextRound();
}

function toggleReveal() {
  if (!state.selectedChoice) return;
  state.presenterReveal = !state.presenterReveal;
  render();
}

function toggleVotePanel() {
  state.showVotePanel = !state.showVotePanel;
  render();
}

function castVote(choiceId) {
  const round = currentRound();
  state.voteCounts[round.id][choiceId] += 1;
  render();
}

function resetRoundVotes() {
  const round = currentRound();
  state.voteCounts[round.id] = round.choices.reduce((acc, choice) => {
    acc[choice.id] = 0;
    return acc;
  }, {});
  render();
}

function setConferenceParticipant(participantId) {
  state.conferenceActiveParticipantId = participantId;
  state.inspectedPersonId = participantId;
  render();
}

function progressPercent() {
  const steps = ['landing', 'conferenceIntro', 'market', 'round1', 'round2', 'recap', 'bitcoin', 'end'];
  const currentKey = state.screen === 'round' ? `round${state.roundIndex + 1}` : state.screen;
  const index = Math.max(0, steps.indexOf(currentKey));
  return ((index + 1) / steps.length) * 100;
}

function selectedPropertiesSummary() {
  return properties.filter((entry) => state.selectedProperties.includes(entry.id));
}

function finalHeadline() {
  if (state.score === rounds.length + 1) return 'Strong run.';
  if (state.score >= 2) return 'Nice progression.';
  return 'You completed the arc.';
}

function voteTotal(roundId) {
  return Object.values(state.voteCounts[roundId] || {}).reduce((sum, value) => sum + value, 0);
}

function votePercent(roundId, choiceId) {
  const total = voteTotal(roundId);
  if (!total) return 0;
  return Math.round((state.voteCounts[roundId][choiceId] / total) * 100);
}

function shell(content, options = {}) {
  const { projector = false } = options;
  app.innerHTML = `
    <main class="app-shell ${projector ? 'projector-shell' : ''}">
      <section class="topbar card soft-card">
        <div class="brand-block">
          <div class="eyebrow">${GAME_COPY.title}</div>
          <div class="topbar-title">${state.mode === 'presenter' ? 'Conference mode' : 'Solo mode'}</div>
        </div>
        <div class="topbar-actions">
          <span class="badge progress-badge">${Math.round(progressPercent())}%</span>
          <button class="icon-btn" data-action="home" aria-label="Go to landing">⌂</button>
        </div>
        <div class="progress" aria-hidden="true"><span style="width:${progressPercent()}%"></span></div>
      </section>
      ${content}
    </main>
  `;
  bind();
}

function landingScreen() {
  shell(`
    <section class="hero card glow-card stack-lg">
      <div class="hero-copy stack">
        <div class="eyebrow">Interactive lesson</div>
        <h1>Walk the plaza from barter friction to Bitcoin logic.</h1>
        <p class="lede">Start inside an embodied market full of people, inspect their goods and needs, feel why barter breaks, then carry that intuition into commodity money, inflation, and Bitcoin.</p>
      </div>
      <div class="hero-grid">
        <article class="info-card panel">
          <div class="pill-badge">Solo</div>
          <h2>Explore the market yourself</h2>
          <p>${GAME_COPY.soloDuration}. Tap through a plaza, inspect traders, and discover why a cow is awkward, quantities matter, and exact wants rarely line up.</p>
          <ul class="feature-list">
            <li>Embodied market plaza with visible people</li>
            <li>Quantity-aware barter and indivisibility</li>
            <li>Clear failure modes before the money lesson</li>
          </ul>
          <button class="btn primary" data-action="start-solo">Start solo</button>
        </article>
        <article class="info-card panel presenter-entry">
          <div class="pill-badge alt">Presenter</div>
          <h2>Run a live market session</h2>
          <p>${GAME_COPY.presenterDuration}. Conference mode mirrors the same plaza logic with participant roles, presenter control, and projector-safe inspection/trade flow.</p>
          <ul class="feature-list">
            <li>Participant roles as people in the market</li>
            <li>Presenter-controlled inspections and trades</li>
            <li>Vote scaffold for later rounds</li>
          </ul>
          <button class="btn secondary strong" data-action="start-presenter">Open presenter mode</button>
        </article>
      </div>
      <section class="mini-panel stack">
        <div class="eyebrow">What learners discover</div>
        <div class="stat-row">
          <span class="stat-chip">Wants mismatch blocks trades</span>
          <span class="stat-chip">Scale mismatch blocks trades</span>
          <span class="stat-chip">Indivisible goods are awkward money</span>
          <span class="stat-chip">Bitcoin extends the story digitally</span>
        </div>
      </section>
    </section>
  `);
}

function conferenceIntroScreen() {
  shell(`
    <section class="card projector-intro stack-lg">
      <div class="row wrap-row">
        <div class="stack">
          <div class="eyebrow">Conference mode</div>
          <h1>Turn the room into a plaza.</h1>
          <p class="lede">This mode treats participants as people with visible have/need roles. Even without live backend infrastructure, the presenter can run a coherent, human market simulation on screen.</p>
        </div>
        <div class="badge big-badge">${GAME_COPY.presenterDuration}</div>
      </div>
      <div class="presenter-layout">
        <section class="panel stack">
          <h3>Presenter flow</h3>
          <ol class="ordered-list">
            <li>Open the plaza and inspect one person at a time.</li>
            <li>Ask the room whether the trade fails because of wants, quantity, or indivisibility.</li>
            <li>Execute the trade only when the room can explain why it works.</li>
            <li>Bridge from plaza friction into commodity money and inflation.</li>
          </ol>
        </section>
        <section class="panel stack">
          <h3>What is simulated live</h3>
          <p>The room sees a live plaza map, the player inventory, the target good, participant roles, and a trade log that names the exact failure modes.</p>
          <div class="inline-note">Static-site safe: no backend, no sockets, still conference-ready.</div>
        </section>
      </div>
      <section class="tip-strip">
        ${presenterTips.map((tip) => `<div class="tip-chip">${tip}</div>`).join('')}
      </section>
      <div class="footer-actions single-row">
        <button class="btn ghost" data-action="home">Back</button>
        <button class="btn primary" data-action="begin-presenter">Begin session</button>
      </div>
    </section>
  `, { projector: true });
}

function marketFailureChips() {
  const all = [
    { id: 'wants-mismatch', label: 'Wants mismatch' },
    { id: 'scale-mismatch', label: 'Scale mismatch' },
    { id: 'indivisibility', label: 'Indivisibility' },
    { id: 'awkwardness', label: 'Awkward bulk' },
  ];

  return all
    .map(
      (entry) => `<span class="stat-chip ${state.failureBadgesSeen.includes(entry.id) ? 'chip-highlight' : 'chip-dim'}">${entry.label}</span>`,
    )
    .join('');
}

function marketScreen() {
  const currentItem = item(state.playerInventory.itemId);
  const targetItem = item(state.targetInventory.itemId);
  const inspectedPerson = getPerson(state.inspectedPersonId) || state.marketPeople[0];
  const inspectedEvaluation = inspectedPerson ? evaluateTrade(inspectedPerson) : null;
  const activeParticipant = state.conferenceParticipants.find((entry) => entry.id === state.conferenceActiveParticipantId);

  shell(`
    <section class="experience-grid ${state.mode === 'presenter' ? 'presenter-grid market-grid' : 'market-grid'}">
      <section class="card stage-card ${state.mode === 'presenter' ? 'projector-card' : ''}">
        <div class="stage-header">
          <div>
            <div class="eyebrow">${barterScenario.kicker}</div>
            <h1>${barterScenario.title}</h1>
          </div>
          <div class="badge big-badge">Plaza</div>
        </div>
        <p class="prompt">${barterScenario.intro}</p>
        <section class="market-objective panel stack">
          <div class="row wrap-row objective-row">
            <div class="inventory-card inventory-now">
              <span class="inventory-label">You have</span>
              <div class="inventory-item"><span class="inventory-emoji">${currentItem.emoji}</span><strong>${quantityLabel(state.playerInventory)}</strong></div>
              <p>${currentItem.description}</p>
            </div>
            <div class="market-arrow">→</div>
            <div class="inventory-card inventory-target">
              <span class="inventory-label">You need</span>
              <div class="inventory-item"><span class="inventory-emoji">${targetItem.emoji}</span><strong>${quantityLabel(state.targetInventory)}</strong></div>
              <p>${targetItem.description}</p>
            </div>
          </div>
          <div class="market-status-row">
            <span class="stat-chip">Trades made: ${state.marketTradeCount}</span>
            <span class="stat-chip">Current burden: ${currentItem.bulk}</span>
            <span class="stat-chip ${state.marketCompleted ? 'chip-success' : ''}">${state.marketCompleted ? 'Target reached' : 'Still bargaining'}</span>
          </div>
          <div class="failure-chip-row">${marketFailureChips()}</div>
        </section>

        <section class="plaza-scene panel stack">
          <div class="row wrap-row">
            <div>
              <div class="eyebrow">Market plaza</div>
              <h3>Tap a person to inspect or trade</h3>
            </div>
            <div class="inline-note">Visible people, visible goods, visible trade friction.</div>
          </div>
          <div class="plaza-map">
            ${state.marketPeople
              .map((person) => {
                const status = marketPersonStatus(person);
                return `
                  <button class="plaza-person ${person.tone} person-${status} ${person.id === state.inspectedPersonId ? 'person-inspected' : ''}" data-inspect="${person.id}" style="left:${person.x}%; top:${person.y}%;">
                    <span class="person-avatar">🧑</span>
                    <span class="person-name">${person.name.split(' ')[0]}</span>
                    <span class="person-goods">${item(person.offer.itemId).emoji}</span>
                  </button>
                `;
              })
              .join('')}
            <div class="plaza-centerpiece">⛲</div>
          </div>
        </section>

        ${
          inspectedPerson
            ? `
              <section class="inspection-card panel stack">
                <div class="row wrap-row">
                  <div>
                    <div class="eyebrow">Inspected person</div>
                    <h3>${inspectedPerson.name} · ${inspectedPerson.role}</h3>
                  </div>
                  <span class="trader-status-pill inspect-pill ${inspectedEvaluation?.ok ? 'pill-ready' : ''}">${
                    inspectedEvaluation?.ok ? 'Trade works now' : marketFailureLabel(inspectedEvaluation?.reason)
                  }</span>
                </div>
                <p>${inspectedPerson.greeting}</p>
                <div class="inspection-grid">
                  <div class="trade-pair have-pair">
                    <span class="trade-label">HAS</span>
                    <div class="trade-item">${goodsPhrase(inspectedPerson.offer)}</div>
                    <p>${item(inspectedPerson.offer.itemId).moneyTraits}</p>
                  </div>
                  <div class="trade-pair want-pair">
                    <span class="trade-label">WANTS</span>
                    <div class="trade-item">${goodsPhrase(inspectedPerson.ask)}</div>
                    <p>${inspectedPerson.failureHint}</p>
                  </div>
                </div>
                <section class="feedback-card ${inspectedEvaluation?.ok ? 'feedback-good' : 'feedback-warn'}">
                  <div class="result-tag ${inspectedEvaluation?.ok ? '' : 'subtle'}">${
                    inspectedEvaluation?.ok ? 'Trade path open' : marketFailureLabel(inspectedEvaluation?.reason)
                  }</div>
                  <h3>${inspectedEvaluation?.ok ? 'This person will trade with you right now.' : inspectedEvaluation?.headline || 'Inspect a person to see the friction.'}</h3>
                  <p>${
                    inspectedEvaluation?.ok
                      ? `You can swap ${goodsPhrase({ itemId: state.playerInventory.itemId, quantity: inspectedEvaluation.consumedQty })} for ${goodsPhrase(inspectedEvaluation.nextInventory)}.`
                      : inspectedEvaluation?.detail || barterScenario.prompt
                  }</p>
                </section>
                <div class="footer-actions single-row market-inline-actions">
                  <button class="btn ghost" data-action="inspect-next">Next person</button>
                  <button class="btn primary" data-trade="${inspectedPerson.id}" ${inspectedEvaluation?.ok ? '' : 'disabled'}>Trade with ${inspectedPerson.name.split(' ')[0]}</button>
                </div>
              </section>
            `
            : ''
        }

        <section class="feedback-card ${state.marketCompleted ? 'feedback-good' : 'feedback-pending'}">
          <div class="result-tag ${state.marketCompleted ? '' : 'subtle'}">${state.marketCompleted ? 'Barter lesson unlocked' : 'Trade friction in motion'}</div>
          <h3>${
            state.marketCompleted
              ? 'You reached the target, but only through a fragile chain of specific matches.'
              : 'Barter is not just about value. It is about matching the right person, the right thing, and the right quantity at the right moment.'
          }</h3>
          <p>${state.marketCompleted ? barterScenario.lessonSummary : barterScenario.prompt}</p>
        </section>

        <div class="footer-actions ${state.mode === 'presenter' ? 'presenter-actions presenter-actions-market' : ''}">
          <button class="btn ghost" data-action="reset-market">Reset market</button>
          ${state.mode === 'presenter' ? '<button class="btn ghost" data-action="skip-market">Skip to next lesson</button>' : '<button class="btn ghost" data-action="restart-mode">Restart run</button>'}
          <button class="btn primary" data-action="continue-market" ${state.marketCompleted ? '' : 'disabled'}>Continue</button>
        </div>
      </section>
      <aside class="stack sidebar">
        ${
          state.mode === 'presenter'
            ? `
              <section class="card panel stack presenter-note-card">
                <div class="eyebrow">Facilitator prompt</div>
                <h3>Why does this trade fail or work?</h3>
                <p>${barterScenario.facilitatorNote}</p>
                <div class="inline-note">${barterScenario.audiencePrompt}</div>
              </section>
              <section class="card panel stack participant-panel">
                <div class="eyebrow">Participant market board</div>
                <h3>People in this plaza</h3>
                <p class="small-copy">These participant roles mirror the market people. The presenter can spotlight anyone even without live audience devices.</p>
                <div class="participant-list">
                  ${state.conferenceParticipants
                    .map(
                      (participant) => `
                        <button class="participant-card ${participant.id === state.conferenceActiveParticipantId ? 'participant-active' : ''} ${participant.colorClass}" data-participant="${participant.id}">
                          <div>
                            <strong>${participant.name}</strong>
                            <div class="trader-role">${participant.role}</div>
                          </div>
                          <div class="participant-mini-pairs">
                            <span>Has ${goodsPhrase(participant.have)}</span>
                            <span>Needs ${goodsPhrase(participant.want)}</span>
                          </div>
                        </button>
                      `,
                    )
                    .join('')}
                </div>
                ${
                  activeParticipant
                    ? `
                      <div class="participant-focus panel stack">
                        <div class="eyebrow">Spotlighted participant</div>
                        <h3>${activeParticipant.name}</h3>
                        <p class="small-copy">Has ${goodsPhrase(activeParticipant.have)} · Needs ${goodsPhrase(activeParticipant.want)}</p>
                      </div>
                    `
                    : ''
                }
              </section>
            `
            : `
              <section class="card panel stack recap-side-card">
                <div class="eyebrow">Why this matters</div>
                <h3>Big goods are not easy money.</h3>
                <p class="small-copy">A cow may store a lot of value, but this plaza shows why value alone is not enough. You also need divisibility, portability, and broad acceptance.</p>
              </section>
            `
        }
        <section class="card panel stack market-log-panel">
          <div class="row wrap-row">
            <div>
              <div class="eyebrow">Trade log</div>
              <h3>What just happened</h3>
            </div>
            <span class="badge">${state.marketLog.length} events</span>
          </div>
          <div class="market-log-list">
            ${state.marketLog
              .map(
                (entry) => `
                  <article class="market-log-entry log-${entry.type}">
                    ${entry.badge ? `<div class="result-tag subtle">${marketFailureLabel(entry.badge)}</div>` : ''}
                    <p>${entry.text}</p>
                  </article>
                `,
              )
              .join('')}
          </div>
        </section>
      </aside>
    </section>
  `, { projector: state.mode === 'presenter' });
}

function roundScreen() {
  const round = currentRound();
  const choice = state.selectedChoice;
  const correct = choice ? choice.id === round.correctChoiceId : false;
  const showReveal = state.mode === 'solo' ? Boolean(choice) : Boolean(choice && state.presenterReveal);

  shell(`
    <section class="experience-grid ${state.mode === 'presenter' ? 'presenter-grid' : ''}">
      <section class="card stage-card ${state.mode === 'presenter' ? 'projector-card' : ''}">
        <div class="stage-header">
          <div>
            <div class="eyebrow">${round.kicker}</div>
            <h1>${round.title}</h1>
          </div>
          <div class="badge big-badge">${state.roundIndex + 2} / ${rounds.length + 1}</div>
        </div>
        <p class="prompt">${round.prompt}</p>
        <div class="choice-grid ${state.mode === 'presenter' ? 'choice-grid-large' : ''}">
          ${round.choices
            .map(
              (entry) => `
                <button class="choice ${choice?.id === entry.id ? 'selected' : ''} ${showReveal && entry.id === round.correctChoiceId ? 'choice-correct' : ''} ${showReveal && choice?.id === entry.id && !correct ? 'choice-missed' : ''}" data-choice="${entry.id}">
                  <span class="choice-title">${entry.label}</span>
                  <span class="choice-detail">${entry.detail}</span>
                </button>
              `,
            )
            .join('')}
        </div>
        ${
          showReveal
            ? `
              <section class="feedback-card ${correct ? 'feedback-good' : 'feedback-warn'}">
                <div class="result-tag">${correct ? 'Correct direction' : 'Useful failure'}</div>
                <h3>${correct ? 'That moves the story forward.' : 'That choice clarifies why stronger money emerged.'}</h3>
                <p>${choice.feedback}</p>
                <ul>
                  ${round.summary.map((entry) => `<li>${entry}</li>`).join('')}
                </ul>
              </section>
            `
            : `
              <section class="feedback-card feedback-pending">
                <div class="result-tag subtle">${state.mode === 'presenter' ? 'Awaiting reveal' : 'Pick an option'}</div>
                <p>${state.mode === 'presenter' ? 'Select an answer, discuss with the room, then reveal the lesson.' : 'Choose an option to see what this round teaches.'}</p>
              </section>
            `
        }
        <div class="footer-actions ${state.mode === 'presenter' ? 'presenter-actions' : ''}">
          ${
            state.mode === 'presenter'
              ? `
                <button class="btn ghost" data-action="reset-round">Reset round</button>
                <button class="btn ghost" data-action="skip-round">Skip</button>
                <button class="btn secondary" data-action="toggle-votes">${state.showVotePanel ? 'Hide votes' : 'Show votes'}</button>
                <button class="btn secondary" data-action="toggle-reveal" ${choice ? '' : 'disabled'}>${showReveal ? 'Hide reveal' : round.revealLabel}</button>
                <button class="btn primary" data-action="next" ${showReveal ? '' : 'disabled'}>${state.roundIndex === rounds.length - 1 ? 'Go to recap' : 'Next'}</button>
              `
              : `
                <button class="btn ghost" data-action="restart-mode">Restart</button>
                <button class="btn primary" data-action="next" ${choice ? '' : 'disabled'}>${state.roundIndex === rounds.length - 1 ? 'Recap' : 'Next round'}</button>
              `
          }
        </div>
      </section>
      <aside class="stack sidebar">
        ${
          state.mode === 'presenter'
            ? `
              <section class="card panel stack presenter-note-card">
                <div class="eyebrow">Facilitator prompt</div>
                <h3>${round.question}</h3>
                <p>${round.facilitatorNote}</p>
                <div class="inline-note">${round.audiencePrompt}</div>
              </section>
              <section class="card panel stack ${state.showVotePanel ? '' : 'muted-panel'}">
                <div class="row wrap-row">
                  <div>
                    <div class="eyebrow">Audience vote board</div>
                    <h3>${voteTotal(round.id)} total votes</h3>
                  </div>
                  <button class="btn ghost small-btn" data-action="reset-votes">Reset votes</button>
                </div>
                <p class="small-copy">Use this as a hand-count tracker or scaffold for future live multi-user voting.</p>
                <div class="vote-list">
                  ${round.choices
                    .map(
                      (entry) => `
                        <div class="vote-row">
                          <button class="vote-cast" data-vote="${entry.id}">+1</button>
                          <div class="vote-meta">
                            <div class="vote-line">
                              <strong>${entry.label}</strong>
                              <span>${state.voteCounts[round.id][entry.id]} votes · ${votePercent(round.id, entry.id)}%</span>
                            </div>
                            <div class="vote-bar"><span style="width:${votePercent(round.id, entry.id)}%"></span></div>
                          </div>
                        </div>
                      `,
                    )
                    .join('')}
                </div>
              </section>
            `
            : `
              <section class="card panel stack recap-side-card">
                <div class="eyebrow">Run status</div>
                <h3>${state.score} / ${rounds.length + 1} complete</h3>
                <p class="small-copy">The plaza showed that barter breaks for several reasons at once. These rounds explain why societies search for stronger money.</p>
              </section>
            `
        }
      </aside>
    </section>
  `, { projector: state.mode === 'presenter' });
}

function recapScreen() {
  const selected = selectedPropertiesSummary();
  const ready = selected.length >= 3;

  shell(`
    <section class="experience-grid ${state.mode === 'presenter' ? 'presenter-grid' : ''}">
      <section class="card stage-card ${state.mode === 'presenter' ? 'projector-card' : ''}">
        <div class="stage-header">
          <div>
            <div class="eyebrow">Recap</div>
            <h1>What makes money strong?</h1>
          </div>
          <div class="badge big-badge">${state.score} / ${rounds.length + 1}</div>
        </div>
        <p class="prompt">Choose at least three traits. Strong money is not magic, but it usually handles the same problems you felt in the plaza.</p>
        <div class="properties-grid ${state.mode === 'presenter' ? 'properties-grid-large' : ''}">
          ${properties
            .map(
              (entry) => `
                <button class="pill ${state.selectedProperties.includes(entry.id) ? 'selected' : ''}" data-property="${entry.id}">
                  <span class="choice-title">${entry.title}</span>
                  <span class="choice-detail">${entry.description}</span>
                </button>
              `,
            )
            .join('')}
        </div>
        <section class="recap-panel panel">
          <div class="row wrap-row">
            <h3>Run recap</h3>
            <span class="badge">${state.history.length} rounds logged</span>
          </div>
          <div class="history-list">
            ${state.history
              .map(
                (entry) => `
                  <article class="history-item ${entry.correct ? 'history-good' : 'history-warn'}">
                    <div>
                      <strong>${entry.roundTitle}</strong>
                      <p>${entry.choice}</p>
                    </div>
                    <span class="status-dot">${entry.correct ? '✓' : '•'}</span>
                  </article>
                `,
              )
              .join('')}
          </div>
          <div class="selected-summary ${selected.length ? '' : 'empty-summary'}">
            ${
              selected.length
                ? selected.map((entry) => `<span class="stat-chip">${entry.title}</span>`).join('')
                : '<span class="small-copy">Pick at least three traits to unlock the Bitcoin bridge.</span>'
            }
          </div>
        </section>
        <div class="footer-actions ${state.mode === 'presenter' ? 'presenter-actions' : ''}">
          <button class="btn ghost" data-action="restart-mode">${state.mode === 'presenter' ? 'Restart session' : 'Replay'}</button>
          <button class="btn primary" data-action="bridge" ${ready ? '' : 'disabled'}>Bitcoin bridge</button>
        </div>
      </section>
      <aside class="stack sidebar">
        <section class="card panel stack">
          <div class="eyebrow">Teaching prompt</div>
          <h3>Ask before you bridge</h3>
          <p class="small-copy">Which money trait mattered most after the plaza: portability, divisibility, scarcity, or acceptability?</p>
        </section>
      </aside>
    </section>
  `, { projector: state.mode === 'presenter' });
}

function bitcoinScreen() {
  shell(`
    <section class="experience-grid ${state.mode === 'presenter' ? 'presenter-grid' : ''}">
      <section class="card stage-card ${state.mode === 'presenter' ? 'projector-card' : ''}">
        <div class="stage-header">
          <div>
            <div class="eyebrow">Bitcoin bridge</div>
            <h1>Why Bitcoin enters this story</h1>
          </div>
          <div class="badge big-badge">Final step</div>
        </div>
        <div class="bridge-grid">
          ${bridgePoints
            .map(
              (entry, index) => `
                <article class="bridge-card panel">
                  <div class="bridge-index">0${index + 1}</div>
                  <p>${entry}</p>
                </article>
              `,
            )
            .join('')}
        </div>
        <section class="feedback-card feedback-neutral">
          <div class="result-tag">Big idea</div>
          <h3>People keep searching for money that is easier to trust, harder to debase, and easier to move through space and time.</h3>
          <p>Bitcoin matters here because it tries to solve old money problems in a digital environment, not because it appeared from nowhere.</p>
        </section>
        <div class="footer-actions ${state.mode === 'presenter' ? 'presenter-actions' : ''}">
          <button class="btn ghost" data-action="restart-mode">Restart</button>
          <button class="btn primary" data-action="finish">Finish</button>
        </div>
      </section>
      <aside class="stack sidebar">
        <section class="card panel stack">
          <div class="eyebrow">Facilitator note</div>
          <h3>Keep the bridge modest</h3>
          <p class="small-copy">The plaza should do most of the teaching. Bitcoin then appears as the next candidate in the longer history of money.</p>
        </section>
      </aside>
    </section>
  `, { projector: state.mode === 'presenter' });
}

function endScreen() {
  shell(`
    <section class="card end-card stack-lg ${state.mode === 'presenter' ? 'projector-card' : ''}">
      <div class="eyebrow">Complete</div>
      <h1>${finalHeadline()}</h1>
      <p class="lede">You walked a live market plaza, saw barter fail in concrete ways, moved into commodity money, through inflation, and into the Bitcoin bridge.</p>
      <div class="end-stats">
        <div class="panel stat-panel">
          <strong>Score</strong>
          <span>${state.score} / ${rounds.length + 1}</span>
        </div>
        <div class="panel stat-panel">
          <strong>Mode</strong>
          <span>${state.mode === 'presenter' ? 'Conference / presenter' : 'Solo'}</span>
        </div>
        <div class="panel stat-panel">
          <strong>Selected traits</strong>
          <span>${selectedPropertiesSummary().map((entry) => entry.title).join(', ') || 'None selected'}</span>
        </div>
      </div>
      <section class="panel stack">
        <h3>Replay options</h3>
        <div class="footer-actions single-row">
          <button class="btn ghost" data-action="home">Back to landing</button>
          <button class="btn secondary" data-action="start-solo">Play solo again</button>
          <button class="btn primary" data-action="start-presenter">Presenter mode</button>
        </div>
      </section>
    </section>
  `, { projector: state.mode === 'presenter' });
}

function render() {
  switch (state.screen) {
    case 'landing':
      landingScreen();
      break;
    case 'conferenceIntro':
      conferenceIntroScreen();
      break;
    case 'market':
      marketScreen();
      break;
    case 'round':
      roundScreen();
      break;
    case 'recap':
      recapScreen();
      break;
    case 'bitcoin':
      bitcoinScreen();
      break;
    case 'end':
      endScreen();
      break;
    default:
      landingScreen();
  }
}

function bind() {
  const on = (selector, handler) => {
    app.querySelectorAll(selector).forEach((el) => el.addEventListener('click', handler));
  };

  on('[data-action="home"]', resetToLanding);
  on('[data-action="start-solo"]', startSolo);
  on('[data-action="start-presenter"]', startPresenter);
  on('[data-action="begin-presenter"]', beginPresenterRun);
  on('[data-action="next"]', nextRound);
  on('[data-action="bridge"]', goToBitcoinBridge);
  on('[data-action="finish"]', finishExperience);
  on('[data-action="restart-mode"]', restartCurrentMode);
  on('[data-action="reset-round"]', resetCurrentRound);
  on('[data-action="skip-round"]', skipRound);
  on('[data-action="toggle-reveal"]', toggleReveal);
  on('[data-action="toggle-votes"]', toggleVotePanel);
  on('[data-action="reset-votes"]', resetRoundVotes);
  on('[data-action="reset-market"]', resetMarketRound);
  on('[data-action="continue-market"]', continueFromMarket);
  on('[data-action="skip-market"]', skipMarket);
  on('[data-action="inspect-next"]', () => {
    if (!state.marketPeople.length) return;
    const currentIndex = state.marketPeople.findIndex((entry) => entry.id === state.inspectedPersonId);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % state.marketPeople.length : 0;
    inspectPerson(state.marketPeople[nextIndex].id);
  });

  app.querySelectorAll('[data-choice]').forEach((el) =>
    el.addEventListener('click', () => selectChoice(el.getAttribute('data-choice'))),
  );

  app.querySelectorAll('[data-property]').forEach((el) =>
    el.addEventListener('click', () => toggleProperty(el.getAttribute('data-property'))),
  );

  app.querySelectorAll('[data-vote]').forEach((el) =>
    el.addEventListener('click', () => castVote(el.getAttribute('data-vote'))),
  );

  app.querySelectorAll('[data-inspect]').forEach((el) =>
    el.addEventListener('click', () => inspectPerson(el.getAttribute('data-inspect'))),
  );

  app.querySelectorAll('[data-trade]').forEach((el) =>
    el.addEventListener('click', () => tryTrade(el.getAttribute('data-trade'))),
  );

  app.querySelectorAll('[data-participant]').forEach((el) =>
    el.addEventListener('click', () => setConferenceParticipant(el.getAttribute('data-participant'))),
  );
}

resetProgress();
render();
