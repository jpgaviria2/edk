const GAME_COPY = {
  title: 'History of Money',
  subtitle: 'A fast interactive journey from barter to Bitcoin',
  soloDuration: '~3 min solo run',
  presenterDuration: '~8–12 min facilitated session',
};

const rounds = [
  {
    id: 'barter',
    title: 'Barter breaks down',
    kicker: 'Round 1',
    prompt: 'You are a fisherman. Winter is coming and you need shoes. What is your best move in a barter world?',
    facilitatorNote:
      'Ask the room: what has to line up perfectly for barter to work? Let a few people answer before you reveal.',
    revealLabel: 'Reveal the barter problem',
    question: 'What is barter missing?',
    correctChoiceId: 'fish-for-shoes',
    choices: [
      {
        id: 'fish-for-shoes',
        label: 'Trade fish for shoes',
        detail: 'Only works if the shoemaker wants fish right now.',
        feedback:
          'That is the famous coincidence-of-wants problem. Barter depends on two people wanting each other’s goods at the same moment.',
      },
      {
        id: 'save-fish',
        label: 'Store fish for later',
        detail: 'Fish spoil before they can carry value well.',
        feedback:
          'Perishable goods make terrible money because they are hard to save, move, and trust over time.',
      },
      {
        id: 'borrow-shoes',
        label: 'Borrow shoes',
        detail: 'Useful for one person, not for the system.',
        feedback:
          'Credit can help temporarily, but it does not solve the broader exchange problem for everyone in the village.',
      },
    ],
    summary: [
      'Barter is fragile because exchange only works when wants line up.',
      'Perishable goods are poor stores of value.',
      'People start searching for something more tradeable than their own output.',
    ],
    audiencePrompt: 'Quick vote: which option feels most realistic in a village with no common money yet?',
  },
  {
    id: 'commodity',
    title: 'Commodity money emerges',
    kicker: 'Round 2',
    prompt: 'Your village starts converging on one good to trade through. Which item works best as money?',
    facilitatorNote:
      'Invite people to defend the wrong answers too. This helps surface money properties naturally instead of lecturing first.',
    revealLabel: 'Reveal the stronger money',
    question: 'Which good is strongest money?',
    correctChoiceId: 'salt',
    choices: [
      {
        id: 'salt',
        label: 'Salt',
        detail: 'Useful, divisible, portable, and widely desired.',
        feedback:
          'Exactly. Useful commodities can become money because people already recognize their value and expect others to accept them.',
      },
      {
        id: 'berries',
        label: 'Berries',
        detail: 'Easy to collect, easy to crush, easy to rot.',
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
      'Physical money improves trade, but it still has costs and limitations.',
    ],
    audiencePrompt: 'Ask for a show of hands before revealing: salt, berries, or giant rock?',
  },
  {
    id: 'inflation',
    title: 'Supply shocks break trust',
    kicker: 'Round 3',
    prompt: 'Your town uses shells as money. Then a ship arrives carrying huge sacks of identical shells. What changes first?',
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
  'Use “reveal” only after the room has committed to an answer or a vote.',
  'Keep the solo lesson moving. In conference mode, use pauses and discussion to slow it down.',
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

function resetVotes() {
  state.voteCounts = createInitialVotes();
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
  state.screen = 'round';
  render();
}

function startPresenter() {
  state.mode = 'presenter';
  resetProgress();
  state.screen = 'conferenceIntro';
  render();
}

function beginPresenterRun() {
  state.screen = 'round';
  state.presenterReveal = false;
  render();
}

function currentRound() {
  return rounds[state.roundIndex];
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

function progressPercent() {
  const steps = ['landing', 'conferenceIntro', 'round1', 'round2', 'round3', 'recap', 'bitcoin', 'end'];
  const currentKey =
    state.screen === 'round'
      ? `round${state.roundIndex + 1}`
      : state.screen;
  const index = Math.max(0, steps.indexOf(currentKey));
  return ((index + 1) / steps.length) * 100;
}

function selectedPropertiesSummary() {
  return properties.filter((item) => state.selectedProperties.includes(item.id));
}

function finalHeadline() {
  if (state.score === rounds.length) return 'Strong run.';
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
        <p class="lede">A mobile-first lesson for meetups, classrooms, and mini apps. Play solo or launch a facilitator-friendly conference mode.</p>
      </div>
      <div class="hero-grid">
        <article class="info-card panel">
          <div class="pill-badge">Solo</div>
          <h2>Quick self-guided run</h2>
          <p>${GAME_COPY.soloDuration}. Tap choices, learn from feedback, recap what strong money needs, then bridge into Bitcoin.</p>
          <ul class="feature-list">
            <li>Simple one-thumb interaction</li>
            <li>Clear round-by-round feedback</li>
            <li>Replayable in seconds</li>
          </ul>
          <button class="btn primary" data-action="start-solo">Start solo</button>
        </article>
        <article class="info-card panel presenter-entry">
          <div class="pill-badge alt">Presenter</div>
          <h2>Conference / meetup mode</h2>
          <p>${GAME_COPY.presenterDuration}. Project the story, collect lightweight room votes, use presenter controls, and reveal lessons at the right time.</p>
          <ul class="feature-list">
            <li>Projector-friendly layout</li>
            <li>Reveal and reset controls</li>
            <li>Facilitator notes built in</li>
          </ul>
          <button class="btn secondary strong" data-action="start-presenter">Open presenter mode</button>
        </article>
      </div>
      <section class="mini-panel stack">
        <div class="eyebrow">What learners discover</div>
        <div class="stat-row">
          <span class="stat-chip">Barter needs coincidence of wants</span>
          <span class="stat-chip">Commodity money improves coordination</span>
          <span class="stat-chip">Unbounded supply weakens money</span>
          <span class="stat-chip">Bitcoin enters as a strong-money candidate</span>
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
          <h1>Teach the history of money live.</h1>
          <p class="lede">This layout is tuned for projector use and guided facilitation. You control pacing, reveals, and optional audience vote tracking.</p>
        </div>
        <div class="badge big-badge">${GAME_COPY.presenterDuration}</div>
      </div>
      <div class="presenter-layout">
        <section class="panel stack">
          <h3>Presenter flow</h3>
          <ol class="ordered-list">
            <li>Ask the room to commit to an answer first.</li>
            <li>Use <strong>Reveal</strong> to surface the lesson.</li>
            <li>Use <strong>Next</strong> to move the narrative forward.</li>
            <li>Use <strong>Reset round</strong> if you want to re-run the moment.</li>
          </ol>
        </section>
        <section class="panel stack">
          <h3>Audience voting foundation</h3>
          <p>The vote board is intentionally lightweight and static-first. You can tally raised hands or verbal responses with a tap, then reset per round.</p>
          <div class="inline-note">No live infra required. It is a clean scaffold for future multiplayer expansion.</div>
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
          <div class="badge big-badge">${state.roundIndex + 1} / ${rounds.length}</div>
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
                <h3>${state.score} / ${rounds.length} correct</h3>
                <p class="small-copy">Each round shows why societies move toward better money: easier exchange, stronger coordination, and harder-to-manipulate supply.</p>
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
          <div class="badge big-badge">${state.score} / ${rounds.length}</div>
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
          <p class="small-copy">Which money trait felt most important to the room: durability, scarcity, portability, or verifiability? Let people answer before moving on.</p>
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
          <p class="small-copy">This lesson is about monetary evolution, not maximalism. Let the history set up the intuition for why Bitcoin becomes interesting.</p>
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
      <p class="lede">You moved from barter friction, to commodity coordination, to the inflation problem, and into the Bitcoin bridge.</p>
      <div class="end-stats">
        <div class="panel stat-panel">
          <strong>Score</strong>
          <span>${state.score} / ${rounds.length}</span>
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
  on('[data-action="reset-round"]', resetRound);
  on('[data-action="skip-round"]', skipRound);
  on('[data-action="toggle-reveal"]', toggleReveal);
  on('[data-action="toggle-votes"]', toggleVotePanel);
  on('[data-action="reset-votes"]', resetRoundVotes);

  app.querySelectorAll('[data-choice]').forEach((el) =>
    el.addEventListener('click', () => selectChoice(el.getAttribute('data-choice'))),
  );

  app.querySelectorAll('[data-property]').forEach((el) =>
    el.addEventListener('click', () => toggleProperty(el.getAttribute('data-property'))),
  );

  app.querySelectorAll('[data-vote]').forEach((el) =>
    el.addEventListener('click', () => castVote(el.getAttribute('data-vote'))),
  );
}

resetVotes();
render();
