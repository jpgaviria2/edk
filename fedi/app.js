(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const receiptsKey = 'history-fedi-sats-market-receipts-v2';
  const settingsKey = 'history-fedi-sats-market-settings-v2';
  const APP = 'historyofmoney-sats-market';
  const KIND = 30078;
  const STALE_MS = 30 * 60 * 1000;
  const DEFAULT_RELAYS = 'wss://relay.anmore.me,wss://relay.damus.io,wss://nos.lol,wss://relay.primal.net';

  const state = {
    profile: { alias: 'Fedi wallet', pubkey: '' },
    room: 'history-money-room',
    relayUrl: DEFAULT_RELAYS,
    relays: [],
    joined: false,
    selectedPubkey: '',
    lastPresenceAt: 0,
    online: new Map(),
    requests: new Map(),
    receipts: loadJson(receiptsKey, []),
    settings: loadJson(settingsKey, {}),
    walletBalanceSats: null,
    walletBalanceSource: '',
    role: null,
    inventory: null,
    appliedTrades: new Set(loadJson('history-fedi-applied-trades-v4', [])),
    notice: { title: 'Ready', copy: 'Join the room, then tap Show me a trade.', target: 'market' },
    currentMatch: null,
    moneyEra: loadJson('history-fedi-money-era-v1', 'bitcoin')
  };

  function loadJson(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { return fallback; } }
  function saveJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function short(value) { return value && value.length > 18 ? `${value.slice(0, 10)}…${value.slice(-8)}` : (value || ''); }
  function isFediReady() { return Boolean(window.webln); }
  function now() { return Date.now(); }
  const roles = [
    { item: 'Water refill', category: 'water', amount: 15, needs: ['shelter', 'mangoes'], inventory: { water: 5, shelter: 0, mangoes: 1, fish: 1, cattle: 0, shells: 4, gold: 1, claims: 2, dollars: 40 } },
    { item: 'Shelter repair', category: 'shelter', amount: 35, needs: ['water', 'fish'], inventory: { water: 1, shelter: 3, mangoes: 1, fish: 0, cattle: 1, shells: 3, gold: 1, claims: 3, dollars: 35 } },
    { item: 'Fresh mangoes', category: 'mangoes', amount: 20, needs: ['water', 'shelter'], inventory: { water: 1, shelter: 0, mangoes: 8, fish: 0, cattle: 0, shells: 5, gold: 0, claims: 1, dollars: 30 } },
    { item: 'Fish dinner', category: 'fish', amount: 25, needs: ['mangoes', 'shelter'], inventory: { water: 1, shelter: 0, mangoes: 1, fish: 5, cattle: 0, shells: 2, gold: 1, claims: 2, dollars: 25 } },
    { item: 'Cattle transport', category: 'cattle', amount: 45, needs: ['water', 'mangoes'], inventory: { water: 2, shelter: 1, mangoes: 0, fish: 0, cattle: 3, shells: 2, gold: 2, claims: 2, dollars: 45 } },
    { item: 'Lightning wallet help', category: 'savings', amount: 35, needs: ['fish', 'shelter'], inventory: { water: 1, shelter: 1, mangoes: 1, fish: 1, cattle: 0, shells: 4, gold: 1, claims: 4, dollars: 50 } }
  ];
  const moneyEras = { barter: { label: 'Barter', resource: null }, shells: { label: 'Shells', resource: 'shells' }, gold: { label: 'Gold', resource: 'gold' }, claims: { label: 'Paper claims', resource: 'claims' }, dollars: { label: 'Dollars', resource: 'dollars' }, bitcoin: { label: 'Bitcoin', resource: 'sats' } };

  function randomRole() {
    const last = localStorage.getItem('history-fedi-last-role-item') || '';
    const choices = roles.filter((role) => role.item !== last);
    const bytes = new Uint32Array(1);
    crypto.getRandomValues(bytes);
    return choices[bytes[0] % choices.length] || roles[bytes[0] % roles.length];
  }

  function assignNewRole() {
    state.role = randomRole();
    state.inventory = { ...state.role.inventory };
    localStorage.setItem('history-fedi-last-role-item', state.role.item);
    saveJson('history-fedi-inventory-v3', state.inventory);
    $('[data-item]').innerHTML = `<option value="${state.role.item}|${state.role.category}|${state.role.amount}">${state.role.item}</option>`;
  }

  function ensureRole() {
    if (!state.role || !state.inventory) assignNewRole();
    $('[data-item]').innerHTML = `<option value="${state.role.item}|${state.role.category}|${state.role.amount}">${state.role.item}</option>`;
  }

  function selectedOffer() { return { item: state.role.item, category: state.role.category, amount: Number(state.role.amount), quantity: 1, needs: state.role.needs || [] }; }
  function myDisplayName() { return $('[data-name]').value.trim() || state.profile.alias || 'Player'; }

  async function initIdentity() {
    $('[data-room]').value = state.settings.room || state.room;
    ensureRole();
    const savedRelays = state.settings.relayUrl || state.relayUrl;
    $('[data-relay]').value = savedRelays.includes(',') ? savedRelays : DEFAULT_RELAYS;
    $('[data-moderator]').value = state.settings.moderator || '';

    const env = $('[data-env]');
    if (!isFediReady()) { env.textContent = 'Open inside Fedi'; env.className = 'status warn'; renderAll(); return; }
    env.textContent = 'Fedi detected'; env.className = 'status ok';
    try {
      await window.webln.enable();
      const info = await window.webln.getInfo?.();
      if (info?.node?.alias) state.profile.alias = info.node.alias;
      const fediName = await readFediName();
      if (fediName) state.profile.alias = fediName;
    } catch (error) { addReceipt('fail', 'Wallet warning', error.message || 'Could not read wallet info.'); }
    try { if (window.nostr?.getPublicKey) state.profile.pubkey = await window.nostr.getPublicKey(); } catch (_) {}
    await refreshWalletBalance();
    $('[data-name]').value = state.profile.alias || 'Fedi wallet';
    renderAll();
  }

  async function readFediName() {
    const candidates = [
      () => window.fedi?.getUserInfo?.(),
      () => window.fedi?.getUser?.(),
      () => window.fedi?.getUsername?.(),
      () => window.fedi?.getDisplayName?.()
    ];
    for (const call of candidates) {
      try {
        const result = await call();
        if (typeof result === 'string' && result.trim()) return result.trim();
        if (result?.displayName) return result.displayName;
        if (result?.username) return result.username;
        if (result?.name) return result.name;
      } catch (_) {}
    }
    return '';
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
    if (state.role) {
      $('[data-role-title]').textContent = `${state.role.item} · ${state.role.amount} sats`;
      $('[data-role-copy]').textContent = `You sell ${state.role.item}. You need ${(state.role.needs || []).join(' + ')}. Current money: ${moneyEras[state.moneyEra].label}.`;
    }
    const goods = Object.entries(state.inventory || {}).map(([key, value]) => `
      <div class="inv"><span>${key}</span><b>${value}</b></div>
    `).join('');
    const sats = Number.isFinite(state.walletBalanceSats)
      ? `<div class="inv sats"><span>app sats</span><b>${state.walletBalanceSats}</b></div>`
      : '<div class="inv sats unknown"><span>app sats</span><b>—</b><small>Balance private</small></div>';
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
    $('[data-people]').innerHTML = '';
  }


  function matchScore(peer) {
    const myOffer = selectedOffer();
    const theirOffer = peer.offer || {};
    const theyNeedMine = (theirOffer.needs || []).includes(myOffer.category);
    const iNeedTheirs = (myOffer.needs || []).includes(theirOffer.category);
    const theyHaveNeed = Number(peer.inventory?.[myOffer.category] || 0) > 0;
    const iHaveNeed = Number(state.inventory?.[theirOffer.category] || 0) > 0;
    return (theyNeedMine ? 4 : 0) + (iNeedTheirs ? 4 : 0) + (theyHaveNeed ? 1 : 0) + (iHaveNeed ? 1 : 0);
  }

  function tradeModeFor(peer) {
    const myOffer = selectedOffer();
    const theirOffer = peer.offer || {};
    const doubleCoincidence = (theirOffer.needs || []).includes(myOffer.category) && (myOffer.needs || []).includes(theirOffer.category);
    if (doubleCoincidence && Number(state.inventory[myOffer.category] || 0) > 0 && Number(peer.inventory?.[theirOffer.category] || 0) > 0) return 'barter';
    return state.moneyEra;
  }

  function renderMatch() {
    const card = $('[data-match-card]');
    if (!card) return;
    const match = state.currentMatch ? state.online.get(state.currentMatch.pubkey) : null;
    if (!match) {
      $('[data-match-title]').textContent = 'Waiting for a match';
      $('[data-match-copy]').textContent = 'Tap Show me a trade. You will get one player card at a time.';
      $('[data-match-options]').innerHTML = '<button class="primary" data-action="show-trade">Show me a trade</button>';
      return;
    }
    const mode = tradeModeFor(match);
    const myOffer = selectedOffer();
    const theirOffer = match.offer || {};
    const theirs = Object.entries(match.inventory || {}).filter(([, v]) => Number(v) > 0).map(([k, v]) => `${k}: ${v}`).join(' · ');
    $('[data-match-title]').textContent = match.name || 'Matched player';
    $('[data-match-copy]').innerHTML = `They have <b>${escapeHtml(theirOffer.item || 'goods')}</b>. They need ${(theirOffer.needs || []).map(escapeHtml).join(' + ') || 'unknown'}.<br>${mode === 'barter' ? `Match: you need ${escapeHtml(theirOffer.category)}, they need ${escapeHtml(myOffer.category)}. Barter works.` : `No perfect barter. Use ${escapeHtml(moneyEras[mode].label)} if you want to trade.`}<br><small>${escapeHtml(theirs)}</small>`;
    $('[data-match-options]').innerHTML = `
      <button class="primary" data-action="accept-match" data-pubkey="${match.pubkey}">Accept</button>
      <button data-action="reject-match">Reject</button>
      <button data-action="request-trade" data-pubkey="${match.pubkey}">Make offer</button>
    `;
  }

  function moneyButtons() {
    return `<div class="money-row">${Object.entries(moneyEras).map(([key, era]) => `<button class="money-chip ${state.moneyEra === key ? 'active' : ''}" data-money-era="${key}">${era.label}</button>`).join('')}</div>`;
  }

  function renderRequests() {
    const ids = [...new Set([...state.requests.values()].map((r) => r.id))];
    const summaries = ids.map((id) => {
      const events = tradeEvents(id);
      return events.paid || events.invoice || events.accept || events.reject || events.request;
    }).filter(Boolean).sort((a, b) => b.createdAt - a.createdAt);
    $('[data-requests]').innerHTML = summaries.length ? summaries.map((r) => requestCard(r)).join('') : '<p class="muted">No trade notifications yet.</p>';
  }

  function requestCard(r) {
    const mine = state.profile.pubkey;
    const events = tradeEvents(r.id);
    const paid = Boolean(events.paid);
    const rejected = Boolean(events.reject);
    const accepted = Boolean(events.accept);
    const invoiced = Boolean(events.invoice);
    const incoming = r.sellerPubkey === mine && r.type === 'request' && !accepted && !invoiced && !paid && !rejected;
    const ecashForMe = r.buyerPubkey === mine && r.type === 'accept' && !paid && !rejected;
    const invoiceForMe = r.buyerPubkey === mine && r.type === 'invoice' && !paid && !rejected;
    const handled = paid || rejected || (invoiced && r.type === 'request') || (accepted && r.type === 'request');
    const status = paid ? 'Paid' : rejected ? 'Rejected' : accepted ? 'Accepted' : invoiced ? 'Invoice created' : 'Open';
    const isBarter = (events.request?.mode || r.mode) === 'barter' || Number(r.amount || 0) === 0;
    const method = isBarter ? 'barter' : ecashAvailable() ? 'ecash' : 'invoice';
    return `<article class="request ${r.type} ${handled ? 'handled' : ''}"><strong>${escapeHtml(r.title)}</strong><p>${escapeHtml(r.copy)}</p><small>${new Date(r.createdAt).toLocaleTimeString()} · ${status}</small><div class="button-row">
      ${incoming ? `<button class="primary" data-action="accept-request" data-id="${r.id}">${method === 'barter' ? 'Accept barter' : `Accept ${method === 'ecash' ? 'trade' : '+ create invoice'}`}</button><button data-action="reject-request" data-id="${r.id}">Reject</button>` : ''}
      ${ecashForMe ? `<button class="primary" data-action="pay-ecash" data-id="${r.id}">Pay with ecash</button>` : ''}
      ${invoiceForMe ? `<button class="primary" data-action="pay-request-invoice" data-id="${r.id}">Pay invoice</button>` : ''}
      ${paid ? '<span class="pill">Paid</span>' : invoiced && r.type === 'request' ? '<span class="pill">Waiting for buyer</span>' : accepted && r.type === 'request' ? '<span class="pill">Accepted</span>' : rejected ? '<span class="pill">Rejected</span>' : ''}
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

  function tradeEvents(id) {
    return {
      request: [...state.requests.values()].find((r) => r.id === id && r.type === 'request'),
      accept: [...state.requests.values()].find((r) => r.id === id && r.type === 'accept'),
      invoice: [...state.requests.values()].find((r) => r.id === id && r.type === 'invoice'),
      paid: [...state.requests.values()].find((r) => r.id === id && r.type === 'paid'),
      reject: [...state.requests.values()].find((r) => r.id === id && r.type === 'reject')
    };
  }

  function actionableRequests() {
    const mine = state.profile.pubkey;
    const seen = new Set();
    const actions = [];
    for (const r of state.requests.values()) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      const events = tradeEvents(r.id);
      if (events.paid || events.reject) continue;
      if (events.request?.sellerPubkey === mine && !events.invoice && !events.accept) actions.push(events.request);
      if (events.accept?.buyerPubkey === mine) actions.push(events.accept);
      if (events.invoice?.buyerPubkey === mine) actions.push(events.invoice);
    }
    return actions;
  }

  function renderActionTray() {
    const actions = actionableRequests();
    const people = [...state.online.values()].filter((p) => p.pubkey !== state.profile.pubkey && now() - p.seenAt < STALE_MS);
    $('[data-request-badge]').textContent = actions.length ? ` ${actions.length}` : '';
    $('[data-market-badge]').textContent = people.length ? ` ${people.length}` : '';
    if (actions.length) {
      const next = actions[0];
      state.notice = { title: next.type === 'invoice' ? 'Invoice ready' : 'Trade request', copy: next.copy || next.title, target: 'requests' };
    }
    $('[data-action-title]').textContent = state.notice.title;
    $('[data-action-copy]').textContent = state.notice.copy;
    $('[data-action-tray]').classList.toggle('hot', actions.length > 0);
  }

  function renderAll() { renderIdentity(); renderInventory(); renderPeople(); renderMatch(); renderRequests(); renderModerator(); renderReceipts(); renderActionTray(); }
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
    if (!state.joined) assignNewRole();
    state.room = $('[data-room]').value.trim() || 'history-money-room';
    state.relayUrl = $('[data-relay]').value.trim() || DEFAULT_RELAYS;
    state.settings = { room: state.room, relayUrl: state.relayUrl, moderator: $('[data-moderator]').value.trim() };
    saveJson(settingsKey, state.settings);
    feedback.textContent = 'Connecting to the room relay…';
    await connectRelays();
    try {
      feedback.textContent = 'Fedi is asking you to sign your room status. Tap Yes to join.';
      await publishPresence();
      state.joined = true;
      state.notice = { title: 'Joined room', copy: 'Tap Show me a trade or pick an online player.', target: 'market' };
      feedback.textContent = `Joined ${state.room}. Looking for online players…`;
    } catch (error) {
      state.joined = false;
      feedback.textContent = `Join cancelled or failed: ${error.message || 'signature was not approved'}. Tap Join room again and choose Yes.`;
      addReceipt('fail', 'Join failed', error.message || 'Presence signature was rejected or failed.');
    }
    renderAll();
  }

  async function connectRelays() {
    const urls = state.relayUrl.split(',').map((url) => url.trim()).filter(Boolean);
    state.relays.forEach((relay) => { try { relay.close(); } catch (_) {} });
    state.relays = [];
    await Promise.all(urls.map((url) => new Promise((resolve) => {
      try {
        const relay = new WebSocket(url);
        relay.onopen = () => { state.relays.push(relay); subscribe(relay); resolve(); };
        relay.onmessage = (message) => handleRelayMessage(message.data);
        relay.onerror = () => resolve();
        relay.onclose = () => {};
        setTimeout(resolve, 3500);
      } catch (_) { resolve(); }
    })));
  }

  function subscribe(relay) {
    const filter = { kinds: [KIND], '#r': [state.room], since: Math.floor(Date.now() / 1000) - 7200, limit: 300 };
    relay.send(JSON.stringify(['REQ', 'sats-market-room', filter]));
  }

  async function signAndPublish(type, content, extraTags = []) {
    if (!state.relays.some((relay) => relay.readyState === WebSocket.OPEN)) await connectRelays();
    const openRelays = state.relays.filter((relay) => relay.readyState === WebSocket.OPEN);
    if (!openRelays.length) throw new Error('No room relays are connected');
    const payload = { type, ...content };
    const event = await window.nostr.signEvent({
      kind: KIND,
      created_at: Math.floor(Date.now() / 1000),
      tags: [['d', `${APP}:${state.room}:${type}:${crypto.randomUUID()}`], ['a', APP], ['r', state.room], ['t', type], ['payload', encodePayload(payload)], ...extraTags],
      content: humanSignText(type, payload)
    });
    if (event.pubkey && !state.profile.pubkey) state.profile.pubkey = event.pubkey;
    openRelays.forEach((relay) => relay.send(JSON.stringify(['EVENT', event])));
    return event;
  }

  function humanSignText(type, payload) {
    if (type === 'presence') return `${payload.name || 'Player'} is joining Sats Market room “${state.room}” and selling ${payload.offer?.item || 'an item'} for ${payload.offer?.amount || '?'} sats.`;
    if (type === 'request') return `${myDisplayName()} offers ${payload.amount} sats to buy ${payload.item || 'an item'} in Sats Market room “${state.room}”.`;
    if (type === 'invoice') return `${myDisplayName()} accepted a Sats Market trade and created an invoice for ${payload.amount} sats.`;
    if (type === 'paid') return `${myDisplayName()} marked a Sats Market trade as paid for ${payload.amount} sats.`;
    if (type === 'reject') return `${myDisplayName()} rejected a Sats Market trade request.`;
    if (type === 'crisis') return `Moderator announces Sats Market crisis: ${payload.title}. ${payload.copy || ''}`.trim();
    return `Sats Market ${type} event in room “${state.room}”.`;
  }

  function encodePayload(payload) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  }

  function decodePayload(value) {
    return JSON.parse(decodeURIComponent(escape(atob(value))));
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
    let content = null;
    const payloadTag = event.tags?.find((t) => t[0] === 'payload')?.[1];
    if (payloadTag) {
      try { content = decodePayload(payloadTag); } catch (_) {}
    }
    if (!content) {
      try { content = JSON.parse(event.content || '{}'); } catch (_) { return; }
    }
    if (!event.tags?.some((t) => t[0] === 'r' && t[1] === state.room)) return;
    if (!event.tags?.some((t) => t[0] === 'a' && t[1] === APP)) return;

    if (content.type === 'presence') {
      state.online.set(event.pubkey, { pubkey: event.pubkey, name: content.name || short(event.pubkey), offer: content.offer || {}, inventory: content.inventory || {}, seenAt: content.seenAt || now() });
    }
    if (['request', 'accept', 'invoice', 'paid', 'ecash', 'reject'].includes(content.type)) {
      const id = content.requestId || event.id;
      state.requests.set(id + ':' + content.type, { id, type: content.type, buyerPubkey: content.buyerPubkey, sellerPubkey: content.sellerPubkey, invoice: content.invoice, item: content.item, category: content.category, offeredItem: content.offeredItem, offeredCategory: content.offeredCategory, mode: content.mode, quantity: content.quantity || 1, amount: content.amount, title: content.title || content.type, copy: content.copy || '', createdAt: (event.created_at || Math.floor(now() / 1000)) * 1000 });
      if (content.type === 'request' && content.sellerPubkey === state.profile.pubkey) { state.notice = { title: 'New trade request', copy: content.copy || content.title, target: 'requests' }; setTab('requests'); }
      if (content.type === 'accept' && content.buyerPubkey === state.profile.pubkey) { state.notice = { title: 'Trade accepted', copy: content.copy || content.title, target: 'requests' }; setTab('requests'); }
      if (content.type === 'invoice' && content.buyerPubkey === state.profile.pubkey) { state.notice = { title: 'Invoice ready', copy: content.copy || content.title, target: 'requests' }; setTab('requests'); }
      if (content.type === 'ecash' && content.sellerPubkey === state.profile.pubkey) receiveEcashPayment(content);
      if (content.type === 'paid') applyTradeInventory(content);
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
      category: target.offer.category,
      offeredItem: selectedOffer().item,
      offeredCategory: selectedOffer().category,
      amount: tradeAmount(target),
      quantity: 1,
      mode: tradeModeFor(target),
      title: `${myDisplayName()} wants to trade for ${target.offer.item}`,
      copy: tradeCopy(target)
    }, [['p', pubkey]]);
    state.requests.set(requestId + ':request', { id: requestId, type: 'request', buyerPubkey: state.profile.pubkey, sellerPubkey: pubkey, item: target.offer.item, category: target.offer.category, offeredItem: selectedOffer().item, offeredCategory: selectedOffer().category, amount: tradeAmount(target), quantity: 1, mode: tradeModeFor(target), title: `${myDisplayName()} wants to trade for ${target.offer.item}`, copy: tradeCopy(target), createdAt: now() });
    state.notice = { title: 'Offer sent', copy: `Waiting for ${target.name} to accept.`, target: 'requests' };
    setTab('requests');
    addReceipt('request', 'Trade request sent', tradeCopy(target));
  }

  function tradeAmount(peer) {
    const mode = tradeModeFor(peer);
    if (mode === 'barter') return 0;
    return Number(peer.offer?.amount || 0);
  }

  function tradeCopy(peer) {
    const mode = tradeModeFor(peer);
    if (mode === 'barter') return `${myDisplayName()} proposes barter: ${selectedOffer().item} for ${peer.offer.item}.`;
    return `${myDisplayName()} offers ${peer.offer.amount} sats worth of ${moneyEras[mode].label} for ${peer.offer.item}.`;
  }

  async function acceptRequest(id) {
    const req = [...state.requests.values()].find((r) => r.id === id && r.type === 'request');
    if (!req || tradeEvents(id).invoice || tradeEvents(id).accept || tradeEvents(id).paid || tradeEvents(id).reject) return;
    if (req.mode === 'barter' || Number(req.amount || 0) === 0) {
      const trade = { requestId: id, buyerPubkey: req.buyerPubkey, sellerPubkey: state.profile.pubkey, item: req.item, category: req.category, offeredItem: req.offeredItem, offeredCategory: req.offeredCategory, mode: 'barter', quantity: req.quantity || 1, amount: 0, title: 'Barter complete', copy: `Barter accepted: ${req.offeredItem || 'offered good'} for ${req.item}.` };
      applyTradeInventory(trade);
      await signAndPublish('paid', trade, [['p', req.buyerPubkey]]);
      state.requests.set(id + ':paid', { id, type: 'paid', ...trade, createdAt: now() });
      state.notice = { title: 'Barter complete', copy: `${req.item} and ${req.offeredItem || 'offered good'} exchanged.`, target: 'market' };
      addReceipt('paid', 'Barter complete', trade.copy);
      renderAll();
      await publishPresence();
      return;
    }
    if (ecashAvailable()) {
      await signAndPublish('accept', { requestId: id, buyerPubkey: req.buyerPubkey, sellerPubkey: state.profile.pubkey, item: req.item, category: req.category, offeredItem: req.offeredItem, offeredCategory: req.offeredCategory, quantity: req.quantity || 1, amount: req.amount, title: `Trade accepted`, copy: `Seller accepted ${req.item}. Buyer can pay with Fedi ecash now.` }, [['p', req.buyerPubkey]]);
      state.requests.set(id + ':accept', { id, type: 'accept', buyerPubkey: req.buyerPubkey, sellerPubkey: state.profile.pubkey, item: req.item, category: req.category, offeredItem: req.offeredItem, offeredCategory: req.offeredCategory, quantity: req.quantity || 1, amount: req.amount, title: 'Trade accepted', copy: `Seller accepted ${req.item}. Buyer can pay with Fedi ecash now.`, createdAt: now() });
      state.notice = { title: 'Trade accepted', copy: 'Waiting for buyer to pay with ecash.', target: 'requests' };
      addReceipt('accept', 'Accepted trade', `Waiting for ${req.amount} sats ecash payment.`);
      renderAll();
      return;
    }
    state.notice = { title: 'Creating invoice…', copy: 'Approve invoice creation in Fedi.', target: 'requests' };
    renderAll();
    try {
      await window.webln.enable();
      const response = await window.webln.makeInvoice({ amount: req.amount, defaultMemo: `Sats Market: ${req.title}` });
      await signAndPublish('invoice', { requestId: id, buyerPubkey: req.buyerPubkey, sellerPubkey: state.profile.pubkey, invoice: response.paymentRequest, item: req.item, category: req.category, offeredItem: req.offeredItem, offeredCategory: req.offeredCategory, quantity: req.quantity || 1, amount: req.amount, title: `Invoice for ${req.amount} sats`, copy: `Seller accepted ${req.item}. Buyer can pay the invoice now.` }, [['p', req.buyerPubkey]]);
      state.requests.set(id + ':invoice', { id, type: 'invoice', buyerPubkey: req.buyerPubkey, sellerPubkey: state.profile.pubkey, invoice: response.paymentRequest, item: req.item, category: req.category, offeredItem: req.offeredItem, offeredCategory: req.offeredCategory, quantity: req.quantity || 1, amount: req.amount, title: `Invoice for ${req.amount} sats`, copy: `Seller accepted ${req.item}. Buyer can pay the invoice now.`, createdAt: now() });
      state.notice = { title: 'Invoice created', copy: 'Waiting for buyer to pay.', target: 'requests' };
      addReceipt('invoice', 'Accepted trade + created invoice', `${req.amount} sats invoice sent to buyer.`);
    } catch (error) { addReceipt('fail', 'Invoice failed', error.message || 'Could not create invoice.'); }
  }

  function ecashAvailable() { return Boolean(window.fedi?.generateEcash && window.fedi?.receiveEcash); }

  async function generateEcash(amount) {
    const result = await window.fedi.generateEcash({ amount });
    return result?.notes || result?.ecash || result?.token || result;
  }

  async function receiveEcash(notes) {
    try { return await window.fedi.receiveEcash({ notes }); }
    catch (_) { return window.fedi.receiveEcash(notes); }
  }

  async function encryptFor(pubkey, payload) {
    const text = JSON.stringify(payload);
    if (window.nostr?.nip44?.encrypt) return { scheme: 'nip44', ciphertext: await window.nostr.nip44.encrypt(pubkey, text) };
    if (window.nostr?.nip04?.encrypt) return { scheme: 'nip04', ciphertext: await window.nostr.nip04.encrypt(pubkey, text) };
    return { scheme: 'plain', ciphertext: text };
  }

  async function decryptFrom(pubkey, wrapped) {
    if (wrapped?.scheme === 'nip44' && window.nostr?.nip44?.decrypt) return JSON.parse(await window.nostr.nip44.decrypt(pubkey, wrapped.ciphertext));
    if (wrapped?.scheme === 'nip04' && window.nostr?.nip04?.decrypt) return JSON.parse(await window.nostr.nip04.decrypt(pubkey, wrapped.ciphertext));
    return JSON.parse(wrapped?.ciphertext || '{}');
  }

  async function payAcceptedEcash(id) {
    const accepted = [...state.requests.values()].find((r) => r.id === id && r.type === 'accept');
    if (!accepted || tradeEvents(id).paid || tradeEvents(id).reject) return;
    state.notice = { title: 'Generating ecash…', copy: 'Approve ecash generation in Fedi.', target: 'requests' };
    renderAll();
    try {
      const notes = await generateEcash(Number(accepted.amount));
      const wrapped = await encryptFor(accepted.sellerPubkey, { notes, requestId: id, amount: accepted.amount, item: accepted.item, offeredItem: accepted.offeredItem, offeredCategory: accepted.offeredCategory, category: accepted.category, quantity: accepted.quantity || 1 });
      applyTradeInventory({ requestId: id, buyerPubkey: state.profile.pubkey, sellerPubkey: accepted.sellerPubkey, item: accepted.item, offeredItem: accepted.offeredItem, offeredCategory: accepted.offeredCategory, category: accepted.category, quantity: accepted.quantity || 1 });
      await signAndPublish('ecash', { requestId: id, buyerPubkey: state.profile.pubkey, sellerPubkey: accepted.sellerPubkey, item: accepted.item, offeredItem: accepted.offeredItem, offeredCategory: accepted.offeredCategory, category: accepted.category, quantity: accepted.quantity || 1, amount: accepted.amount, wrapped, title: 'Ecash sent', copy: `${myDisplayName()} sent ${accepted.amount} sats ecash for ${accepted.item}.` }, [['p', accepted.sellerPubkey]]);
      state.requests.set(id + ':paid', { id, type: 'paid', buyerPubkey: state.profile.pubkey, sellerPubkey: accepted.sellerPubkey, item: accepted.item, offeredItem: accepted.offeredItem, offeredCategory: accepted.offeredCategory, category: accepted.category, quantity: accepted.quantity || 1, amount: accepted.amount, title: 'Ecash sent', copy: `${myDisplayName()} sent ${accepted.amount} sats ecash for ${accepted.item}.`, createdAt: now() });
      state.notice = { title: 'Ecash sent', copy: `${accepted.item} inventory updated.`, target: 'market' };
      addReceipt('paid', 'Sent ecash', `${accepted.amount} sats sent for ${accepted.item}.`);
      renderAll();
      await publishPresence();
    } catch (error) { addReceipt('fail', 'Ecash payment failed', error.message || 'Ecash generation/send failed.'); state.notice = { title: 'Ecash failed', copy: error.message || 'Payment cancelled.', target: 'requests' }; renderAll(); }
  }

  async function receiveEcashPayment(content) {
    if (content.sellerPubkey !== state.profile.pubkey || tradeEvents(content.requestId).paid) return;
    try {
      const payload = await decryptFrom(content.buyerPubkey, content.wrapped);
      await receiveEcash(payload.notes);
      applyTradeInventory(content);
      await signAndPublish('paid', { requestId: content.requestId, buyerPubkey: content.buyerPubkey, sellerPubkey: state.profile.pubkey, item: content.item, offeredItem: content.offeredItem, offeredCategory: content.offeredCategory, category: content.category, quantity: content.quantity || 1, amount: content.amount, title: 'Trade paid', copy: `${content.amount} sats ecash received for ${content.item}.` }, [['p', content.buyerPubkey]]);
      state.requests.set(content.requestId + ':paid', { id: content.requestId, type: 'paid', buyerPubkey: content.buyerPubkey, sellerPubkey: state.profile.pubkey, item: content.item, offeredItem: content.offeredItem, offeredCategory: content.offeredCategory, category: content.category, quantity: content.quantity || 1, amount: content.amount, title: 'Trade paid', copy: `${content.amount} sats ecash received for ${content.item}.`, createdAt: now() });
      state.notice = { title: 'Ecash received', copy: `${content.item} inventory updated.`, target: 'market' };
      addReceipt('paid', 'Received ecash', `${content.amount} sats received for ${content.item}.`);
      renderAll();
      await refreshWalletBalance();
      await publishPresence();
    } catch (error) { addReceipt('fail', 'Receive ecash failed', error.message || 'Could not receive ecash.'); }
  }

  async function payRequestInvoice(id) {
    const invoice = [...state.requests.values()].find((r) => r.id === id && r.type === 'invoice');
    if (!invoice || tradeEvents(id).paid || tradeEvents(id).reject) return;
    state.notice = { title: 'Opening payment…', copy: 'Approve the payment in Fedi.', target: 'requests' };
    renderAll();
    try {
      await window.webln.enable();
      const response = await window.webln.sendPayment(invoice.invoice);
      await refreshWalletBalance();
      applyTradeInventory({ requestId: id, buyerPubkey: state.profile.pubkey, sellerPubkey: invoice.sellerPubkey, item: invoice.item, offeredItem: invoice.offeredItem, offeredCategory: invoice.offeredCategory, category: invoice.category, quantity: invoice.quantity || 1 });
      await signAndPublish('paid', { requestId: id, buyerPubkey: state.profile.pubkey, sellerPubkey: invoice.sellerPubkey, item: invoice.item, offeredItem: invoice.offeredItem, offeredCategory: invoice.offeredCategory, category: invoice.category, quantity: invoice.quantity || 1, amount: invoice.amount, preimage: response.preimage || '', title: 'Trade paid', copy: `${myDisplayName()} paid ${invoice.amount} sats for ${invoice.item}.` }, [['p', invoice.sellerPubkey]]);
      state.requests.set(id + ':paid', { id, type: 'paid', buyerPubkey: state.profile.pubkey, sellerPubkey: invoice.sellerPubkey, item: invoice.item, offeredItem: invoice.offeredItem, offeredCategory: invoice.offeredCategory, category: invoice.category, quantity: invoice.quantity || 1, amount: invoice.amount, title: 'Trade paid', copy: `${myDisplayName()} paid ${invoice.amount} sats for ${invoice.item}.`, createdAt: now() });
      state.notice = { title: 'Trade complete', copy: `${invoice.item} inventory updated.`, target: 'market' };
      addReceipt('paid', 'Paid trade invoice', `${invoice.amount} sats sent for ${invoice.item}.`);
      renderAll();
      await publishPresence();
    } catch (error) { addReceipt('fail', 'Payment failed', error.message || 'Payment rejected or failed.'); }
  }

  async function rejectRequest(id) {
    const req = [...state.requests.values()].find((r) => r.id === id && r.type === 'request');
    if (!req) return;
    await signAndPublish('reject', { requestId: id, buyerPubkey: req.buyerPubkey, sellerPubkey: state.profile.pubkey, item: req.item, offeredItem: req.offeredItem, offeredCategory: req.offeredCategory, category: req.category, title: 'Trade rejected', copy: `${myDisplayName()} rejected the offer.` }, [['p', req.buyerPubkey]]);
    state.requests.set(id + ':reject', { id, type: 'reject', buyerPubkey: req.buyerPubkey, sellerPubkey: state.profile.pubkey, item: req.item, offeredItem: req.offeredItem, offeredCategory: req.offeredCategory, category: req.category, title: 'Trade rejected', copy: `${myDisplayName()} rejected the offer.`, createdAt: now() });
    renderAll();
  }

  function resourceFromTrade(trade) {
    if (trade.category) return trade.category;
    const item = String(trade.item || '').toLowerCase();
    if (item.includes('mango')) return 'mangoes';
    if (item.includes('water')) return 'water';
    if (item.includes('shelter')) return 'shelter';
    if (item.includes('fish')) return 'fish';
    if (item.includes('cattle')) return 'cattle';
    return '';
  }

  function applyTradeInventory(trade) {
    const key = trade.requestId || trade.id;
    if (!key || state.appliedTrades.has(key)) return false;
    const resource = resourceFromTrade(trade);
    if (!resource || resource === 'savings') return false;
    const quantity = Math.max(1, Number(trade.quantity || 1));
    if (!state.inventory) state.inventory = {};
    const offeredResource = trade.offeredCategory || '';
    if (trade.buyerPubkey === state.profile.pubkey) {
      state.inventory[resource] = Number(state.inventory[resource] || 0) + quantity;
      if (trade.mode === 'barter' && offeredResource && offeredResource !== 'savings') {
        state.inventory[offeredResource] = Math.max(0, Number(state.inventory[offeredResource] || 0) - quantity);
      }
    }
    if (trade.sellerPubkey === state.profile.pubkey) {
      state.inventory[resource] = Math.max(0, Number(state.inventory[resource] || 0) - quantity);
      if (trade.mode === 'barter' && offeredResource && offeredResource !== 'savings') {
        state.inventory[offeredResource] = Number(state.inventory[offeredResource] || 0) + quantity;
      }
    }
    state.appliedTrades.add(key);
    saveJson('history-fedi-applied-trades-v4', [...state.appliedTrades]);
    saveJson('history-fedi-inventory-v3', state.inventory);
    renderInventory();
    return true;
  }

  function rejectMatch() {
    const old = state.currentMatch?.pubkey;
    const people = [...state.online.values()].filter((p) => p.pubkey !== state.profile.pubkey && p.pubkey !== old && now() - p.seenAt < STALE_MS);
    if (!people.length) {
      state.currentMatch = null;
      state.notice = { title: 'No more matches', copy: 'No other players are online right now.', target: 'market' };
      renderAll();
      return;
    }
    const ranked = people.map((p) => ({ p, score: matchScore(p) })).sort((a, b) => b.score - a.score);
    const pick = ranked[0].p;
    state.selectedPubkey = pick.pubkey;
    state.currentMatch = { pubkey: pick.pubkey, at: now() };
    state.notice = { title: 'New match', copy: `${pick.name} is selling ${pick.offer?.item || 'goods'}.`, target: 'market' };
    renderAll();
  }

  function showTrade() {
    if (!state.joined) { $('[data-room-feedback]').textContent = 'Join the room first. Fedi will ask you to sign your room status.'; return; }
    const people = [...state.online.values()].filter((p) => p.pubkey !== state.profile.pubkey && now() - p.seenAt < STALE_MS);
    if (!people.length) { $('[data-room-feedback]').textContent = 'No other online players yet. Join from your second device with the same room code.'; return; }
    const ranked = people.map((p) => ({ p, score: matchScore(p) })).sort((a, b) => b.score - a.score);
    const bestScore = ranked[0].score;
    const pool = ranked.filter((entry) => entry.score === bestScore).map((entry) => entry.p);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    state.selectedPubkey = pick.pubkey;
    state.currentMatch = { pubkey: pick.pubkey, at: now() };
    const mode = tradeModeFor(pick);
    $('[data-room-feedback]').textContent = `Matched with ${pick.name}. ${mode === 'barter' ? 'Double coincidence found — barter is possible.' : `Use ${moneyEras[mode].label} if barter does not line up.`}`;
    setTab('market'); renderAll();
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
    saveJson('history-fedi-inventory-v3', state.inventory);
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
    if (action === 'accept-match') requestTrade(event.target.dataset.pubkey);
    if (action === 'reject-match') rejectMatch();
    if (action === 'select-person') { state.selectedPubkey = event.target.dataset.pubkey; state.currentMatch = { pubkey: event.target.dataset.pubkey, at: now() }; renderAll(); }
    if (action === 'accept-request') acceptRequest(event.target.dataset.id);
    if (action === 'reject-request') rejectRequest(event.target.dataset.id);
    if (action === 'pay-request-invoice') payRequestInvoice(event.target.dataset.id);
    if (action === 'pay-ecash') payAcceptedEcash(event.target.dataset.id);
    if (action === 'save-moderator') saveModerator();
    if (action === 'export-receipts') exportReceipts();
    if (action === 'clear-receipts') { state.receipts = []; saveJson(receiptsKey, state.receipts); renderReceipts(); }
    if (action === 'open-next-action') setTab(state.notice.target || 'requests');
    const moneyEra = event.target?.dataset?.moneyEra;
    if (moneyEra) { state.moneyEra = moneyEra; saveJson('history-fedi-money-era-v1', state.moneyEra); renderAll(); }
    if (crisis) publishCrisis(crisis);
  });

  
  setInterval(() => { renderPeople(); }, 30000);

  renderAll();
  initIdentity();
})();
