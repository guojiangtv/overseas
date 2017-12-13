define(['common', 'layer', 'fx', 'bodymovin'], function(require, exports, module) {
	var common = require('common'),
		layer = require('layer'),
		platform = common.getPlatformType();

	var currentPosition,
		timer,
		animItem,
		animTime,
		mScrollLock = false,
		uScrollLock = false,
		lotteryResult = '';

	//平台跳转
	function platformChange() {
		if (platform != 'android_webview' && platform != 'ios_webview') {
			location.href = '/download/link';
			return;
		}
	}
	//滚动条向上滚动
	function toTop() {
		currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
		currentPosition -= 100; //控制步长
		if (currentPosition > 0) {
			window.scrollTo(0, currentPosition);
		} else {
			window.scrollTo(0, 0);
			clearInterval(timer);
		}
	}
	//播放svg
	function playSvg(svgData) {
		animItem = bodymovin.loadAnimation({
			wrapper: svgContainer,
			animType: 'svg',
			loop: false,
			autoplay: true,
			path: svgData,
			complete: setTimeout(destory, 1500)
		});
	}
	//销毁动画
	function destory() {
		animItem.destroy();
		$('#svgContainer').css("height", "0");
		if (lotteryResult) {
			lotteryMsg("Wow! Congratulations! You've won " + lotteryResult + "！", "YES")
		} else {
			lotteryMsg("Sorry you didn't win, try one more time!", "OK");
		}
	}
	//滚动加载绑定
	function scrollLoad(ele, bottomHeight, callback) {
		var _ele = document.querySelector(ele);
		var cliHeight = _ele.clientHeight;
		var bH = bottomHeight || 100;
		var scrollTop = _ele.scrollTop;
		var scrollHeight = _ele.scrollHeight;
		_ele.addEventListener('scroll', function() {
			cliHeight = _ele.clientHeight;
			scrollTop = _ele.scrollTop;
			scrollHeight = _ele.scrollHeight;
			if (scrollHeight - cliHeight - scrollTop < bH) {
				callback();
			}
		}, false);
	}
	//翻页加载主播内容
	function getModRank(page) {
		$.ajax({
			url: '/ChristmasActivity/GetModRank',
			data: { page: page },
			type: 'GET',
			dataType: 'JSON',
			beforeSend: function() {
				common.showLoading()
			},
			success: function(data) {
				// console.log(data);
				common.hideLoading()
				mScrollLock = false;
				if (typeof data == 'string') {
					data = JSON.parse(data)
				}
				if (data.errno == 0) {
					var _html = _isFollowing = _isPlaying = '';
					for (var i = 0, len = data.data.list.length; i < len; i++) {
						if (data.data.list[i]['isFollowing']) {
							_isFollowing = '<span class="follow_btn following">Following</span>'
						} else {
							_isFollowing = '<span class="follow_btn nofollow">Follow</span>'
						}
						if (data.data.list[i]['isPlaying']) {
							_isPlaying = '<span class="live">LIVE</span>'
						}
						_html += '<li data-id="'+data.data.list[i]['mid']+'">\
                                    <div class="index">' + (10 * page + i + 1) +
							'</div>\
                                    <div class="info">\
                                        <span class="crown"></span>\
                                        <div class="avatar_wrap">\
                                            <img src="' + data.data.list[i]
							['headPic'] + '" class="avatar">\
                                        </div>' +
							_isPlaying + '\
                                        <div class="total_num">' + data.data.list[i][
								'total'
							] +
							'</div>\
                                        <p>\
                                            <span class="nickname">' +
							data.data.list[i]['nickname'] + '</span>' +
							_isFollowing +
							'\
                                        </p>\
                                    </div>\
                                    <ul class="receive">\
                                        <li><span class="gift_human"></span><span>' +
							data.data.list[i][
								'gift53'
							] +
							'</span></li>\
                                        <li><span class="gift_tree"></span><span>' + data.data
							.list[i][
								'gift54'
							] +
							'</span></li>\
                                        <li><span class="gift_car"></span><span>' + data.data
							.list[i][
								'gift55'
							] +
							'</span></li>\
                                    </ul>\
                                </li>';
					}
					$('.mRank').append(_html);
				}
			}
		})
	}
	//翻页加载用户内容
	function getUserRank(page) {
		$.ajax({
			url: '/christmasActivity/GetUserRank',
			data: { page: page },
			type: 'GET',
			dataType: 'JSON',
			beforeSend: function() {
				common.showLoading()
			},
			success: function(data) {
				// console.log(data);
				common.hideLoading()
				uScrollLock = false;
				if (typeof data == 'string') {
					data = JSON.parse(data)
				}
				if (data.errno == 0) {
					var _html = _isFollowing = '';
					for (var i = 0, len = data.data.list.length; i < len; i++) {
						if (data.data.list[i]['isFollowing']) {
							_isFollowing = '<span class="follow_btn following">Following</span>'
						} else {
							_isFollowing = '<span class="follow_btn nofollow">Follow</span>'
						}
						_html += '<li data-id="' +
							data.data.list[i]['uid'] + '">\
                                    <div class="index">' + (10 * (page + 1) + i + 1) +
							'</div>\
                                    <div class="info">\
                                        <div class="avatar_wrap" >\
                                            <img src="' + data.data.list[i]
							['headPic'] +
							'" class="avatar">\
                                        </div>\
                                        <div class="content">\
                                            <p>\
                                                <span class="nickname">' +
							data.data.list[i]['nickname'] +
							'</span>\
                                                <span class="level_icon level_icon_' + data.data.list[
								i]['level'] +
							'"></span>\
                                            </p>\
                                            <p class="sent_num">Sent ' +
							data.data.list[i]['total'] + '</p>\
                                        </div>' +
							_isFollowing + '\
                                    </div>\
                                </li>';
					}
					$('.uRank').append(_html);
				}
			}
		})
	}
	//关注主播
	function addAttention(ele, mid) {
		$.ajax({
			type: "GET",
			url: "/ChristmasActivity/Attention",
			dataType: "json",
			data: {
				mid: mid
			},
			beforeSend: function() {
				common.showLoading()
			},
			success: function(data) {
				common.hideLoading()
				if (data.errno == -100) {
					common.goLogin()
				} else if (data.errno == 0) {
					ele.removeClass('nofollow').addClass('following').text('Following').unbind('click')
				} else {
					layer.open({
						content: data.msg,
						time: 3
					})
				}
			},
			error: function(err) {
				console.log(err);
			}
		})
	}
	//预加载动画图片
	function preloadImg() {
		var img, i;
		for (i = 0; i < 15; i++) {
			img = document.createElement('img');
			img.src = 'http://static.cblive.tv/dist/mobile/img/activity/christmas/socks/images/img_' + i + '.png';
		}
	}
	//发起抽奖请求
	function getLotteryResult(lotteryId) {
		$.ajax({
			type: "GET",
			url: "/ChristmasActivity/GetLotteryResult",
			data: {
				lotteryId: lotteryId
			},
			dataType: "json",
			success: function(data) {
				console.log(data);
				if (data.data.result.prizeName) {
					lotteryResult = data.data.result.prizeName;
				} else {
					lotteryResult = '';
				}
			},
			error: function(err) {
				console.log(err);
			}
		})
	}
	//抽奖结果弹窗提示
	function lotteryMsg(msg, btnContent) {
		$('.mask').removeClass('hide');
		$('.lottery_result').html(msg);
		$('.result_btn').html(btnContent);
	}

	function initEvents() {
		var screenHeight = document.body.clientHeight,
			mPage = 0,
			uPage = 0,
			flag = false;

		//platformChange();
		//预加载动画图片
		preloadImg();
		//点击more_details
		$('.details_btn').click(function() {
			$('body').css("overflow", "hidden");
			$('.more_detail').removeClass('hide');
		})
		//关闭弹窗
		$('.close,.result_btn').click(function() {
			$(this).parents('section').addClass('hide');
			$('body').css("overflow", "scroll");
		})
		//点击open播放动画
		$('.open').click(function() {
			$('#svgContainer').css("height", "100%");
			playSvg('http://static.cblive.tv/dist/mobile/img/activity/christmas/socks/data.json');
			getLotteryResult(lotteryIdArr.shift());
			console.log('lotteryIdArr', lotteryIdArr);
			if (leftChances > 0) {
				leftChances--;
			} else {
				leftChances = 0;
			}
			console.log('leftChances', leftChances);
			$('.last_chances_num').html(leftChances);
			if (!lotteryIdArr[0]) {
				$('.lottery').removeClass('open').addClass('over').unbind('click');
				//没有抽奖机会时弹出提示
				$('.over').click(function() {
					lotteryMsg(
						"Sorry, you don't have any lucky drawing  chance :( Send some christmas gifts to play the game now.",
						'Got it');
				})
			}
		})
		//没有抽奖机会时弹出提示
		$('.over').click(function() {
			lotteryMsg("Sorry, you don't have any lucky drawing  chance :( Send some christmas gifts to play the game now.",
				'Got it');
		})
		//监听滚动出现向上按钮
		$(window).scroll(function() {
			var scrollTop = $(this).scrollTop();
			if (scrollTop >= screenHeight && !flag) {
				$('.up_btn').animate({
					opacity: 1
				}, 500);
				flag = true;
			} else if (scrollTop < screenHeight && flag) {
				$('.up_btn').animate({
					opacity: 0
				}, 500);
				flag = false;
			}
		})
		//点击向上按钮
		$('.up_btn').click(function() {
			timer = setInterval(toTop, 1);
		})

		//榜单切换
		$('.handler').on('click', 'div', function() {
			var i = $(this).index();
			$(this).addClass('on').siblings().removeClass('on');
			$('.handler_box').children().eq(i).addClass('on').siblings().removeClass('on');
		})

		//监听滚动加载内容
		scrollLoad(".mRank", 150, function() {
			if (mScrollLock) return;
			mPage++;
			if (mPage > 4) return;
			mScrollLock = true;
			getModRank(mPage);
		});
		scrollLoad(".uRank", 150, function() {
			if (uScrollLock) return;
			uPage++;
			if (uPage > 3) return;
			uScrollLock = true;
			getUserRank(uPage);
		});
		//进入个人主页
		$('.mRank').on('click', '.avatar', function() {
			var mid = $(this).closest('li').data('id');
			common.goPersonalPage(mid);
		})
		//点击follow关注
		$('.mRank,.uRank').on('click', '.nofollow', function() {
			var mid = $(this).closest('li').data('id');
			addAttention($(this), mid)
		})
	}

	initEvents();

})
