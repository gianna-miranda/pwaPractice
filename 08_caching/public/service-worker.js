// console.log("Hello from your service worker!");
const FILES_TO_CACHE = [
    '/',
    '/offline.html',
    'index.html',
    '/assets/images/1.jpg',
    '/assets/images/2.jpg',
    '/assets/images/3.jpg',
    '/assets/images/4.jpg',
    '/assets/images/5.jpg',
    '/assets/images/6.jpg',
    '/assets/images/7.jpg',
    '/assets/images/8.jpg',
    '/assets/images/9.jpg',
    '/assets/images/10.jpg',
    '/assets/images/11.jpg',
    '/assets/images/12.jpg',
    '/assets/images/13.jpg',
    '/assets/images/14.jpg',
    '/assets/images/15.jpg',
    '/assets/images/16.jpg',
    '/assets/images/17.jpg'

];

const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

self.addEventListener('install', function(evt){
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache =>{
            console.log('your files were pre-cached successfully!');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function(evt){
    evt.waitUntil(
        caches.keys().then(keyList => {
    return Promise.all(
        keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME){
                console.log('Removing old cache data', key);
                return caches.delete(key);
            }
        })
    )
})
);
self.ClientRectList.claim();
})

self.addEventListener('fetch',function(evt) {
    if (evt.request.url.includes('/api/')) {
        console.log('[Service Worker] Fetch (data)', evt.request.url);
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                .then(response => {
                    if(response.status === 200) {
                        cache.put(evt.request.url, response.clone());
                }
                return response;
                })
                .catch(err => {
                    return cache.match(evt.request);
                })
            })
        );
        return;
    }
    evt.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(evt.request).then(response => {
                return response || fetch(evt.request);
            });
        })
    );
});