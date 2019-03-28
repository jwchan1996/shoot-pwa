'use strict';

var request = axios.create({
    baseURL: 'https://api.clicli.top'
});

var app = new Vue({
    el: '#app',
    data: {
        postList: [],
        page: 1,
        loading: true
    },
    mounted: function mounted() {
        this.listenScrollToBottom();
        this.getRecommend();
    },

    methods: {
        getRecommend: function getRecommend() {
            var _this = this;

            request.get('/posts/type', {
                params: {
                    status: 'public',
                    page: 1,
                    pageSize: 20
                }
            }).then(function (response) {

                console.log(response.data);

                if (response.data.code == 201) {
                    _this.postList = response.data.posts;
                } else {
                    alert('没找到相关内容哦~');
                }
            }).catch(function (error) {
                console.log(error.data);
            });
        },
        getImgSrc: function getImgSrc(content) {
            var m = content.match(/suo(.+?)\)/i);
            return m ? m[1].slice(2) : 'https://wx4.sinaimg.cn/mw690/0060lm7Tly1fvmtrka9p5j30b40b43yo.jpg';
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
                this.loadMore();
            }
        },
        loadMore: function loadMore() {
            var _this2 = this;

            this.page++;
            request.get('/posts/type', {
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
