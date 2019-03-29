importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-sw.js");
var cacheName = 'minimal-pwa-01'

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => cache.addAll([
            '/',
            './index.html',
            './dist/index.js',
            './vendor/vue.min.js',
            './vendor/axios.min.js'
        ]))
    );
});

self.addEventListener('fetch', function (event) {
    var request = event.request.url;
    var api = /https:\/\/api.i-meto.com\/api\/v1/g;
    // 动态缓存接口请求数据
    if (api.test(request)) {
        fetch(event.request).then(function (response) {
            var key = event.request.url;
            var value = response.clone();
            caches.open(cacheName).then(function (cache) {
                cache.put(key, value);
            })
        })
    }
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {

            if (response) {
                return response;
            }

            return fetch(event.request);
        })
    );
});