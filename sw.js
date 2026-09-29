const CACHE_NAME = 'vidpho-cache-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  // Ongeza faili zako hapa chini (k.v CSS, JS, picha n.k)
];

// 1. Wakati wa Kusakinisha (Install)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Wakati wa Kuamilisha (Activate)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clientsClaim();
});

// 3. Kudaka Maombi (Fetch & Network Interception)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Kama ipo kwenye cache, irudishe; kama haipo, jaribu mtandao
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Ikishindikana kupata mtandao na haipo kwenye cache, 
        // badala ya kuonyesha error mbaya, unaweza kurudisha ukurasa maalum wa offline
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
