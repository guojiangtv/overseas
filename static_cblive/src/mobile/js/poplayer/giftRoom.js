define(['bodymovin'],function(require, exports, module){
    var common = require('common');
    var countAct = 0,
        copyemperorPostData = [],
        emperorPostData = [];
    var animItem,
        st30;
    var emperorClickLock = false;

    function init (data) {
        countAct++;
        copyemperorPostData.push(data);
        setTimeout(function(){
            emperorPostData.push(copyemperorPostData.pop());
        },3000);
        svgAni();
    }

    function svgAni () {
        //30秒关闭svg
        clearTimeout(st30);
        st30 = setTimeout(function(){
            destroy();
        },30000);
        //生成svg动画
        if(!!animItem) return animItem.goToAndPlay(0,false);
        //生成页面可点击元素
        safeClickEle();

        var svgWrap = document.querySelector("#svgContainer");
        animItem = bodymovin.loadAnimation({
            wrapper: svgWrap,
            animType: 'svg',
            loop: false,
            autoplay: true,
            path: 'http://static.guojiang.tv/src/mobile/js/poplayer/emperor/json/redpack.json'
        });
        
    }
    //点击抢炮炮
    function lotteryClick () {
        if(emperorPostData.length===0 || emperorClickLock) return;
        emperorClickLock = true;

        var animateData = emperorPostData.pop();

        //cnzz统计
        if(typeof _czc !== 'undefined') _czc.push(["_trackEvent", "炸房活动ID" + animateData['activityId'] + " app", "参与抽奖的用户"]);

        sendGiftXHR(animateData);
    }
    //点击确定
    function sureLottery (event) {
        countAct--;
        emperorClickLock = false;
        if(countAct == 0){
            destroy();
        }else{
            $(".center-bg").hide();
        }
        event.stopPropagation();
        event.preventDefault();
    }
    function sendGiftXHR (animateData) {
        
        $.ajax({
            type: 'GET',
            url: 'http://m.kuaishouvideo.tv/lottery/goLottery',
            dataType: 'jsonp',
            jsonpCallback:"callback",
            data: { animate_data: animateData },
            success: function(data) {

                if($(".center-bg").length == 0) safeClickEle();

                $(".center-bg").show();
                var obj =  $(".center-bg p");
                if (data.errno == 0) {
                    // 判断是否抽取背包物品
                    if (data.data.addPackageGift) {
                        // 版本号小于 2.8.5 不支持背包
                        var version = common.getVersion();
                        if (parseInt(version.replace(/\./g, '')) < 285) {
                            obj.html('请移步V2.8.5及以上版本app端<br>查看背包礼物');
                        } else {
                            obj.html('恭喜你抢到<i>' + data.data.prizeName + '</i>');
                        }
                        common.refreshBackpack();
                    } else if (data.data.addCoin) {
                        var addCoin = data.data.addCoin.toString();
                        //抽中奖品
                        obj.html('恭喜你抢到<i>' + data.data.prizeName + '</i>');
                        common.refreshCoin(addCoin);
                    } else if(data.data.prizeId==0){
                        obj.html('今日手气不佳');
                    }
                } else {
                    //没抽中
                    if (data.msg == '101 格子不足') {
                        obj.html('背包已满，请先腾空后再来领取哦~');
                        return;
                    }
                    obj.html('今日手气不佳');
                }
            },
            error:function(err){
                $(".center-bg").show();
                $(".center-bg p").html(err.msg);
            }
        });
    }
    //webview点不动，可能是因为页面元素被销毁了，保障一定有
    function safeClickEle () {
        $("#svgContainer").remove();
        var str =' \
            <div id="svgContainer">\
                <div class="conver-bg">\
                    <div class="center-bg">\
                        <p></p>\
                        <div class="center-bg-btn">确定</div>\
                    </div>\
                </div>\
            </div>';
        $(".pl_spirits_wrap").append(str);

        //click抢泡泡
        $(".conver-bg").click(function(){
            lotteryClick();
        });
        //点击确定
        $(".center-bg-btn").click(function(event){
            sureLottery(event);
        });
    }


    function destroy () {
        $("#svgContainer").remove();
        animItem = undefined;
        countAct = 0;
        copyemperorPostData = [];
        emperorPostData = [];
        clearTimeout(st30);

        common.closeActWebview(".pl_spirits_wrap",function(){

        });
    }

    function giftRoom(data) {
        init(data);
    }
    exports.giftRoom = giftRoom;


    (function(){
        $('.close').click(function() {
            $(".pl_spirits_wrap").empty();
            destroy();
        });
    })();

});