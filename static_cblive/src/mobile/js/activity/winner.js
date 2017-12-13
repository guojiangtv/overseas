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
			url: '/winnerActivity/love',
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
	$('ul').on('click', '.avatar', function(){
		if(platform != 'android_webview' && platform != 'ios_webview'){
			location.href = '/download/link';
			return;
		}
		
		var _this = $(this),
			mid = _this.closest('li').data('mid')

		common.goPersonalPage(mid);
	})

	//弹层排行
	$('#showAllList').on('click', function(){
		$('.s_layer').show()
		$('.s_layer .list_wrap ul').html('')
		$('body').css('overflow','hidden')
		getRank(0)
	})

	$('.s_layer .close').on('click', function(){
		page = 0;

		$('.s_layer').hide();
		$('.list_wrap ul').html('');
		$('body').css('overflow','auto')
	})

	var scroll_tag = true,
		page = 0
	$('.list_wrap').on('scroll', function(){
		var scroll_H = $('.list_wrap').scrollTop(),
			doc_H = $('.list_wrap ul').height(),
			wrap_H = $('.list_wrap').height()

		if(doc_H - scroll_H - wrap_H < 50 && scroll_tag){
			page++

			scroll_tag = false
			getRank(page)
		}
	})

	function getRank(page){

		$.ajax({
			url: '/winnerActivity/getRank',
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

					for(var i = 0; i < data.data.list.length; i++){
						if(data.data.list[i]['isFollowing']){
							var _follow = '<button class="follow_btn following">Following</button>'
						}else{
							var _follow = '<button class="follow_btn">Follow</button>'
						}
						_html += '<li class="clearfix" data-mid="'+ data.data.list[i]['mid'] +'">\
									<span class="index fl">'+ (10*page+i+1) +'</span>\
									<img src="'+ data.data.list[i]['headPic'] +'" class="avatar fl">\
									<div class="desc fl">\
										<p><span>'+ data.data.list[i]['nickname'] +'</span><span class="level_icon level_icon_'+ data.data.list[i]['level'] +'"></span></p>\
										<p>'+ data.data.list[i]['number'] +'</p>\
									</div>\
									'+ _follow +'\
								</li>';
					}
	
					$('.s_layer .list_wrap ul').append(_html);

					var checkResult = setInterval(function(){
						if($('.s_layer .list_wrap ul li').length == 10*(page+1)){
							scroll_tag = true
							clearInterval(checkResult)
						}
					},200)
				}
			}
		})
	}
})