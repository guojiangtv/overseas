seajs.config({
    base : 'http://static.cblive.tv/dist/mobile/',
    alias : {
        'zepto' : 'js/common/zepto.min.js',
        'upload' : 'js/component/gj.upload.js',
        'common' : 'js/common/common.js?v=1121',
        'cookie' : 'js/common/jquery.cookies.js',
        'swfobject' : 'js/common/swfobject.js',
        'iscroll' : 'js/common/iscroll.min.js',
        'wechatshare' : 'js/common/jweixin-1.0.0.js',
        'touch' : 'js/common/touch.js',
        'fx' : 'js/common/fx.js',  
        'jcrop' : 'js/component/jquery.Jcrop.min.js',
        'cropper' : 'js/component/cropper.min.js',
        'layer' : 'js/component/layer.m.js?v=0531',
        'canvas2image' : 'js/component/canvas2image.js',
        'photoswipe' : 'js/component/photoswipe.min.js',
        'photoswipe_ui' : 'js/component/photoswipe-ui-default.min.js',
        'swiperAnimate' : 'js/component/swiper.animate1.0.2.min.js',
        'swiper' : 'js/component/swiper.jquery.min.js?v=1107',
        'lazyload' : 'js/component/jquery.lazyload.min.js?v=0911',
        'room' : 'js/room.js?v=1034',
        'midAutumn' : 'js/activity/midAutumn.js?v=0925',
        'sendFlow' : 'js/activity/sendFlow.js?v=20150925',
        'exchangeFlow' : 'js/activity/exchangeFlow.js?v=0925',
        'laypage' : 'js/activity/expression/laypage.js',
        'bodymovin':'js/common/bodymovin.min.js'
    }
});

//cnzz统计，声明_czc对象:
var _czc = _czc || [];
_czc.push(["_setAccount", "1255976554"]);


//快速点击，消灭300ms
$(function() {
  FastClick.attach(document.body);
});

//页面出来之前显示load状态
//呈现loading效果
  var loadHtml = '<img src="http://static.cblive.tv/dist/mobile/img/common/loading.png" id="pageLoading" class="alertLoding">';
  document.write(loadHtml);

  //监听加载状态改变
  document.onreadystatechange = completeLoading;

  //加载状态为complete时移除loading效果
  function completeLoading() {
      if (document.readyState == "complete") {
          var loadingMask = document.getElementById('pageLoading');
          loadingMask.parentNode.removeChild(loadingMask);
      }
  }
