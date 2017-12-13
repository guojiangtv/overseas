define(['wechatshare','common'],function(require, exports, module){

    var wx = require('wechatshare'),
        common = require('common');
    
    var share_url = encodeURIComponent(location.href.split('#')[0]),
        share_data;

    if( typeof(gjShareParam) == 'undefined' ){
        var wxShareParam = {
            title: '果酱直播',
            content: '中国唯一华裔美少年偶像社区',
            link: location.href,
            imgLink: 'http://static.cblive.tv/dist/mobile/img/common/touch_icon.png'
        }
    }else{
        var wxShareParam = JSON.parse(gjShareParam);
    }

    $.ajax({
        url : '/mobile/getShareArgv?url='+share_url,
        type : 'POST',
        dataType : 'JSON',
        success : function(data){
            if( typeof(data) != 'object' ){
                var data = eval('(' + data + ')');
            }

            share_data = data.data;

            var paras = {
                images: wxShareParam.imgLink,
                title:wxShareParam.title,
                url: share_data['url'],
                summary:wxShareParam.content,
                comment:wxShareParam.content 
            };

            wx.config({
                debug: false,
                appId: share_data['appid'],
                timestamp: share_data['timestamp'],
                nonceStr: share_data['noncestr'],
                signature: share_data['signature'],
                jsApiList: [
                    'onMenuShareTimeline', 'onMenuShareAppMessage','onMenuShareQQ','onMenuShareQZone'
                ]   
            });
            wx.ready(function () {
                wx.onMenuShareTimeline({
                    title: paras.comment, // 分享标题
                    link: paras.url, // 分享链接
                    imgUrl: paras.images, // 分享图标
                    success: function (e) {
                        // 用户确认分享后执行的回调函数
                       
                        //alert(JSON.stringify(e)+'success share');
                        common.onWxShareSuccess(JSON.stringify(e));
                    },
                    cancel: function (e) {
                        // 用户取消分享后执行的回调函数
                        //alert(JSON.stringify(e)+'cancel share');
                        common.onWxShareCancel(JSON.stringify(e));
                    }
                });

                wx.onMenuShareAppMessage({
                    title: paras.title, // 分享标题
                    desc: paras.summary, // 分享描述
                    link: paras.url, // 分享链接
                    imgUrl: paras.images, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function (e) {
                        // 用户确认分享后执行的回调函数
                        // alert(JSON.stringify(e)+'success send');
                        common.onAppShareSuccess(JSON.stringify(e));
                    },
                    cancel: function (e) {
                        // 用户取消分享后执行的回调函数
                        common.onAppShareCancel(JSON.stringify(e));
                    }
                });
                
                wx.onMenuShareQQ({
                    title: paras.title, // 分享标题
                    desc: paras.comment, // 分享描述
                    link: paras.url, // 分享链接
                    imgUrl: paras.images, // 分享图标
                    success: function (e) {
                        // 用户确认分享后执行的回调函数
                       // alert(JSON.stringify(e)+'success send qq');
                       common.onQqShareSuccess(JSON.stringify(e));
                    },
                    cancel: function (e) {
                        // 用户取消分享后执行的回调函数
                        common.onQqShareCancel(JSON.stringify(e));
                    }
              });     
              wx.onMenuShareQZone({
                    title: paras.title, // 分享标题
                    desc: paras.comment, // 分享描述
                    link: paras.url, // 分享链接
                    imgUrl: paras.images, // 分享图标
                    success: function (e) { 
                       // 用户确认分享后执行的回调函数
                       // alert(JSON.stringify(e)+'success send Qzone');
                       common.onQzoneShareSuccess(JSON.stringify(e));
                    },
                    cancel: function (e) { 
                        // 用户取消分享后执行的回调函数
                        common.onQzoneShareCancel(JSON.stringify(e));
                    }
                }); 

            }); 
        } //success
    });//ajax
  
})


$(function(){
    setTimeout(function(){
        try{
            gBridge.setShareData(gjShareParam);
        }catch(e){}
        
    },500);
})