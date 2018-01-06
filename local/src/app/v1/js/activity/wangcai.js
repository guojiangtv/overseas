require("../../css/activity/wangcai.less");

import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
import bodymovin from '../../../js/common/bodymovin.min.js'

let page1 = 1,
    page2 = 1,
    page3 = 1,
    modPage = 0,
    userPage = 0,
    scrollLock1 = false,
    scrollLock2 = false,
    scrollLock3 = false,
    scrollLock4 = false,
    scrollLock5 = false;

new Vue({
    el: '#app',
    data: {
        initData: [],
        uid: 0, //当前用户id
        time: 0, //活动时间
        showMount: true, //默认展示座驾
        mountList: [], //座驾列表
        giftList: [], //礼物列表
        stage: "", //商品期数
        nextStageStartTime: '', //下期开始时间
        allPrizeList: [], //已开奖列表
        myPrizeList: [], //我的中奖纪录列表
        myPurchaseList: [], //我的夺宝记录列表
        mRanks: [], //主播排行榜
        mSum: 0,
        uRanks: [], //用户排行榜
        uSum: 0,
        showRules: false, //活动规则
        snatchLayer: false, //购买人次最外层弹窗层
        attendWrap: true, //购买弹窗层
        messageWrap: false, //幸运号wrap
        purchaseNum: 1, //购买的人次
        //oldNum:1,//默认购买的人次
        maxLeftNum: 0, //最大可购买人次
        productId: 0, //购买的商品ID
        lotteryNumber: 0, //幸运号码
        tips1: '', //提交购买错误警告1
        tips2: '', //提交购买错误警告2
        smash: false, //特效背景遮罩
        svgContainerBox: false, //特效盒子
        countDownTime: '', //倒计时html
        showAllList: true,
        showMyRecordList: false,
        showMyList: false,
        showList: true,
        countDownLock: false, //倒计时是否开启
        showStage: true,
        showNextTime: true,
        purchaseLock: true
    },
    computed: {
        nextStageStartTimeContent: function() {
            if (this.nextStageStartTime == 'over') {
                return "--:--:--";
            } else {
                return this.nextStageStartTime.slice(11)
            }
        },
        next_time_unix: function() {
            return Date.parse(new Date(this.nextStageStartTime.replace(/-/g, '/'))) / 1000;
        },
        intDiff: function() {
            return this.next_time_unix - this.time;
        }
        //,
        // purchaseNum:{
        //     get: function() {
        //         return this.oldNum;
        //     },
        //     set: function(newValue) {
        //         this.oldNum = newValue.replace(/[^\d]/g, '');
        //     }
        // }
    },
    created: function() {
        //获取初始化页面数据
        axios.get('/WangCaiActivity/Init')
            .then(res => {
                let data = res.data;
                //console.log('初始页面数据', data);
                if (data.errno == 0) {
                    this.uid = data.data.uid;
                    if (!this.uid) {
                        common.goLogin()
                    }
                    this.time = data.data.time - 2; //延迟2秒确保倒计时大于6小时
                    this.allPrizeList = data.data.allPrizeList;
                    this.myPrizeList = data.data.myPrizeList;
                    this.myPurchaseList = data.data.myPurchaseList;
                    this.mRanks = data.data.mResult.ranks;
                    this.mSum = data.data.mResult.sum;
                    this.uRanks = data.data.uResult.ranks;
                    this.uSum = data.data.uResult.sum;
                    this.getProduct();
                }
            })
            .catch(err => {
                console.log(err);
            })
    },
    mounted: function() {
        //绑定滚动加载
        this.initScrollLoad();
    },
    methods: {
        //获取商品列表
        getProduct() {
            axios.get('/WangCaiActivity/GetProduct')
                .then(res => {
                    let data = res.data.data;
                    //console.log('座驾列表', data);
                    this.mountList = data.slice(0, 8);
                    this.giftList = data.slice(8);
                    if (this.time < 1514433600) { 
                        this.showStage = false;
                        this.showNextTime = false;
                    } else if (data[0].is_activity_end) {
                        this.stage = '--';
                        this.nextStageStartTime = 'over';
                    } else {
                        this.stage = data[0].stage;
                        this.nextStageStartTime = data[0].next_stage_start_time;
                        this.countDown();
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //倒计时
        countDown() {
            let intDiff = this.intDiff,
                that = this;

            function auto() {
                let day = 0,
                    hour = 0,
                    minute = 0,
                    second = 0; //时间默认值
                if (intDiff > 0) {
                    day = Math.floor(intDiff / (60 * 60 * 24));
                    hour = Math.floor(intDiff / (60 * 60) % 24);
                    minute = Math.floor(intDiff / 60 % 60);
                    second = Math.floor(intDiff % 60);
                } else {
                    return false;
                }
                minute = minute < 10 ? '0' + minute : minute;
                second = second < 10 ? '0' + second : second;
                that.countDownTime = '距结束: ' + hour + '小时' + minute + '分' + second + '秒';
                intDiff--;
                //console.log(intDiff);
                //倒计时为0 页面刷新
                if (intDiff == 0) {
                    window.location.reload();
                }
            };
            if (!this.countDownLock) {
                this.countDownLock = true;
                auto();
                window.setInterval(auto, 1000);
            }
        },
        //礼物预览
        preview(item) {
            let entityId = item.entity_id,
                svgSrc = '',
                imgSrc = '',
                svgContainer = document.getElementById('svgContainer');
            switch (entityId) {
                //皮皮虾典藏
                case '17':
                    svgSrc = 'http://static.guojiang.tv/pc/v3/img/room/svg/mount/17/data.json';
                    break;
                    //皮皮虾标准
                case '16':
                    svgSrc = 'http://static.guojiang.tv/pc/v3/img/room/svg/mount/16/data.json';
                    break;
                    //战斗机
                case '14':
                    svgSrc = 'http://static.guojiang.tv/pc/v3/img/room/svg/mount/14/data.json';
                    break;
                    //圣诞快车
                case '15':
                    svgSrc = 'http://static.guojiang.tv/pc/v3/img/room/svg/mount/15/data.json';
                    break;
                    //雪橇
                case '13':
                    svgSrc = 'http://static.guojiang.tv/pc/v3/img/room/svg/mount/13/data.json';
                    break;
                    //雷麒麟
                case '10':
                    svgSrc = 'http://static.guojiang.tv/pc/v3/img/room/svg/mount/10/data.json';
                    break;
                    //筋斗云
                case '9':
                    svgSrc = 'http://static.guojiang.tv/pc/v3/img/room/svg/mount/9/data.json';
                    break;
                    //比翼鸟
                case '11':
                    svgSrc = 'http://static.guojiang.tv/pc/v3/img/room/svg/mount/11/data.json';
                    break;

                    //旺财
                case '661':
                    svgSrc = 'http://static.guojiang.tv/app/gift/pc_animation/661/661.json';
                    break;
                    //姜饼屋
                case '621':
                    svgSrc = 'http://static.guojiang.tv/app/gift/pc_animation/621/621.json';
                    break;
                    //雪人派对
                case '622':
                    svgSrc = 'http://static.guojiang.tv/app/gift/pc_animation/622/622.json';
                    break;
                    //捣蛋女巫
                case '427':
                    svgSrc = 'http://static.guojiang.tv/app/gift/pc_animation/427/427_1508297715.json';
                    break;
                    //百鬼夜行
                case '428':
                    svgSrc = 'http://static.guojiang.tv/app/gift/pc_animation/428/428_1508297714.json';
                    break;
                    //强势围观
                case '501':
                    svgSrc = 'http://static.guojiang.tv/app/gift/pc_animation/501/501_1600000000.json';
                    break;
            }
            this.playSvg(svgSrc);
            this.smash = true;
            this.svgContainerBox = true;
        },
        //播放动画
        playSvg(svgData) {
            this.animItem = bodymovin.loadAnimation({
                wrapper: svgContainer,
                animType: 'svg',
                loop: true,
                autoplay: true,
                path: svgData
            });
        },
        //销毁实例
        destory() {
            svgContainer.innerHTML = '';
            this.smash = false;
            this.svgContainerBox = false;
        },
        //立即参与夺宝弹窗
        popUp(item) {
            if (this.time < 1514433600) { 
                layer.open({
                    content: '活动未开始',
                    time: 3,
                });
            } else if (this.time > 1514822399) {
                layer.open({
                    content: '活动已结束',
                    time: 3,
                });
            } else {
                this.productId = item.product_id
                this.maxLeftNum = item.left_num;
                this.snatchLayer = true;
                this.attendWrap = true;
            }
        },
        //减少购买人次
        subtraction() {
            this.purchaseNum--;
            if (this.purchaseNum < 0) {
                this.purchaseNum = 0;
            }
        },
        //增加购买人次
        addition() {
            this.purchaseNum++;
        },
        //关闭弹窗
        close() {
            this.tips1 = '';
            this.tips2 = '';
            this.purchaseNum = 1;
            this.messageWrap = false;
            this.snatchLayer = false;
            this.showRules = false;
        },
        //确认购买
        purchase() {
            if (this.purchaseLock) {
                this.purchaseLock = false;
                axios.get('/WangCaiActivity/GetPurchase', {
                        params: {
                            productId: this.productId,
                            num: this.purchaseNum
                        }
                    })
                    .then(res => {
                        let _data = res.data;
                        //console.log(_data);
                        this.purchaseLock = true;
                        if (_data.errno == 0) {
                            this.lotteryNumber = _data.data.productInfo
                            this.attendWrap = false;
                            this.messageWrap = true;
                            this.getProduct();
                            this.getMyPurchaseList(1, 'myPurchase', true);
                        } else if (_data.errno == 210) {
                            this.tips2 = '余额不足，请充值！'
                        } else if (_data.errno == 211) {
                            this.tips1 = '剩余人次不足，请重新填写数量'
                        } else if (_data.errno == 212) {
                            this.tips1 = '该礼物已开奖'
                        } else if (_data.errno == 214) {
                            this.tips1 = '请输入正确的购买人次'
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        },
        //榜单切换
        change(arg) {
            this.showAllList = arg == 1 ? true : false
            this.showMyRecordList = arg == 2 ? true : false
            this.showMyList = arg == 3 ? true : false
        },
        //滚动加载
        scrollLoad(ele, bottomHeight, callback) {
            var _ele = document.querySelector(ele);
            var bH = bottomHeight || 100;
            _ele.addEventListener('scroll', function() {
                var scrollTop = _ele.scrollTop,
                    cliHeight = _ele.clientHeight,
                    scrollHeight = _ele.scrollHeight;
                if (scrollHeight - cliHeight - scrollTop < bH) {
                    callback();
                }
            }, false);
        },
        //绑定滚动加载
        initScrollLoad() {
            const that = this;
            that.scrollLoad(".all_list ul", 150, function() {
                if (scrollLock1) return;
                scrollLock1 = true;
                page1++;
                that.getAllList(page1, 'all');
            });
            that.scrollLoad(".my_record_list ul", 150, function() {
                if (scrollLock2) return;
                scrollLock2 = true;
                page2++;
                that.getMyPrizeList(page2, 'myPrize');
            });
            that.scrollLoad(".my_list ul", 150, function() {
                if (scrollLock3) return;
                scrollLock3 = true;
                page3++;
                that.getMyPurchaseList(page3, 'myPurchase');
            });
            that.scrollLoad(".mod-last-list", 500, function() {
                if (scrollLock4) return;
                scrollLock4 = true;
                modPage++;
                that.getModRank();
            });
            that.scrollLoad(".user-last-list", 500, function() {
                if (scrollLock5) return;
                scrollLock5 = true;
                userPage++;
                that.getUserRank();
            });
        },
        //获取所有中奖信息
        getAllList(page, tag) {
            const that = this;
            axios.get('/WangCaiActivity/GetPrizeInfo', {
                    params: {
                        activityId: 290,
                        page: page,
                        tag: tag
                    }
                })
                .then(res => {
                    let data = res.data.data.data;
                    //console.log(data);
                    if (data.length > 0) {
                        that.allPrizeList = that.allPrizeList.concat(data)
                        scrollLock1 = false;
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //获取我的中奖记录
        getMyPrizeList(page, tag) {
            const that = this;
            axios.get('/WangCaiActivity/GetPrizeInfo', {
                    params: {
                        activityId: 290,
                        page: page,
                        tag: tag
                    }
                })
                .then(res => {
                    let data = res.data.data.data;
                    //console.log(data);
                    if (data.length > 0) {
                        that.myPrizeList = that.myPrizeList.concat(data)
                        scrollLock2 = false;
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //获取我的夺宝记录
        getMyPurchaseList(page, tag, newData) {
            const that = this;
            axios.get('/WangCaiActivity/GetPrizeInfo', {
                    params: {
                        activityId: 290,
                        page: page,
                        tag: tag
                    }
                })
                .then(res => {
                    let data = res.data.data.data;
                    //console.log(data);
                    if (newData) {
                        that.myPurchaseList.unshift(data[0])
                    } else {
                        if (data.length > 0) {
                            that.myPurchaseList = that.myPurchaseList.concat(data)
                            scrollLock3 = false;
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //ajax获取主播列表
        getModRank() {
            const that = this;
            axios.get('/WangCaiActivity/GetRank', {
                    params: {
                        page: modPage,
                        limit: 20,
                        tag: 'm'
                    }
                })
                .then(res => {
                    let data = res.data.data;
                    //console.log(data);
                    if (data.ranks.length > 0) {
                        that.mRanks = that.mRanks.concat(data.ranks);
                        scrollLock4 = false;
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //ajax获取用户列表
        getUserRank() {
            const that = this;
            axios.get('/WangCaiActivity/GetRank', {
                    params: {
                        page: userPage,
                        limit: 20,
                        tag: 'u'
                    }
                })
                .then(res => {
                    let data = res.data.data;
                    //console.log(data);
                    if (data.ranks.length > 0) {
                        that.uRanks = that.uRanks.concat(data.ranks);
                        scrollLock5 = false;
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //点击主播头像，跳转直播间
        inlive(rid) {
            common.goRoom(rid)
        },
        //点击关注按钮，关注主播
        attention(mid, index) {
            axios.get('/WangCaiActivity/Attention', {
                    params: {
                        mid: mid
                    }
                })
                .then(res => {
                    if (typeof data == 'string') {
                        data = JSON.parse(data)
                    }
                    let _data = res.data;
                    //console.log(_data);
                    if (_data.errno == 0) {
                        this.mRanks[index].is_attention = true
                    } else {
                        layer.open({
                            content: _data.msg,
                            time: 3000,
                            closeBtn: 0
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
})
