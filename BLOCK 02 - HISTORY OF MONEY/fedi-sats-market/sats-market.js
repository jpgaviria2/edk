(() => {
  const $ = (selector) => document.querySelector(selector);
  const storageKey = 'edk-sats-market-v2';

  const starterWallets = () => ([
    {
      id: 'primary',
      name: 'JP Primary',
      handle: '@jp_btclearn',
      avatar: 'JP',
      spendable: 100,
      earned: 0,
      cold: 0,
      offer: 'Lightning wallet setup help',
      category: 'Savings',
      price: 35,
      desc: 'Service · solves Savings · learn how to protect sats and recover your wallet.',
      needs: ['Transportation', 'Communication', 'Savings'],
      metNeeds: []
    },
    {
      id: 'second',
      name: 'JP Test Wallet',
      handle: '@jp_test',
      avatar: 'JT',
      spendable: 100,
      earned: 0,
      cold: 0,
      offer: 'Fix a flat tire',
      category: 'Transportation',
      price: 35,
      desc: 'Service · solves Transportation · useful if you need to move goods or get home.',
      needs: ['Food', 'Water', 'Education'],
      metNeeds: []
    }
  ]);

  const marketOffers = [
    { offer: 'Fresh bread', category: 'Food', price: 25, desc: 'Good · solves Food · immediate consumption, no long-term storage.' },
    { offer: 'Phone charging cable', category: 'Communication', price: 40, desc: 'Good · solves Communication · keeps you connected to the market.' },
    { offer: 'Water bottle refill', category: 'Water', price: 15, desc: 'Good · solves Water · cheap, useful, and easy to verify.' },
    { offer: 'Math tutoring sprint', category: 'Education', price: 30, desc: 'Service · solves Education · knowledge good with reputation value.' }
  ];

  const startingState = () => ({
    round: 1,
    buyerId: 'primary',
    sellerId: 'second',
    mode: 'solo-ledger',
    missed: 0,
    useful: 0,
    pending: null,
    countered: false,
    receipts: [],
    wallets: starterWallets()
  });

  let state = loadState();

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved?.wallets?.length === 2) return saved;
    } catch (_) {}
    return startingState();
  }

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function wallet(id) {
    return state.wallets.find((item) => item.id === id);
  }

  function buyer() {
    return wallet(state.buyerId);
  }

  function seller() {
    return wallet(state.sellerId);
  }

  function detectAdapter() {
    return window.FediSatsMarketAdapter || window.fediSatsMarketAdapter || null;
  }

  async function transferSats({ from, to, amount, memo }) {
    const adapter = detectAdapter();
    if (adapter?.transferSats) {
      return adapter.transferSats({ fromProfileId: from.id, toProfileId: to.id, amountSats: amount, memo });
    }

    from.spendable -= amount;
    to.spendable += amount;
    to.earned += amount;
    return { id: `sim-${Date.now()}`, mode: 'simulated-ledger' };
  }

  function score() {
    const needsMet = state.wallets.reduce((total, item) => total + item.metNeeds.length, 0);
    const earned = state.wallets.reduce((total, item) => total + item.earned, 0);
    const cold = state.wallets.reduce((total, item) => total + item.cold, 0);
    return (needsMet * 20) + (state.useful * 5) + (Math.floor(earned / 10) * 5) + (Math.floor(cold / 10) * 8) - (state.missed * 3);
  }

  function receipt(type, title, copy, meta = {}) {
    state.receipts.unshift({ type, title, copy, meta, at: new Date().toISOString() });
    state.receipts = state.receipts.slice(0, 24);
  }

  function renderNeeds(target, element) {
    element.innerHTML = target.needs.map((need) => (
      `<span class="need ${target.metNeeds.includes(need) ? 'met' : ''}">${need}</span>`
    )).join('');
  }

  function render() {
    const b = buyer();
    const s = seller();
    const adapter = detectAdapter();
    const needsMet = state.wallets.reduce((total, item) => total + item.metNeeds.length, 0);

    $('[data-round]').textContent = state.round;
    $('[data-mode-label]').textContent = adapter ? 'Fedi adapter' : 'Solo';
    $('[data-player-count]').textContent = state.wallets.length;
    $('[data-room-copy]').textContent = adapter
      ? 'A wallet adapter is available. This bridge lab can now hand the same confirmation step to a real wallet flow.'
      : 'Solo two-wallet mode uses a local game ledger, so you can test the bridge from money theory to wallet behavior without risking funds.';

    $('[data-buyer-avatar]').textContent = b.avatar;
    $('[data-buyer-name]').textContent = b.name;
    $('[data-buyer-handle]').textContent = `${b.handle} · verified room profile`;
    $('[data-buyer-spendable]').textContent = b.spendable;
    $('[data-buyer-earned]').textContent = b.earned;
    $('[data-buyer-cold]').textContent = b.cold;
    $('[data-buyer-offer]').textContent = b.offer;
    $('[data-buyer-price]').textContent = b.price;
    $('[data-buyer-category]').textContent = b.category;
    renderNeeds(b, $('[data-buyer-needs]'));

    $('[data-seller-avatar]').textContent = s.avatar;
    $('[data-seller-name]').textContent = s.name;
    $('[data-seller-handle]').textContent = `${s.handle} · paired seller profile`;
    $('[data-seller-offer]').textContent = s.offer;
    $('[data-seller-desc]').textContent = s.desc;
    $('[data-seller-price]').textContent = s.price;
    $('[data-seller-price-slider]').value = s.price;
    $('[data-offer-pill]').textContent = b.needs.includes(s.category) ? 'Matches a buyer need' : 'Open market offer';

    $('[data-primary-mini]').textContent = `${wallet('primary').spendable} spendable · ${wallet('primary').cold} cold`;
    $('[data-second-mini]').textContent = `${wallet('second').spendable} spendable · ${wallet('second').cold} cold`;
    document.querySelectorAll('[data-wallet-tab]').forEach((button) => button.classList.toggle('active', button.dataset.walletTab === state.buyerId));

    $('[data-needs-met]').textContent = needsMet;
    $('[data-missed]').textContent = state.missed;
    $('[data-useful]').textContent = state.useful;
    $('[data-score]').textContent = score();

    $('[data-ledger]').innerHTML = state.receipts.length
      ? state.receipts.map((item) => `<div class="receipt ${item.type}"><strong>${item.title}</strong><small>${item.copy}</small></div>`).join('')
      : '<p>No receipts yet. Buy, skip, counter, save to cold storage, or swap wallets.</p>';

    $('[data-confirm]').hidden = !state.pending;
    $('[data-primary-actions]').hidden = Boolean(state.pending);
    if (state.pending) {
      $('[data-confirm-copy]').textContent = `Send ${state.pending.amount} sats from ${b.name} to ${s.name} for “${s.offer}”?`;
    }

    saveState();
  }

  function nextRound() {
    state.round = state.round >= 6 ? 1 : state.round + 1;
    state.countered = false;
    if (state.round === 3) {
      receipt('cold', 'Market shock', 'Communication and trust matter more. Profiles reduce risk, but they do not remove the need to verify payments and counterparties.');
    }
    if (state.round === 5) {
      receipt('cold', 'Custody lesson', 'Cold storage sats are protected from impulse spending, but unavailable for quick trades. Better money still requires better custody habits.');
    }
  }

  function requestBuy() {
    const b = buyer();
    const s = seller();
    if (b.spendable < s.price) {
      $('[data-feedback]').textContent = `${b.name} does not have enough spendable sats. Skip, swap wallets, or reset the room.`;
      return;
    }
    state.pending = { amount: s.price, sellerId: s.id, buyerId: b.id };
    $('[data-feedback]').textContent = 'Confirm before sats move. This is the bridge moment from classroom theory into real wallet behavior.';
    render();
  }

  async function confirmBuy() {
    if (!state.pending) return;
    const b = buyer();
    const s = seller();
    const amount = state.pending.amount;
    const useful = b.needs.includes(s.category) && !b.metNeeds.includes(s.category);

    try {
      const result = await transferSats({ from: b, to: s, amount, memo: `Sats Market: ${s.offer}` });
      if (useful) {
        b.metNeeds.push(s.category);
        state.useful += 1;
      }
      receipt('buy', `Bought ${s.offer}`, `${b.name} sent ${amount} sats to ${s.name}. ${useful ? `Met ${b.name}'s ${s.category} need.` : 'Purchase did not match an active need.'}`, result);
      $('[data-feedback]').textContent = `Confirmed: ${amount} sats sent from ${b.name} to ${s.name}. Debrief whether sats improved coordination or just made the trade legible.`;
      state.pending = null;
      nextRound();
      rotateSellerOffer();
    } catch (error) {
      $('[data-feedback]').textContent = `Transfer failed: ${error?.message || 'wallet adapter rejected the payment'}. No game balance changed.`;
      state.pending = null;
    }
    render();
  }

  function rotateSellerOffer() {
    const s = seller();
    const next = marketOffers[(state.round + state.receipts.length) % marketOffers.length];
    if (state.mode === 'solo-ledger') {
      Object.assign(s, next);
    }
  }

  function counter() {
    const s = seller();
    if (state.countered) {
      $('[data-feedback]').textContent = 'Only one counter per pairing. Live rounds need to keep moving.';
      return;
    }
    state.countered = true;
    if (s.price >= 20) {
      s.price = Math.max(5, s.price - 10);
      receipt('buy', 'Counter accepted', `${s.name} lowered “${s.offer}” to ${s.price} sats.`);
      $('[data-feedback]').textContent = `${s.name} accepted. You can buy at the lower price.`;
    } else {
      receipt('skip', 'Counter rejected', `${s.name} kept the price at ${s.price} sats.`);
      $('[data-feedback]').textContent = `${s.name} rejected. Buy or skip.`;
    }
    render();
  }

  function skip() {
    state.missed += 1;
    receipt('skip', 'Skipped pairing', `${buyer().name} skipped ${seller().name}'s offer. No sats moved.`);
    $('[data-feedback]').textContent = 'Skipped. New round created.';
    nextRound();
    rotateSellerOffer();
    render();
  }

  function coldStorage() {
    const b = buyer();
    const amount = Math.min(20, b.spendable);
    if (!amount) {
      $('[data-feedback]').textContent = `${b.name} has no spendable sats left to protect.`;
      return;
    }
    b.spendable -= amount;
    b.cold += amount;
    if (b.needs.includes('Savings') && !b.metNeeds.includes('Savings')) b.metNeeds.push('Savings');
    receipt('cold', 'Saved to cold storage', `${b.name} moved ${amount} sats out of the spending wallet. Protected, but unavailable for quick trades.`);
    $('[data-feedback]').textContent = `${amount} sats moved to cold storage for ${b.name}. Now ask what got easier and what responsibility stayed with the holder.`;
    render();
  }

  function swap() {
    [state.buyerId, state.sellerId] = [state.sellerId, state.buyerId];
    state.pending = null;
    state.countered = false;
    receipt('cold', 'Buyer and seller swapped', `${buyer().name} is now the active buyer.`);
    $('[data-feedback]').textContent = 'Swapped wallets. You can now test the opposite direction.';
    render();
  }

  function chooseBuyer(id) {
    if (id === state.buyerId) return;
    state.buyerId = id;
    state.sellerId = state.wallets.find((item) => item.id !== id).id;
    state.pending = null;
    state.countered = false;
    $('[data-feedback]').textContent = `${buyer().name} is now the active buyer.`;
    render();
  }

  function exportReceipts() {
    const payload = JSON.stringify({ exportedAt: new Date().toISOString(), state }, null, 2);
    navigator.clipboard?.writeText(payload).then(() => {
      $('[data-feedback]').textContent = 'Receipts copied to clipboard as JSON.';
    }).catch(() => {
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sats-market-receipts.json';
      link.click();
      URL.revokeObjectURL(url);
      $('[data-feedback]').textContent = 'Receipts downloaded as JSON.';
    });
  }

  function reset() {
    localStorage.removeItem(storageKey);
    state = startingState();
    $('[data-feedback]').textContent = 'Room reset. Solo two-wallet testing is ready.';
    render();
  }

  document.addEventListener('click', (event) => {
    const action = event.target?.dataset?.action;
    const walletTab = event.target?.closest('[data-wallet-tab]')?.dataset?.walletTab;
    if (walletTab) chooseBuyer(walletTab);
    if (action === 'buy') requestBuy();
    if (action === 'confirm-buy') confirmBuy();
    if (action === 'cancel-confirm') { state.pending = null; $('[data-feedback]').textContent = 'Payment cancelled. No sats moved.'; render(); }
    if (action === 'counter') counter();
    if (action === 'skip') skip();
    if (action === 'cold') coldStorage();
    if (action === 'swap') swap();
    if (action === 'export') exportReceipts();
    if (action === 'reset') reset();
    if (action === 'toggle-mode') { $('[data-feedback]').textContent = 'Solo two-wallet mode is active. Real transfers require an injected FediSatsMarketAdapter.'; }
  });

  $('[data-seller-price-slider]').addEventListener('input', (event) => {
    seller().price = Number(event.target.value);
    render();
  });

  render();
})();
