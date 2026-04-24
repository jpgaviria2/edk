const GAME_COPY = {
  title: 'History of Money',
  subtitle: 'A progressive interactive journey from barter to Bitcoin',
  soloDuration: '~8–10 min solo run',
  presenterDuration: '~15–20 min facilitated session',
};

const marketItems = {
  bread: {
    id: 'bread', emoji: '🍞', label: 'Bread', unitLabel: 'loaf of bread', pluralLabel: 'loaves of bread', defaultQty: 2, divisible: false, bulk: 'easy to carry', moneyTraits: 'useful food, but perishable', description: 'Simple and useful, but it does not last long enough to serve as great money.',
  },
  eggs: {
    id: 'eggs', emoji: '🥚', label: 'Eggs', unitLabel: 'basket of eggs', pluralLabel: 'baskets of eggs', defaultQty: 1, divisible: false, bulk: 'fragile basket', moneyTraits: 'useful, but fragile and perishable', description: 'Useful to eat, but fragile and hard to save for later.',
  },
  milk: {
    id: 'milk', emoji: '🥛', label: 'Milk', unitLabel: 'jug of milk', pluralLabel: 'jugs of milk', defaultQty: 1, divisible: true, bulk: 'sloshing jug', moneyTraits: 'divisible, but spoils fast', description: 'You can measure it, but it spoils quickly and is awkward to carry.',
  },
  fish: {
    id: 'fish', emoji: '🐟', label: 'Fish', unitLabel: 'fish', pluralLabel: 'fish', defaultQty: 2, divisible: false, bulk: 'perishable bundle', moneyTraits: 'useful food, but spoils fast', description: 'Useful food, but it spoils quickly and is awkward for pricing other goods.',
  },
  apples: {
    id: 'apples', emoji: '🍎', label: 'Apples', unitLabel: 'apple', pluralLabel: 'apples', defaultQty: 500, divisible: true, bulk: 'bulky in large sacks', moneyTraits: 'divisible, but perishable and awkward in volume', description: 'Easy to count, but 500 apples is a lot to carry and they do not last forever.',
  },
  shoes: {
    id: 'shoes', emoji: '👞', label: 'Shoes', unitLabel: 'pair of shoes', pluralLabel: 'pairs of shoes', defaultQty: 1, divisible: false, bulk: 'portable pair', moneyTraits: 'useful, but not a general money', description: 'Exactly what you need before winter, but a pair of shoes is not easy to split into smaller payments.',
  },
  grain: {
    id: 'grain', emoji: '🌾', label: 'Grain', unitLabel: 'sack of grain', pluralLabel: 'sacks of grain', defaultQty: 3, divisible: true, bulk: 'moderately bulky sacks', moneyTraits: 'widely useful, divisible by sack, but still bulky', description: 'A staple good lots of people want, though sacks still take space and effort to move.',
  },
  salt: {
    id: 'salt', emoji: '🧂', label: 'Salt', unitLabel: 'salt pouch', pluralLabel: 'salt pouches', defaultQty: 4, divisible: true, bulk: 'portable pouches', moneyTraits: 'portable, divisible, and widely wanted', description: 'Portable, divisible, and broadly useful. It starts to feel money-like.',
  },
  wool: {
    id: 'wool', emoji: '🧶', label: 'Wool Cloth', unitLabel: 'roll of wool cloth', pluralLabel: 'rolls of wool cloth', defaultQty: 2, divisible: false, bulk: 'soft bundle', moneyTraits: 'valuable, but less standardized', description: 'Warm and valuable, but not everyone wants exactly the same amount at the same time.',
  },
  pots: {
    id: 'pots', emoji: '🏺', label: 'Clay Pots', unitLabel: 'clay pot', pluralLabel: 'clay pots', defaultQty: 3, divisible: false, bulk: 'fragile stack', moneyTraits: 'useful, but fragile and uneven', description: 'Useful containers, but fragile and awkward for pricing many other things.',
  },
  shells: {
    id: 'shells', emoji: '🐚', label: 'Shells', unitLabel: 'string of shells', pluralLabel: 'strings of shells', defaultQty: 12, divisible: true, bulk: 'lightweight strings', moneyTraits: 'recognizable, but scarcity can change', description: 'Portable and familiar, but only useful as money if people trust the supply stays limited.',
  },
  silver: {
    id: 'silver', emoji: '🥈', label: 'Silver Pieces', unitLabel: 'silver piece', pluralLabel: 'silver pieces', defaultQty: 8, divisible: true, bulk: 'compact pouch', moneyTraits: 'portable and fairly durable, but can be clipped or diluted', description: 'Useful as money when people trust its weight and purity.',
  },
  coin: {
    id: 'coin', emoji: '🪙', label: 'Stamped Coins', unitLabel: 'coin', pluralLabel: 'coins', defaultQty: 6, divisible: true, bulk: 'small pouch', moneyTraits: 'portable, countable, and standardized', description: 'Stamped coins are easier to count and trust than random piles of goods.',
  },
  cow: {
    id: 'cow', emoji: '🐄', label: 'Cow', unitLabel: 'cow', pluralLabel: 'cows', defaultQty: 1, divisible: false, bulk: 'very bulky', moneyTraits: 'high value, but awkward and indivisible', description: 'Huge value, but hard to divide, move, or price into smaller everyday trades.',
  },
  bitcoin: {
    id: 'bitcoin', emoji: '₿', label: 'Bitcoin', unitLabel: 'bitcoin', pluralLabel: 'bitcoin', defaultQty: 1, divisible: true, bulk: 'weightless to transmit', moneyTraits: 'digital, scarce, divisible, and verifiable', description: 'Digital money designed to stay scarce, verifiable, and easy to move globally.',
  },
};

const barterScenarios = [
  {
    id: 'simple-barter', title: 'Barter in a friendly lane', kicker: 'Round 1',
    intro: 'Start simple. You are in a tiny market lane. You have bread and need eggs. The chain is short and solvable, so you can feel barter working before it starts failing.',
    prompt: 'Inspect the traders. A workable path exists. Your first job is just to learn how direct exchange feels.',
    facilitatorNote: 'Let learners succeed quickly here. The point is not frustration yet. The point is understanding that barter means swapping real goods person to person.',
    audiencePrompt: 'Ask the room: who should we talk to first if we want eggs and only have bread?',
    lessonSummary: 'Barter can work when the chain is short and people line up cleanly. But even here, you still need the right person with the right wants.',
    playerStart: { itemId: 'bread', quantity: 2 }, target: { itemId: 'eggs', quantity: 1 },
    people: [
      { id: 'niva', name: 'Niva the Dairy Farmer', role: 'Milk seller', x: 22, y: 32, tone: 'tone-1', greeting: 'I can trade one jug of milk for two loaves of bread.', offer: { itemId: 'milk', quantity: 1 }, ask: { itemId: 'bread', quantity: 2 }, tradeMode: 'exact', failureHint: 'This one is clean: she wants what you have in exactly the amount you hold.' },
      { id: 'peta', name: 'Peta the Chicken Keeper', role: 'Egg seller', x: 70, y: 34, tone: 'tone-2', greeting: 'Bring me one jug of milk and I will trade you a basket of eggs.', offer: { itemId: 'eggs', quantity: 1 }, ask: { itemId: 'milk', quantity: 1 }, tradeMode: 'exact', failureHint: 'You cannot trade with Peta first because she wants milk, not bread.' },
      { id: 'varo', name: 'Varo the Fisher', role: 'Fish seller', x: 48, y: 72, tone: 'tone-3', greeting: 'I only swap fish for eggs today.', offer: { itemId: 'fish', quantity: 2 }, ask: { itemId: 'eggs', quantity: 1 }, tradeMode: 'exact', failureHint: 'He is here to show that even in a simple market, not everybody matches your needs.' },
    ],
  },
  {
    id: 'barter-market', title: 'Barter in the crowded plaza', kicker: 'Round 2',
    intro: 'Now the market is larger, noisier, and less forgiving. You step into a busy plaza before winter. People are shouting, guarding piles of goods, and demanding very specific trades. You need shoes before you leave.',
    prompt: 'Walk the plaza person by person. Tap anyone to inspect what they have, what they want, and why a trade may fail. This time the chain is longer and friction shows up everywhere.',
    facilitatorNote: 'Let the room “walk” the market out loud. Ask who to approach first, then inspect that person before deciding whether barter actually works.',
    audiencePrompt: 'Ask the group: where does barter break first here — wants, quantity, or indivisibility?',
    lessonSummary: 'Barter fails for more than one reason: the other person may want the wrong thing, the amounts may not match, big goods like cows are hard to split, and carrying awkward goods across many trades is exhausting.',
    playerStart: { itemId: 'cow', quantity: 1 }, target: { itemId: 'shoes', quantity: 1 },
    people: [
      { id: 'toma', name: 'Toma the Orchard Keeper', role: 'Fruit seller', x: 22, y: 28, tone: 'tone-1', greeting: 'I have apples from the orchard. I need fish for my family supper.', offer: { itemId: 'apples', quantity: 500 }, ask: { itemId: 'fish', quantity: 2 }, tradeMode: 'exact', failureHint: 'Even though apples are countable, Toma does not want your cow at all. That is a wants mismatch.' },
      { id: 'mara', name: 'Mara the Potter', role: 'Potter', x: 60, y: 20, tone: 'tone-2', greeting: 'Three sturdy pots for anyone who brings me 500 apples. Pottery for produce.', offer: { itemId: 'pots', quantity: 3 }, ask: { itemId: 'apples', quantity: 500 }, tradeMode: 'exact', failureHint: 'Mara is open to trade, but only for a very specific amount of apples.' },
      { id: 'gita', name: 'Gita the Weaver', role: 'Weaver', x: 78, y: 48, tone: 'tone-3', greeting: 'Two rolls of wool cloth for three clay pots. No pots, no cloth.', offer: { itemId: 'wool', quantity: 2 }, ask: { itemId: 'pots', quantity: 3 }, tradeMode: 'exact', failureHint: 'You need exactly the right goods in exactly the right scale.' },
      { id: 'soren', name: 'Soren the Salt Merchant', role: 'Salt trader', x: 46, y: 58, tone: 'tone-4', greeting: 'I will swap four salt pouches for two rolls of wool cloth.', offer: { itemId: 'salt', quantity: 4 }, ask: { itemId: 'wool', quantity: 2 }, tradeMode: 'exact', failureHint: 'Salt starts to look useful because more people will take it later.' },
      { id: 'tala', name: 'Tala the Farmer', role: 'Farmer', x: 28, y: 70, tone: 'tone-5', greeting: 'I will give three sacks of grain if you bring me two salt pouches.', offer: { itemId: 'grain', quantity: 3 }, ask: { itemId: 'salt', quantity: 2 }, tradeMode: 'partial-ok', failureHint: 'Salt is divisible enough that Tala can accept part of your salt instead of all of it.' },
      { id: 'bako', name: 'Bako the Shoemaker', role: 'Shoemaker', x: 69, y: 74, tone: 'tone-6', greeting: 'One pair of winter shoes costs one sack of grain. I cannot cut shoes in half for change.', offer: { itemId: 'shoes', quantity: 1 }, ask: { itemId: 'grain', quantity: 1 }, tradeMode: 'partial-ok', failureHint: 'Shoes are indivisible. Even if values feel close, you cannot split one pair into tiny pieces to make exact change.' },
      { id: 'lina', name: 'Lina the Herder', role: 'Livestock trader', x: 12, y: 52, tone: 'tone-2', greeting: 'A whole cow? That is too much for what I have. I only need a pair of shoes, and I cannot give you “part of a cow” back as change.', offer: { itemId: 'fish', quantity: 2 }, ask: { itemId: 'shoes', quantity: 1 }, tradeMode: 'exact', failureHint: 'This is indivisibility directly: your cow may be valuable, but it is too lumpy for a smaller trade.' },
    ],
  },
  {
    id: 'divisibility-dilemma', title: 'The divisibility dilemma', kicker: 'Round 3',
    intro: 'Now you are wealthy on paper but clumsy in practice. You hold one whole cow, but today you only need a small basket of apples and a little grain for dinner.',
    prompt: 'Inspect the traders and try to see the problem before you trade: high value is not the same thing as good money.',
    facilitatorNote: 'Pause on the cow. Ask the room whether having something expensive automatically means it works well for daily exchange.',
    audiencePrompt: 'Ask: would you rather hold one cow or many smaller units if you needed to buy lunch, shoes, and rent separately?',
    lessonSummary: 'A money good must fit both large and small trades. If a unit is too large to split cleanly, everyday exchange gets messy fast.',
    playerStart: { itemId: 'cow', quantity: 1 }, target: { itemId: 'apples', quantity: 20 },
    people: [
      { id: 'riva', name: 'Riva the Orchard Seller', role: 'Fruit seller', x: 26, y: 30, tone: 'tone-1', greeting: 'I will trade 20 apples for 1 salt pouch. I cannot price my apples against a whole cow.', offer: { itemId: 'apples', quantity: 20 }, ask: { itemId: 'salt', quantity: 1 }, tradeMode: 'exact', failureHint: 'The apples are small and everyday. Your cow is large and lumpy. The units do not fit each other.' },
      { id: 'hela', name: 'Hela the Grain Seller', role: 'Farmer', x: 68, y: 28, tone: 'tone-2', greeting: 'I can trade 1 sack of grain for 2 silver pieces, or 1 salt pouch. I do not have the change for a cow.', offer: { itemId: 'grain', quantity: 1 }, ask: { itemId: 'salt', quantity: 1 }, tradeMode: 'exact', failureHint: 'Even when people know the cow is valuable, they may not have enough smaller goods to break it down.' },
      { id: 'sami', name: 'Sami the Salt Trader', role: 'Salt merchant', x: 42, y: 56, tone: 'tone-4', greeting: 'I will trade 4 salt pouches for 1 sack of grain. Salt moves through the market much more easily than cattle.', offer: { itemId: 'salt', quantity: 4 }, ask: { itemId: 'grain', quantity: 1 }, tradeMode: 'exact', failureHint: 'Salt acts like a bridge because smaller units can unlock more trades.' },
      { id: 'orun', name: 'Orun the Stable Owner', role: 'Livestock buyer', x: 74, y: 64, tone: 'tone-5', greeting: 'I can take your cow, but all I can offer back today is 1 sack of grain. The values do not match and I cannot make change.', offer: { itemId: 'grain', quantity: 1 }, ask: { itemId: 'cow', quantity: 1 }, tradeMode: 'exact', failureHint: 'This is the classic problem: the cow is too big a unit for a small purchase.' },
    ],
  },
];

const rounds = [
  { id: 'commodity-emergence', title: 'Commodity money emerges', kicker: 'Round 4', prompt: 'After struggling through barter, your village starts using one good as a common stepping-stone between trades. Which good works best as early money?', facilitatorNote: 'Connect this back to the plaza. Which item solved the most friction: wants mismatch, scale mismatch, and indivisibility?', revealLabel: 'Reveal the stronger money', question: 'Which good is strongest early money?', correctChoiceId: 'salt', choices: [
    { id: 'salt', label: 'Salt', detail: 'Portable, divisible, broadly useful, and already accepted by several traders.', feedback: 'Exactly. Salt starts working as money because it is useful, portable, divisible, and already widely wanted. It reduces the need for perfect barter matches.' },
    { id: 'cow', label: 'Cow', detail: 'Stores high value, but is too indivisible and awkward for daily trade.', feedback: 'A cow can store a lot of value, but it is terrible for making smaller, precise exchanges. That is a money weakness, not a strength.' },
    { id: 'fish', label: 'Fish', detail: 'Useful food, but it spoils quickly and is hard to carry across time.', feedback: 'Fish is valuable for eating, but weak money must be replaced often. Good money should survive time better than fish.' },
  ], summary: ['Commodity money emerges when one trade good becomes easier to pass on than all the others.', 'The earlier rounds made divisibility and broad acceptance feel important, not abstract.', 'Money reduces the need for long barter chains of exact matches.'], audiencePrompt: 'Ask the group which item they would rather carry across ten more trades: salt, a cow, or fish?' },
  { id: 'coin-standardization', title: 'Stamped money speeds trade', kicker: 'Round 5', prompt: 'Commodity money helps, but weighing, testing, and arguing over quality still takes time. A ruler begins stamping standard coins. What improves first?', facilitatorNote: 'This is the move from useful commodity to standardized medium. Emphasize reduced haggling and faster verification.', revealLabel: 'Reveal the coin lesson', question: 'What do stamped coins improve most?', correctChoiceId: 'verification', choices: [
    { id: 'verification', label: 'Trade becomes faster to verify', detail: 'Standardized units reduce constant weighing and bargaining over purity.', feedback: 'Right. Standardized coins compress trust into a recognizable unit. That makes trade faster and wider because people do not renegotiate every time.' },
    { id: 'scarcity', label: 'Scarcity becomes perfect forever', detail: 'Stamping a coin does not automatically prevent future dilution or overproduction.', feedback: 'Coins help standardize trade, but they do not guarantee perfect scarcity. Governments and rulers can still clip, debase, or overissue them.' },
    { id: 'barter', label: 'Barter returns as the easiest system', detail: 'Standard money exists precisely because barter is too slow and clumsy.', feedback: 'No. Coins emerge because societies are trying to escape barter friction, not return to it.' },
  ], summary: ['Standardized money reduces time spent checking every trade from scratch.', 'Recognition and verification matter almost as much as divisibility and portability.', 'Money evolves toward easier trust at larger scale.'], audiencePrompt: 'If every silver piece must be weighed separately, is that still better than a coin everyone instantly recognizes?' },
  { id: 'debasement', title: 'When money gets weakened', kicker: 'Round 6', prompt: 'Later, the ruler starts minting more coins by mixing in cheaper metal. The coin looks similar, but each unit contains less silver. What is the core problem?', facilitatorNote: 'Use this to introduce debasement: same label, weaker substance. Link it to trust and purchasing power, not just chemistry.', revealLabel: 'Reveal the debasement lesson', question: 'What breaks when coins are diluted?', correctChoiceId: 'trust', choices: [
    { id: 'trust', label: 'People trust the money less', detail: 'If units stop meaning what people thought they meant, prices and confidence start moving.', feedback: 'Exactly. Money depends on trust in what each unit represents. Debasement weakens that trust and often shows up as higher prices and defensive behavior.' },
    { id: 'nothing', label: 'Nothing important changes', detail: 'If each coin holds less value than before, trade does not stay the same.', feedback: 'Something important changes immediately: people realize the unit is less reliable. That affects pricing, savings, and confidence.' },
    { id: 'more-wealth', label: 'Society becomes wealthier', detail: 'Changing the unit is not the same as creating more real goods.', feedback: 'No. More weakened units do not create more bread, shoes, or labor. They mostly change who gets paid first and how prices adjust.' },
  ], summary: ['Reliable money should not be easy to quietly weaken.', 'Purchasing power depends on trusted units, not just more units.', 'Money that can be diluted becomes harder to save in over long periods.'], audiencePrompt: 'Would you still save in a coin if the issuer could silently reduce what was inside it?' },
  { id: 'inflation', title: 'Supply shocks break purchasing power', kicker: 'Round 7', prompt: 'Your town now uses shells as money. Then a ship arrives carrying huge sacks of identical shells. What changes first?', facilitatorNote: 'Ask whether “more units” means “more wealth,” or whether it mainly changes pricing and trust.', revealLabel: 'Reveal the inflation lesson', question: 'What happens when supply explodes?', correctChoiceId: 'prices-up', choices: [
    { id: 'prices-up', label: 'Prices rise over time', detail: 'Each shell buys less once shells become much easier to get.', feedback: 'Right. If money supply grows much faster than goods and services, each unit tends to lose purchasing power.' },
    { id: 'everyone-richer', label: 'Everyone becomes richer instantly', detail: 'Extra money units are not the same as extra real goods.', feedback: 'Nominal balances can rise without real wealth increasing. More money does not magically create more shoes, grain, or fish.' },
    { id: 'nothing', label: 'Nothing changes', detail: 'Supply changes usually hit expectations and pricing quickly.', feedback: 'Money depends on trust in scarcity and predictability. A sudden supply flood weakens both.' },
  ], summary: ['Strong money should be hard to produce unexpectedly.', 'Easy supply growth tends to weaken purchasing power.', 'People save into money because they trust it to hold value across time.'], audiencePrompt: 'If shells suddenly became common on every beach, would you still save in them?' },
  { id: 'bitcoin-connection', title: 'Why Bitcoin feels like the next chapter', kicker: 'Round 8', prompt: 'After all these earlier money problems, which bundle of traits best explains why many people compare Bitcoin to strong money?', facilitatorNote: 'This should feel earned now. Learners have already felt barter friction, divisibility problems, standardization, debasement, and inflation risk.', revealLabel: 'Reveal the Bitcoin connection', question: 'Which combination best connects Bitcoin to the history of money?', correctChoiceId: 'scarce-divisible-verifiable', choices: [
    { id: 'scarce-divisible-verifiable', label: 'Predictably scarce, highly divisible, easy to verify', detail: 'It tries to keep the strongest money traits while becoming digital and global.', feedback: 'Exactly. Bitcoin matters in this story because it tries to carry forward scarcity, divisibility, portability, and verification in a digital form.' },
    { id: 'issued-faster', label: 'Easy for leaders to create whenever needed', detail: 'That sounds convenient, but it recreates old problems around dilution and trust.', feedback: 'That would actually reintroduce one of the central problems from earlier rounds: money becoming easy to expand or manipulate.' },
    { id: 'valuable-because-new', label: 'Mainly valuable because it is modern and trendy', detail: 'The lesson arc points toward monetary properties, not novelty.', feedback: 'No. In this lesson, Bitcoin is not the endpoint because it is new. It is interesting because it attempts to solve long-running money problems in a new environment.' },
  ], summary: ['Bitcoin is best understood as part of the long search for better money.', 'Its pitch is not “digital because digital,” but strong monetary properties in networked form.', 'The connection lands only after learners feel what earlier money systems struggled with.'], audiencePrompt: 'Which old money problem does Bitcoin seem most designed to resist: barter friction, debasement, or arbitrary supply growth?' },
];

const moneyFunctions = [
  { title: 'Medium of exchange', description: 'Money lets you trade without finding someone who wants exactly what you have.' },
  { title: 'Store of value', description: 'Money should help move today’s work into the future.' },
  { title: 'Unit of account', description: 'Money gives prices a common measuring stick so people can compare choices.' },
];

const properties = [
  { id: 'durable', title: 'Durable', description: 'It should survive time without rotting, spoiling, or falling apart.' },
  { id: 'portable', title: 'Portable', description: 'It should move easily from one place to another.' },
  { id: 'divisible', title: 'Divisible', description: 'It should handle both small and large payments cleanly.' },
  { id: 'fungible', title: 'Fungible / uniform', description: 'One unit should be interchangeable with another unit of the same value.' },
  { id: 'scarce', title: 'Scarce', description: 'New supply should be difficult to create unexpectedly.' },
  { id: 'acceptable', title: 'Widely accepted', description: 'Other people should expect they can trade it onward too.' },
];

const bridgePoints = [
  'Bitcoin is digital, but it is best understood through old money questions: can it exchange value, store value, and measure value?',
  'Its supply is predictable instead of being easy for a ruler, bank, or committee to expand suddenly.',
  'It is highly divisible, portable across distance, and independently verifiable.',
  'That is why many people see Bitcoin as a new chapter in the history of money, not a story disconnected from it.',
];

const curriculumNotes = [
  'Aligned with My First Bitcoin Diploma modules: What is Money, History of Money, functions of money, and properties of money.',
  'The solo flow follows the Diploma idea that money emerges from market process: barter first, then the most saleable good, then better monetary tools.',
];

const presenterTips = [
  'Let the first lane feel easy so the audience learns barter before it fails.',
  'Name the friction out loud: wants mismatch, scale mismatch, indivisibility, awkward bulk, weak verification, weak scarcity.',
  'By the time Bitcoin appears, the room should already want something more reliable than barter, shells, or diluted coins.',
];

const state = {
  mode: 'solo', screen: 'landing', marketRoundIndex: 0, roundIndex: 0, selectedChoice: null, score: 0, history: [], selectedProperties: [], presenterReveal: false, showVotePanel: false, voteCounts: {}, playerInventory: null, targetInventory: null, marketCompleted: false, marketTradeCount: 0, marketLog: [], inspectedPersonId: null, marketPeople: [], failureBadgesSeen: [], conferenceParticipants: [], conferenceActiveParticipantId: null, lastActionText: '',
};

const app = document.getElementById('app');

function createInitialVotes() { return rounds.reduce((acc, round) => { acc[round.id] = round.choices.reduce((choiceAcc, choice) => { choiceAcc[choice.id] = 0; return choiceAcc; }, {}); return acc; }, {}); }
function cloneOffer(offer) { return { itemId: offer.itemId, quantity: offer.quantity }; }
function item(itemId) { return marketItems[itemId]; }
function pluralizeItemLabel(itemId, quantity) { const current = item(itemId); return quantity === 1 ? current.unitLabel : current.pluralLabel; }
function quantityLabel(goods) { return `${goods.quantity} ${pluralizeItemLabel(goods.itemId, goods.quantity)}`; }
function itemPhrase(itemId) { const current = item(itemId); return `${current.emoji} ${current.label}`; }
function goodsPhrase(goods) { const current = item(goods.itemId); return `${current.emoji} ${quantityLabel(goods)}`; }
function currentMarketScenario() { return barterScenarios[state.marketRoundIndex]; }
function buildMarketPeople() { return currentMarketScenario().people.map((person) => ({ ...person, offer: cloneOffer(person.offer), ask: cloneOffer(person.ask) })); }
function buildConferenceParticipants() { return currentMarketScenario().people.map((person, index) => ({ id: person.id, name: person.name, role: person.role, have: cloneOffer(person.offer), want: cloneOffer(person.ask), colorClass: `participant-tone-${(index % 6) + 1}` })); }
function resetVotes() { state.voteCounts = createInitialVotes(); }
function setLastAction(text) { state.lastActionText = text; }
function appendMarketLog(type, text, badge = null) { state.marketLog.unshift({ type, text, badge }); if (badge && !state.failureBadgesSeen.includes(badge)) state.failureBadgesSeen.push(badge); }
function resetMarketState() {
  const scenario = currentMarketScenario();
  state.playerInventory = { ...scenario.playerStart };
  state.targetInventory = { ...scenario.target };
  state.marketCompleted = false;
  state.marketTradeCount = 0;
  state.inspectedPersonId = scenario.people[0]?.id || null;
  state.marketPeople = buildMarketPeople();
  state.failureBadgesSeen = [];
  state.marketLog = [{ type: 'start', text: `You enter holding ${goodsPhrase(state.playerInventory)} and needing ${goodsPhrase(state.targetInventory)}.`, badge: null }];
  setLastAction(`Start by inspecting traders. You currently have ${goodsPhrase(state.playerInventory)} and need ${goodsPhrase(state.targetInventory)}.`);
}
function resetConferenceParticipants() { state.conferenceParticipants = buildConferenceParticipants(); state.conferenceActiveParticipantId = state.conferenceParticipants[0]?.id || null; }
function resetProgress() {
  state.marketRoundIndex = 0; state.roundIndex = 0; state.selectedChoice = null; state.score = 0; state.history = []; state.selectedProperties = []; state.presenterReveal = false; state.showVotePanel = false; state.lastActionText = 'Choose solo or presenter mode to begin.'; resetVotes(); resetMarketState(); resetConferenceParticipants();
}
function resetToLanding() { state.mode = 'solo'; state.screen = 'landing'; resetProgress(); setLastAction('Choose a mode. Solo is the priority mobile experience.'); render(); }
function startSolo() { state.mode = 'solo'; resetProgress(); state.screen = 'market'; setLastAction('Read the guided trade card. Make the trade if it works, or continue when the concept is clear.'); render(); }
function startPresenter() { state.mode = 'presenter'; resetProgress(); state.screen = 'conferenceIntro'; setLastAction('Presenter mode is ready. Start the session when the room is set.'); render(); }
function beginPresenterRun() { state.screen = 'market'; state.presenterReveal = false; setLastAction('Guide the room trader by trader. Inspect first, then decide whether to trade.'); render(); }
function currentRound() { return rounds[state.roundIndex]; }
function getPerson(personId) { return state.marketPeople.find((entry) => entry.id === personId); }
function inventoryMatches(goodsA, goodsB) { return goodsA.itemId === goodsB.itemId && goodsA.quantity === goodsB.quantity; }
function evaluateTrade(person) {
  const player = state.playerInventory;
  if (!player) return { ok: false, reason: 'wants-mismatch', headline: 'No inventory.', detail: 'Player inventory is missing.' };
  if (player.itemId !== person.ask.itemId) return { ok: false, reason: 'wants-mismatch', headline: `${person.name} does not want ${itemPhrase(player.itemId)}.`, detail: `${person.name} wants ${goodsPhrase(person.ask)}, not ${goodsPhrase(player)}. ${person.failureHint}` };
  const wantedQty = person.ask.quantity; const playerQty = player.quantity; const playerItem = item(player.itemId);
  if (person.tradeMode === 'exact' && playerQty !== wantedQty) {
    if (playerQty > wantedQty && !playerItem.divisible) return { ok: false, reason: 'indivisibility', headline: `${goodsPhrase(player)} is too lumpy for this trade.`, detail: `${person.name} wants ${goodsPhrase(person.ask)}, but you only have ${goodsPhrase(player)}. ${playerItem.label} is indivisible here, so you cannot shave off “part of it” as change.` };
    return { ok: false, reason: 'scale-mismatch', headline: 'The quantities do not line up.', detail: `${person.name} wants ${goodsPhrase(person.ask)}, but you have ${goodsPhrase(player)}. Barter often stalls because scale and quantity do not match cleanly.` };
  }
  if (person.tradeMode === 'partial-ok' && playerQty < wantedQty) return { ok: false, reason: 'scale-mismatch', headline: `You do not have enough ${item(player.itemId).label.toLowerCase()}.`, detail: `${person.name} wants ${goodsPhrase(person.ask)}, but you only have ${goodsPhrase(player)}. Even when goods are divisible, quantity still matters.` };
  const consumedQty = person.tradeMode === 'partial-ok' ? wantedQty : playerQty; const remainingQty = playerQty - consumedQty; const nextInventory = cloneOffer(person.offer);
  return { ok: true, reason: remainingQty > 0 ? 'partial-trade' : 'exact-trade', consumedQty, remainingQty, nextInventory, awkwardness: playerItem.bulk };
}
function marketPersonStatus(person) {
  if (state.marketCompleted && inventoryMatches(state.playerInventory, state.targetInventory)) return person.offer.itemId === state.targetInventory.itemId ? 'target-hit' : 'closed';
  const evaluation = evaluateTrade(person);
  if (evaluation.ok) return 'ready';
  if (evaluation.reason === 'wants-mismatch') return 'blocked';
  if (evaluation.reason === 'scale-mismatch') return 'quantity';
  if (evaluation.reason === 'indivisibility') return 'indivisible';
  return 'blocked';
}
function marketFailureLabel(reason) { switch (reason) { case 'wants-mismatch': return 'Wants mismatch'; case 'scale-mismatch': return 'Scale mismatch'; case 'indivisibility': return 'Indivisibility'; case 'awkwardness': return 'Awkward bulk'; default: return 'Barter friction'; } }
function nextInspectablePersonId() { if (!state.marketPeople.length) return null; const currentIndex = state.marketPeople.findIndex((entry) => entry.id === state.inspectedPersonId); const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % state.marketPeople.length : 0; return state.marketPeople[nextIndex].id; }
function inspectPerson(personId) {
  state.inspectedPersonId = personId;
  if (state.mode === 'presenter') state.conferenceActiveParticipantId = personId;
  const person = getPerson(personId); const evaluation = person ? evaluateTrade(person) : null;
  if (person && evaluation) setLastAction(evaluation.ok ? `${person.name} is a good next move. Trade now to receive ${goodsPhrase(evaluation.nextInventory)}.` : `${person.name} is blocked: ${marketFailureLabel(evaluation.reason)}. Check the inspection card, then inspect someone else.`);
  render();
}
function markMarketHistory(success) { const scenario = currentMarketScenario(); const prior = state.history.find((entry) => entry.roundId === scenario.id); if (prior) return; state.history.push({ roundId: scenario.id, roundTitle: scenario.title, correct: success, choiceId: success ? 'route-found' : 'market-skipped', choice: success ? `Reached ${goodsPhrase(state.targetInventory)} in ${state.marketTradeCount} trades` : 'Skipped market challenge' }); if (success) state.score += 1; }
function tryTrade(personId) {
  if (state.marketCompleted) return;
  const person = getPerson(personId); if (!person) return;
  state.inspectedPersonId = personId; if (state.mode === 'presenter') state.conferenceActiveParticipantId = personId;
  const result = evaluateTrade(person);
  if (!result.ok) { appendMarketLog('blocked', result.detail, result.reason); setLastAction(`${person.name} cannot trade yet: ${marketFailureLabel(result.reason)}. Inspect another trader.`); render(); return; }
  const before = { ...state.playerInventory }; state.playerInventory = result.nextInventory; state.marketTradeCount += 1;
  appendMarketLog('trade', `Trade ${state.marketTradeCount}: You gave ${goodsPhrase({ itemId: before.itemId, quantity: result.consumedQty })} to ${person.name} and received ${goodsPhrase(result.nextInventory)}.`);
  if (result.remainingQty > 0) appendMarketLog('note', `You would still be left holding ${result.remainingQty} ${pluralizeItemLabel(before.itemId, result.remainingQty)} in a more realistic market. Even partial trades create awkward leftovers to price and carry.`, 'awkwardness');
  else if (item(before.itemId).bulk === 'very bulky') appendMarketLog('note', `${goodsPhrase(before)} was ${item(before.itemId).bulk}. Large barter goods are awkward to drag from one trade to the next.`, 'awkwardness');
  if (inventoryMatches(state.playerInventory, state.targetInventory)) {
    state.marketCompleted = true;
    appendMarketLog('success', `Success: you reached ${goodsPhrase(state.targetInventory)} after ${state.marketTradeCount} swaps. ${currentMarketScenario().lessonSummary}`);
    markMarketHistory(true);
    setLastAction(`Success. You reached ${goodsPhrase(state.targetInventory)}. Continue when ready.`);
  } else {
    const nextCleanTrade = state.marketPeople.find((entry) => evaluateTrade(entry).ok);
    if (nextCleanTrade) state.inspectedPersonId = nextCleanTrade.id;
    setLastAction(`Trade complete. You now hold ${goodsPhrase(state.playerInventory)}. The next clean trade is surfaced automatically.`);
  }
  render();
}
function skipMarket() {
  const scenario = currentMarketScenario();
  if (!state.history.find((entry) => entry.roundId === scenario.id)) state.history.push({ roundId: scenario.id, roundTitle: scenario.title, correct: false, choiceId: 'market-skipped', choice: 'Skipped market challenge' });
  if (state.marketRoundIndex < barterScenarios.length - 1) { state.marketRoundIndex += 1; resetMarketState(); resetConferenceParticipants(); state.screen = 'market'; setLastAction('Skipped ahead. Inspect the new market to continue the lesson.'); }
  else { state.screen = 'round'; state.roundIndex = 0; setLastAction('Barter section complete. Pick an answer to continue into the money rounds.'); }
  render();
}
function continueFromMarket() {
  if (!state.marketCompleted) return;
  state.selectedChoice = null; state.presenterReveal = false;
  if (state.marketRoundIndex < barterScenarios.length - 1) { state.marketRoundIndex += 1; resetMarketState(); resetConferenceParticipants(); state.screen = 'market'; setLastAction('Nice. New market loaded. Inspect the next trader to keep the momentum.'); }
  else { state.screen = 'round'; state.roundIndex = 0; setLastAction('Barter complete. Now answer the money rounds to connect the lesson.'); }
  render();
}
function markHistory(round, choice) { const prior = state.history.find((entry) => entry.roundId === round.id); if (prior) return; state.history.push({ roundId: round.id, roundTitle: round.title, correct: choice.id === round.correctChoiceId, choiceId: choice.id, choice: choice.label }); if (choice.id === round.correctChoiceId) state.score += 1; }
function selectChoice(choiceId) {
  const round = currentRound(); const choice = round.choices.find((entry) => entry.id === choiceId); if (!choice) return;
  state.selectedChoice = choice; markHistory(round, choice);
  if (state.mode === 'presenter') { state.presenterReveal = false; setLastAction(`Answer selected: ${choice.label}. Discuss it, then reveal when ready.`); }
  else setLastAction(choice.id === round.correctChoiceId ? 'Good pick. Read the feedback, then continue.' : 'Useful miss. Read the feedback, then continue.');
  render();
}
function toggleProperty(propertyId) { const selected = new Set(state.selectedProperties); if (selected.has(propertyId)) selected.delete(propertyId); else selected.add(propertyId); state.selectedProperties = [...selected]; const total = state.selectedProperties.length; setLastAction(total >= 3 ? 'Strong enough recap. You can open the Bitcoin bridge now.' : `Choose ${3 - total} more trait${3 - total === 1 ? '' : 's'} to unlock the bridge.`); render(); }
function nextRound() { state.selectedChoice = null; state.presenterReveal = false; state.showVotePanel = false; if (state.roundIndex < rounds.length - 1) { state.roundIndex += 1; state.screen = 'round'; setLastAction('New round loaded. Read the prompt and tap the strongest answer.'); } else { state.screen = 'recap'; setLastAction('Quiz section complete. Pick at least three money traits to continue.'); } render(); }
function goToBitcoinBridge() { state.screen = 'bitcoin'; setLastAction('Final bridge open. Read the cards, then finish the run.'); render(); }
function finishExperience() { state.screen = 'end'; setLastAction('Run complete. Replay solo or switch to presenter mode.'); render(); }
function restartCurrentMode() { if (state.mode === 'presenter') startPresenter(); else startSolo(); }
function resetCurrentRound() { const round = currentRound(); state.selectedChoice = null; state.presenterReveal = false; state.history = state.history.filter((entry) => entry.roundId !== round.id); state.score = state.history.filter((entry) => entry.correct).length; setLastAction('Round reset. Pick an answer when you are ready.'); render(); }
function resetMarketRound() { const scenario = currentMarketScenario(); state.history = state.history.filter((entry) => entry.roundId !== scenario.id); state.score = state.history.filter((entry) => entry.correct).length; resetMarketState(); resetConferenceParticipants(); setLastAction('Market reset. Start again by inspecting a trader.'); render(); }
function skipRound() { const round = currentRound(); const prior = state.history.find((entry) => entry.roundId === round.id); if (!prior) state.history.push({ roundId: round.id, roundTitle: round.title, correct: false, choiceId: 'skipped', choice: 'Skipped' }); nextRound(); }
function toggleReveal() { if (!state.selectedChoice) return; state.presenterReveal = !state.presenterReveal; setLastAction(state.presenterReveal ? 'Reveal open. Review the lesson, then continue.' : 'Reveal hidden. Continue discussion or choose a different answer.'); render(); }
function toggleVotePanel() { state.showVotePanel = !state.showVotePanel; setLastAction(state.showVotePanel ? 'Vote board open for the room.' : 'Vote board hidden.'); render(); }
function castVote(choiceId) { const round = currentRound(); state.voteCounts[round.id][choiceId] += 1; setLastAction(`Vote recorded for ${round.choices.find((entry) => entry.id === choiceId)?.label || 'that choice'}.`); render(); }
function resetRoundVotes() { const round = currentRound(); state.voteCounts[round.id] = round.choices.reduce((acc, choice) => { acc[choice.id] = 0; return acc; }, {}); setLastAction('Vote counts reset.'); render(); }
function setConferenceParticipant(participantId) { state.conferenceActiveParticipantId = participantId; state.inspectedPersonId = participantId; const participant = state.conferenceParticipants.find((entry) => entry.id === participantId); if (participant) setLastAction(`Spotlight on ${participant.name}.`); render(); }
function progressPercent() { const totalSteps = barterScenarios.length + rounds.length + 3; let completed = 1; if (state.screen === 'conferenceIntro') completed = 1; else if (state.screen === 'market') completed = 1 + state.marketRoundIndex; else if (state.screen === 'round') completed = 1 + barterScenarios.length + state.roundIndex; else if (state.screen === 'recap') completed = 1 + barterScenarios.length + rounds.length; else if (state.screen === 'bitcoin') completed = 2 + barterScenarios.length + rounds.length; else if (state.screen === 'end') completed = totalSteps; return (completed / totalSteps) * 100; }
function selectedPropertiesSummary() { return properties.filter((entry) => state.selectedProperties.includes(entry.id)); }
function finalHeadline() { const perfect = barterScenarios.length + rounds.length; if (state.score === perfect) return 'Strong run.'; if (state.score >= Math.ceil(perfect * 0.65)) return 'Nice progression.'; return 'You completed the arc.'; }
function voteTotal(roundId) { return Object.values(state.voteCounts[roundId] || {}).reduce((sum, value) => sum + value, 0); }
function votePercent(roundId, choiceId) { const total = voteTotal(roundId); if (!total) return 0; return Math.round((state.voteCounts[roundId][choiceId] / total) * 100); }
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
      <section class="mobile-cta card soft-card">
        <div class="mobile-cta-copy">
          <div class="eyebrow">Next move</div>
          <p>${state.lastActionText}</p>
        </div>
      </section>
    </main>
  `;
  bind();
}
function landingScreen() {
  shell(`
    <section class="hero card glow-card stack-lg">
      <div class="hero-copy stack">
        <div class="eyebrow">Interactive lesson</div>
        <h1>Walk from barter to Bitcoin in a real learning arc.</h1>
        <p class="lede">Start with a simple solvable barter chain. Then move into coincidence of wants, divisibility problems, commodity money, coin standardization, debasement, inflation, and finally Bitcoin as an earned conclusion.</p>
      </div>
      <div class="hero-grid">
        <article class="info-card panel">
          <div class="pill-badge">Solo</div>
          <h2>Play the lesson yourself</h2>
          <p>${GAME_COPY.soloDuration}. Rebuilt for phone-first flow with clearer next steps, larger tap targets, and less cramped reading.</p>
          <ul class="feature-list">
            <li>Inspect/trade flow that is easier to follow on small screens</li>
            <li>Sticky next-step guidance throughout the run</li>
            <li>Faster scanning of goals, inventory, and outcomes</li>
          </ul>
          <button class="btn primary" data-action="start-solo">Start solo</button>
        </article>
        <article class="info-card panel presenter-entry">
          <div class="pill-badge alt">Presenter</div>
          <h2>Run a live room session</h2>
          <p>${GAME_COPY.presenterDuration}. Presenter mode remains intact, with mobile-safe layouts so it does not break on phones.</p>
          <ul class="feature-list">
            <li>Presenter-safe pacing across the full round sequence</li>
            <li>Participant roles mapped onto each market</li>
            <li>Reveal controls for discussion-first teaching</li>
          </ul>
          <button class="btn secondary strong" data-action="start-presenter">Open presenter mode</button>
        </article>
      </div>
      <section class="mini-panel stack">
        <div class="eyebrow">Lesson arc</div>
        <div class="stat-row">
          <span class="stat-chip">1. Simple barter success</span>
          <span class="stat-chip">2. Coincidence of wants problem</span>
          <span class="stat-chip">3. Divisibility problem</span>
          <span class="stat-chip">4. Commodity money</span>
          <span class="stat-chip">5. Coins and standardization</span>
          <span class="stat-chip">6. Debasement and inflation</span>
          <span class="stat-chip">7. Bitcoin bridge</span>
        </div>
      </section>
      <section class="mini-panel stack curriculum-panel">
        <div class="eyebrow">Curriculum alignment</div>
        ${curriculumNotes.map((note) => `<p class="small-copy">${note}</p>`).join('')}
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
          <h1>Turn the room into a money story.</h1>
          <p class="lede">This mode now follows the full progression: easy barter first, then harder barter, then divisibility, then money emergence, then money failure modes, then Bitcoin.</p>
        </div>
        <div class="badge big-badge">${GAME_COPY.presenterDuration}</div>
      </div>
      <div class="presenter-layout">
        <section class="panel stack"><h3>Presenter flow</h3><ol class="ordered-list"><li>Let the room solve the first simple barter lane quickly.</li><li>Increase complexity with a crowded plaza and divisibility failure.</li><li>Bridge into money as the social solution to barter friction.</li><li>Close with debasement, inflation, and Bitcoin as an earned comparison.</li></ol></section>
        <section class="panel stack"><h3>What stays static-site safe</h3><p>No backend, no sockets, no runtime dependencies. The full lesson still works as a single front-end bundle for GitHub Pages and mini app deployment.</p><div class="inline-note">Expanded pedagogy without breaking deploy simplicity.</div></section>
      </div>
      <section class="tip-strip">${presenterTips.map((tip) => `<div class="tip-chip">${tip}</div>`).join('')}</section>
      <div class="footer-actions single-row"><button class="btn ghost" data-action="home">Back</button><button class="btn primary" data-action="begin-presenter">Begin session</button></div>
    </section>
  `, { projector: true });
}
function marketFailureChips() {
  const all = [{ id: 'wants-mismatch', label: 'Wants mismatch' }, { id: 'scale-mismatch', label: 'Scale mismatch' }, { id: 'indivisibility', label: 'Indivisibility' }, { id: 'awkwardness', label: 'Awkward bulk' }];
  return all.map((entry) => `<span class="stat-chip ${state.failureBadgesSeen.includes(entry.id) ? 'chip-highlight' : 'chip-dim'}">${entry.label}</span>`).join('');
}
function soloMarketLessonLabel(reason) {
  switch (reason) {
    case 'wants-mismatch': return 'Concept: coincidence of wants';
    case 'scale-mismatch': return 'Concept: unit size and pricing';
    case 'indivisibility': return 'Concept: divisibility';
    case 'awkwardness': return 'Concept: portability';
    default: return 'Concept: barter friction';
  }
}
function soloMarketTakeaway(scenario, evaluation) {
  if (state.marketCompleted) return scenario.lessonSummary;
  if (!evaluation) return scenario.prompt;
  if (evaluation.ok) return 'This trade works because the other person wants exactly what you are holding right now. Barter can work, but only when wants and quantities line up.';
  return evaluation.detail;
}
function soloCompleteMarketLesson() {
  const scenario = currentMarketScenario();
  if (!state.marketCompleted) {
    const prior = state.history.find((entry) => entry.roundId === scenario.id);
    if (!prior) {
      state.history.push({ roundId: scenario.id, roundTitle: scenario.title, correct: true, choiceId: 'concept-understood', choice: `Understood: ${scenario.lessonSummary}` });
      state.score += 1;
    }
    state.marketCompleted = true;
    appendMarketLog('note', `Lesson complete: ${scenario.lessonSummary}`);
  }
  continueFromMarket();
}
function findSoloNextTrade() { return state.marketPeople.find((person) => evaluateTrade(person).ok); }
function soloRoundIntent(scenario, nextTrade) {
  if (state.marketCompleted) return 'You reached the target. Now connect the action to the concept before moving on.';
  if (nextTrade) return 'There is one clean next trade. The app surfaces it so you can focus on why it works.';
  return 'No clean trade is available from what you hold. That failure is the lesson: barter can break even when everyone has valuable goods.';
}
function guidedSoloMarketScreen() {
  const scenario = currentMarketScenario();
  const currentItem = item(state.playerInventory.itemId); const targetItem = item(state.targetInventory.itemId);
  const nextTrade = state.marketCompleted ? null : findSoloNextTrade();
  const inspectedPerson = getPerson(state.inspectedPersonId) || nextTrade || state.marketPeople[0]; const inspectedEvaluation = inspectedPerson ? evaluateTrade(inspectedPerson) : null;
  const nextPersonId = nextInspectablePersonId(); const nextPerson = nextPersonId ? getPerson(nextPersonId) : null;
  const lessonLabel = state.marketCompleted ? 'Concept learned' : soloMarketLessonLabel(inspectedEvaluation?.reason);
  shell(`
    <section class="solo-lesson-shell">
      <section class="card stage-card solo-stage-card">
        <div class="stage-header"><div><div class="eyebrow">${scenario.kicker}</div><h1>${scenario.title}</h1></div><div class="badge big-badge">Step ${state.marketRoundIndex + 1} / ${barterScenarios.length}</div></div>
        <p class="prompt">${scenario.intro}</p>
        <section class="solo-objective panel">
          <div class="solo-objective-card"><span class="inventory-label">You have</span><div class="solo-big-good"><span>${currentItem.emoji}</span><strong>${quantityLabel(state.playerInventory)}</strong></div><p>${currentItem.description}</p></div>
          <div class="solo-path-arrow">→</div>
          <div class="solo-objective-card target"><span class="inventory-label">Goal</span><div class="solo-big-good"><span>${targetItem.emoji}</span><strong>${quantityLabel(state.targetInventory)}</strong></div><p>${targetItem.description}</p></div>
        </section>
        <section class="solo-intent-card feedback-card feedback-neutral">
          <div class="result-tag">What this screen is teaching</div>
          <h3>${soloRoundIntent(scenario, nextTrade)}</h3>
          <p>${scenario.prompt}</p>
        </section>
        <section class="solo-teaching-card panel stack-lg">
          <div class="row wrap-row"><div><div class="eyebrow">${nextTrade ? 'Recommended next trade' : 'Example trader'}</div><h2>${inspectedPerson.name}</h2><p class="small-copy">${inspectedPerson.role}</p></div><span class="result-tag ${inspectedEvaluation?.ok || state.marketCompleted ? '' : 'subtle'}">${state.marketCompleted ? 'Goal reached' : inspectedEvaluation?.ok ? 'Trade works' : marketFailureLabel(inspectedEvaluation?.reason)}</span></div>
          <p class="lede">${inspectedPerson.greeting}</p>
          <div class="solo-trade-explainer">
            <article class="trade-pair"><span class="trade-label">They have</span><div class="trade-item">${goodsPhrase(inspectedPerson.offer)}</div></article>
            <article class="trade-pair"><span class="trade-label">They want</span><div class="trade-item">${goodsPhrase(inspectedPerson.ask)}</div></article>
          </div>
          <section class="feedback-card ${state.marketCompleted || inspectedEvaluation?.ok ? 'feedback-good' : 'feedback-warn'}">
            <div class="result-tag">${lessonLabel}</div>
            <h3>${state.marketCompleted ? 'You reached the goal.' : inspectedEvaluation?.ok ? 'This is the next clean trade.' : inspectedEvaluation?.headline}</h3>
            <p>${soloMarketTakeaway(scenario, inspectedEvaluation)}</p>
          </section>
          <div class="footer-actions solo-actions">
            ${nextTrade && inspectedPerson.id !== nextTrade.id ? `<button class="btn ghost" data-inspect="${nextTrade.id}">Return to recommended trade</button>` : `<button class="btn ghost" data-action="inspect-next">${nextPerson ? `Show ${nextPerson.name.split(' ')[0]}` : 'Show another trader'}</button>`}
            <button class="btn ${inspectedEvaluation?.ok && !state.marketCompleted ? 'primary' : 'secondary'}" data-trade="${inspectedPerson.id}" ${inspectedEvaluation?.ok && !state.marketCompleted ? '' : 'disabled'}>${inspectedEvaluation?.ok && !state.marketCompleted ? `Make this trade` : 'No clean trade from here'}</button>
            <button class="btn primary" data-action="solo-complete-market" ${!state.marketCompleted && nextTrade ? 'disabled' : ''}>${state.marketCompleted ? (state.marketRoundIndex === barterScenarios.length - 1 ? 'Continue to money' : 'Next concept') : nextTrade ? 'Make the trade first' : 'I understand — continue'}</button>
          </div>
        </section>
        <section class="solo-concept-strip">
          <span class="stat-chip ${state.failureBadgesSeen.includes('wants-mismatch') || inspectedEvaluation?.reason === 'wants-mismatch' ? 'chip-highlight' : ''}">Double coincidence of wants</span>
          <span class="stat-chip ${state.failureBadgesSeen.includes('scale-mismatch') || inspectedEvaluation?.reason === 'scale-mismatch' ? 'chip-highlight' : ''}">Unit of account</span>
          <span class="stat-chip ${state.failureBadgesSeen.includes('indivisibility') || inspectedEvaluation?.reason === 'indivisibility' ? 'chip-highlight' : ''}">Divisibility</span>
          <span class="stat-chip ${state.marketTradeCount > 0 ? 'chip-highlight' : ''}">Medium of exchange</span>
        </section>
      </section>
    </section>
  `);
}
function marketScreen() {
  if (state.mode === 'solo') { guidedSoloMarketScreen(); return; }
  const scenario = currentMarketScenario(); const currentItem = item(state.playerInventory.itemId); const targetItem = item(state.targetInventory.itemId); const inspectedPerson = getPerson(state.inspectedPersonId) || state.marketPeople[0]; const inspectedEvaluation = inspectedPerson ? evaluateTrade(inspectedPerson) : null; const activeParticipant = state.conferenceParticipants.find((entry) => entry.id === state.conferenceActiveParticipantId); const nextPersonId = nextInspectablePersonId(); const nextPerson = nextPersonId ? getPerson(nextPersonId) : null;
  shell(`
    <section class="experience-grid ${state.mode === 'presenter' ? 'presenter-grid market-grid' : 'market-grid'}">
      <section class="card stage-card ${state.mode === 'presenter' ? 'projector-card' : ''}">
        <div class="stage-header"><div><div class="eyebrow">${scenario.kicker}</div><h1>${scenario.title}</h1></div><div class="badge big-badge">Market ${state.marketRoundIndex + 1} / ${barterScenarios.length}</div></div>
        <p class="prompt">${scenario.intro}</p>
        <section class="feedback-card feedback-neutral market-guidance"><div class="result-tag">How to play</div><h3>${state.marketCompleted ? 'Target reached.' : 'Inspect → understand the friction → trade only when the path opens.'}</h3><p>${state.marketCompleted ? 'You can move on whenever you are ready.' : state.lastActionText}</p></section>
        <section class="market-objective panel stack">
          <div class="row wrap-row objective-row">
            <div class="inventory-card inventory-now"><span class="inventory-label">You have</span><div class="inventory-item"><span class="inventory-emoji">${currentItem.emoji}</span><strong>${quantityLabel(state.playerInventory)}</strong></div><p>${currentItem.description}</p></div>
            <div class="market-arrow">→</div>
            <div class="inventory-card inventory-target"><span class="inventory-label">You need</span><div class="inventory-item"><span class="inventory-emoji">${targetItem.emoji}</span><strong>${quantityLabel(state.targetInventory)}</strong></div><p>${targetItem.description}</p></div>
          </div>
          <div class="market-status-row"><span class="stat-chip">Trades made: ${state.marketTradeCount}</span><span class="stat-chip">Current burden: ${currentItem.bulk}</span><span class="stat-chip ${state.marketCompleted ? 'chip-success' : ''}">${state.marketCompleted ? 'Target reached' : 'Still bargaining'}</span></div>
          <div class="failure-chip-row">${marketFailureChips()}</div>
        </section>
        <section class="plaza-scene panel stack">
          <div class="row wrap-row"><div><div class="eyebrow">Market plaza</div><h3>Tap a person to inspect</h3></div><div class="inline-note">${scenario.prompt}</div></div>
          <div class="plaza-people-list">${state.marketPeople.map((person) => { const status = marketPersonStatus(person); return `<button class="person-list-card plaza-person ${person.tone} person-${status} ${person.id === state.inspectedPersonId ? 'person-inspected' : ''}" data-inspect="${person.id}"><span class="person-avatar">🧑</span><span class="person-list-meta"><span class="person-name">${person.name}</span><span class="person-role">${person.role}</span></span><span class="person-list-goods">${item(person.offer.itemId).emoji} ${item(person.offer.itemId).label}</span></button>`; }).join('')}</div>
          <div class="plaza-map" aria-hidden="true">${state.marketPeople.map((person) => { const status = marketPersonStatus(person); return `<button class="plaza-person ${person.tone} person-${status} ${person.id === state.inspectedPersonId ? 'person-inspected' : ''}" data-inspect="${person.id}" style="left:${person.x}%; top:${person.y}%;"><span class="person-avatar">🧑</span><span class="person-name">${person.name.split(' ')[0]}</span><span class="person-goods">${item(person.offer.itemId).emoji}</span></button>`; }).join('')}<div class="plaza-centerpiece">⛲</div></div>
        </section>
        ${inspectedPerson ? `<section class="inspection-card panel stack"><div class="row wrap-row"><div><div class="eyebrow">Inspected person</div><h3>${inspectedPerson.name} · ${inspectedPerson.role}</h3></div><span class="trader-status-pill inspect-pill ${inspectedEvaluation?.ok ? 'pill-ready' : ''}">${inspectedEvaluation?.ok ? 'Trade works now' : marketFailureLabel(inspectedEvaluation?.reason)}</span></div><p>${inspectedPerson.greeting}</p><div class="inspection-grid"><div class="trade-pair have-pair"><span class="trade-label">HAS</span><div class="trade-item">${goodsPhrase(inspectedPerson.offer)}</div><p>${item(inspectedPerson.offer.itemId).moneyTraits}</p></div><div class="trade-pair want-pair"><span class="trade-label">WANTS</span><div class="trade-item">${goodsPhrase(inspectedPerson.ask)}</div><p>${inspectedPerson.failureHint}</p></div></div><section class="feedback-card ${inspectedEvaluation?.ok ? 'feedback-good' : 'feedback-warn'}"><div class="result-tag ${inspectedEvaluation?.ok ? '' : 'subtle'}">${inspectedEvaluation?.ok ? 'Trade path open' : marketFailureLabel(inspectedEvaluation?.reason)}</div><h3>${inspectedEvaluation?.ok ? 'This person will trade with you right now.' : inspectedEvaluation?.headline || 'Inspect a person to see the friction.'}</h3><p>${inspectedEvaluation?.ok ? `You can swap ${goodsPhrase({ itemId: state.playerInventory.itemId, quantity: inspectedEvaluation.consumedQty })} for ${goodsPhrase(inspectedEvaluation.nextInventory)}.` : inspectedEvaluation?.detail || scenario.prompt}</p></section><div class="footer-actions single-row market-inline-actions"><button class="btn ghost" data-action="inspect-next">${nextPerson ? `Next: ${nextPerson.name.split(' ')[0]}` : 'Next person'}</button><button class="btn primary" data-trade="${inspectedPerson.id}" ${inspectedEvaluation?.ok ? '' : 'disabled'}>${inspectedEvaluation?.ok ? `Trade for ${item(inspectedPerson.offer.itemId).label}` : 'Trade unavailable'}</button></div></section>` : ''}
        <section class="feedback-card ${state.marketCompleted ? 'feedback-good' : 'feedback-pending'}"><div class="result-tag ${state.marketCompleted ? '' : 'subtle'}">${state.marketCompleted ? 'Lesson unlocked' : 'Trade friction in motion'}</div><h3>${state.marketCompleted ? 'You reached the target, but the path itself teaches the lesson.' : 'Barter is not just about value. It is about matching the right person, the right thing, and the right quantity at the right moment.'}</h3><p>${state.marketCompleted ? scenario.lessonSummary : scenario.prompt}</p></section>
        <div class="footer-actions ${state.mode === 'presenter' ? 'presenter-actions presenter-actions-market' : ''}"><button class="btn ghost" data-action="reset-market">Reset market</button>${state.mode === 'presenter' ? '<button class="btn ghost" data-action="skip-market">Skip to next lesson</button>' : '<button class="btn ghost" data-action="restart-mode">Restart run</button>'}<button class="btn primary" data-action="continue-market" ${state.marketCompleted ? '' : 'disabled'}>${state.marketRoundIndex === barterScenarios.length - 1 ? 'Continue to money' : 'Next market'}</button></div>
      </section>
      <aside class="stack sidebar">
        ${state.mode === 'presenter' ? `<section class="card panel stack presenter-note-card"><div class="eyebrow">Facilitator prompt</div><h3>What exactly is the friction here?</h3><p>${scenario.facilitatorNote}</p><div class="inline-note">${scenario.audiencePrompt}</div></section><section class="card panel stack participant-panel"><div class="eyebrow">Participant market board</div><h3>People in this market</h3><p class="small-copy">These roles mirror the market people so presenter mode stays coherent across the expanded lesson.</p><div class="participant-list">${state.conferenceParticipants.map((participant) => `<button class="participant-card ${participant.id === state.conferenceActiveParticipantId ? 'participant-active' : ''} ${participant.colorClass}" data-participant="${participant.id}"><div><strong>${participant.name}</strong><div class="trader-role">${participant.role}</div></div><div class="participant-mini-pairs"><span>Has ${goodsPhrase(participant.have)}</span><span>Needs ${goodsPhrase(participant.want)}</span></div></button>`).join('')}</div>${activeParticipant ? `<div class="participant-focus panel stack"><div class="eyebrow">Spotlighted participant</div><h3>${activeParticipant.name}</h3><p class="small-copy">Has ${goodsPhrase(activeParticipant.have)} · Needs ${goodsPhrase(activeParticipant.want)}</p></div>` : ''}</section>` : `<section class="card panel stack recap-side-card"><div class="eyebrow">Why this round exists</div><h3>${scenario.kicker}</h3><p class="small-copy">Each market round adds one more layer of monetary pressure so the lesson ramps instead of front-loading complexity.</p></section>`}
        <section class="card panel stack market-log-panel"><div class="row wrap-row"><div><div class="eyebrow">Trade log</div><h3>What just happened</h3></div><span class="badge">${state.marketLog.length} events</span></div><div class="market-log-list">${state.marketLog.map((entry) => `<article class="market-log-entry log-${entry.type}">${entry.badge ? `<div class="result-tag subtle">${marketFailureLabel(entry.badge)}</div>` : ''}<p>${entry.text}</p></article>`).join('')}</div></section>
      </aside>
    </section>
  `, { projector: state.mode === 'presenter' });
}
function roundScreen() {
  const round = currentRound(); const choice = state.selectedChoice; const correct = choice ? choice.id === round.correctChoiceId : false; const showReveal = state.mode === 'solo' ? Boolean(choice) : Boolean(choice && state.presenterReveal); const totalLessonRounds = barterScenarios.length + rounds.length; const displayedRoundNumber = barterScenarios.length + state.roundIndex + 1;
  shell(`
    <section class="experience-grid ${state.mode === 'presenter' ? 'presenter-grid' : ''}">
      <section class="card stage-card ${state.mode === 'presenter' ? 'projector-card' : ''}">
        <div class="stage-header"><div><div class="eyebrow">${round.kicker}</div><h1>${round.title}</h1></div><div class="badge big-badge">${displayedRoundNumber} / ${totalLessonRounds}</div></div>
        <p class="prompt">${round.prompt}</p>
        <section class="feedback-card feedback-neutral market-guidance"><div class="result-tag">Next move</div><h3>${choice ? 'Answer locked in.' : 'Choose the strongest answer.'}</h3><p>${state.lastActionText}</p></section>
        <div class="choice-grid ${state.mode === 'presenter' ? 'choice-grid-large' : ''}">${round.choices.map((entry) => `<button class="choice ${choice?.id === entry.id ? 'selected' : ''} ${showReveal && entry.id === round.correctChoiceId ? 'choice-correct' : ''} ${showReveal && choice?.id === entry.id && !correct ? 'choice-missed' : ''}" data-choice="${entry.id}"><span class="choice-title">${entry.label}</span><span class="choice-detail">${entry.detail}</span></button>`).join('')}</div>
        ${showReveal ? `<section class="feedback-card ${correct ? 'feedback-good' : 'feedback-warn'}"><div class="result-tag">${correct ? 'Correct direction' : 'Useful failure'}</div><h3>${correct ? 'That moves the story forward.' : 'That choice helps clarify what stronger money needs.'}</h3><p>${choice.feedback}</p><ul>${round.summary.map((entry) => `<li>${entry}</li>`).join('')}</ul></section>` : `<section class="feedback-card feedback-pending"><div class="result-tag subtle">${state.mode === 'presenter' ? 'Awaiting reveal' : 'Pick an option'}</div><p>${state.mode === 'presenter' ? 'Select an answer, discuss with the room, then reveal the lesson.' : 'Choose an option to see what this round teaches.'}</p></section>`}
        <div class="footer-actions ${state.mode === 'presenter' ? 'presenter-actions' : ''}">${state.mode === 'presenter' ? `<button class="btn ghost" data-action="reset-round">Reset round</button><button class="btn ghost" data-action="skip-round">Skip</button><button class="btn secondary" data-action="toggle-votes">${state.showVotePanel ? 'Hide votes' : 'Show votes'}</button><button class="btn secondary" data-action="toggle-reveal" ${choice ? '' : 'disabled'}>${showReveal ? 'Hide reveal' : round.revealLabel}</button><button class="btn primary" data-action="next" ${showReveal ? '' : 'disabled'}>${state.roundIndex === rounds.length - 1 ? 'Go to recap' : 'Next'}</button>` : `<button class="btn ghost" data-action="restart-mode">Restart</button><button class="btn primary" data-action="next" ${choice ? '' : 'disabled'}>${state.roundIndex === rounds.length - 1 ? 'Recap' : 'Next round'}</button>`}</div>
      </section>
      <aside class="stack sidebar">
        ${state.mode === 'presenter' ? `<section class="card panel stack presenter-note-card"><div class="eyebrow">Facilitator prompt</div><h3>${round.question}</h3><p>${round.facilitatorNote}</p><div class="inline-note">${round.audiencePrompt}</div></section><section class="card panel stack ${state.showVotePanel ? '' : 'muted-panel'}"><div class="row wrap-row"><div><div class="eyebrow">Audience vote board</div><h3>${voteTotal(round.id)} total votes</h3></div><button class="btn ghost small-btn" data-action="reset-votes">Reset votes</button></div><p class="small-copy">Use this as a hand-count tracker or scaffold for future live multi-user voting.</p><div class="vote-list">${round.choices.map((entry) => `<div class="vote-row"><button class="vote-cast" data-vote="${entry.id}">+1</button><div class="vote-meta"><div class="vote-line"><strong>${entry.label}</strong><span>${state.voteCounts[round.id][entry.id]} votes · ${votePercent(round.id, entry.id)}%</span></div><div class="vote-bar"><span style="width:${votePercent(round.id, entry.id)}%"></span></div></div></div>`).join('')}</div></section>` : `<section class="card panel stack recap-side-card"><div class="eyebrow">Run status</div><h3>${state.score} / ${barterScenarios.length + rounds.length} complete</h3><p class="small-copy">The market rounds created the intuition. The later rounds explain how societies keep trying to improve money.</p></section>`}
      </aside>
    </section>
  `, { projector: state.mode === 'presenter' });
}
function recapScreen() {
  const selected = selectedPropertiesSummary(); const ready = selected.length >= 3;
  shell(`
    <section class="experience-grid ${state.mode === 'presenter' ? 'presenter-grid' : ''}">
      <section class="card stage-card ${state.mode === 'presenter' ? 'projector-card' : ''}">
        <div class="stage-header"><div><div class="eyebrow">Recap</div><h1>What makes money strong?</h1></div><div class="badge big-badge">${state.score} / ${barterScenarios.length + rounds.length}</div></div>
        <p class="prompt">Choose at least three traits. By now, these should feel earned from the lesson, not memorized from a slide.</p>
        <section class="feedback-card feedback-neutral market-guidance"><div class="result-tag">Three functions of money</div><h3>Money should help people exchange, save, and measure value.</h3><div class="function-strip">${moneyFunctions.map((entry) => `<article class="function-chip"><strong>${entry.title}</strong><span>${entry.description}</span></article>`).join('')}</div></section>
        <section class="feedback-card feedback-neutral market-guidance"><div class="result-tag">Next move</div><h3>${ready ? 'Bridge unlocked.' : 'Pick at least three traits.'}</h3><p>${state.lastActionText}</p></section>
        <div class="properties-grid ${state.mode === 'presenter' ? 'properties-grid-large' : ''}">${properties.map((entry) => `<button class="pill ${state.selectedProperties.includes(entry.id) ? 'selected' : ''}" data-property="${entry.id}"><span class="choice-title">${entry.title}</span><span class="choice-detail">${entry.description}</span></button>`).join('')}</div>
        <section class="recap-panel panel"><div class="row wrap-row"><h3>Run recap</h3><span class="badge">${state.history.length} rounds logged</span></div><div class="history-list">${state.history.map((entry) => `<article class="history-item ${entry.correct ? 'history-good' : 'history-warn'}"><div><strong>${entry.roundTitle}</strong><p>${entry.choice}</p></div><span class="status-dot">${entry.correct ? '✓' : '•'}</span></article>`).join('')}</div><div class="selected-summary ${selected.length ? '' : 'empty-summary'}">${selected.length ? selected.map((entry) => `<span class="stat-chip">${entry.title}</span>`).join('') : '<span class="small-copy">Pick at least three traits to unlock the Bitcoin bridge.</span>'}</div></section>
        <div class="footer-actions ${state.mode === 'presenter' ? 'presenter-actions' : ''}"><button class="btn ghost" data-action="restart-mode">${state.mode === 'presenter' ? 'Restart session' : 'Replay'}</button><button class="btn primary" data-action="bridge" ${ready ? '' : 'disabled'}>Bitcoin bridge</button></div>
      </section>
      <aside class="stack sidebar"><section class="card panel stack"><div class="eyebrow">Teaching prompt</div><h3>Ask before you bridge</h3><p class="small-copy">Which property mattered most in the earlier rounds: divisibility, portability, scarcity, fungibility, or broad acceptance?</p></section></aside>
    </section>
  `, { projector: state.mode === 'presenter' });
}
function bitcoinScreen() {
  shell(`
    <section class="experience-grid ${state.mode === 'presenter' ? 'presenter-grid' : ''}">
      <section class="card stage-card ${state.mode === 'presenter' ? 'projector-card' : ''}">
        <div class="stage-header"><div><div class="eyebrow">Bitcoin bridge</div><h1>Why Bitcoin enters this story</h1></div><div class="badge big-badge">Final step</div></div>
        <section class="feedback-card feedback-neutral market-guidance"><div class="result-tag">Next move</div><h3>Read the bridge, then finish.</h3><p>${state.lastActionText}</p></section>
        <div class="bridge-grid">${bridgePoints.map((entry, index) => `<article class="bridge-card panel"><div class="bridge-index">0${index + 1}</div><p>${entry}</p></article>`).join('')}</div>
        <section class="feedback-card feedback-neutral"><div class="result-tag">Big idea</div><h3>People keep searching for money that is easier to trust, harder to debase, and easier to move through space and time.</h3><p>Bitcoin matters here because it tries to solve old money problems in a digital environment, not because it appeared from nowhere. The earlier rounds are what make that comparison meaningful.</p></section>
        <div class="footer-actions ${state.mode === 'presenter' ? 'presenter-actions' : ''}"><button class="btn ghost" data-action="restart-mode">Restart</button><button class="btn primary" data-action="finish">Finish</button></div>
      </section>
      <aside class="stack sidebar"><section class="card panel stack"><div class="eyebrow">Facilitator note</div><h3>Keep the bridge earned</h3><p class="small-copy">If the audience already understands why barter is clumsy and why money fails when it is weak or easily diluted, the Bitcoin connection lands much more cleanly.</p></section></aside>
    </section>
  `, { projector: state.mode === 'presenter' });
}
function endScreen() {
  shell(`
    <section class="card end-card stack-lg ${state.mode === 'presenter' ? 'projector-card' : ''}">
      <div class="eyebrow">Complete</div>
      <h1>${finalHeadline()}</h1>
      <p class="lede">You moved from simple barter success to harder barter failure, through divisibility, commodity money, standardization, debasement, inflation, and finally the Bitcoin bridge.</p>
      <div class="end-stats"><div class="panel stat-panel"><strong>Score</strong><span>${state.score} / ${barterScenarios.length + rounds.length}</span></div><div class="panel stat-panel"><strong>Mode</strong><span>${state.mode === 'presenter' ? 'Conference / presenter' : 'Solo'}</span></div><div class="panel stat-panel"><strong>Selected traits</strong><span>${selectedPropertiesSummary().map((entry) => entry.title).join(', ') || 'None selected'}</span></div></div>
      <section class="panel stack"><h3>Replay options</h3><div class="footer-actions single-row"><button class="btn ghost" data-action="home">Back to landing</button><button class="btn secondary" data-action="start-solo">Play solo again</button><button class="btn primary" data-action="start-presenter">Presenter mode</button></div></section>
    </section>
  `, { projector: state.mode === 'presenter' });
}
function render() { switch (state.screen) { case 'landing': landingScreen(); break; case 'conferenceIntro': conferenceIntroScreen(); break; case 'market': marketScreen(); break; case 'round': roundScreen(); break; case 'recap': recapScreen(); break; case 'bitcoin': bitcoinScreen(); break; case 'end': endScreen(); break; default: landingScreen(); } }
function bind() {
  const on = (selector, handler) => { app.querySelectorAll(selector).forEach((el) => el.addEventListener('click', handler)); };
  on('[data-action="home"]', resetToLanding); on('[data-action="start-solo"]', startSolo); on('[data-action="start-presenter"]', startPresenter); on('[data-action="begin-presenter"]', beginPresenterRun); on('[data-action="next"]', nextRound); on('[data-action="bridge"]', goToBitcoinBridge); on('[data-action="finish"]', finishExperience); on('[data-action="restart-mode"]', restartCurrentMode); on('[data-action="reset-round"]', resetCurrentRound); on('[data-action="skip-round"]', skipRound); on('[data-action="toggle-reveal"]', toggleReveal); on('[data-action="toggle-votes"]', toggleVotePanel); on('[data-action="reset-votes"]', resetRoundVotes); on('[data-action="reset-market"]', resetMarketRound); on('[data-action="continue-market"]', continueFromMarket); on('[data-action="solo-complete-market"]', soloCompleteMarketLesson); on('[data-action="skip-market"]', skipMarket); on('[data-action="inspect-next"]', () => { const nextId = nextInspectablePersonId(); if (!nextId) return; inspectPerson(nextId); });
  app.querySelectorAll('[data-choice]').forEach((el) => el.addEventListener('click', () => selectChoice(el.getAttribute('data-choice'))));
  app.querySelectorAll('[data-property]').forEach((el) => el.addEventListener('click', () => toggleProperty(el.getAttribute('data-property'))));
  app.querySelectorAll('[data-vote]').forEach((el) => el.addEventListener('click', () => castVote(el.getAttribute('data-vote'))));
  app.querySelectorAll('[data-inspect]').forEach((el) => el.addEventListener('click', () => inspectPerson(el.getAttribute('data-inspect'))));
  app.querySelectorAll('[data-trade]').forEach((el) => el.addEventListener('click', () => tryTrade(el.getAttribute('data-trade'))));
  app.querySelectorAll('[data-participant]').forEach((el) => el.addEventListener('click', () => setConferenceParticipant(el.getAttribute('data-participant'))));
}
resetProgress();
render();