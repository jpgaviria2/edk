(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const receiptsKey = 'history-fedi-sats-market-receipts';

  const state = {
    profile: { alias: 'Fedi wallet', pubkey: '' },
    invoice: '',
    invoiceMeta: null,
    receipts: loadReceipts()
  };

  function isFediReady() { return Boolean(window.webln); }
  function loadReceipts() { try { return JSON.parse(localStorage.getItem(receiptsKey)) || []; } catch (_) { return []; } }
  function saveReceipts() { localStorage.setItem(receiptsKey, JSON.stringify(state.receipts)); }
  function shorten(value) { return value && value.length > 16 ? `${value.slice(0, 10)}…${value.slice(-8)}` : (value || ''); }

  function addReceipt(type, title, details) {
    state.receipts.unshift({ type, title, details, at: new Date().toISOString(), profile: state.profile });
    state.receipts = state.receipts.slice(0, 25);
    saveReceipts();
    renderReceipts();
  }

  async function initIdentity() {
    const env = $('[data-env]');
    if (!isFediReady()) {
      env.textContent = 'Open inside Fedi';
      env.className = 'status warn';
      renderIdentity();
      return;
    }
    env.textContent = 'Fedi detected';
    env.className = 'status ok';

    try {
      await window.webln.enable();
      const info = await window.webln.getInfo?.();
      if (info?.node?.alias) state.profile.alias = info.node.alias;
    } catch (error) {
      addReceipt('fail', 'Wallet connection warning', error.message || 'Could not read WebLN wallet info.');
    }

    try {
      if (window.nostr?.getPublicKey) state.profile.pubkey = await window.nostr.getPublicKey();
    } catch (_) {}
    renderIdentity();
  }

  function renderIdentity() {
    const alias = state.profile.alias || 'Fedi wallet';
    $('[data-alias]').textContent = alias;
    $('[data-avatar]').textContent = alias.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || '₿';
    $('[data-pubkey]').textContent = state.profile.pubkey ? `Nostr pubkey ${shorten(state.profile.pubkey)}` : 'Wallet connected. Nostr identity unavailable or not approved yet.';
  }

  function selectedOffer() {
    const [item, category, defaultAmount] = $('[data-item]').value.split('|');
    return {
      seller: $('[data-seller-name]').value.trim() || state.profile.alias || 'Seller wallet',
      item,
      category: $('[data-category]').value.trim() || category,
      amount: Number($('[data-amount]').value || defaultAmount || 1)
    };
  }

  async function makeInvoice() {
    const feedback = $('[data-sell-feedback]');
    if (!isFediReady()) { feedback.textContent = 'Open this page inside Fedi to create a real wallet invoice.'; return; }
    const offer = selectedOffer();
    if (!Number.isFinite(offer.amount) || offer.amount < 1) { feedback.textContent = 'Enter a sats amount greater than zero.'; return; }

    feedback.textContent = 'Asking Fedi to create invoice… approve it in your wallet.';
    try {
      await window.webln.enable();
      const memo = `Sats Market: ${offer.item} from ${offer.seller} (${offer.category})`;
      const response = await window.webln.makeInvoice({ amount: offer.amount, defaultMemo: memo });
      state.invoice = response.paymentRequest;
      state.invoiceMeta = { ...offer, memo, rHash: response.rHash || '' };
      $('[data-invoice]').value = state.invoice;
      $('[data-offer-title]').textContent = `${offer.item} · ${offer.amount} sats`;
      $('[data-offer-summary]').textContent = `${offer.seller} is selling ${offer.item}. Solves: ${offer.category}.`;
      $('[data-invoice-card]').hidden = false;
      feedback.textContent = 'Invoice created. Copy/share it to the buyer wallet.';
      addReceipt('invoice', 'Created invoice', `${offer.amount} sats for ${offer.item}. ${response.rHash ? `Hash ${shorten(response.rHash)}` : ''}`);
    } catch (error) {
      feedback.textContent = `Invoice cancelled or failed: ${error.message || 'unknown error'}`;
      addReceipt('fail', 'Invoice failed', error.message || 'User denied or wallet could not create invoice.');
    }
  }

  async function payInvoice() {
    const feedback = $('[data-buy-feedback]');
    const invoice = $('[data-pay-invoice]').value.trim();
    if (!isFediReady()) { feedback.textContent = 'Open this page inside the buyer Fedi wallet to send a real payment.'; return; }
    if (!invoice.toLowerCase().startsWith('ln')) { feedback.textContent = 'Paste a valid BOLT11 Lightning invoice first.'; return; }

    feedback.textContent = 'Opening Fedi payment confirmation… approve or deny in the wallet.';
    try {
      await window.webln.enable();
      const response = await window.webln.sendPayment(invoice);
      feedback.textContent = 'Payment sent. Trade complete.';
      addReceipt('paid', 'Paid invoice', `Payment preimage ${shorten(response.preimage || '')}. Invoice ${shorten(invoice)}.`);
    } catch (error) {
      feedback.textContent = `Payment cancelled or failed: ${error.message || 'unknown error'}`;
      addReceipt('fail', 'Payment failed', error.message || 'User denied or wallet could not pay invoice.');
    }
  }

  async function copyInvoice() {
    if (!state.invoice) return;
    await navigator.clipboard.writeText(state.invoice);
    $('[data-sell-feedback]').textContent = 'Invoice copied. Paste it into the buyer wallet.';
  }

  async function shareInvoice() {
    if (!state.invoice) return;
    const text = `Sats Market invoice${state.invoiceMeta ? ` for ${state.invoiceMeta.item} (${state.invoiceMeta.amount} sats)` : ''}:\n${state.invoice}`;
    if (navigator.share) await navigator.share({ title: 'Sats Market invoice', text });
    else { await navigator.clipboard.writeText(text); $('[data-sell-feedback]').textContent = 'Share is unavailable, so the invoice text was copied.'; }
  }

  function openLightning() {
    const invoice = state.invoice || $('[data-pay-invoice]').value.trim();
    if (invoice) window.location.href = `lightning:${invoice}`;
  }

  async function pasteInvoice() {
    try {
      $('[data-pay-invoice]').value = await navigator.clipboard.readText();
      $('[data-buy-feedback]').textContent = 'Invoice pasted. Review, then pay.';
    } catch (_) { $('[data-buy-feedback]').textContent = 'Clipboard paste was blocked. Paste manually.'; }
  }

  async function signReceipt() {
    if (!state.receipts.length) { addReceipt('fail', 'No receipt to sign', 'Create or pay an invoice first.'); return; }
    if (!window.nostr?.signEvent) { addReceipt('fail', 'Nostr signing unavailable', 'Open inside Fedi and allow Nostr signing to sign a receipt.'); return; }
    const latest = state.receipts[0];
    try {
      const event = await window.nostr.signEvent({
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['app', 'historyofmoney-sats-market'], ['type', latest.type]],
        content: `Sats Market receipt: ${latest.title} — ${latest.details}`
      });
      addReceipt('signed', 'Signed receipt with Nostr', `Event ${shorten(event.id)} signed by ${shorten(event.pubkey)}.`);
    } catch (error) { addReceipt('fail', 'Receipt signing failed', error.message || 'User denied signing.'); }
  }

  function exportReceipts() {
    const payload = JSON.stringify({ exportedAt: new Date().toISOString(), receipts: state.receipts }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fedi-sats-market-receipts.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  function renderReceipts() {
    $('[data-receipts]').innerHTML = state.receipts.length ? state.receipts.map((receipt) => `
      <article class="receipt ${receipt.type === 'fail' ? 'fail' : ''}">
        <strong>${receipt.title}</strong>
        <span>${receipt.details}</span>
        <small>${new Date(receipt.at).toLocaleString()}</small>
      </article>
    `).join('') : '<p class="muted">No receipts yet.</p>';
  }

  function setTab(tab) {
    $$('[data-tab]').forEach((button) => button.classList.toggle('active', button.dataset.tab === tab));
    $$('[data-panel]').forEach((panel) => panel.classList.toggle('hidden', panel.dataset.panel !== tab));
  }

  document.addEventListener('click', (event) => {
    const tab = event.target?.dataset?.tab;
    const action = event.target?.dataset?.action;
    if (tab) setTab(tab);
    if (action === 'make-invoice') makeInvoice();
    if (action === 'pay-invoice') payInvoice();
    if (action === 'copy-invoice') copyInvoice();
    if (action === 'share-invoice') shareInvoice();
    if (action === 'open-lightning') openLightning();
    if (action === 'paste-invoice') pasteInvoice();
    if (action === 'sign-receipt') signReceipt();
    if (action === 'export-receipts') exportReceipts();
    if (action === 'clear-receipts') { state.receipts = []; saveReceipts(); renderReceipts(); }
  });

  $('[data-item]').addEventListener('change', () => {
    const [, category, amount] = $('[data-item]').value.split('|');
    $('[data-category]').value = category;
    $('[data-amount]').value = amount;
  });

  renderIdentity();
  renderReceipts();
  initIdentity();
})();
