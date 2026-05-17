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
const LAYOUTS = {
  safe8: { key: 'safe8', label: 'Safer 8-up', cols: 2, rows: 4, gap: 0.18, pagePad: 0.28, pagePadA4: 0.24 },
  dense9: { key: 'dense9', label: 'Dense 9-up', cols: 3, rows: 3, gap: 0.12, pagePad: 0.2, pagePadA4: 0.16 }
};

const body = document.body;
const countControls = document.getElementById('countControls');
const legend = document.getElementById('legend');
const printStage = document.getElementById('printStage');
const deckSummary = document.getElementById('deckSummary');
const paperSize = document.getElementById('paperSize');
const layoutMode = document.getElementById('layoutMode');
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

function currentLayout() {
  return LAYOUTS[layoutMode.value] || LAYOUTS.safe8;
}

function cardsPerPage() {
  const layout = currentLayout();
  return layout.cols * layout.rows;
}

function mirrorForBacks(pageCards) {
  const { cols } = currentLayout();
  const rows = chunk(pageCards, cols);
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

function renderSheets(cards, side, options = {}) {
  const layout = currentLayout();
  const pages = chunk(cards, cardsPerPage());
  const cardsOnly = options.cardsOnly ? ' cards-only' : '';
  return pages.map((pageCards, pageIndex) => {
    const printableCards = side === 'back' ? mirrorForBacks(pageCards) : pageCards;
    const label = side === 'front' ? 'Fronts' : 'Mirrored backs';
    return `
      <section class="sheet${cardsOnly}">
        <div class="sheet-head">
          <div><strong>History of Money Card Trading Kit</strong><br/>${label} · ${layout.label}</div>
          <div>Page ${pageIndex + 1} of ${pages.length}</div>
        </div>
        <div class="sheet-grid">
          ${printableCards.map(card => renderCard(card, side)).join('')}
        </div>
      </section>
    `;
  }).join('');
}

function getRenderContext() {
  const isA4 = paperSize.value === 'a4';
  const layout = currentLayout();
  const pageW = isA4 ? 8.27 : 8.5;
  const pageH = isA4 ? 11.69 : 11;
  const pagePad = isA4 ? layout.pagePadA4 : layout.pagePad;
  const gap = layout.gap;
  const headerReserve = 0.34;
  const aspect = 2.5 / 3.5;
  const maxCardWFromWidth = (pageW - (2 * pagePad) - (gap * (layout.cols - 1))) / layout.cols;
  const maxCardHFromHeight = (pageH - (2 * pagePad) - headerReserve - (gap * (layout.rows - 1))) / layout.rows;
  const cardW = Math.min(maxCardWFromWidth, maxCardHFromHeight * aspect);
  const cardH = cardW / aspect;
  const typeCounts = readCounts();
  const cards = expandCards(typeCounts);
  return { isA4, layout, pagePad, gap, cardW, cardH, cards };
}

function applyLayoutVars(ctx, target = body) {
  target.style.setProperty('--sheet-cols', String(ctx.layout.cols));
  target.style.setProperty('--sheet-rows', String(ctx.layout.rows));
  target.style.setProperty('--gap', `${ctx.gap}in`);
  target.style.setProperty('--page-pad', `${ctx.pagePad}in`);
  target.style.setProperty('--card-w', `${ctx.cardW}in`);
  target.style.setProperty('--card-h', `${ctx.cardH}in`);
}

function render() {
  const ctx = getRenderContext();
  body.classList.toggle('paper-a4', ctx.isA4);
  body.classList.toggle('paper-letter', !ctx.isA4);
  applyLayoutVars(ctx);
  pageSizeStyle.textContent = `@page { size: ${ctx.isA4 ? 'A4' : 'letter'} portrait; margin: 0; }`;

  const perPage = cardsPerPage();
  const frontsPages = Math.ceil(ctx.cards.length / perPage);
  const mode = renderMode.value;

  deckSummary.innerHTML = `${ctx.cards.length} total cards · ${frontsPages || 0} sheet${frontsPages === 1 ? '' : 's'} per side · active layout: ${ctx.layout.label} (${ctx.layout.cols}×${ctx.layout.rows}).`;

  if (!ctx.cards.length) {
    printStage.innerHTML = '<section class="panel"><h2>No cards selected</h2><p>Add at least one card count to generate printable sheets.</p></section>';
    return;
  }

  const fronts = renderSheets(ctx.cards, 'front');
  const backs = renderSheets(ctx.cards, 'back');
  printStage.innerHTML = [mode !== 'backs' ? fronts : '', mode !== 'fronts' ? backs : ''].join('');
}

function openPrintWindow(mode) {
  const ctx = getRenderContext();
  if (!ctx.cards.length) return;
  const printHtml = [
    mode !== 'backs' ? renderSheets(ctx.cards, 'front', { cardsOnly: true }) : '',
    mode !== 'fronts' ? renderSheets(ctx.cards, 'back', { cardsOnly: true }) : ''
  ].join('');
  const printWindow = window.open('', '_blank', 'noopener,noreferrer');
  if (!printWindow) {
    renderMode.value = mode;
    render();
    window.print();
    return;
  }
  const styleVars = `:root{--sheet-cols:${ctx.layout.cols};--sheet-rows:${ctx.layout.rows};--gap:${ctx.gap}in;--page-pad:${ctx.pagePad}in;--card-w:${ctx.cardW}in;--card-h:${ctx.cardH}in;}`;
  printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>History of Money Print</title><link rel="stylesheet" href="./styles.css" /><style>${styleVars}@page{size:${ctx.isA4 ? 'A4' : 'letter'} portrait;margin:0}body{background:#fff;margin:0;padding:0}.print-stage{gap:0}.sheet{margin:0;box-shadow:none}.sheet-head{display:none!important}</style></head><body class="${ctx.isA4 ? 'paper-a4' : 'paper-letter'}"><main class="kit-shell" style="padding:0;max-width:none"><section class="print-stage">${printHtml}</section></main></body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => {
    printWindow.print();
  };
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
    layoutMode.value = 'safe8';
    renderMode.value = 'both';
    render();
  }
  if (action === 'print-fronts') openPrintWindow('fronts');
  if (action === 'print-backs') openPrintWindow('backs');
  if (action === 'print-both') openPrintWindow('both');
});

document.addEventListener('change', event => {
  if (event.target.matches('input[data-key], select')) render();
});

document.addEventListener('input', event => {
  if (event.target.matches('input[data-key]')) render();
});

buildControls();
render();
