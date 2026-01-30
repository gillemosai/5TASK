const CACHE_NAME = '5task-v19'; 
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/Stalk%20logo.png',
  'https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/einstein-happy.png',
  'https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/einstein-skeptical.png',
  'https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/einstein-ecstatic.png',
  'https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/einstein-worried.png',
  'https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
            return cache.add(url).catch(err => console.log('Falha ao cachear:', url, err));
        })
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic' && response.type !== 'cors') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    }).catch(() => new Response("Offline"))
  );
});