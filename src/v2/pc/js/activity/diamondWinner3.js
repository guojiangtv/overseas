import '../../css/activity/diamondWinner3.less';

import Vue from 'vue';
import axios from 'axios';
Vue.prototype.axios = axios;

import Rank from './components/Rank.vue';

//ios中激活active伪类
document.body.addEventListener('touchstart', function() {});

new Vue({
    el: '#app',
    data: {
        user: {
            uInfo: {
                uid: 0,
                head_pic_1: ''
            },
            receivedNum: '',
            sentNum: '',
            winNum: ''
        },
        currentPosition: 0, //页面当前scrollTop值
        showRules: false,
        showToUpBtn:false,//是否显示向上按钮
    },
    components: {
        Rank
    },
    created: function() {
        //获取初始化页面数据
        axios.get('/Winner3Activity/Init')
            .then(res => {
                let data = res.data;
                //console.log('初始页面数据', data);
                if (data.errno == 0) {
                    this.user = data.data;
                    if (!this.uid) {
                        common.goLogin();
                    }
                }
            })
            .catch(err => {
                console.log(err);
            });
        // this.platformChange();
    },
    mounted: function() {
        //监听滚动出现规则按钮
        window.addEventListener('scroll', () => {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                screenHeight = screen.availHeight;
            if (scrollTop >= screenHeight / 2) {
                this.showToUpBtn = true;
            } else if (scrollTop < screenHeight / 2) {
                this.showToUpBtn = false;
            }
        });
    },
    methods: {
        //平台跳转
        platformChange() {
            if (platform != 'android_webview' && platform != 'ios_webview') {
                location.href = '/download/link';
                return;
            }
        },
        //滚动条向上滚动
        toTop() {
            this.timer = setInterval(() => {
                this.currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
                this.currentPosition -= 100; //控制步长
                if (this.currentPosition > 0) {
                    window.scrollTo(0, this.currentPosition);
                } else {
                    window.scrollTo(0, 0);
                    clearInterval(this.timer);
                }
            }, 1);
        }
    }
});
