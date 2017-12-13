/*
* config配置参数:
*   data：炸房下发的data
*   spirit: spirit[0]精灵图公共类背景图片，spirit[i]单个精灵图背景定位（不限个数）
*   loadTime：倒计时类，用于添加到页面生成倒计时的字符串(不需要定位css)
*   timeModel: 倒计时动画模式:{scale:3.2.1倒计时缩放; svg: svg动效地址}
*   flex：图片大小间隔，图片常量60*60,如果图片是100*100，flex应为40(可适当缩小).ps:flex<=100
*/
var ar = {};
/*第一种模式 倒计时是图片，礼物是雪碧图*/
ar.stealHeart = function (data) {
    var config = {
        data:data,
        spirit: ["gift-sprite","gift-sprite-1","gift-sprite-2","gift-sprite-3"],
        loadTime: timeLoadLast(),
        timeModel: "scale",
        flex: 40
    }

    function timeLoadLast(){
        var str = '\
                    <div class="time-load-sprite-1 time-load-sprite"></div>\
                    <div class="time-load-sprite-2 time-load-sprite"></div>\
                    <div class="time-load-sprite-3 time-load-sprite"></div>\
                ';
        return str;
    }
    return config;
}

/*第三种模式 倒计时和动效都是svg*/
ar.christmas = function (data) {
    var config = {
        data:data,
        timeClick: 5, //几秒后可以点击
        loadTime: "http://static.cblive.tv/src/mobile/img/poplayer/christmas/data.json",
        timeModel: "svg",
    }
    return config;
}