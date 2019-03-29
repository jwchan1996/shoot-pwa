'use strict';

var cacheStorageKey = 'minimal-pwa-01';

self.addEventListener('install', function (e) {
    e.waitUntil(caches.open(cacheStorageKey).then(function (cache) {
        return cache.addAll(['/', './index.html', './dist/index.js', './vendor/vue.min.js', './vendor/axios.min.js']);
    }).then(function () {
        return self.skipWaiting();
    }));
});

self.addEventListener('fetch', function (e) {
    e.respondWith(caches.match(e.request).then(function (response) {
        if (response != null) {
            return response;
        }
        return fetch(e.request.url);
    }));
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
    //获取所有cache名称
    caches.keys().then(function (cacheNames) {
        return Promise.all(
        // 获取所有不同于当前版本名称cache下的内容
        cacheNames.filter(function (cacheNames) {
            return cacheNames !== cacheStorageKey;
        }).map(function (cacheNames) {
            return caches.delete(cacheNames);
        }));
    }).then(function () {
        return self.clients.claim();
    }));
});
