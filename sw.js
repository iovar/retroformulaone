const cacheName = 'retroformulaone-cache-v2';

const cachedFiles = [
    './',
    'audio/sounds.mp3',
    'css/fonts/LCDM2N__.ttf',
    'css/controller.css',
    'css/game.css',
    'img/parts/flags.png',
    'img/parts/fuel_pump.png',
    'img/parts/game_over.png',
    'img/parts/level.png',
    'img/parts/life-1.png',
    'img/parts/life-2.png',
    'img/parts/life-3.png',
    'img/parts/pit_stop.png',
    'img/parts/row_a-c.png',
    'img/parts/row_a-l.png',
    'img/parts/row_a-r.png',
    'img/parts/row_b-c.png',
    'img/parts/row_b-l.png',
    'img/parts/row_b-r.png',
    'img/parts/row_c-c.png',
    'img/parts/row_c-l.png',
    'img/parts/row_c-r.png',
    'img/parts/self-c.png',
    'img/parts/self-l.png',
    'img/parts/self-r.png',
    'js/audio.js',
    'js/config.js',
    'js/controller.js',
    'js/game.js',
    'js/main.js',
    'icon.png',
    'index.html',
    'sw.js',
    'manifest.json',
];

const addFilesToCache = async () => {
    const cache = await caches.open(cacheName);
    return cache.addAll(cachedFiles);
};

const removeStaleCaches = async () => {
    const keys = await caches.keys();
    const staleKeys = keys.filter((key) => key !== cacheName);

    return Promise.all(key.map((key) => caches.delete(key)));
}

const fetchFromNetwork = async (cache, event) => {
    const networkResponse = await fetch(event.request);
    cache.put(event.request, networkResponse.clone());

    return networkResponse;
};

const fetchFromCacheFirst = async (event) => {
    const cache = await caches.open(cacheName);
    const response = await cache.match(event.request);

    if (response) {
        return response;
    }

    return fetchFromNetwork(cache, event);
};

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => event.waitUntil(removeStaleCaches()));

self.addEventListener('fetch', (event) => event.respondWith(fetchFromCacheFirst(event)));

