const app = document.getElementById('app');

const curriculumSources = [
  'My First Bitcoin Diploma: 1.3 Functions of Money',
  'My First Bitcoin Diploma: 1.4 Properties of Money',
  'My First Bitcoin Diploma: 2.0 History of Money introduction',
  'My First Bitcoin Diploma: 2.1 From Barter to Modern Currency',
];

const lessons = [
  {
    id: 'barter',
    eyebrow: 'Lesson 1',
    title: 'Why barter breaks',
    summary: 'A barter trade needs both people to want exactly what the other person has, at the same time, in the right amount.',
    practical: 'Try the island trade example: Joseph has bananas but wants coconuts. Yael has coconuts but wants mangoes. Tammy has mangoes but wants papayas. The goods exist, but the trade chain still fails.',
    takeaway: 'Money solves the double coincidence of wants by becoming the thing people accept so they can trade later.',
  },
  {
    id: 'functions',
    eyebrow: 'Lesson 2',
    title: 'The three functions of money',
    summary: 'Money is not just “stuff we pay with.” It performs jobs that make complex trade possible.',
    practical: 'Classify real examples: saving for a puppy, buying pizza, comparing concert tickets to a ski pass.',
    takeaway: 'Good money helps people exchange value, store value, and measure value.',
  },
  {
    id: 'properties',
    eyebrow: 'Lesson 3',
    title: 'What makes money good?',
    summary: 'Different goods can act like money, but they do not perform equally well.',
    practical: 'Score cows, hot sauce, diamonds, paper money, and Bitcoin across durability, portability, fungibility, acceptability, scarcity, and divisibility.',
    takeaway: 'Societies tend to converge on goods that are more saleable: easier to trade onward across time and space.',
  },
  {
    id: 'evolution',
    eyebrow: 'Lesson 4',
    title: 'From commodity money to fragile trust',
    summary: 'Commodity money, coins, paper receipts, and fiat systems each solve one problem while creating new trust problems.',
    practical: 'Watch what happens when shells flood the market or coins are diluted with cheaper metal.',
    takeaway: 'If money can be quietly expanded or weakened, people lose purchasing power and trust.',
  },
  {
    id: 'bitcoin',
    eyebrow: 'Lesson 5',
    title: 'Why Bitcoin belongs in the story',
    summary: 'Bitcoin is easier to understand when it is framed as another answer to old money problems.',
    practical: 'Compare Bitcoin against earlier money using scarcity, divisibility, portability, and verification.',
    takeaway: 'The point is not “digital is new.” The point is predictable scarcity, independent verification, and global settlement.',
  },
];

const functionsOfMoney = [
  { id: 'exchange', title: 'Medium of exchange', example: 'Adam buys two slices of pizza for $8.30.', answer: 'Money is being used to trade for goods without barter.' },
  { id: 'store', title: 'Store of value', example: 'Evan saves part of each paycheck to buy a puppy.', answer: 'Money is carrying value from now into the future.' },
  { id: 'account', title: 'Unit of account', example: 'Marc compares concert tickets for $75 with a ski pass for $95.', answer: 'Money is being used as a common measuring stick.' },
];

const scoreItems = ['Cow', 'Hot sauce', 'Diamonds', 'Paper money', 'Bitcoin'];
const properties = [
  { id: 'durable', label: 'Durable', prompt: 'Can it survive time without rotting, spoiling, or falling apart?' },
  { id: 'portable', label: 'Portable', prompt: 'Can people carry and use it easily in different places?' },
  { id: 'fungible', label: 'Fungible', prompt: 'Is one unit interchangeable with another unit of the same value?' },
  { id: 'acceptable', label: 'Acceptable', prompt: 'Will other people confidently accept it in trade?' },
  { id: 'scarce', label: 'Scarce', prompt: 'Is it difficult to create more unexpectedly?' },
  { id: 'divisible', label: 'Divisible', prompt: 'Can it handle small and large payments cleanly?' },
];

const defaultScores = {
  Cow: { durable: 2, portable: 1, fungible: 2, acceptable: 2, scarce: 4, divisible: 0 },
  'Hot sauce': { durable: 3, portable: 3, fungible: 3, acceptable: 2, scarce: 1, divisible: 3 },
  Diamonds: { durable: 5, portable: 5, fungible: 1, acceptable: 3, scarce: 4, divisible: 1 },
  'Paper money': { durable: 2, portable: 5, fungible: 5, acceptable: 5, scarce: 2, divisible: 4 },
  Bitcoin: { durable: 5, portable: 5, fungible: 4, acceptable: 3, scarce: 5, divisible: 5 },
};

const state = {
  tab: 'learn',
  lessonIndex: 0,
  barterStep: 0,
  selectedFunction: null,
  scoreItem: 'Cow',
  scores: structuredClone(defaultScores),
  shellSupply: 10,
  coinPurity: 100,
};

function totalScore(item) {
  return Object.values(state.scores[item]).reduce((sum, value) => sum + Number(value), 0);
}

function strongestMoney() {
  return [...scoreItems].sort((a, b) => totalScore(b) - totalScore(a))[0];
}

function setTab(tab) {
  state.tab = tab;
  render();
}

function setLesson(index) {
  state.lessonIndex = index;
  state.tab = 'learn';
  render();
}

function updateScore(propertyId, value) {
  state.scores[state.scoreItem][propertyId] = Number(value);
  render();
}

function purchasingPower() {
  return Math.max(5, Math.round((10 / state.shellSupply) * 100));
}

function coinTrust() {
  if (state.coinPurity >= 90) return 'High trust: people believe the unit means what it says.';
  if (state.coinPurity >= 60) return 'Strained trust: prices start adjusting because the coin contains less real value.';
  return 'Low trust: the label stayed the same, but the substance changed too much.';
}

function shell(children) {
  app.innerHTML = `
    <main class="site-shell">
      <header class="site-hero">
        <nav class="topnav">
          <div>
            <div class="eyebrow">Educational Development Kit</div>
            <strong>History of Money</strong>
          </div>
          <div class="nav-actions">
            <button class="nav-btn ${state.tab === 'learn' ? 'active' : ''}" data-tab="learn">Learn</button>
            <button class="nav-btn ${state.tab === 'examples' ? 'active' : ''}" data-tab="examples">Examples</button>
            <button class="nav-btn ${state.tab === 'facilitator' ? 'active' : ''}" data-tab="facilitator">Facilitator</button>
          </div>
        </nav>
        <section class="hero-grid">
          <div class="hero-copy">
            <div class="eyebrow">From barter to Bitcoin</div>
            <h1>A practical website for teaching why money emerges.</h1>
            <p class="lede">This is no longer trying to be just a mini app. It is a website-first learning experience with short lessons, practical examples, and interactive tools educators can use in class or learners can use solo.</p>
            <div class="hero-actions">
              <button class="btn primary" data-tab="learn">Start the lesson</button>
              <button class="btn secondary" data-tab="examples">Open practical examples</button>
            </div>
          </div>
          <aside class="source-card">
            <div class="eyebrow">Content backbone</div>
            <h2>Aligned to My First Bitcoin</h2>
            <ul>${curriculumSources.map((source) => `<li>${source}</li>`).join('')}</ul>
          </aside>
        </section>
      </header>
      ${children}
    </main>
  `;
  bind();
}

function learnScreen() {
  const lesson = lessons[state.lessonIndex];
  shell(`
    <section class="content-grid">
      <aside class="lesson-nav card">
        <div class="eyebrow">Course path</div>
        ${lessons.map((entry, index) => `<button class="lesson-link ${index === state.lessonIndex ? 'active' : ''}" data-lesson="${index}"><span>${entry.eyebrow}</span><strong>${entry.title}</strong></button>`).join('')}
      </aside>
      <section class="lesson-panel card">
        <div class="eyebrow">${lesson.eyebrow}</div>
        <h2>${lesson.title}</h2>
        <p class="big-copy">${lesson.summary}</p>
        <div class="explain-stack">
          <article class="explain-card">
            <span class="tag">Practical example</span>
            <p>${lesson.practical}</p>
          </article>
          <article class="explain-card strong">
            <span class="tag">Key takeaway</span>
            <p>${lesson.takeaway}</p>
          </article>
        </div>
        <div class="step-actions">
          <button class="btn secondary" data-lesson="${Math.max(0, state.lessonIndex - 1)}" ${state.lessonIndex === 0 ? 'disabled' : ''}>Previous</button>
          <button class="btn primary" data-lesson="${Math.min(lessons.length - 1, state.lessonIndex + 1)}" ${state.lessonIndex === lessons.length - 1 ? 'disabled' : ''}>Next lesson</button>
        </div>
      </section>
    </section>
  `);
}

function examplesScreen() {
  const selectedFunction = functionsOfMoney.find((entry) => entry.id === state.selectedFunction);
  shell(`
    <section class="examples-layout">
      <section class="card example-card wide">
        <div class="eyebrow">Practical example 1</div>
        <h2>Barter chain: why everyone gets stuck</h2>
        <p class="big-copy">Joseph has bananas and wants coconuts. Yael has coconuts and wants mangoes. Tammy has mangoes and wants papayas. The island has value everywhere, but no clean exchange.</p>
        <div class="barter-chain">
          ${['🍌 Joseph wants 🥥', '🥥 Yael wants 🥭', '🥭 Tammy wants papayas that do not exist'].map((entry, index) => `<div class="chain-node ${state.barterStep === index ? 'active' : ''}">${entry}</div>`).join('')}
        </div>
        <div class="result-box"><strong>${state.barterStep < 2 ? 'Still searching for a match.' : 'Trade fails: this is the double coincidence of wants problem.'}</strong><span>Money acts as a common bridge so people do not need perfect direct matches.</span></div>
        <div class="step-actions"><button class="btn secondary" data-barter="${Math.max(0, state.barterStep - 1)}">Back</button><button class="btn primary" data-barter="${Math.min(2, state.barterStep + 1)}">Next step</button></div>
      </section>

      <section class="card example-card">
        <div class="eyebrow">Practical example 2</div>
        <h2>Functions of money</h2>
        <p>Pick the function shown by each example.</p>
        <div class="function-examples">
          ${functionsOfMoney.map((entry) => `<button class="choice-card ${state.selectedFunction === entry.id ? 'active' : ''}" data-function="${entry.id}"><strong>${entry.example}</strong><span>${entry.title}</span></button>`).join('')}
        </div>
        ${selectedFunction ? `<div class="result-box"><strong>${selectedFunction.title}</strong><span>${selectedFunction.answer}</span></div>` : '<div class="result-box muted">Choose an example to reveal the function.</div>'}
      </section>

      <section class="card example-card">
        <div class="eyebrow">Practical example 3</div>
        <h2>Score good money</h2>
        <div class="select-row">
          ${scoreItems.map((item) => `<button class="mini-select ${state.scoreItem === item ? 'active' : ''}" data-score-item="${item}">${item}</button>`).join('')}
        </div>
        <div class="score-form">
          ${properties.map((property) => `<label><span><strong>${property.label}</strong><small>${property.prompt}</small></span><input type="range" min="0" max="5" value="${state.scores[state.scoreItem][property.id]}" data-score="${property.id}" /><b>${state.scores[state.scoreItem][property.id]}</b></label>`).join('')}
        </div>
        <div class="result-box"><strong>${state.scoreItem}: ${totalScore(state.scoreItem)} / 30</strong><span>Current strongest score: ${strongestMoney()} (${totalScore(strongestMoney())} / 30)</span></div>
      </section>

      <section class="card example-card">
        <div class="eyebrow">Practical example 4</div>
        <h2>Supply and purchasing power</h2>
        <p>If shells become easy to find, each shell tends to buy less.</p>
        <label class="slider-row"><span>Shell supply</span><input type="range" min="10" max="100" step="10" value="${state.shellSupply}" data-shell-supply /><b>${state.shellSupply}x</b></label>
        <div class="power-meter"><span style="width:${purchasingPower()}%"></span></div>
        <div class="result-box"><strong>Purchasing power: ${purchasingPower()}%</strong><span>More money units do not automatically create more real goods.</span></div>
      </section>

      <section class="card example-card">
        <div class="eyebrow">Practical example 5</div>
        <h2>Debasement and trust</h2>
        <p>The coin keeps the same name, but the metal inside changes.</p>
        <label class="slider-row"><span>Silver content</span><input type="range" min="20" max="100" step="10" value="${state.coinPurity}" data-coin-purity /><b>${state.coinPurity}%</b></label>
        <div class="coin-demo" style="--purity:${state.coinPurity}%">🪙</div>
        <div class="result-box"><strong>${coinTrust()}</strong><span>Debasement breaks trust because the unit stops meaning what people thought it meant.</span></div>
      </section>
    </section>
  `);
}

function facilitatorScreen() {
  shell(`
    <section class="facilitator card">
      <div class="eyebrow">Facilitator mode</div>
      <h2>How to run this as a workshop</h2>
      <div class="run-grid">
        <article><span class="tag">5 min</span><h3>Open with barter</h3><p>Ask learners why Joseph, Yael, and Tammy cannot trade even though they all have valuable goods.</p></article>
        <article><span class="tag">10 min</span><h3>Introduce money’s jobs</h3><p>Use the three function examples: pizza, saving for a puppy, and comparing prices.</p></article>
        <article><span class="tag">15 min</span><h3>Score candidate money</h3><p>Have groups score cows, hot sauce, diamonds, paper money, and Bitcoin. Compare totals and disagreements.</p></article>
        <article><span class="tag">10 min</span><h3>Stress the system</h3><p>Use the shell supply and coin debasement examples to show purchasing power and trust problems.</p></article>
        <article><span class="tag">10 min</span><h3>Bridge to Bitcoin</h3><p>Frame Bitcoin as an attempt to solve old money problems digitally: predictable scarcity, portability, divisibility, and verification.</p></article>
      </div>
      <div class="result-box"><strong>Positioning</strong><span>This website can stand alone for self-study, support a live class, or become the base for future mini-app wrappers later.</span></div>
    </section>
  `);
}

function render() {
  if (state.tab === 'examples') examplesScreen();
  else if (state.tab === 'facilitator') facilitatorScreen();
  else learnScreen();
}

function bind() {
  app.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => setTab(button.dataset.tab)));
  app.querySelectorAll('[data-lesson]').forEach((button) => button.addEventListener('click', () => setLesson(Number(button.dataset.lesson))));
  app.querySelectorAll('[data-barter]').forEach((button) => button.addEventListener('click', () => { state.barterStep = Number(button.dataset.barter); render(); }));
  app.querySelectorAll('[data-function]').forEach((button) => button.addEventListener('click', () => { state.selectedFunction = button.dataset.function; render(); }));
  app.querySelectorAll('[data-score-item]').forEach((button) => button.addEventListener('click', () => { state.scoreItem = button.dataset.scoreItem; render(); }));
  app.querySelectorAll('[data-score]').forEach((input) => input.addEventListener('input', () => updateScore(input.dataset.score, input.value)));
  const shellInput = app.querySelector('[data-shell-supply]');
  if (shellInput) shellInput.addEventListener('input', () => { state.shellSupply = Number(shellInput.value); render(); });
  const coinInput = app.querySelector('[data-coin-purity]');
  if (coinInput) coinInput.addEventListener('input', () => { state.coinPurity = Number(coinInput.value); render(); });
}

render();
