import '<%= stylePath %>';
import Vue from 'vue';
import axios from 'axios';
import common from 'common';

//ios中激活active伪类
document.body.addEventListener('touchstart', function() {});

new Vue({
    el: '#app',
    data: {},
    mounted: function() {

    },
    methods: {
        //点击头像，进入个人主页
        goPersonalPage(id) {
            common.goPersonalPage(id);
        },
        //点击关注按钮，关注主播
        attention(uid, index) {
            axios.get('***', {
                    params: {
                        mid: uid
                    }
                })
                .then(res => {
                    if (typeof data == 'string') {
                        data = JSON.parse(data);
                    }
                    let _data = res.data;
                    if (_data.errno == 0) {
                        this.rankList[index].isFollow = true;
                    } else {
                        console.log(_data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
});
