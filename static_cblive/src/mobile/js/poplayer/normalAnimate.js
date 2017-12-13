define(['common'], function(require, exports, module){
	var common = require('common');

    var na_timeout; 

    var fontSize = document.querySelector("html").style.fontSize.replace("px","")-0;
    var imgMarginTop = -107*fontSize/32;

    //初始化 gif 动图，渲染到页面里面
    exports.initAnimation = initAnimation;

    // $('.close').click(function() {
    //     common.closeWebview();
    // });
    
    //图片加载成功后
    function imgPrevLoad (config, callback) {

        var hash = config.hash || false;

        var imgArr = config.imgArr || [];

        var tempLen = imgArr.length;

        var hashImgBox = [];

        imgArr.forEach(function(value,index) {

            var IMG = document.createElement("img");

            if (hash) {
                value += '?vs='+(new Date().getTime())+'';
            }

            IMG.src = value;

            hashImgBox.push(value);

            IMG.onload = function () {

                tempLen--;

                if (tempLen === 0) {

                    callback(hashImgBox);

                }
            }
        });
    }


    function initAnimation(data){

        var wrap = $('.pl_spirits_wrap'),
            caishen_animation_html = '<div class="animation_alone_wrap caishen">\
                                <img src="http://static.guojiang.tv/mobile/img/poplayer/backpack/167_2.png" class="animation_bg caishen_bg">\
                                <img src="http://static.guojiang.tv/mobile/img/poplayer/backpack/167_1.png">\
                            </div>',
            chicken_animation_html = '<div class="animation_alone_wrap">\
                <img src="http://static.guojiang.tv/mobile/img/poplayer/backpack/chicken_bg.gif" class="animation_bg">\
                <img src="http://static.guojiang.tv/mobile/img/poplayer/backpack/169_1.png" >\
            </div>';


        // 添加获得信息
        $('.animation_alone_wrap').remove();
        if(data.pid == 167){
            wrap.append(caishen_animation_html);
        }else if(data.activityId == 113){
            boomGif(
                wrap,
                'http://static.guojiang.tv/mobile/img/poplayer/backpack/tomato.gif',
                'false'
            );
            return;

        }else if(data.activityId == 123 || data.activityId == 124){
            boomGif(
                wrap,
                'http://static.guojiang.tv/mobile/img/poplayer/dakang/beiguo.gif',
                'false'
            );
            return;
        }else{
            wrap.append(chicken_animation_html);
        }

        clearTimeout(na_timeout);
        na_timeout = setTimeout(function(){
            //记录礼物特效的定时器
            $('.animation_alone_wrap').remove();
            clearTimeout(na_timeout);

            //炸房元素也不存在时，关闭webview
            if( $('.pl_spirits_wrap').children().length == 0){
                common.closeWebview();
            }
            
        }, 4000);
        
    }


    //—————————————————— 普通炸弹触发函数
    /*
    *parameter: ele是一已经创建了的的div元素直接用之，一张imgUrl图片的地址，hash代表是否重复请求imgUrl。
    */
    function boomGif (ele,imgUrl,hash) {
        var _hash = hash || false;
        var _ele = ele;
        var config = {
            hash:_hash,
            imgArr:[imgUrl]
        }
        
        imgPrevLoad(config,function(data){

            var tomatoFools = '<div class="animation_alone_wrap">\
                <img src="'+data[0]+'" class="animation_bg">\
            </div>';

            _ele.append(tomatoFools);
            clearTimeout(na_timeout);
            na_timeout = setTimeout(function(){
                //记录礼物特效的定时器
                $('.animation_alone_wrap').remove();
                clearTimeout(na_timeout);

                //炸房元素也不存在时，关闭webview
                if( $('.pl_spirits_wrap').children().length == 0){
                    common.closeWebview();
                }
                
            }, 4000);

        });
    }





});