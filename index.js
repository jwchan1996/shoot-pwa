const request = axios.create({
    baseURL: 'https://api.i-meto.com/api/v1'
})

const app = new Vue({
    el: '#app',
    data: {
        songList: [],
        page: 1,
        loading: true
    },
    mounted() {
        this.registerServiceWorker()
        this.listenScrollToBottom()
        this.getSongList()
    },
    methods: {
        registerServiceWorker(){
            // 注册 service worker
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('sw.js').then( registration => {
                    // 注册成功
                    console.log('ServiceWorker registration successful with scope: ', registration.scope)
                }).catch( err => {
                    // 注册失败 :(
                    console.log('ServiceWorker registration failed: ', err)
                })
            }  
        },
        getSongList() {
            request.get('/meting', {
                params: {
                    server: 'netease',
                    type: 'parse',
                    id: '周杰伦'
                }
            }).then(response => {

                console.log(response.data)

                // if (response.data.code == 201) {
                    this.songList = response.data
                // } else {
                //     alert('没找到相关内容哦~')
                // }

            }).catch(error => {
                console.log(error.data)
            })
        },
        listenScrollToBottom() {
            window.addEventListener('scroll',this.scrolltobottom,false)
        },
        scrolltobottom(){
            //变量scrollTop是滚动条滚动时，距离顶部的距离
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            //变量windowHeight是可视区的高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
            //变量scrollHeight是滚动条的总高度
            let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
            //滚动条到底部的条件
            if (scrollTop + windowHeight == scrollHeight) {
                console.log('到底了')
                // this.loadMore()
            }
        },
        loadMore() {
            this.page ++
            request.get('/meting', {
                params: {
                    status: 'public',
                    page: this.page,
                    pageSize: 20
                }
            }).then(response => {

                console.log(response.data)

                if (response.data.code === 201) {
                    if(response.data.posts !== null){
                        for ( let i = 0; i < response.data.posts.length; i ++ ) {
                            this.postList.push(response.data.posts[i])
                        }
                        if(response.data.posts.length<20){
                            this.loading = false
                        }
                    }else{
                        this.loading = false
                        //移除事件监听
                        window.removeEventListener(this.scrolltobottom,false)
                    }
                }

            }).catch(error => {
                console.log(JSON.stringify(error))
                this.loading = false
            })
        }
    }
})