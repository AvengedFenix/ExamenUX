const staticAssets = [
    './',
    './styles.css',
    './app.js'
];

self.addEventListener('install', evnet =>{
    console.log('install'); 
    const cache = await caches.open('static')
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', event =>{
    console.log('fetch');
    const req = event.request;
    event.respondWith(cacheFirst());
});

async function cacheFirst(req){
    const cachedReponse = await caches.match(req);
    return cachedResponse || fetch(req);
}