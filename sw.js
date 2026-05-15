const CACHE_VERSION = 'history-money-pwa-v32';
const STATIC_CACHE = `${CACHE_VERSION}-static`;

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/assets/moneypoly-board-logo.jpg',
  '/assets/icons/moneypoly-icon-192.png',
  '/assets/icons/moneypoly-icon-512.png',
  '/assets/icons/apple-touch-icon.png',
  '/assets/edk.css',
  '/assets/edk.js',
  '/fedi/',
  '/fedi/index.html',
  '/fedi/style.css',
  '/fedi/app.js',
  '/BLOCK 02 - HISTORY OF MONEY/',
  '/BLOCK 02 - HISTORY OF MONEY/index.html',
  '/BLOCK 02 - HISTORY OF MONEY/moneypoly/',
  '/BLOCK 02 - HISTORY OF MONEY/moneypoly/index.html',
  '/BLOCK 02 - HISTORY OF MONEY/moneypoly/moneypoly.css',
  '/BLOCK 02 - HISTORY OF MONEY/moneypoly/game-data.js',
  '/BLOCK 02 - HISTORY OF MONEY/moneypoly/moneypoly.js',
  '/BLOCK 02 - HISTORY OF MONEY/moneypoly/physical-kit/FACILITATOR-KIT.pdf',
  '/BLOCK 02 - HISTORY OF MONEY/fedi-sats-market/',
  '/BLOCK 02 - HISTORY OF MONEY/fedi-sats-market/index.html',
  '/BLOCK 02 - HISTORY OF MONEY/fedi-sats-market/sats-market.css',
  '/BLOCK 02 - HISTORY OF MONEY/fedi-sats-market/sats-market.js',
  '/BLOCK 07 - TRANSACTIONS SEND & RECEIVE/',
  '/BLOCK 07 - TRANSACTIONS SEND & RECEIVE/index.html',
  '/BLOCK 07 - TRANSACTIONS SEND & RECEIVE/physical-kit/bitcoin-transaction-demo/moderator.html',
  '/BLOCK 07 - TRANSACTIONS SEND & RECEIVE/physical-kit/bitcoin-transaction-demo/BITCOIN-TRANSACTION-DEMO-KIT.pdf'
];

const toCacheRequest = (url) => new Request(encodeURI(url), { cache: 'reload' });

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS.map(toCacheRequest)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('history-money-pwa-') && key !== STATIC_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function cachedWithoutQuery(request) {
  const url = new URL(request.url);
  url.search = '';
  return caches.match(url.pathname === '/' ? '/' : url.toString());
}

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return (await cachedWithoutQuery(request)) || (await caches.match('/offline.html'));
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request) || await cachedWithoutQuery(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        caches.open(STATIC_CACHE).then((cache) => cache.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => cached || new Response('', { status: 504, statusText: 'Offline' }));

  return cached || fetchPromise;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin || request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});
