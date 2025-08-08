/* eslint-disable no-restricted-globals */

// This service worker is custom-built to meet the project requirements.

const CACHE_NAME = 'mern-portfolio-cache-v1';
const STATIC_CACHE_NAME = 'static-assets-v1';
const DYNAMIC_CACHE_NAME = 'dynamic-api-v1';

// App Shell: All the static assets that the app needs to run.
// In a real build process, this list would be generated automatically.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // JS and CSS files would be here, but their names are hashed and unknown without a build step.
  // The service worker will cache them dynamically upon first visit anyway.
];

// Install event: Cache the app shell.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      console.log('Opened static cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event: Clean up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: Serve content from cache or network.
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy 1: For API calls (dynamic content), use Network First.
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE_NAME).then(async (cache) => {
        try {
          const networkResponse = await fetch(request);
          // If the request is successful, cache it and return it.
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          // If the network fails, try to serve from the cache.
          console.log('Network request failed, trying cache for:', request.url);
          const cachedResponse = await cache.match(request);
          return cachedResponse || new Response(JSON.stringify({ offline: true }), { headers: { 'Content-Type': 'application/json' } });
        }
      })
    );
    return;
  }

  // Strategy 2: For all other requests (static assets), use Cache First.
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      // If the response is in the cache, return it.
      if (cachedResponse) {
        return cachedResponse;
      }
      // Otherwise, fetch it from the network, cache it, and return it.
      return fetch(request).then(networkResponse => {
        return caches.open(STATIC_CACHE_NAME).then(cache => {
          // Cache the new resource.
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});
