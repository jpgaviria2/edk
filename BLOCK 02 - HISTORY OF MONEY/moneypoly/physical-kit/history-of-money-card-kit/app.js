const CARD_TYPES = [
  { key: 'mango', label: 'Mango', icon: '🥭', accent: '#ee7c2b', accentDark: '#8f3b10', accentGlow: '#ffc26b', note: 'Perishable food value', back: 'Barter supply', lesson: 'Tradeable nourishment with short shelf life.' },
  { key: 'cattle', label: 'Cattle', icon: '🐄', accent: '#6e4f3f', accentDark: '#2e2019', accentGlow: '#d7b28f', note: 'High-value living wealth', back: 'Stored status', lesson: 'Bulky wealth that stores value but is hard to divide.' },
  { key: 'shelter', label: 'Shelter', icon: '⛺', accent: '#5c4a86', accentDark: '#2d2446', accentGlow: '#b9a4ef', note: 'Protection & stability', back: 'Security layer', lesson: 'A core need that becomes scarce fast under stress.' },
  { key: 'water', label: 'Water', icon: '💧', accent: '#2187c7', accentDark: '#114366', accentGlow: '#88ddff', note: 'Essential daily need', back: 'Life-support trade', lesson: 'Universal demand makes water urgent but hard to store.' },
  { key: 'fish', label: 'Fish', icon: '🐟', accent: '#14806d', accentDark: '#0b3b35', accentGlow: '#6ee7cf', note: 'Protein & market flow', back: 'Fast-moving barter', lesson: 'Useful food that spoils and pressures quick exchange.' },
  { key: 'gold-coins', label: 'Gold Coins', icon: '🪙', accent: '#d2a217', accentDark: '#715108', accentGlow: '#ffe68a', note: 'Hard money era', back: 'Durable savings', lesson: 'Portable wealth with stronger long-term monetary properties.' },
  { key: 'banknotes', label: 'Banknotes', icon: '🏦', accent: '#53743c', accentDark: '#24351a', accentGlow: '#bbdf91', note: 'Redeemable paper claims', back: 'Ledger trust', lesson: 'Convenient claims whose strength depends on institutions.' },
  { key: 'dollars', label: 'Dollars', icon: '💵', accent: '#1b9d5d', accentDark: '#0b4d2c', accentGlow: '#8bf3bf', note: 'Fiat convenience', back: 'Modern liquidity', lesson: 'Easy to use, easy to issue, and vulnerable to debasement.' }
];
const DEFAULT_COUNT = 100;
const CARDS_PER_PAGE = 9;

const body = document.body;
const countControls = document.getElementById('countControls');
const legend = document.getElementById('legend');
const printStage = document.getElementById('printStage');
const deckSummary = document.getElementById('deckSummary');
const paperSize = document.getElementById('paperSize');
const renderMode = document.getElementById('renderMode');
const pageSizeStyle = document.createElement('style');
pageSizeStyle.id = 'page-size-style';
document.head.appendChild(pageSizeStyle);

function buildControls() {
  countControls.innerHTML = CARD_TYPES.map(type => `
    <label class="count-chip" for="count-${type.key}">
      <span>${type.label}</span>
      <input id="count-${type.key}" type="number" min="0" max="200" step="1" value="${DEFAULT_COUNT}" data-key="${type.key}" />
    </label>
  `).join('');

  legend.innerHTML = CARD_TYPES.map(type => `
    <article class="legend-card">
      <span class="legend-swatch" style="background:${type.accent}">${type.icon}</span>
      <h3>${type.label}</h3>
      <p><strong>${type.note}</strong></p>
      <p>${type.lesson}</p>
    </article>
  `).join('');
}

function readCounts() {
  return CARD_TYPES.map(type => {
    const input = document.getElementById(`count-${type.key}`);
    const count = Math.max(0, Number.parseInt(input.value || '0', 10));
    input.value = Number.isFinite(count) ? count : 0;
    return { ...type, count: Number.isFinite(count) ? count : 0 };
  });
}

function chunk(items, size) {
  const output = [];
  for (let i = 0; i < items.length; i += size) output.push(items.slice(i, i + size));
  return output;
}

function expandCards(typeCounts) {
  const cards = [];
  typeCounts.forEach(type => {
    for (let i = 1; i <= type.count; i += 1) {
      cards.push({ ...type, serial: i });
    }
  });
  return cards;
}

function mirrorForBacks(pageCards) {
  const rows = chunk(pageCards, 3);
  return rows.flatMap(row => row.slice().reverse());
}

function renderCard(card, side = 'front') {
  const common = `style="--accent:${card.accent};--accent-dark:${card.accentDark};--accent-glow:${card.accentGlow}"`;
  const crops = '<span class="crop tl"></span><span class="crop tr"></span><span class="crop bl"></span><span class="crop br"></span>';
  if (side === 'back') {
    return `
      <article class="card card-back" ${common}>
        ${crops}
        <div class="card-inner">
          <div class="back-grid">
            <div class="back-ring">${card.icon}</div>
            <div class="back-mark">${card.label}</div>
            <div class="back-copy">History of Money · Trading Kit<br/>Block 02 · ${card.back}</div>
          </div>
        </div>
      </article>
    `;
  }
  return `
    <article class="card card-face" ${common}>
      ${crops}
      <div class="card-inner">
        <div class="card-top">
          <div class="card-type">${card.label}</div>
          <div class="card-count">#${String(card.serial).padStart(3, '0')}</div>
        </div>
        <div>
          <div class="card-icon">${card.icon}</div>
          <h2 class="card-title">${card.note}</h2>
          <p class="card-copy">${card.lesson}</p>
        </div>
        <div class="card-footer">
          <span>Workshop trade card</span>
          <span>${card.key.toUpperCase().replaceAll('-', ' ')}</span>
        </div>
      </div>
    </article>
  `;
}

function renderSheets(cards, side) {
  const pages = chunk(cards, CARDS_PER_PAGE);
  return pages.map((pageCards, pageIndex) => {
    const printableCards = side === 'back' ? mirrorForBacks(pageCards) : pageCards;
    const label = side === 'front' ? 'Fronts' : 'Mirrored backs';
    return `
      <section class="sheet">
        <div class="sheet-head">
          <div><strong>History of Money Card Trading Kit</strong><br/>${label}</div>
          <div>Page ${pageIndex + 1} of ${pages.length}</div>
        </div>
        <div class="sheet-grid">
          ${printableCards.map(card => renderCard(card, side)).join('')}
        </div>
      </section>
    `;
  }).join('');
}

function render() {
  const isA4 = paperSize.value === 'a4';
  body.classList.toggle('paper-a4', isA4);
  body.classList.toggle('paper-letter', !isA4);
  pageSizeStyle.textContent = `@page { size: ${isA4 ? 'A4' : 'letter'} portrait; margin: 0; }`;

  const typeCounts = readCounts();
  const cards = expandCards(typeCounts);
  const frontsPages = Math.ceil(cards.length / CARDS_PER_PAGE);
  const mode = renderMode.value;

  deckSummary.innerHTML = `${cards.length} total cards · ${frontsPages || 0} sheet${frontsPages === 1 ? '' : 's'} per side · default run = 800 cards across 89 front sheets and 89 mirrored back sheets.`;

  if (!cards.length) {
    printStage.innerHTML = '<section class="panel"><h2>No cards selected</h2><p>Add at least one card count to generate printable sheets.</p></section>';
    return;
  }

  const fronts = renderSheets(cards, 'front');
  const backs = renderSheets(cards, 'back');
  printStage.innerHTML = [mode !== 'backs' ? fronts : '', mode !== 'fronts' ? backs : ''].join('');
}

document.addEventListener('click', event => {
  const action = event.target?.dataset?.action;
  if (!action) return;
  if (action === 'render') render();
  if (action === 'reset') {
    CARD_TYPES.forEach(type => {
      const input = document.getElementById(`count-${type.key}`);
      if (input) input.value = DEFAULT_COUNT;
    });
    paperSize.value = 'letter';
    renderMode.value = 'both';
    render();
  }
  if (action === 'print-fronts') {
    renderMode.value = 'fronts';
    render();
    window.print();
  }
  if (action === 'print-backs') {
    renderMode.value = 'backs';
    render();
    window.print();
  }
  if (action === 'print-both') {
    renderMode.value = 'both';
    render();
    window.print();
  }
});

document.addEventListener('change', event => {
  if (event.target.matches('input[data-key], select')) render();
});

document.addEventListener('input', event => {
  if (event.target.matches('input[data-key]')) render();
});

buildControls();
render();
