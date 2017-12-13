define(['common', 'layer'], function(require, exports, module){
	var common = require('common'),
		layer = require('layer'),
		platform = common.getPlatformType();

	if(uid == '-1'){
		common.goLogin();
		return;
	}

	//点击star/moon/sun图标切换显示
	$('.gifts').on("click", 'dl', function(){
		var i = $(this).index(),
			siblings = $(this).parent().siblings('.tab-box');
		siblings.children('.gifts-btn').children().eq(i).addClass("on").siblings().removeClass('on');
		siblings.children('.tab-content').eq(i).removeClass('hide').siblings('.tab-content').addClass("hide");
		// $('.gifts-btn').children().eq(i).addClass("on").siblings().removeClass('on');
		//$('.tab-content').eq(i).removeClass('hide').siblings('.tab-content').addClass("hide");
	})

	//点击star/moon/sun文字切换显示
	$('.gifts-btn').on("click", 'li', function(){
		$(this).addClass("on").siblings().removeClass("on");
		var i = $(this).index();
		$(this).parent().siblings('.tab-content').eq(i).removeClass('hide').siblings('.tab-content').addClass("hide");
	})

	//weekly Receiver 切换
	$('.btn-weekly').on("click",'p',function(){
		$(this).removeClass('opacity').siblings().toggleClass("opacity");
		$(this).parent().siblings('.btn-bg').toggleClass("move");
		var i = $(this).index();
		$(this).parents('.btn-weekly').siblings('.list').eq(i).removeClass('hide').siblings('.list').addClass("hide");
		
	})
	// $('#weeklyReceivers').click(function(){
	// })
	// $('#weeklyGifters').click(function(){
	// 	$(this).removeClass('opacity').siblings().toggleClass("opacity");
	// 	$(this).parent().siblings('.btn-bg').css("left","50%");
	// })


	//点击follow关注
	var follow_flag = true
	$('.tab-content').on('click', '.btn-follow', function(){
		// if(platform != 'android_webview' && platform != 'ios_webview'){
		// 	location.href = '/download/link';
		// 	return;
		// }

		var _this = $(this),
			mid = _this.closest('li').data('mid')
		if(!follow_flag) return
		follow_flag = false

		$.ajax({
			url: '/lightUpSkyActivity/love',
			data: {mid: mid},
			type: 'GET',
			dataType: 'JSON',
			beforeSend: function(){
				common.showLoading()
			},
			success: function(data){
				common.hideLoading()
				follow_flag = true
				if(typeof data == 'string'){
					data = JSON.parse(data)
				}
				if(data.errno == -100){
					common.goLogin()
				}else if(data.errno == 0){
					_this.toggleClass('following')
				}else{
					layer.open({
						content: data.msg,
						time: 3
					})
				}	

			}
		})
	})


	//点击头像或昵称进入个人主页
	$('.tab-content').on('click', '.avatar,.nickname', function(){
		// if(platform != 'android_webview' && platform != 'ios_webview'){
		// 	location.href = '/download/link';
		// 	return;
		// }
		
		var _this = $(this),
			mid = _this.closest('li').data('mid')
		common.goPersonalPage(mid);
	})

	//活动规则弹层
	$('#rules_btn').click(function(){
		$('.s_layer').removeClass("hide");
	})
	$('.s_layer .close').on('click', function(){
		$('.s_layer').addClass("hide");
	})

	//点击see more加载4~10条内容
	$('.btn-more').click(function(){
		var _this = $(this);

		if(_this.hasClass('close')){
			_this.closest('.tab-content').find('.top-list').hide()
		}else{
			_this.closest('.tab-content').find('.top-list').show()
		}
		_this.toggleClass('close');
	})



})