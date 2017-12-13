define(['common','bodymovin'], function(require, exports, module) {
    var common = require('common');

    var spiritsWrap = $('.pl_spirits_wrap');
    var copyDataArr = [];
    var closeViewST = [];
    var closeST9;

    var gridPoint = []; //礼物格子

    var dayST;
    var btnSTend;
    var closeAllST;

    //倒计时和礼物都是svg动图
    var svgGiftData = []; 
    var svgGiftLock = false;


    //没有元素&关闭webview
    function noneEleCloseView () {
        common.closeActWebview('.pl_spirits_wrap',function(){
            //格子数组清空
            gridPoint = [];
            //定时器关闭
            clearTimeout(closeST9);
            closeViewST.forEach(function(value){
                clearTimeout(value);
            });
        });
    }
    //点击精灵：消失&判断关闭webview
    function clickAllClose (ele) {
        (function(_ele){
            setTimeout(function(){
                _ele.remove();
                noneEleCloseView();
            },1500);
        })(ele);
    }

    function goLotteryTimeMachine(obj, animateData,cb) {
        //cnzz统计
        _czc.push(["_trackEvent", "炸房活动ID" + animateData['activityId'] + " app", "参与抽奖的用户"]);
        $.ajax({
            type: 'GET',
            url: 'http://m.kuaishouvideo.com/lottery/goLottery',
            dataType: 'jsonp',
            jsonpCallback:'callback',
            data: { animate_data: animateData },
            beforeSend: function() {
                var hint_font = animateData['activityType'] == 1 ? '秒杀中...' : '抽奖中...';
                obj.append('<em class="lottery_hint">' + hint_font + '</em>');
            },
            success: function(data) {
                $('.lottery_hint').remove();
                if(typeof cb === 'function') cb();
                if (data.errno == 0) {
                    // 判断是否抽取背包物品
                    if (data.data.addPackageGift) {
                        // 版本号小于 2.8.5 不支持背包
                        var version = common.getVersion();
                        if (parseInt(version.replace(/\./g, '')) < 285) {
                            obj.append('<em>请移步V2.8.5及以上版本app端<br>查看背包礼物</em>');
                        } else {
                            obj.append('<em>+' + data.data.prizeName + '</em>');
                        }
                        common.refreshBackpack();
                    } else if (data.data.addCoin) {
                        var addCoin = data.data.addCoin.toString();
                        //抽中奖品
                        obj.append('<em>+' + data.data.prizeName + '</em>');
                        common.refreshCoin(addCoin);
                    } else if(data.data.prizeId==0){
                        obj.append('<em>卧槽，没中！</em>');
                    }

                } else {
                    //没抽中
                    if (animateData['spiritsClass'] && animateData['spiritsClass'] == 'week_star') {
                        obj.append('<em>卧槽，没中！</em>');
                    } else {
                        data.msg == '101 格子不足' ? obj.append('<em>背包已满，请先腾空后再来领取哦~</em>') : obj.append('<em>卧槽，没中！</em>');
                    }
                }
            }
        });
    }

    //倒计时和礼物都是svg动效
    function lotteryClick(animateData,cb) {
        cb && cb(10);
        //cnzz统计
        // _czc.push(["_trackEvent", "炸房活动ID" + animateData['activityId'] + " app", "参与抽奖的用户"]);
        // $.ajax({
        //     type: 'GET',
        //     url: 'http://m.kuaishouvideo.com/lottery/goLottery',
        //     dataType: 'jsonp',
        //     jsonpCallback:'callback',
        //     data: { animate_data: animateData },
        //     success: function(data) {
        //         cb && cb(data);
        //     }
        // });
    }



    (function(){

        /**
         * 初始化精灵图点击事件
         * 每个精灵图有一个公共的css类 spirite_box
         */
        spiritsWrap.on('click', '.spirite_box', function() {
            //抽奖
            var _this = $(this);

            //点击精灵图
            if (!_this.hasClass("boom-out")) {
                var copyAniData,
                    thisBatchId = _this.data('batchid');

                _this.removeClass("shake-to-out");
                if (thisBatchId == 1) {
                    copyAniData = copyDataArr.pop();
                    _this.css("zIndex","9998");
                    goLotteryTimeMachine(_this, copyAniData,function(){
                        _this.addClass("boom-out");
                        clickAllClose(_this);
                    });
                    return;
                };

                clickAllClose(_this);
                _this.css("zIndex","9900");
                _this.addClass('newboom').addClass("boom-out");
            }

        });

        $('.close').click(function() {
            spiritsWrap.empty();
            noneEleCloseView();
        });

    })();
    exports.showSpiritsAnimation = showSpiritsAnimation;
    function showSpiritsAnimation (config) {
        var data = config.data;
        copyDataArr.push(data);

        //倒计时
        if(config.timeModel === 'svg'){
            if(config.timeClick){
                //倒计时和礼物都是svg
                svgAni(config.loadTime, 10000);
                svgTimeClick(config.data);
                setTimeout(function(){
                    svgGiftData.push(config.data);
                },4500);
                return;
            }else{
                //倒计时是svg
                svgAni(config.loadTime,3000);
            }
        }else{
            clearTimeout(dayST);
            dayST = setTimeout(function(){
                $(".act-load-time").remove();
            },3000);

            addTimeModelAni(config);
        }
        //掉落礼物
        dropGiftST(config.spirit, config.flex);

        //9秒后移除webview所有
        clearTimeout(closeST9);
        closeST9 = setTimeout(function(){
            $(".spirite_box").remove();
            noneEleCloseView();
        },9000);
    }
    //svg动画
    var bodymovinST;
    var svgAniObj = undefined;
    function svgAni(path,time){
        clearTimeout(bodymovinST);
        $(".cover-bg").remove();
        $(".pl_spirits_wrap").append('<div class="cover-bg"></div>');
        var svgWrap = document.querySelector(".cover-bg");
        svgAniObj = bodymovin.loadAnimation({
            wrapper: svgWrap,
            animType: 'svg',
            loop: false,
            autoplay: true,
            path: path
        });
        bodymovinST = setTimeout(function(){
            $(".cover-bg").remove();
            svgAniObj = undefined;
            noneEleCloseView();
        },time);
    }

    //svg动效n毫秒后可点击
    var svgPrizeST = 0;
    function svgTimeClick(){
        //连续炸房，则关闭中奖框
        $(".svg-prize").remove();
        clearTimeout(svgPrizeST);

        if($("#svg-timeclick").length > 0) return;
        var str =' \
            <div id="svg-timeclick">\
            </div>';
        $(".cover-bg").append(str);

        //click抢克拉
        $("#svg-timeclick").click(function(){
            if(svgGiftData.length === 0 || svgGiftLock) return;
            svgGiftLock = true;
            var data = svgGiftData.shift();
            lotteryClick(data,function(result){
                clearTimeout(svgPrizeST);
                svgPrizeST = setTimeout(function(){
                    //抽奖1.5秒后弹框消失
                    if(svgGiftData.length === 0){
                        $(".cover-bg").remove();
                    }else{
                        $(".svg-prize").remove();
                    }
                    noneEleCloseView();
                },1500);
                svgGiftLock = false;
                var prizeStr = '<div class="svg-prize"><p>Plus '+result+' coins</p></div>';
                $("#svg-timeclick").html(prizeStr);
            });
        });
    }


    //倒计时动画模式
    function addTimeModelAni (config) {
        var loadTimeEle = document.createElement("div");
        loadTimeEle.className = "act-load-time";
        loadTimeEle.innerHTML = config.loadTime;
        document.querySelector(".pl_spirits_wrap").appendChild(loadTimeEle);
        var nodes = loadTimeEle.childNodes;

        var aniIndex = 0;
        for(var i = 0, len = nodes.length; i < len; i++){
            if(nodes[i].nodeType == 1){
                /*倒计时缩放模式*/
                if(config.timeModel === 'scale'){
                    nodes[i].className += ' scale-ani-'+(++aniIndex)+'';
                }
            }
        }
    }

    function dropGiftST (spirit,flex) {

        var spiritST = setTimeout(function(){
            new BounceSpirits(spirit,flex);
        },3000);

        closeViewST.push(spiritST);
    }

    function BounceSpirits (spirit,flex) {
        this.spirit = spirit;
        this.spiritWrap = spirit.shift();
        this.spirits_type_num = spirit.length;
        this.prizeIndex = 0;
        this.pointArr = [];
        this.SPIRITS_NUM = 3;
        this.IMG_W = 60;
        this.IMG_H = 60;
        this.FLEX = flex;
        this.init();
    }

    BounceSpirits.prototype.init = function () {
        this.prizeIndex = parseInt(Math.random()*this.SPIRITS_NUM);
        this.generatorSpirits();
    }
    BounceSpirits.prototype.generatorSpirits = function () {
        for(var i = 0; i < this.SPIRITS_NUM; i++){
            var currentIndex = parseInt(Math.random()*this.spirits_type_num);
            var spiritDom = document.createElement('div');
            spiritDom.className = "spirite_box shake-to-out "+this.spiritWrap+" "+this.spirit[currentIndex]+"";

            var pointXY = this.getRandomXY();
            spiritDom.style.left = pointXY.left + 'px';
            spiritDom.style.top = pointXY.top + 'px';
            if(this.prizeIndex === i) spiritDom.setAttribute("data-batchid",1);
            else spiritDom.setAttribute("data-batchid",0);

            spiritsWrap.append(spiritDom);
        }
    }
    BounceSpirits.prototype.getRandomXY = function () {
        var gridLen = gridPoint.length;
        if(gridLen === 0){
            var w = window.innerWidth;
            var h = window.innerHeight;
            var canvasWidth = w;
            var canvasHeight = h;
            var gridW = this.IMG_W+this.FLEX;
            var gridH = this.IMG_H+this.FLEX;
            var row = parseInt(canvasHeight/(gridH));
            var col = parseInt(canvasWidth/(gridW));

            var arr = [];
            for(var i = 0; i < col; i++){
                for(var j = 0; j < row; j++){
                    arr.push({
                        row: j * gridH,
                        col: i * gridW
                    });
                }
            }
            gridPoint = arr;
            gridLen = gridPoint.length;
        }
        var index = parseInt(Math.random()*gridLen);
        var gridSelect = gridPoint.splice(index,1)[0];

        return {
            left: gridSelect.col,
            top: gridSelect.row
        };
    }
});
