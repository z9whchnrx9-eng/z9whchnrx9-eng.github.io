// Mudstreet Service Worker — Bully-Wise — Mudstreet
const CACHE = 'mudstreet-bully-v1';
const ASSETS = ['/', '/index.html', '/manifest.json', '/icon-192.svg', '/icon-512.svg'];

// On install — cache core assets
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

// On activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Fetch — network first, fallback to cache
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const rc = r.clone(); caches.open(CACHE).then(c => c.put(e.request, rc)); return r; })
      .catch(() => caches.match(e.request))
  );
});
