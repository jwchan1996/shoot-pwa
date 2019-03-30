var cacheStorageKey = 'minimal-pwa02'

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

// 「弹出添加到主屏对话框」事件
self.addEventListener('beforeinstallprompt', event => {
    // 这个 `event.userChoice` 是一个 Promise ，在用户选择后 resolve
    event.userChoice.then(result => {
        console.log(result.outcome)
        // 'accepted': 添加到主屏
        // 'dismissed': 用户不想理你并向你扔了个取消
    })
})