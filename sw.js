var cacheStorageKey = 'minimal-pwa01'

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheStorageKey)
        .then(cache => cache.addAll([
            '/',
            './index.html',
            './dist/index.js',
            './vendor/vue.min.js',
            './vendor/axios.min.js',
            './src/common/img/kotori.png'
        ])).then(() => self.skipWaiting())
    );
})

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            if (response != null) {
                return response
            }
            return fetch(e.request.url)
        })
    )
})

self.addEventListener('activate', function (e) {
    e.waitUntil(
        //获取所有cache名称
        Promise.all(
            caches.keys().then(cacheNames => {
                return cacheNames.map(name => {
                    if (name !== cacheStorageKey) {
                        return caches.delete(name)
                    }
                })
            })
        ).then(() => {
            return self.clients.claim()
        })
    )
})