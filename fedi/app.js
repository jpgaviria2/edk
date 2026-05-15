(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const receiptsKey = 'history-fedi-sats-market-receipts-v2';
  const settingsKey = 'history-fedi-sats-market-settings-v2';
  const APP = 'historyofmoney-sats-market';
  const KIND = 30078;
  const STALE_MS = 30 * 60 * 1000;

  const state = {
    profile: { alias: 'Fedi wallet', pubkey: '' },
    room: 'history-money-room',
    relayUrl: 'wss://relay.anmore.me',
    relay: null,
    joined: false,
    selectedPubkey: '',
    lastPresenceAt: 0,
    online: new Map(),
    requests: new Map(),
    receipts: loadJson(receiptsKey, []),
    settings: loadJson(settingsKey, {}),
    walletBalanceSats: null,
    walletBalanceSource: '',
    inventory: loadJson('history-fedi-inventory-v2', { water: 3, shelter: 1, mangoes: 5, fish: 2, cattle: 2 })
  };

  function loadJson(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { return fallback; } }
  function saveJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function short(value) { return value && value.length > 18 ? `${value.slice(0, 10)}…${value.slice(-8)}` : (value || ''); }
  function isFediReady() { return Boolean(window.webln); }
  function now() { return Date.now(); }
  function selectedOffer() { const [item, category, amount] = $('[data-item]').value.split('|'); return { item, category, amount: Number(amount) }; }
  function myDisplayName() { return $('[data-name]').value.trim() || state.profile.alias || 'Player'; }

  async function initIdentity() {
    $('[data-room]').value = state.settings.room || state.room;
    $('[data-relay]').value = state.settings.relayUrl || state.relayUrl;
    $('[data-moderator]').value = state.settings.moderator || '';
    if (state.settings.name) $('[data-name]').value = state.settings.name;

    const env = $('[data-env]');
    if (!isFediReady()) { env.textContent = 'Open inside Fedi'; env.className = 'status warn'; renderAll(); return; }
    env.textContent = 'Fedi detected'; env.className = 'status ok';
    try {
      await window.webln.enable();
      const info = await window.webln.getInfo?.();
      if (info?.node?.alias) state.profile.alias = info.node.alias;
    } catch (error) { addReceipt('fail', 'Wallet warning', error.message || 'Could not read wallet info.'); }
    try { if (window.nostr?.getPublicKey) state.profile.pubkey = await window.nostr.getPublicKey(); } catch (_) {}
    await refreshWalletBalance();
    renderAll();
  }

  async function refreshWalletBalance() {
    const candidates = [
      ['fedi.getBalance', () => window.fedi?.getBalance?.()],
      ['fedi.getWalletBalance', () => window.fedi?.getWalletBalance?.()],
      ['fedi.getFederationBalance', () => window.fedi?.getFederationBalance?.()],
      ['webln.getBalance', () => window.webln?.getBalance?.()]
    ];
    for (const [source, call] of candidates) {
      try {
        const result = await call();
        const sats = extractSatsBalance(result);
        if (Number.isFinite(sats)) {
          state.walletBalanceSats = sats;
          state.walletBalanceSource = source;
          return sats;
        }
      } catch (_) {}
    }
    state.walletBalanceSats = null;
    state.walletBalanceSource = '';
    return null;
  }

  function extractSatsBalance(value) {
    if (typeof value === 'number') return value;
    if (!value || typeof value !== 'object') return null;
    const directKeys = ['sats', 'sat', 'balanceSats', 'balanceSat', 'balance', 'amountSats', 'amountSat'];
    for (const key of directKeys) {
      if (typeof value[key] === 'number') return value[key];
      if (typeof value[key] === 'string' && value[key].trim() !== '' && !Number.isNaN(Number(value[key]))) return Number(value[key]);
    }
    if (typeof value.msats === 'number') return Math.floor(value.msats / 1000);
    if (typeof value.millisats === 'number') return Math.floor(value.millisats / 1000);
    if (value.balance && typeof value.balance === 'object') return extractSatsBalance(value.balance);
    if (value.wallet && typeof value.wallet === 'object') return extractSatsBalance(value.wallet);
    return null;
  }

  function renderIdentity() {
    const alias = myDisplayName();
    $('[data-alias]').textContent = alias;
    $('[data-avatar]').textContent = alias.split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase() || '₿';
    $('[data-pubkey]').textContent = state.profile.pubkey ? `Nostr ${short(state.profile.pubkey)}` : 'Nostr identity unavailable until opened/approved in Fedi.';
  }

  function renderInventory() {
    const goods = Object.entries(state.inventory).map(([key, value]) => `
      <div class="inv"><span>${key}</span><b>${value}</b></div>
    `).join('');
    const sats = Number.isFinite(state.walletBalanceSats)
      ? `<div class="inv sats"><span>app sats</span><b>${state.walletBalanceSats}</b></div>`
      : '<div class="inv sats unknown"><span>app sats</span><b>—</b><small>Fedi balance API unavailable</small></div>';
    $('[data-inventory]').innerHTML = goods + sats;
  }

  function publicInventory() {
    return Number.isFinite(state.walletBalanceSats) ? { ...state.inventory, sats: state.walletBalanceSats } : { ...state.inventory };
  }

  function renderPeople() {
    const people = [...state.online.values()]
      .filter((p) => p.pubkey !== state.profile.pubkey && now() - p.seenAt < STALE_MS)
      .sort((a, b) => b.seenAt - a.seenAt);
    $('[data-online-count]').textContent = `${people.length} online`;
    $('[data-people]').innerHTML = people.length ? people.map((p) => `
      <article class="person ${state.selectedPubkey === p.pubkey ? 'active' : ''}">
        <div class="person-top"><div class="avatar small">${initials(p.name)}</div><div><strong>${escapeHtml(p.name)}</strong><small>${short(p.pubkey)}</small></div></div>
        <p>Selling <b>${escapeHtml(p.offer.item)}</b> for <b>${p.offer.amount}</b> sats · ${escapeHtml(p.offer.category)}</p>
        <div class="mini-inventory">${Object.entries(p.inventory || {}).map(([k, v]) => `<span>${k}: ${v}</span>`).join('')}</div>
        <div class="button-row"><button data-action="request-trade" data-pubkey="${p.pubkey}">Offer ${p.offer.amount} sats</button><button data-action="select-person" data-pubkey="${p.pubkey}">View</button></div>
      </article>
    `).join('') : '<p class="muted">No other players online yet. Open this page on your second Fedi wallet and join the same room.</p>';
  }

  function renderRequests() {
    const requests = [...state.requests.values()].sort((a, b) => b.createdAt - a.createdAt);
    $('[data-requests]').innerHTML = requests.length ? requests.map((r) => requestCard(r)).join('') : '<p class="muted">No trade notifications yet.</p>';
  }

  function requestCard(r) {
    const mine = state.profile.pubkey;
    const incoming = r.sellerPubkey === mine && r.type === 'request';
    const invoiceForMe = r.buyerPubkey === mine && r.type === 'invoice';
    const paidForMe = r.sellerPubkey === mine && r.type === 'paid';
    return `<article class="request ${r.type}"><strong>${escapeHtml(r.title)}</strong><p>${escapeHtml(r.copy)}</p><small>${new Date(r.createdAt).toLocaleTimeString()}</small><div class="button-row">
      ${incoming ? `<button class="primary" data-action="accept-request" data-id="${r.id}">Accept + create invoice</button><button data-action="reject-request" data-id="${r.id}">Reject</button>` : ''}
      ${invoiceForMe ? `<button class="primary" data-action="pay-request-invoice" data-id="${r.id}">Pay invoice</button>` : ''}
      ${paidForMe ? '<span class="pill">Paid</span>' : ''}
    </div></article>`;
  }

  function renderModerator() {
    const moderator = normalizeKey($('[data-moderator]').value.trim());
    const isModerator = moderator && state.profile.pubkey && moderator === state.profile.pubkey;
    $('[data-mod-feedback]').textContent = isModerator ? 'Moderator unlocked for this wallet.' : 'Save your moderator pubkey, then open with that Fedi/Nostr identity to publish crisis events.';
    $$('[data-crisis]').forEach((button) => { button.disabled = !isModerator; });
  }

  function renderReceipts() {
    $('[data-receipts]').innerHTML = state.receipts.length ? state.receipts.map((r) => `<article class="receipt ${r.type === 'fail' ? 'fail' : ''}"><strong>${escapeHtml(r.title)}</strong><span>${escapeHtml(r.details)}</span><small>${new Date(r.at).toLocaleString()}</small></article>`).join('') : '<p class="muted">No receipts yet.</p>';
  }

  function renderAll() { renderIdentity(); renderInventory(); renderPeople(); renderRequests(); renderModerator(); renderReceipts(); }
  function initials(name) { return (name || '?').split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase(); }
  function escapeHtml(text) { return String(text ?? '').replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
  function normalizeKey(value) {
    if (!value) return '';
    const clean = value.trim();
    if (/^[0-9a-f]{64}$/i.test(clean)) return clean.toLowerCase();
    if (!clean.startsWith('npub')) return clean;
    try { return bech32ToHex(clean); } catch (_) { return clean; }
  }

  function bech32ToHex(bech) {
    const alphabet = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
    const pos = bech.lastIndexOf('1');
    const words = bech.slice(pos + 1, -6).split('').map((char) => alphabet.indexOf(char));
    let bits = 0, value = 0;
    const bytes = [];
    for (const word of words) {
      if (word < 0) throw new Error('invalid bech32');
      value = (value << 5) | word;
      bits += 5;
      if (bits >= 8) {
        bits -= 8;
        bytes.push((value >> bits) & 255);
      }
    }
    return bytes.slice(0, 32).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  function addReceipt(type, title, details) {
    state.receipts.unshift({ type, title, details, at: new Date().toISOString() });
    state.receipts = state.receipts.slice(0, 50);
    saveJson(receiptsKey, state.receipts);
    renderReceipts();
  }

  async function joinRoom() {
    const feedback = $('[data-room-feedback]');
    if (!window.nostr?.signEvent) { feedback.textContent = 'Open inside Fedi and allow Nostr identity/signing to join the live room.'; return; }
    state.room = $('[data-room]').value.trim() || 'history-money-room';
    state.relayUrl = $('[data-relay]').value.trim() || 'wss://relay.anmore.me';
    state.settings = { room: state.room, relayUrl: state.relayUrl, name: myDisplayName(), moderator: $('[data-moderator]').value.trim() };
    saveJson(settingsKey, state.settings);
    feedback.textContent = 'Connecting to the room relay…';
    await connectRelay();
    try {
      feedback.textContent = 'Fedi is asking you to sign your room status. Tap Yes to join.';
      await publishPresence();
      state.joined = true;
      feedback.textContent = `Joined ${state.room}. Looking for online players…`;
    } catch (error) {
      state.joined = false;
      feedback.textContent = `Join cancelled or failed: ${error.message || 'signature was not approved'}. Tap Join room again and choose Yes.`;
      addReceipt('fail', 'Join failed', error.message || 'Presence signature was rejected or failed.');
    }
    renderAll();
  }

  function connectRelay() {
    return new Promise((resolve) => {
      if (state.relay?.readyState === WebSocket.OPEN) return resolve();
      try { state.relay?.close(); } catch (_) {}
      state.relay = new WebSocket(state.relayUrl);
      state.relay.onopen = () => { subscribe(); resolve(); };
      state.relay.onmessage = (message) => handleRelayMessage(message.data);
      state.relay.onerror = () => { $('[data-room-feedback]').textContent = 'Relay connection failed. Try another relay.'; resolve(); };
      state.relay.onclose = () => { if (state.joined) setTimeout(connectRelay, 2500); };
    });
  }

  function subscribe() {
    const filter = { kinds: [KIND], '#r': [state.room], '#a': [APP], since: Math.floor(Date.now() / 1000) - 3600, limit: 200 };
    state.relay.send(JSON.stringify(['REQ', 'sats-market-room', filter]));
  }

  async function signAndPublish(type, content, extraTags = []) {
    if (!state.relay || state.relay.readyState !== WebSocket.OPEN) await connectRelay();
    if (!state.relay || state.relay.readyState !== WebSocket.OPEN) throw new Error('Relay is not connected');
    const event = await window.nostr.signEvent({
      kind: KIND,
      created_at: Math.floor(Date.now() / 1000),
      tags: [['d', `${APP}:${state.room}:${type}:${crypto.randomUUID()}`], ['a', APP], ['r', state.room], ['t', type], ...extraTags],
      content: JSON.stringify({ type, ...content })
    });
    if (event.pubkey && !state.profile.pubkey) state.profile.pubkey = event.pubkey;
    state.relay.send(JSON.stringify(['EVENT', event]));
    return event;
  }

  async function publishPresence() {
    await refreshWalletBalance();
    const offer = selectedOffer();
    const inventory = publicInventory();
    const signed = await signAndPublish('presence', { name: myDisplayName(), offer, inventory, seenAt: now() });
    state.lastPresenceAt = now();
    state.online.set(signed.pubkey, { pubkey: signed.pubkey, name: myDisplayName(), offer, inventory, seenAt: now() });
  }

  function handleRelayMessage(raw) {
    let msg; try { msg = JSON.parse(raw); } catch (_) { return; }
    if (msg[0] !== 'EVENT') return;
    const event = msg[2];
    let content; try { content = JSON.parse(event.content || '{}'); } catch (_) { return; }
    if (!event.tags?.some((t) => t[0] === 'r' && t[1] === state.room)) return;
    if (!event.tags?.some((t) => t[0] === 'a' && t[1] === APP)) return;

    if (content.type === 'presence') {
      state.online.set(event.pubkey, { pubkey: event.pubkey, name: content.name || short(event.pubkey), offer: content.offer || {}, inventory: content.inventory || {}, seenAt: content.seenAt || now() });
    }
    if (['request', 'invoice', 'paid', 'reject'].includes(content.type)) {
      const id = content.requestId || event.id;
      state.requests.set(id + ':' + content.type, { id, type: content.type, buyerPubkey: content.buyerPubkey, sellerPubkey: content.sellerPubkey, invoice: content.invoice, amount: content.amount, title: content.title || content.type, copy: content.copy || '', createdAt: (event.created_at || Math.floor(now() / 1000)) * 1000 });
    }
    if (content.type === 'crisis') applyCrisisIfValid(event, content);
    renderAll();
  }

  async function requestTrade(pubkey) {
    const target = state.online.get(pubkey);
    if (!target) return;
    const requestId = crypto.randomUUID();
    await signAndPublish('request', {
      requestId,
      buyerPubkey: state.profile.pubkey,
      sellerPubkey: pubkey,
      item: target.offer.item,
      amount: target.offer.amount,
      title: `${myDisplayName()} wants to buy ${target.offer.item}`,
      copy: `${myDisplayName()} offers ${target.offer.amount} sats for ${target.offer.item}.`
    }, [['p', pubkey]]);
    addReceipt('request', 'Trade request sent', `${target.offer.amount} sats offered to ${target.name} for ${target.offer.item}.`);
  }

  async function acceptRequest(id) {
    const req = [...state.requests.values()].find((r) => r.id === id && r.type === 'request');
    if (!req) return;
    try {
      await window.webln.enable();
      const response = await window.webln.makeInvoice({ amount: req.amount, defaultMemo: `Sats Market: ${req.title}` });
      await signAndPublish('invoice', { requestId: id, buyerPubkey: req.buyerPubkey, sellerPubkey: state.profile.pubkey, invoice: response.paymentRequest, amount: req.amount, title: `Invoice for ${req.amount} sats`, copy: `Seller accepted. Buyer can pay the invoice now.` }, [['p', req.buyerPubkey]]);
      addReceipt('invoice', 'Accepted trade + created invoice', `${req.amount} sats invoice sent to buyer.`);
    } catch (error) { addReceipt('fail', 'Invoice failed', error.message || 'Could not create invoice.'); }
  }

  async function payRequestInvoice(id) {
    const invoice = [...state.requests.values()].find((r) => r.id === id && r.type === 'invoice');
    if (!invoice) return;
    try {
      await window.webln.enable();
      const response = await window.webln.sendPayment(invoice.invoice);
      await refreshWalletBalance();
      await signAndPublish('paid', { requestId: id, buyerPubkey: state.profile.pubkey, sellerPubkey: invoice.sellerPubkey, amount: invoice.amount, preimage: response.preimage || '', title: 'Trade paid', copy: `${myDisplayName()} paid ${invoice.amount} sats.` }, [['p', invoice.sellerPubkey]]);
      addReceipt('paid', 'Paid trade invoice', `${invoice.amount} sats sent.`);
      await publishPresence();
    } catch (error) { addReceipt('fail', 'Payment failed', error.message || 'Payment rejected or failed.'); }
  }

  async function rejectRequest(id) {
    const req = [...state.requests.values()].find((r) => r.id === id && r.type === 'request');
    if (!req) return;
    await signAndPublish('reject', { requestId: id, buyerPubkey: req.buyerPubkey, sellerPubkey: state.profile.pubkey, title: 'Trade rejected', copy: `${myDisplayName()} rejected the offer.` }, [['p', req.buyerPubkey]]);
  }

  function showTrade() {
    if (!state.joined) { $('[data-room-feedback]').textContent = 'Join the room first. Fedi will ask you to sign your room status.'; return; }
    const people = [...state.online.values()].filter((p) => p.pubkey !== state.profile.pubkey && now() - p.seenAt < STALE_MS);
    if (!people.length) { $('[data-room-feedback]').textContent = 'No other online players yet. Join from your second device with the same room code.'; return; }
    const pick = people[Math.floor(Math.random() * people.length)];
    state.selectedPubkey = pick.pubkey;
    $('[data-room-feedback]').textContent = `Matched with ${pick.name}, selling ${pick.offer.item} for ${pick.offer.amount} sats.`;
    setTab('market'); renderPeople();
  }

  function saveModerator() {
    state.settings.moderator = $('[data-moderator]').value.trim();
    saveJson(settingsKey, state.settings);
    renderModerator();
  }

  async function publishCrisis(kind) {
    const moderator = normalizeKey($('[data-moderator]').value.trim());
    if (!moderator || moderator !== state.profile.pubkey) return;
    const crises = {
      fire: { title: 'Fire', copy: 'Half of everyone’s cattle disappear.', effect: { resource: 'cattle', mode: 'halve' } },
      flood: { title: 'Flood', copy: 'Mango trees are wiped out. Mango stock becomes zero.', effect: { resource: 'mangoes', mode: 'zero' } },
      drought: { title: 'Drought', copy: 'Water becomes scarce. Everyone loses one water.', effect: { resource: 'water', mode: 'minusOne' } }
    };
    await signAndPublish('crisis', crises[kind]);
    addReceipt('crisis', `Moderator event: ${crises[kind].title}`, crises[kind].copy);
  }

  function applyCrisisIfValid(event, content) {
    const moderator = normalizeKey($('[data-moderator]').value.trim());
    if (!moderator || event.pubkey !== moderator) return;
    const { resource, mode } = content.effect || {};
    if (!resource || !(resource in state.inventory)) return;
    if (mode === 'halve') state.inventory[resource] = Math.floor(Number(state.inventory[resource] || 0) / 2);
    if (mode === 'zero') state.inventory[resource] = 0;
    if (mode === 'minusOne') state.inventory[resource] = Math.max(0, Number(state.inventory[resource] || 0) - 1);
    saveJson('history-fedi-inventory-v2', state.inventory);
    addReceipt('crisis', `Crisis: ${content.title}`, content.copy || `${resource} changed.`);
    if (state.joined) publishPresence();
  }

  function setTab(tab) {
    $$('[data-tab]').forEach((button) => button.classList.toggle('active', button.dataset.tab === tab));
    $$('[data-panel]').forEach((panel) => panel.classList.toggle('hidden', panel.dataset.panel !== tab));
  }

  function exportReceipts() {
    const blob = new Blob([JSON.stringify({ receipts: state.receipts, inventory: state.inventory, walletBalanceSats: state.walletBalanceSats, walletBalanceSource: state.walletBalanceSource }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'sats-market-room-receipts.json'; link.click(); URL.revokeObjectURL(url);
  }

  document.addEventListener('click', (event) => {
    const tab = event.target?.dataset?.tab;
    const action = event.target?.dataset?.action;
    const crisis = event.target?.dataset?.crisis;
    if (tab) setTab(tab);
    if (action === 'join-room') joinRoom();
    if (action === 'show-trade') showTrade();
    if (action === 'request-trade') requestTrade(event.target.dataset.pubkey);
    if (action === 'select-person') { state.selectedPubkey = event.target.dataset.pubkey; renderPeople(); }
    if (action === 'accept-request') acceptRequest(event.target.dataset.id);
    if (action === 'reject-request') rejectRequest(event.target.dataset.id);
    if (action === 'pay-request-invoice') payRequestInvoice(event.target.dataset.id);
    if (action === 'save-moderator') saveModerator();
    if (action === 'export-receipts') exportReceipts();
    if (action === 'clear-receipts') { state.receipts = []; saveJson(receiptsKey, state.receipts); renderReceipts(); }
    if (crisis) publishCrisis(crisis);
  });

  $('[data-item]').addEventListener('change', () => { $('[data-room-feedback]').textContent = state.joined ? 'Offer changed locally. Tap Join room / publish status again when you want to update the room.' : 'Offer selected. Join the room when ready.'; });
  setInterval(() => { renderPeople(); }, 30000);

  renderAll();
  initIdentity();
})();
