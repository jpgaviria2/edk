const GAME_COPY = {
  title: 'History of Money',
  subtitle: 'A fast interactive journey from barter to Bitcoin',
  soloDuration: '~4 min solo run',
  presenterDuration: '~10–14 min facilitated session',
};

const marketItems = {
  fish: {
    id: 'fish',
    emoji: '🐟',
    label: 'Fish',
    short: 'Fresh fish',
    description: 'Useful food, but it spoils fast.',
  },
  grain: {
    id: 'grain',
    emoji: '🌾',
    label: 'Grain',
    short: 'Grain sack',
    description: 'Staple food that many people value.',
  },
  salt: {
    id: 'salt',
    emoji: '🧂',
    label: 'Salt',
    short: 'Salt pouch',
    description: 'Portable, divisible, and widely wanted.',
  },
  pots: {
    id: 'pots',
    emoji: '🏺',
    label: 'Clay pots',
    short: 'Clay pots',
    description: 'Useful containers for homes and trade.',
  },
  wool: {
    id: 'wool',
    emoji: '🧶',
    label: 'Wool cloth',
    short: 'Wool cloth',
    description: 'Warm fabric for clothing and trade.',
  },
  shoes: {
    id: 'shoes',
    emoji: '👞',
    label: 'Shoes',
    short: 'Winter shoes',
    description: 'The thing you urgently need before winter.',
  },
  shells: {
    id: 'shells',
    emoji: '🐚',
    label: 'Shells',
    short: 'Shell necklace',
    description: 'Pretty and recognizable, but supply can change.',
  },
};

const barterScenario = {
  id: 'barter-market',
  title: 'Barter market challenge',
  kicker: 'Round 1',
  intro:
    'You enter a crowded village market. You start with one item. Winter is coming and your goal is to leave with shoes.',
  prompt:
    'Trade step-by-step with visible market participants. Each trader will only swap if you offer the item they want.',
  facilitatorNote:
    'Let the room suggest trades out loud. Tap through their proposed route and notice how often barter stalls unless wants line up exactly.',
  audiencePrompt:
    'Ask the group to predict the shortest path before making the first trade.',
  playerStartItemId: 'fish',
  targetItemId: 'shoes',
  traders: [
    {
      id: 'mara',
      name: 'Mara the Potter',
      role: 'Potter',
      line: 'I have clay pots. Bring me fish and we have a deal.',
      have: 'pots',
      want: 'fish',
    },
    {
      id: 'gita',
      name: 'Gita the Weaver',
      role: 'Weaver',
      line: 'I can trade wool cloth, but only if you bring me clay pots.',
      have: 'wool',
      want: 'pots',
    },
    {
      id: 'soren',
      name: 'Soren the Salt Merchant',
      role: 'Salt trader',
      line: 'I carry salt pouches and will swap for wool cloth.',
      have: 'salt',
      want: 'wool',
    },
    {
      id: 'tala',
      name: 'Tala the Farmer',
      role: 'Farmer',
      line: 'I will trade grain for salt. My family always needs salt.',
      have: 'grain',
      want: 'salt',
    },
    {
      id: 'bako',
      name: 'Bako the Shoemaker',
      role: 'Shoemaker',
      line: 'I made sturdy winter shoes. Bring me grain and they are yours.',
      have: 'shoes',
      want: 'grain',
    },
    {
      id: 'lina',
      name: 'Lina the Jeweler',
      role: 'Jeweler',
      line: 'I have shell jewelry, but I only want salt today.',
      have: 'shells',
      want: 'salt',
    },
  ],
};

const rounds = [
  {
    id: 'commodity',
    title: 'Commodity money emerges',
    kicker: 'Round 2',
    prompt: 'After that messy barter run, your village starts converging on one item to trade through. Which good works best as money?',
    facilitatorNote:
      'Connect this back to the market you just played. Ask which item would have made all those trades easier to coordinate.',
    revealLabel: 'Reveal the stronger money',
    question: 'Which good is strongest money?',
    correctChoiceId: 'salt',
    choices: [
      {
        id: 'salt',
        label: 'Salt',
        detail: 'Useful, portable, divisible, and already wanted by multiple traders.',
        feedback:
          'Exactly. Useful commodities can become money because people already recognize their value and expect others to accept them.',
      },
      {
        id: 'berries',
        label: 'Berries',
        detail: 'Easy to gather, easy to bruise, easy to rot.',
        feedback:
          'Berries fail durability. Good money has to survive time, handling, and storage.',
      },
      {
        id: 'giant-rock',
        label: 'A giant rock',
        detail: 'Scarce maybe. Portable definitely not.',
        feedback:
          'Scarcity alone is not enough. Money also needs to move easily and fit many trade sizes.',
      },
    ],
    summary: [
      'Commodity money works when many people value the good already.',
      'Durability, portability, recognizability, and divisibility matter a lot.',
      'A commonly desired trade good reduces the friction you felt in barter.',
    ],
    audiencePrompt: 'Ask for a show of hands before revealing: salt, berries, or giant rock?',
  },
  {
    id: 'inflation',
    title: 'Supply shocks break trust',
    kicker: 'Round 3',
    prompt: 'Your town now uses shells as money. Then a ship arrives carrying huge sacks of identical shells. What changes first?',
    facilitatorNote:
      'Pause after answers and ask: do more money units automatically mean more real wealth?',
    revealLabel: 'Reveal the inflation lesson',
    question: 'What happens when supply explodes?',
    correctChoiceId: 'prices-up',
    choices: [
      {
        id: 'prices-up',
        label: 'Prices rise over time',
        detail: 'Each shell buys less once shells are much easier to get.',
        feedback:
          'Right. When the money supply grows much faster than goods and services, purchasing power tends to fall.',
      },
      {
        id: 'everyone-richer',
        label: 'Everyone becomes richer instantly',
        detail: 'More units is not the same as more wealth.',
        feedback:
          'Nominal balances may rise, but real wealth does not magically appear. More money units do not create more goods.',
      },
      {
        id: 'nothing',
        label: 'Nothing changes',
        detail: 'Supply changes hit expectations and pricing fast.',
        feedback:
          'Money depends on trust in scarcity and predictability. A sudden supply flood weakens that trust.',
      },
    ],
    summary: [
      'Strong money should be hard to produce unexpectedly.',
      'Easy supply growth tends to weaken purchasing power.',
      'Reliable scarcity matters because people save into money, not just spend it.',
    ],
    audiencePrompt: 'Ask the group: if shells become easy to gather, would you still save in them?',
  },
];

const properties = [
  {
    id: 'durable',
    title: 'Durable',
    description: 'It should survive time without rotting or breaking down.',
  },
  {
    id: 'portable',
    title: 'Portable',
    description: 'It should move easily across distance and between people.',
  },
  {
    id: 'divisible',
    title: 'Divisible',
    description: 'Small and large payments should both be possible.',
  },
  {
    id: 'verifiable',
    title: 'Verifiable',
    description: 'People should be able to check that it is real.',
  },
  {
    id: 'scarce',
    title: 'Scarce',
    description: 'New supply should be hard to create on demand.',
  },
  {
    id: 'acceptable',
    title: 'Widely accepted',
    description: 'Others must trust they can trade it onward too.',
  },
];

const bridgePoints = [
  'Bitcoin is digital, but it tries to preserve strong-money traits in a new form.',
  'Its supply is predictable instead of being easy to expand suddenly.',
  'It is highly divisible, easy to verify, and can move globally.',
  'That is why many people see Bitcoin as a new chapter in the history of money.',
];

const presenterTips = [
  'Treat each trader as a person in the market with a real have/need role the audience can reason about.',
  'Use “reveal” only after the room has committed to an answer or a market route.',
  'If the room is mixed, ask beginners for intuition first and experienced participants for refinements second.',
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
  marketInventory: barterScenario.playerStartItemId,
  marketCompleted: false,
  marketTradeCount: 0,
  marketLog: [],
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

function buildConferenceParticipants() {
  return barterScenario.traders.map((trader, index) => ({
    id: trader.id,
    name: trader.name,
    role: trader.role,
    have: trader.have,
    want: trader.want,
    colorClass: `participant-tone-${(index % 6) + 1}`,
  }));
}

function resetVotes() {
  state.voteCounts = createInitialVotes();
}

function resetMarketState() {
  state.marketInventory = barterScenario.playerStartItemId;
  state.marketCompleted = false;
  state.marketTradeCount = 0;
  state.marketLog = [
    {
      type: 'start',
      text: `You enter the market holding ${itemPhrase(barterScenario.playerStartItemId)} and needing ${itemPhrase(barterScenario.targetItemId)}.`,
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

function item(itemId) {
  return marketItems[itemId];
}

function itemPhrase(itemId) {
  const current = item(itemId);
  return `${current.emoji} ${current.label}`;
}

function marketTraderStatus(trader) {
  if (state.marketCompleted && state.marketInventory === barterScenario.targetItemId) {
    return trader.have === barterScenario.targetItemId ? 'target-hit' : 'closed';
  }
  if (state.marketInventory === trader.want) return 'ready';
  if (state.marketInventory === trader.have) return 'holding-same';
  return 'blocked';
}

function markMarketHistory(success) {
  const prior = state.history.find((item) => item.roundId === barterScenario.id);
  if (prior) return;
  state.history.push({
    roundId: barterScenario.id,
    roundTitle: barterScenario.title,
    correct: success,
    choiceId: success ? 'route-found' : 'market-skipped',
    choice: success ? `Reached ${itemPhrase(barterScenario.targetItemId)} in ${state.marketTradeCount} trades` : 'Skipped market challenge',
  });
  if (success) {
    state.score += 1;
  }
}

function tradeWithTrader(traderId) {
  if (state.marketCompleted) return;
  const trader = barterScenario.traders.find((entry) => entry.id === traderId);
  if (!trader) return;

  const beforeItem = state.marketInventory;
  if (beforeItem !== trader.want) {
    state.marketLog.unshift({
      type: 'blocked',
      text: `${trader.name} wants ${itemPhrase(trader.want)}, not ${itemPhrase(beforeItem)}.`,
    });
    render();
    return;
  }

  state.marketInventory = trader.have;
  state.marketTradeCount += 1;
  state.marketLog.unshift({
    type: 'trade',
    text: `Trade ${state.marketTradeCount}: You gave ${itemPhrase(beforeItem)} to ${trader.name} and received ${itemPhrase(trader.have)}.`,
  });

  if (state.marketInventory === barterScenario.targetItemId) {
    state.marketCompleted = true;
    state.marketLog.unshift({
      type: 'success',
      text: `Success: you finally reached ${itemPhrase(barterScenario.targetItemId)} after ${state.marketTradeCount} separate swaps.`,
    });
    markMarketHistory(true);
  }

  render();
}

function skipMarket() {
  if (!state.history.find((item) => item.roundId === barterScenario.id)) {
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
  const prior = state.history.find((item) => item.roundId === round.id);
  if (prior) return;
  state.history.push({
    roundId: round.id,
    roundTitle: round.title,
    correct: choice.id === round.correctChoiceId,
    choiceId: choice.id,
    choice: choice.label,
  });
  if (choice.id === round.correctChoiceId) {
    state.score += 1;
  }
}

function selectChoice(choiceId) {
  const round = currentRound();
  const choice = round.choices.find((item) => item.id === choiceId);
  if (!choice) return;

  state.selectedChoice = choice;
  markHistory(round, choice);

  if (state.mode === 'presenter') {
    state.presenterReveal = false;
  }

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
  if (state.mode === 'presenter') {
    startPresenter();
  } else {
    startSolo();
  }
}

function resetCurrentRound() {
  const round = currentRound();
  state.selectedChoice = null;
  state.presenterReveal = false;
  state.history = state.history.filter((item) => item.roundId !== round.id);
  state.score = state.history.filter((item) => item.correct).length;
  render();
}

function resetMarketRound() {
  state.history = state.history.filter((item) => item.roundId !== barterScenario.id);
  state.score = state.history.filter((item) => item.correct).length;
  resetMarketState();
  render();
}

function skipRound() {
  const round = currentRound();
  const prior = state.history.find((item) => item.roundId === round.id);
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
  const roundVotes = state.voteCounts[round.id];
  roundVotes[choiceId] += 1;
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
  render();
}

function progressPercent() {
  const steps = ['landing', 'conferenceIntro', 'market', 'round1', 'round2', 'recap', 'bitcoin', 'end'];
  const currentKey = state.screen === 'round' ? `round${state.roundIndex + 1}` : state.screen;
  const index = Math.max(0, steps.indexOf(currentKey));
  return ((index + 1) / steps.length) * 100;
}

function selectedPropertiesSummary() {
  return properties.filter((item) => state.selectedProperties.includes(item.id));
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
        <h1>From barter friction to Bitcoin logic.</h1>
        <p class="lede">Start inside a real barter market, trade person-to-person toward a target item, then carry that intuition into commodity money, inflation, and Bitcoin.</p>
      </div>
      <div class="hero-grid">
        <article class="info-card panel">
          <div class="pill-badge">Solo</div>
          <h2>Play the market yourself</h2>
          <p>${GAME_COPY.soloDuration}. You begin with a concrete item, see each trader’s HAVE and WANT, and trade step-by-step until you reach your target.</p>
          <ul class="feature-list">
            <li>Visible trader cards and market state</li>
            <li>Tactile step-by-step barter path</li>
            <li>Clear recap into money properties</li>
          </ul>
          <button class="btn primary" data-action="start-solo">Start solo</button>
        </article>
        <article class="info-card panel presenter-entry">
          <div class="pill-badge alt">Presenter</div>
          <h2>Run it as a live market</h2>
          <p>${GAME_COPY.presenterDuration}. Conference mode models participants as people in the market, gives you a presenter-controlled simulation, and keeps everything projector-friendly.</p>
          <ul class="feature-list">
            <li>Participant role board for the market</li>
            <li>Presenter-controlled market progression</li>
            <li>Discussion prompts and vote scaffold</li>
          </ul>
          <button class="btn secondary strong" data-action="start-presenter">Open presenter mode</button>
        </article>
      </div>
      <section class="mini-panel stack">
        <div class="eyebrow">What learners discover</div>
        <div class="stat-row">
          <span class="stat-chip">Barter needs coincidence of wants</span>
          <span class="stat-chip">Common goods reduce friction</span>
          <span class="stat-chip">Easy supply weakens money</span>
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
          <h1>Turn the room into a market.</h1>
          <p class="lede">This mode treats participants as people with real have/need roles. If full live multiplayer is not available, the presenter still gets a coherent market simulation to drive on screen.</p>
        </div>
        <div class="badge big-badge">${GAME_COPY.presenterDuration}</div>
      </div>
      <div class="presenter-layout">
        <section class="panel stack">
          <h3>Presenter flow</h3>
          <ol class="ordered-list">
            <li>Show the participant market board and assign attention to one trader at a time.</li>
            <li>Ask the room which person the player should approach next.</li>
            <li>Tap the trader card to execute the barter if wants line up.</li>
            <li>After the market resolves, continue into commodity money and inflation.</li>
          </ol>
        </section>
        <section class="panel stack">
          <h3>What is simulated live</h3>
          <p>The room sees the player inventory, target item, participant roles, and trade log. This keeps conference mode grounded in people trading with other people, not abstract quiz choices.</p>
          <div class="inline-note">Static-site safe: no server, no sockets, still presentation-ready.</div>
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

function marketScreen() {
  const currentItem = item(state.marketInventory);
  const targetItem = item(barterScenario.targetItemId);
  const activeParticipant = state.conferenceParticipants.find((entry) => entry.id === state.conferenceActiveParticipantId);

  shell(`
    <section class="experience-grid ${state.mode === 'presenter' ? 'presenter-grid market-grid' : 'market-grid'}">
      <section class="card stage-card ${state.mode === 'presenter' ? 'projector-card' : ''}">
        <div class="stage-header">
          <div>
            <div class="eyebrow">${barterScenario.kicker}</div>
            <h1>${barterScenario.title}</h1>
          </div>
          <div class="badge big-badge">Market</div>
        </div>
        <p class="prompt">${barterScenario.intro}</p>
        <section class="market-objective panel stack">
          <div class="row wrap-row objective-row">
            <div class="inventory-card inventory-now">
              <span class="inventory-label">You have</span>
              <div class="inventory-item"><span class="inventory-emoji">${currentItem.emoji}</span><strong>${currentItem.label}</strong></div>
              <p>${currentItem.description}</p>
            </div>
            <div class="market-arrow">→</div>
            <div class="inventory-card inventory-target">
              <span class="inventory-label">You need</span>
              <div class="inventory-item"><span class="inventory-emoji">${targetItem.emoji}</span><strong>${targetItem.label}</strong></div>
              <p>${targetItem.description}</p>
            </div>
          </div>
          <div class="market-status-row">
            <span class="stat-chip">Trades made: ${state.marketTradeCount}</span>
            <span class="stat-chip">Goal: reach ${targetItem.label}</span>
            <span class="stat-chip ${state.marketCompleted ? 'chip-success' : ''}">${state.marketCompleted ? 'Target reached' : 'Market still in motion'}</span>
          </div>
        </section>
        <section class="trader-board stack">
          <div class="row wrap-row">
            <div>
              <div class="eyebrow">Visible traders</div>
              <h3>Choose who to approach next</h3>
            </div>
            ${state.mode === 'presenter' ? '<div class="inline-note">Presenter can spotlight a participant on the right.</div>' : ''}
          </div>
          <div class="trader-grid ${state.mode === 'presenter' ? 'trader-grid-large' : ''}">
            ${barterScenario.traders
              .map((trader) => {
                const status = marketTraderStatus(trader);
                const canTrade = status === 'ready';
                return `
                  <button class="trader-card trader-${status}" data-trader="${trader.id}">
                    <div class="row wrap-row trader-topline">
                      <div>
                        <strong>${trader.name}</strong>
                        <div class="trader-role">${trader.role}</div>
                      </div>
                      <span class="trader-status-pill">${canTrade ? 'Trade now' : status === 'holding-same' ? 'Same item' : status === 'target-hit' ? 'Target item reached' : 'Needs something else'}</span>
                    </div>
                    <div class="trade-pair-row">
                      <div class="trade-pair have-pair">
                        <span class="trade-label">HAVE</span>
                        <div class="trade-item">${item(trader.have).emoji} ${item(trader.have).label}</div>
                      </div>
                      <div class="trade-swap-arrow">⇄</div>
                      <div class="trade-pair want-pair">
                        <span class="trade-label">WANT</span>
                        <div class="trade-item">${item(trader.want).emoji} ${item(trader.want).label}</div>
                      </div>
                    </div>
                    <p>${trader.line}</p>
                  </button>
                `;
              })
              .join('')}
          </div>
        </section>
        <section class="feedback-card ${state.marketCompleted ? 'feedback-good' : 'feedback-pending'}">
          <div class="result-tag ${state.marketCompleted ? '' : 'subtle'}">${state.marketCompleted ? 'Barter lesson unlocked' : 'Trade-by-trade friction'}</div>
          <h3>${state.marketCompleted ? 'You reached the target, but it took multiple specific matches.' : 'Each trade only works if one person has exactly what the next person wants.'}</h3>
          <p>${state.marketCompleted ? 'This is the coincidence-of-wants problem in motion. Barter can work, but only through a fragile chain of matching needs.' : barterScenario.prompt}</p>
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
                <h3>Who should the player approach next?</h3>
                <p>${barterScenario.facilitatorNote}</p>
                <div class="inline-note">${barterScenario.audiencePrompt}</div>
              </section>
              <section class="card panel stack participant-panel">
                <div class="eyebrow">Participant market board</div>
                <h3>People in this market</h3>
                <p class="small-copy">Use these as presenter-controlled participant roles even if the audience is not interacting through their own devices yet.</p>
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
                            <span>${item(participant.have).emoji} ${item(participant.have).label}</span>
                            <span>needs ${item(participant.want).emoji} ${item(participant.want).label}</span>
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
                        <p class="small-copy">Has ${itemPhrase(activeParticipant.have)} · Needs ${itemPhrase(activeParticipant.want)}</p>
                      </div>
                    `
                    : ''
                }
              </section>
            `
            : `
              <section class="card panel stack recap-side-card">
                <div class="eyebrow">Why this matters</div>
                <h3>Barter can work, but it is clunky.</h3>
                <p class="small-copy">You are feeling the system problem directly: every swap depends on another person wanting exactly what you hold right now.</p>
              </section>
            `
        }
        <section class="card panel stack market-log-panel">
          <div class="row wrap-row">
            <div>
              <div class="eyebrow">Market log</div>
              <h3>What just happened</h3>
            </div>
            <span class="badge">${state.marketLog.length} events</span>
          </div>
          <div class="market-log-list">
            ${state.marketLog
              .map(
                (entry) => `
                  <article class="market-log-entry log-${entry.type}">
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
              (item) => `
                <button class="choice ${choice?.id === item.id ? 'selected' : ''} ${showReveal && item.id === round.correctChoiceId ? 'choice-correct' : ''} ${showReveal && choice?.id === item.id && !correct ? 'choice-missed' : ''}" data-choice="${item.id}">
                  <span class="choice-title">${item.label}</span>
                  <span class="choice-detail">${item.detail}</span>
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
                <h3>${correct ? 'That moves the story forward.' : 'That choice teaches why better money emerged.'}</h3>
                <p>${choice.feedback}</p>
                <ul>
                  ${round.summary.map((item) => `<li>${item}</li>`).join('')}
                </ul>
              </section>
            `
            : `
              <section class="feedback-card feedback-pending">
                <div class="result-tag subtle">${state.mode === 'presenter' ? 'Awaiting reveal' : 'Pick an option'}</div>
                <p>${state.mode === 'presenter' ? 'Select an answer, discuss with the room, then reveal the lesson when ready.' : 'Choose an option to see what this round teaches.'}</p>
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
                <p class="small-copy">Use this as a simple hand-count tracker or scaffold for future multi-user voting.</p>
                <div class="vote-list">
                  ${round.choices
                    .map(
                      (item) => `
                        <div class="vote-row">
                          <button class="vote-cast" data-vote="${item.id}">+1</button>
                          <div class="vote-meta">
                            <div class="vote-line">
                              <strong>${item.label}</strong>
                              <span>${state.voteCounts[round.id][item.id]} votes · ${votePercent(round.id, item.id)}%</span>
                            </div>
                            <div class="vote-bar"><span style="width:${votePercent(round.id, item.id)}%"></span></div>
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
                <p class="small-copy">The market showed barter friction directly. These next rounds explain why stronger money traits start to matter so much.</p>
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
        <p class="prompt">Choose at least three traits. There is not one magical checklist, but strong money usually scores well across the same core properties.</p>
        <div class="properties-grid ${state.mode === 'presenter' ? 'properties-grid-large' : ''}">
          ${properties
            .map(
              (item) => `
                <button class="pill ${state.selectedProperties.includes(item.id) ? 'selected' : ''}" data-property="${item.id}">
                  <span class="choice-title">${item.title}</span>
                  <span class="choice-detail">${item.description}</span>
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
                (item) => `
                  <article class="history-item ${item.correct ? 'history-good' : 'history-warn'}">
                    <div>
                      <strong>${item.roundTitle}</strong>
                      <p>${item.choice}</p>
                    </div>
                    <span class="status-dot">${item.correct ? '✓' : '•'}</span>
                  </article>
                `,
              )
              .join('')}
          </div>
          <div class="selected-summary ${selected.length ? '' : 'empty-summary'}">
            ${
              selected.length
                ? selected.map((item) => `<span class="stat-chip">${item.title}</span>`).join('')
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
          <p class="small-copy">Which money trait felt most important after the market simulation: portability, divisibility, scarcity, or acceptability?</p>
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
              (item, index) => `
                <article class="bridge-card panel">
                  <div class="bridge-index">0${index + 1}</div>
                  <p>${item}</p>
                </article>
              `,
            )
            .join('')}
        </div>
        <section class="feedback-card feedback-neutral">
          <div class="result-tag">Big idea</div>
          <h3>People keep searching for money that is easier to trust, harder to debase, and easier to move through space and time.</h3>
          <p>Bitcoin matters in this lesson because it tries to solve those old money problems in a digital context, not because it appeared from nowhere.</p>
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
          <p class="small-copy">The market and money-property logic should do most of the teaching. Bitcoin then appears as the next candidate in that longer history.</p>
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
      <p class="lede">You moved through a live barter market, into commodity coordination, through the inflation problem, and into the Bitcoin bridge.</p>
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
          <span>${selectedPropertiesSummary().map((item) => item.title).join(', ') || 'None selected'}</span>
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

  app.querySelectorAll('[data-choice]').forEach((el) =>
    el.addEventListener('click', () => selectChoice(el.getAttribute('data-choice'))),
  );

  app.querySelectorAll('[data-property]').forEach((el) =>
    el.addEventListener('click', () => toggleProperty(el.getAttribute('data-property'))),
  );

  app.querySelectorAll('[data-vote]').forEach((el) =>
    el.addEventListener('click', () => castVote(el.getAttribute('data-vote'))),
  );

  app.querySelectorAll('[data-trader]').forEach((el) =>
    el.addEventListener('click', () => tradeWithTrader(el.getAttribute('data-trader'))),
  );

  app.querySelectorAll('[data-participant]').forEach((el) =>
    el.addEventListener('click', () => setConferenceParticipant(el.getAttribute('data-participant'))),
  );
}

resetProgress();
render();
