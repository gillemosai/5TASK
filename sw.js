const CACHE_NAME = '5task-engine-v48';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/Stalk logo.png',
  '/assets/einstein-happy.png',
  '/assets/einstein-skeptical.png',
  '/assets/einstein-ecstatic.png',
  '/assets/einstein-worried.png',
  'https://cdn.tailwindcss.com',
  'https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) return networkResponse;
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          const url = new URL(request.url);
          if (url.origin === location.origin || url.host.includes('tailwindcss')) {
             cache.put(request, responseToCache);
          }
        });
        return networkResponse;
      }).catch(() => {
        if (request.mode === 'navigate') return caches.match('/index.html');
      });
    })
  );
});