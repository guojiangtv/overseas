define(['common', 'layer'], function(require, exports, module){
	var common = require('common'),
		layer = require('layer'),
		platform = common.getPlatformType()

	//关注
	var follow_flag = true
	$('ul').on('click', '.follow_btn', function(){
		if(platform != 'android_webview' && platform != 'ios_webview'){
			location.href = '/download/link';
			return;
		}

		var _this = $(this),
			mid = _this.closest('li').data('mid')
		if(!follow_flag) return
		follow_flag = false

		$.ajax({
			url: '/partyTimeActivity3/love',
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
					if(_this.hasClass('following')){
						_this.text('Following')
					}else{
						_this.text('Follow')
					}
				}else{
					layer.open({
						content: data.msg,
						time: 3
					})
				}	

			}
		})
	})


	//进入个人主页
	$('ul').on('click', '.avatar,.avatar_bg', function(){
		if(platform != 'android_webview' && platform != 'ios_webview'){
			location.href = '/download/link';
			return;
		}
		var _this = $(this),
			mid = _this.closest('li').data('mid')
		common.goPersonalPage(mid);
	})

	//活动规则弹层
	$('.rules_btn').on('click', function(){
		$('.s_layer').show()
	})

	$('.s_layer .close').on('click', function(){
		$('.s_layer').hide();
	})



	var scroll_tag = true,
		page = 0
	window.onscroll = function(){
		var scroll_H = document.body.scrollTop,
			doc_H = document.body.scrollHeight,
			wrap_H = window.innerHeight;
		//限制输出50条数据 新加载4页
		if(page >= 4){return;}
		if(doc_H - scroll_H - wrap_H < 250 && scroll_tag){
			page ++
			scroll_tag = false
			getRank(page)
		}
		
	}

	function getRank(page){

		$.ajax({
			url: '/partyTimeActivity3/getRank',
			data: {page: page},
			type: 'GET',
			dataType: 'JSON',
			beforeSend: function(){
				common.showLoading()
			},
			success: function(data){
				common.hideLoading()
				
				if(typeof data == 'string'){
					data = JSON.parse(data)
				}

				if(data.errno == 0){
					var _html = '';

					for(var i = 0 ,len = data.data.list.length; i < len; i++){
						if(data.data.list[i]['isFollowing']){
							var _follow = '<button class="follow_btn following">Following</button>'
						}else{
							var _follow = '<button class="follow_btn">Follow</button>'
						}
						_html += '<li class="fl" data-mid="'+ data.data.list[i]['mid'] +'">\
									<div class="avatar_wrap">\
										<img src="'+ data.data.list[i]['headPic'] +'" class="avatar">\
										<p class="points">'+ data.data.list[i]['total'] +'</p>\
										<span class="index">'+ (10*page+i+1) +'</span>\
									</div>\
									<div class="info">\
										<p>\
											<span class="nickname">'+ data.data.list[i]['nickname'] +'</span>\
											<span class="level_icon level_icon_'+ data.data.list[i]['level'] +'"></span>\
											'+ _follow +'\
										</p>\
										<p>\
											<span class="time">'+ data.data.list[i]['minuteNumber'] +'</span>\
											<span class="diamond">'+ data.data.list[i]['coinNumber'] +'</span>\
										</p>\
									</div>\
								</li>';
					}
	
					$('.type_3_wrap').append(_html);

					var checkResult = setInterval(function(){
						if($('.type_3_wrap li').length == (10*page+7)){
							scroll_tag = true
							clearInterval(checkResult)
						}
					},200)
				}
			}
		})
	}
})