'use strict';

var request = axios.create({
    baseURL: 'https://api.i-meto.com/api/v1'
});

var app = new Vue({
    el: '#app',
    data: {
        songList: [],
        page: 1,
        loading: true
    },
    mounted: function mounted() {
        this.registerServiceWorker();
        this.listenScrollToBottom();
        this.getSongList();
    },

    methods: {
        registerServiceWorker: function registerServiceWorker() {
            // 注册 service worker
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('sw.js').then(function (registration) {
                    // 注册成功
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }).catch(function (err) {
                    // 注册失败 :(
                    console.log('ServiceWorker registration failed: ', err);
                });
            }
        },
        getSongList: function getSongList() {
            var _this = this;

            request.get('/meting', {
                params: {
                    server: 'netease',
                    type: 'parse',
                    id: '周杰伦'
                }
            }).then(function (response) {

                console.log(response.data);

                // if (response.data.code == 201) {
                _this.songList = response.data;
                // } else {
                //     alert('没找到相关内容哦~')
                // }
            }).catch(function (error) {
                console.log(error.data);
            });
        },
        listenScrollToBottom: function listenScrollToBottom() {
            window.addEventListener('scroll', this.scrolltobottom, false);
        },
        scrolltobottom: function scrolltobottom() {
            //变量scrollTop是滚动条滚动时，距离顶部的距离
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            //变量windowHeight是可视区的高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            //变量scrollHeight是滚动条的总高度
            var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            //滚动条到底部的条件
            if (scrollTop + windowHeight == scrollHeight) {
                console.log('到底了');
                // this.loadMore()
            }
        },
        loadMore: function loadMore() {
            var _this2 = this;

            this.page++;
            request.get('/meting', {
                params: {
                    status: 'public',
                    page: this.page,
                    pageSize: 20
                }
            }).then(function (response) {

                console.log(response.data);

                if (response.data.code === 201) {
                    if (response.data.posts !== null) {
                        for (var i = 0; i < response.data.posts.length; i++) {
                            _this2.postList.push(response.data.posts[i]);
                        }
                        if (response.data.posts.length < 20) {
                            _this2.loading = false;
                        }
                    } else {
                        _this2.loading = false;
                        //移除事件监听
                        window.removeEventListener(_this2.scrolltobottom, false);
                    }
                }
            }).catch(function (error) {
                console.log(JSON.stringify(error));
                _this2.loading = false;
            });
        }
    }
});
