const rounds = [
  {
    id: 'barter',
    title: 'Round 1 · Barter',
    kicker: 'Direct trade only',
    prompt:
      'You are a fisherman. You need shoes before the cold sets in. What do you try first?',
    choices: [
      {
        id: 'fish-for-shoes',
        label: 'Trade fish for shoes',
        detail: 'Maybe the shoemaker wants fish. Maybe not.',
        correct: true,
        feedback:
          'You found the core barter problem: trade only works when both sides want what the other has at the same time.',
      },
      {
        id: 'save-fish',
        label: 'Store fish for later',
        detail: 'Fish spoil quickly.',
        correct: false,
        feedback:
          'Spoilage makes fish bad money. If something rots, it is hard to save or carry value through time.',
      },
      {
        id: 'borrow-shoes',
        label: 'Borrow the shoes',
        detail: 'That solves today, not the trade system.',
        correct: false,
        feedback:
          'Borrowing can help one person, but it does not solve the coordination problem of exchange for everyone.',
      },
    ],
    summary: [
      'Barter is slow because it needs a coincidence of wants.',
      'Perishable goods are poor stores of value.',
      'People start looking for something more widely accepted.',
    ],
  },
  {
    id: 'commodity',
    title: 'Round 2 · Commodity Money',
    kicker: 'Pick a better money',
    prompt:
      'Your village starts converging on one trade good. Which item works best as money?',
    choices: [
      {
        id: 'salt',
        label: 'Salt',
        detail: 'Useful, divisible, and widely wanted.',
        correct: true,
        feedback:
          'Exactly. Useful commodities can emerge as money because many people recognize and value them.',
      },
      {
        id: 'berries',
        label: 'Berries',
        detail: 'Easy to gather, easy to crush, easy to rot.',
        correct: false,
        feedback:
          'Berries fail durability and transportability. Good money should survive time and travel.',
      },
      {
        id: 'giant-rock',
        label: 'A giant rock',
        detail: 'Hard to fake, even harder to carry.',
        correct: false,
        feedback:
          'Scarcity alone is not enough. Money must also be portable and usable in trade.',
      },
    ],
    summary: [
      'Commodity money improves trade when many people already value the good.',
      'The best candidates are durable, portable, recognizable, and divisible.',
      'But physical commodities still have tradeoffs and limits.',
    ],
  },
  {
    id: 'inflation',
    title: 'Round 3 · Inflation',
    kicker: 'What happens when supply jumps?',
    prompt:
      'Your town uses shells as money. Then a ship arrives with massive sacks of identical shells. What changes first?',
    choices: [
      {
        id: 'prices-up',
        label: 'Prices rise over time',
        detail: 'Each shell buys less because there are many more of them.',
        correct: true,
        feedback:
          'Right. When supply grows much faster than goods and services, each unit usually loses purchasing power.',
      },
      {
        id: 'everyone-richer',
        label: 'Everyone becomes richer instantly',
        detail: 'More units of money does not mean more real goods.',
        correct: false,
        feedback:
          'Nominal balances can rise while real purchasing power falls. More money units alone do not create more wealth.',
      },
      {
        id: 'nothing',
        label: 'Nothing changes',
        detail: 'Supply shocks change incentives fast.',
        correct: false,
        feedback:
          'Money depends on trust in scarcity and predictability. A sudden flood of supply weakens that trust.',
      },
    ],
    summary: [
      'Money should be hard to produce unexpectedly.',
      'If supply expands too easily, purchasing power tends to fall.',
      'Reliable scarcity matters because people save into money, not just spend it.',
    ],
  },
];

const properties = [
  {
    id: 'durable',
    title: 'Durable',
    good: 'A money should survive time.',
  },
  {
    id: 'portable',
    title: 'Portable',
    good: 'You should be able to move it easily.',
  },
  {
    id: 'divisible',
    title: 'Divisible',
    good: 'Small and large payments should both work.',
  },
  {
    id: 'verifiable',
    title: 'Verifiable',
    good: 'People must quickly know it is real.',
  },
  {
    id: 'scarce',
    title: 'Scarce',
    good: 'It should be hard to create more on demand.',
  },
  {
    id: 'acceptable',
    title: 'Widely accepted',
    good: 'Others must trust that they can trade it too.',
  },
];

const bridgePoints = [
  'Bitcoin is digital, but it aims to preserve strong money traits.',
  'Its supply is predictable instead of easy to inflate.',
  'It can be verified, divided, and sent globally.',
  'That is why many people see it as a new chapter in the history of money.',
];

const state = {
  screen: 'intro',
  roundIndex: 0,
  selectedChoice: null,
  score: 0,
  history: [],
  selectedProperties: [],
};

const app = document.getElementById('app');

function resetGame() {
  state.screen = 'intro';
  state.roundIndex = 0;
  state.selectedChoice = null;
  state.score = 0;
  state.history = [];
  state.selectedProperties = [];
  render();
}

function nextRound() {
  state.selectedChoice = null;
  if (state.roundIndex < rounds.length - 1) {
    state.roundIndex += 1;
    state.screen = 'round';
  } else {
    state.screen = 'recap';
  }
  render();
}

function startGame() {
  state.screen = 'round';
  state.roundIndex = 0;
  state.selectedChoice = null;
  state.score = 0;
  state.history = [];
  state.selectedProperties = [];
  render();
}

function selectChoice(choiceId) {
  const round = rounds[state.roundIndex];
  const choice = round.choices.find((item) => item.id === choiceId);
  if (!choice) return;
  state.selectedChoice = choice;
  const prior = state.history.find((item) => item.roundId === round.id);
  if (!prior) {
    state.history.push({ roundId: round.id, correct: choice.correct, choice: choice.label });
    if (choice.correct) state.score += 1;
  }
  render();
}

function toggleProperty(propertyId) {
  const set = new Set(state.selectedProperties);
  if (set.has(propertyId)) {
    set.delete(propertyId);
  } else {
    set.add(propertyId);
  }
  state.selectedProperties = [...set];
  render();
}

function progressPercent() {
  const steps = 6;
  const map = {
    intro: 1,
    round: 2 + state.roundIndex,
    recap: 5,
    bitcoin: 6,
    end: 6,
  };
  return (map[state.screen] / steps) * 100;
}

function shell(html) {
  app.innerHTML = `
    <main class="screen">
      <section class="card">
        <div class="row">
          <div>
            <div class="eyebrow">History of Money</div>
            <div class="meta">Mobile-first Fedi mini app MVP</div>
          </div>
          <div class="badge">${Math.round(progressPercent())}%</div>
        </div>
        <div class="progress" aria-hidden="true" style="margin-top:12px;"><span style="width:${progressPercent()}%"></span></div>
      </section>
      ${html}
    </main>
  `;
  bind();
}

function renderIntro() {
  shell(`
    <section class="card hero stack">
      <div class="eyebrow">3 quick rounds</div>
      <h1>How did money evolve?</h1>
      <p>
        Tap through three short rounds: barter, commodity money, and inflation. Then recap what makes money good and bridge into Bitcoin.
      </p>
      <div class="stack">
        <div class="badge">~2–3 minutes</div>
        <ul>
          <li>Simple tap-based decisions</li>
          <li>No dragging, no setup friction</li>
          <li>Replay anytime</li>
        </ul>
      </div>
      <div class="footer-actions single">
        <button class="btn primary" data-action="start">Start</button>
      </div>
    </section>
  `);
}

function renderRound() {
  const round = rounds[state.roundIndex];
  const choice = state.selectedChoice;
  shell(`
    <section class="card stack">
      <div class="row">
        <div>
          <div class="eyebrow">${round.kicker}</div>
          <h2>${round.title}</h2>
        </div>
        <div class="badge">${state.roundIndex + 1}/${rounds.length}</div>
      </div>
      <p>${round.prompt}</p>
      <div class="choice-grid">
        ${round.choices
          .map(
            (item) => `
              <button class="choice ${choice?.id === item.id ? 'selected' : ''}" data-choice="${item.id}">
                <strong>${item.label}</strong>
                <span class="small">${item.detail}</span>
              </button>
            `,
          )
          .join('')}
      </div>
      ${
        choice
          ? `
          <section class="card" style="padding:14px; background:${choice.correct ? 'rgba(98,211,148,0.09)' : 'rgba(255,127,127,0.08)'};">
            <h3 class="${choice.correct ? 'result-good' : 'result-warn'}">${choice.correct ? 'Nice call' : 'Good lesson'}</h3>
            <p style="margin-top:8px;">${choice.feedback}</p>
            <ul style="margin-top:10px;">
              ${round.summary.map((item) => `<li>${item}</li>`).join('')}
            </ul>
          </section>
          `
          : ''
      }
      <div class="footer-actions">
        <button class="btn secondary" data-action="restart">Replay</button>
        <button class="btn primary" data-action="next" ${choice ? '' : 'disabled'}>${state.roundIndex === rounds.length - 1 ? 'Recap' : 'Next round'}</button>
      </div>
    </section>
  `);
}

function renderRecap() {
  const picked = new Set(state.selectedProperties);
  const done = picked.size >= 3;
  shell(`
    <section class="card stack">
      <div class="eyebrow">Money properties recap</div>
      <h2>Tap the traits that strong money needs</h2>
      <p>Pick at least 3. There is not just one right combo, but the classic properties show up again and again.</p>
      <div class="properties-grid">
        ${properties
          .map(
            (item) => `
            <button class="pill ${picked.has(item.id) ? 'selected' : ''}" data-property="${item.id}">
              <strong>${item.title}</strong>
              <span class="small">${item.good}</span>
            </button>
          `,
          )
          .join('')}
      </div>
      <section class="card" style="padding:14px;">
        <div class="row">
          <h3>Your run</h3>
          <div class="badge">${state.score}/${rounds.length}</div>
        </div>
        <p class="small" style="margin-top:8px;">You moved from failed barter, to better commodity money, to the inflation problem caused by easy supply growth.</p>
      </section>
      <div class="footer-actions">
        <button class="btn secondary" data-action="restart">Replay</button>
        <button class="btn primary" data-action="bridge" ${done ? '' : 'disabled'}>Bitcoin bridge</button>
      </div>
    </section>
  `);
}

function renderBitcoin() {
  shell(`
    <section class="card stack">
      <div class="eyebrow">Short Bitcoin bridge</div>
      <h2>Why Bitcoin enters the story</h2>
      <ul>
        ${bridgePoints.map((item) => `<li>${item}</li>`).join('')}
      </ul>
      <section class="card" style="padding:14px;">
        <h3>Big idea</h3>
        <p style="margin-top:8px;">People keep searching for money that is easier to trust, harder to debase, and simpler to move across distance and time.</p>
      </section>
      <div class="footer-actions">
        <button class="btn secondary" data-action="restart">Replay</button>
        <button class="btn primary" data-action="finish">Finish</button>
      </div>
    </section>
  `);
}

function renderEnd() {
  shell(`
    <section class="card stack center">
      <div class="eyebrow">Complete</div>
      <h2>You finished the history of money MVP</h2>
      <p>Score: ${state.score}/${rounds.length}</p>
      <p class="small">You saw why barter is clunky, why some commodities emerge as money, and why inflation matters when supply gets easier to expand.</p>
      <div class="footer-actions single">
        <button class="btn primary" data-action="restart">Play again</button>
      </div>
    </section>
  `);
}

function render() {
  switch (state.screen) {
    case 'intro':
      renderIntro();
      break;
    case 'round':
      renderRound();
      break;
    case 'recap':
      renderRecap();
      break;
    case 'bitcoin':
      renderBitcoin();
      break;
    case 'end':
      renderEnd();
      break;
    default:
      renderIntro();
  }
}

function bind() {
  app.querySelectorAll('[data-action="start"]').forEach((el) => el.addEventListener('click', startGame));
  app.querySelectorAll('[data-action="next"]').forEach((el) => el.addEventListener('click', nextRound));
  app.querySelectorAll('[data-action="restart"]').forEach((el) => el.addEventListener('click', resetGame));
  app.querySelectorAll('[data-action="bridge"]').forEach((el) =>
    el.addEventListener('click', () => {
      state.screen = 'bitcoin';
      render();
    }),
  );
  app.querySelectorAll('[data-action="finish"]').forEach((el) =>
    el.addEventListener('click', () => {
      state.screen = 'end';
      render();
    }),
  );
  app.querySelectorAll('[data-choice]').forEach((el) =>
    el.addEventListener('click', () => selectChoice(el.getAttribute('data-choice'))),
  );
  app.querySelectorAll('[data-property]').forEach((el) =>
    el.addEventListener('click', () => toggleProperty(el.getAttribute('data-property'))),
  );
}

render();
