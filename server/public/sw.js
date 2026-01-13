const CACHE = 'collexa-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logo.svg',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  
  // Skip API requests - let them go to network
  if (url.pathname.startsWith('/api/')) {
    return; // Don't intercept API requests
  }
  
  // Skip non-GET requests
  if (e.request.method !== 'GET') {
    return;
  }
  
  // Skip requests with credentials
  if (e.request.credentials === 'include') {
    return;
  }
  
  // Only cache static assets
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request).then(fetchResponse => {
        // Only cache successful responses for static assets
        if (fetchResponse.ok && (
          fetchResponse.type === 'basic' ||
          url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)
        )) {
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE).then(cache => {
            cache.put(e.request, responseToCache);
          });
        }
        return fetchResponse;
      });
    })
  );
});