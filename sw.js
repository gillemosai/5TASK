const CACHE_NAME = '5task-engine-v59';
const GITHUB_ASSETS = 'https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/';

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  `${GITHUB_ASSETS}5task-logo.png`,
  `${GITHUB_ASSETS}einstein-happy.png`,
  `${GITHUB_ASSETS}einstein-skeptical.png`,
  `${GITHUB_ASSETS}einstein-ecstatic.png`,
  `${GITHUB_ASSETS}einstein-worried.png`,
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
          if (url.origin === location.origin || url.host.includes('tailwindcss') || url.host.includes('githubusercontent')) {
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