
const CACHE_NAME = "todo-pwa-v1";

// Dateien, die offline verfügbar sein sollen
const FILES_TO_CACHE = [
    "index.html",
    "style.css",
    "script.js",
    "manifest.json",
    "icons.svg"
];

// Installation des Service Workers
self.addEventListener("install", (event) => {

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            const urls = FILES_TO_CACHE.map(
                file => new URL(file, self.registration.scope).href
            );

            return cache.addAll(urls);
        })
    );

    self.skipWaiting();
});

// Alte Caches löschen
self.addEventListener("activate", (event) => {

    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );

    self.clients.claim();
});

// Dateien aus dem Cache laden
self.addEventListener("fetch", (event) => {

    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    if (url.origin !== self.location.origin) return;

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        })
    );
});