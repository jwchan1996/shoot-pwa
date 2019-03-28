'use strict';

var request = axios.create({
    baseURL: 'https://api.clicli.top'
});

var app = new Vue({
    el: '#app',
    data: {
        postList: []
    },
    mounted: function mounted() {
        this.getRecommend();
    },

    methods: {
        getRecommend: function getRecommend() {
            var _this = this;

            request.get('/posts/both', {
                params: {
                    status: 'public',
                    type: 'tuijian',
                    page: 1,
                    pageSize: 10
                }
            }).then(function (response) {

                console.log(response.data);

                if (response.data.code == 201) {
                    _this.postList = response.data.posts;
                } else {
                    console.log('没找到相关内容哦~');
                }
            }).catch(function (error) {
                console.log(error.data);
            });
        },
        getImgSrc: function getImgSrc(content) {
            var m = content.match(/suo(.+?)\)/i);
            return m ? m[1].slice(2) : 'https://wx4.sinaimg.cn/mw690/0060lm7Tly1fvmtrka9p5j30b40b43yo.jpg';
        }
    }
});
