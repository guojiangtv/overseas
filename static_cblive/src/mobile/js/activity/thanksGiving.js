define(function(require, exports, module){
	var common = require('common');

	var page = 0;
	var userPage = 0;
	var prizePage = 0;
	var scrollLock0 = false;
	var scrollLock1 = false;
	var scrollLock2 = false;
	var loveLock = false;

	var turntableLock = false;

	var chance = [];

	function getUserMsg(){
		$.ajax({
			type:"GET",
			url:"/ThanksGiving/GetUserMsg",
			dataType:"json",
			success:function(data){
				var _data = data.data;
				chance = _data.chance.data;
				$(".chances-num").html(_data.chance.count);
				$(".nickname-font").html(_data.nickname);
				$(".winning-avator img").attr({
					"src": _data.head_pic_1,
					"data-mid": _data.uid
				});
				$(".winning-id").html("ID："+_data.uid+"");
				$(".coins-won-num").html(_data.prizesSum);
				$(".left-num").html(_data.pidScore.gift51);
				$(".right-num").html(_data.pidScore.gift52);
			},
			error:function(err){
				console.log(err);
			}
		})
	}

	function getUserPrizes(page){
		$.ajax({
			type:"GET",
			url:"/ThanksGiving/GetUserPrizes",
			dataType:"json",
			data:{
				page: page
			},
			success:function(data){
				if(page === 0){
					$(".record-wrap").empty();
				}
				var _data = data.data.result;
				if(_data.length > 0){
					scrollLock2 = false;
					var str = "";
					for(var i = 0, len = _data.length; i < len; i++){
						str += '<div class="record-line c_clearfix">\
						<span class="record-line-nickname">'+_data[i]["nickname"]+'</span>\
						<span class="record-line-won">Won</span>\
						<span class="record-line-point">'+_data[i]["prize_name"]+'</span>\
						</div>';
					}
					$(".record-wrap").append(str);
				}else if(page === 0){
					return $(".record-wrap").html('<div class="any-winning">Oops! You don\'t have any winning records ...</div>');
				}
				
			},
			error:function(err){
				console.log(err);
			}
		})
	}
	
	function generateInitMod(data){
		var strTop = "";
		var len = data.length;
		for(var i = 0; i < 3 && i < len; i++){
			var live = data[i]["isPlaying"] ? "top-avator-live": "";
			var level = data[i]["level"] === "1" ? "top-avator-v": "";
			var follow = !data[i]['isAttention'] ? '<div class="top-avator-btn top-atttend">FOLLOW</div>': '<div class="top-avator-btn following">FOLLOWING</div>';

			strTop += '<div class="top-avator-'+i+'">\
					<span class="top-avator-img js-sort-avator '+live+' '+level+'" data-mid="'+data[i]['mid']+'">\
						<img src="'+data[i]["headPic"]+'">\
						<span class="top-icon-'+i+' sprite"></span>\
					</span>\
					<p class="top-avator-nickname">'+data[i]["nickname"]+'</p>\
					<p class="sort-top-status">Received:</p>\
					<p class="top-avator-point">'+data[i]["total"]+' points</p>\
					'+follow+'\
				</div>'
		}
		$(".js-anchor-sort .top-avator").html(strTop);
		if(len > 3){
			var str = "";
			for(var j = 3; j < len; j++){
				var live = data[j]["isPlaying"] ? "sort-nickname-live": "";
				var level = data[j]["level"] === "1" ? "top-avator-v": "";
				var follow = !data[j]['isAttention'] ? '<div class="top-avator-btn">FOLLOW</div>': '<div class="top-avator-btn following">FOLLOWING</div>';
				str += '<li class="sort-lists c_clearfix">\
					<div class="sort-index">'+(page*20 + j + 1)+'</div>\
					<div class="sort-avator js-sort-avator '+level+'"  data-mid="'+data[j]['mid']+'">\
						<img src="'+data[j]["headPic"]+'">\
					</div>\
					<div class="sort-intro">\
						<p class="sort-nickname"><span>'+data[j]["nickname"]+'</span><span class="'+live+'"></span></p>\
						<p class="sort-status">Received:</p>\
						<p class="sort-points">'+data[j]["total"]+' points</p>\
					</div>\
					'+follow+'\
				</li>'
			}
			$(".js-anchor-sort .sort-table").html(str);
		}

	}


	function generateMod(data){
		var len = data.length;
		var str = "";
		for(var j = 0; j < len; j++){
			var live = data[j]["isPlaying"] ? "sort-nickname-live": "";
			var level = data[j]["level"] === "1" ? "top-avator-v": "";
			var follow = !data[j]['isAttention'] ? '<div class="sort-follow">FOLLOW</div>': '<div class="sort-follow following">FOLLOW</div>';
			str += '<li class="sort-lists c_clearfix">\
				<div class="sort-index">'+(page*20 + j + 1)+'</div>\
				<div class="sort-avator js-sort-avator '+level+'"  data-mid="'+data[j]['mid']+'">\
					<img src="'+data[j]["headPic"]+'">\
				</div>\
				<div class="sort-intro">\
					<p class="sort-nickname"><span>'+data[j]["nickname"]+'</span><span class="'+live+'"></span></p>\
					<p class="sort-status">Received:</p>\
					<p class="sort-points">'+data[j]["total"]+' points</p>\
				</div>\
				'+follow+'\
			</li>'
		}
		$(".js-anchor-sort .sort-table").append(str);
	}

	function generateInitUser(data){
		var strTop = "";
		var len = data.length;
		for(var i = 0; i < 3 && i < len; i++){
			var follow = !data[i]['isAttention'] ? '<div class="top-avator-btn top-atttend" data-mid="'+data[i]['mid']+'">FOLLOW</div>': '<div class="top-avator-btn following">FOLLOWING</div>';

			strTop += '<div class="top-avator-'+i+'">\
					<span class="top-avator-img js-sort-avator"  data-mid="'+data[i]['mid']+'">\
						<img src="'+data[i]["headPic"]+'">\
						<span class="top-icon-'+i+' sprite"></span>\
					</span>\
					<p class="top-avator-nickname">'+data[i]["nickname"]+'</p>\
					<p class="sort-top-status">Sent:</p>\
					<p class="top-avator-point">'+data[i]["total"]+' points</p>\
					'+follow+'\
				</div>'
		}
		$(".js-user-sort .top-avator").html(strTop);
		if(len > 3){
			var str = "";
			for(var j = 3; j < len; j++){
				var follow = !data[j]['isAttention'] ? '<div class="top-avator-btn" data-mid="'+data[j]['mid']+'">FOLLOW</div>': '<div class="top-avator-btn following">FOLLOWING</div>';
				str += '<li class="sort-lists c_clearfix">\
					<div class="sort-index">'+(userPage*20 + j + 1)+'</div>\
					<div class="sort-avator js-sort-avator" data-mid="'+data[j]['mid']+'">\
						<img src="'+data[j]["headPic"]+'">\
					</div>\
					<div class="sort-intro">\
						<p class="sort-nickname"><span>'+data[j]["nickname"]+'</span><span"></span></p>\
						<p class="sort-status">Sent:</p>\
						<p class="sort-points">'+data[j]["total"]+' points</p>\
					</div>\
					'+follow+'\
				</li>'
			}
			$(".js-user-sort .sort-table").html(str);
		}

	}

	function generateUser(data){
		var len = data.length;
		var str = "";
		for(var j = 0; j < len; j++){
			var follow = !data[j]['isAttention'] ? '<div class="top-avator-btn" data-mid="'+data[j]['mid']+'">FOLLOW</div>': '<div class="sort-follow following">FOLLOW</div>';
			str += '<li class="sort-lists c_clearfix">\
				<div class="sort-index">'+(userPage*20 + j + 1)+'</div>\
				<div class="sort-avator js-sort-avator" data-mid="'+data[j]['mid']+'">\
					<img src="'+data[j]["headPic"]+'">\
				</div>\
				<div class="sort-intro">\
					<p class="sort-nickname"><span>'+data[j]["nickname"]+'</span></p>\
					<p class="sort-status">Sent:</p>\
					<p class="sort-points">'+data[j]["total"]+' points</p>\
				</div>\
				'+follow+'\
			</li>'
		}
		$(".js-user-sort .sort-table").append(str);
	}

	/**
	 * [rotate 背景旋转]
	 * @param  {[type]} ele   [旋转元素]
	 * @param  {[type]} num   [分割数量]
	 * @param  {[type]} index [停止的index [1-num]]
	 */
	window.rotate = function(ele,num,index,count){
		var index = num - index;
		var ele = document.querySelector(ele);
		var angle = 360/num * index + 360/num/2;
		var angleRotate = angle + 360*7;
		ele.className="turntable";
		ele.setAttribute(
			'style','-webkit-transform:rotate('+angleRotate+'deg) translateZ(0);transform:rotate('+angleRotate+'deg) translateZ(0);-webkit-transition: all 5s;transition: all 5s'
		);

		function trans(e){
			e.stopImmediatePropagation();
			ele.setAttribute(
				'style','-webkit-transform:rotate('+angle+'deg) translateZ(0);transform:rotate('+angle+'deg) translateZ(0);-webkit-transition: none;transition: none'
			);
			ele.className="turntable turntable-img";
			turntableLock = false;
			ele.removeEventListener("webkitTransitionEnd",trans);
			$(".coins-won-num").html(count);
		}
		ele.addEventListener("webkitTransitionEnd",trans);

	}
 
	function lottery(){
		var lotteryId = chance.pop();
		$(".chances-num").html(chance.length);
		$.ajax({
			type:"GET",
			url:"/ThanksGiving/UseLottery",
			dataType:"json",
			data:{
				lotteryId:lotteryId
			},
			success:function(data){
				var result = data.data.result;
				var prize = {2:2, 3:6, 4:4, 5:3, 6:1, 0:5};
				var prizeCount = [0,50,2,20,10,0,5];
				var count = +$(".coins-won-num").html()+prizeCount[prize[result.prizeId]];
				
				rotate('.turntable',6,prize[result.prizeId],count);
			},
			error:function(err){
				console.log(err);
			}
		})
		
	}

	//滚动加载
	function scrollLoad(ele,bottomHeight,callback){
	    var _ele = document.querySelector(ele);
	    var cliHeight = _ele.clientHeight;
	    var bH = bottomHeight || 100;
	    var scrollTop = _ele.scrollTop;
	    var scrollHeight = _ele.scrollHeight;
	    _ele.addEventListener('scroll',function(){
	        cliHeight = _ele.clientHeight;
	        scrollTop = _ele.scrollTop;
	        scrollHeight = _ele.scrollHeight;
	        if(scrollHeight - cliHeight - scrollTop < bH){
	            callback();
	        }
	    },false);

	}

	//获取主播榜单
	function getModRank(page){
		$.ajax({
			type:"GET",
			url:"/ThanksGiving/ModRank",
			dataType:"json",
			data:{
				page:page
			},
			success:function(data){
				if(data.data.login === '0000'){
					return common.goLogin();
				}
				if(data.data.result.length > 0){
					scrollLock0 = false;
					if(page === 0){
						generateInitMod(data.data.result);
					}else{
						generateMod(data.data.result);
					}
				}
			},
			error:function(err){
				console.log(err);
			}
		})
	}

	//获取用户榜单
	function getUserRank(page){
		$.ajax({
			type:"GET",
			url:"/ThanksGiving/UserRank",
			dataType:"json",
			data:{
				page:page
			},
			success:function(data){
				if(data.data.result.length > 0){
					scrollLock1 = false;
					if(userPage === 0){
						generateInitUser(data.data.result)
					}else{
						generateUser(data.data.result);
					}
				}
				
			},
			error:function(err){
				console.log(err);
			}
		})
	}

	//关注主播
	function addAttention(ele,mid){
		$.ajax({
			type:"GET",
			url:"/HalloweenActivity/Love",
			dataType:"json",
			data:{
				mid:mid	
			},
			success:function(data){
				loveLock = false;
				if(data.data.attResult){
					
				}
			},
			error:function(err){
				loveLock = false;
				console.log(err);
			}
		})
	}

	function initEvents(){
		//抽奖
		$(".go-btn").click(function(){
			if(turntableLock) return;
			if(chance.length === 0){
				return $(".tips-box").show();
			}
			turntableLock = true;
			lottery();
		});

		//规则
		var tempTop = 0;
		$(".rule-close").click(function(){
			$(".rule-cover").hide();
			$("body").css({
				position: "static"
			});
			$(window).scrollTop(tempTop);
		});
		$(".rule-btn").click(function(){
			$(".rule-cover").show();
			tempTop = $(window).scrollTop();
			$("body").css({
				position: "fixed",
				top: -tempTop+"px"
			});
		});

		//主播和用户切换
		$(".anchor-btn").click(function(){
			$(".user-btn").removeClass("top-btn-act").addClass("top-btn-normal");
			$(".anchor-btn").removeClass("top-btn-normal").addClass("top-btn-act");
			$(".js-anchor-sort").show();
			$(".js-user-sort").hide();
		});
		$(".user-btn").click(function(){
			$(".anchor-btn").removeClass("top-btn-act").addClass("top-btn-normal");
			$(".user-btn").removeClass("top-btn-normal").addClass("top-btn-act");
			$(".js-anchor-sort").hide();
			$(".js-user-sort").show();
		});

		//中奖记录
		var winBtnElement = document.querySelector(".winning-btn");
		winBtnElement.addEventListener("touchstart",function(e){
			prizePage = 0;
			$(".prize-cover").show();
			getUserPrizes(prizePage);
		});
		winBtnElement.addEventListener("touchend",function(e){
			e.preventDefault();
			e.stopPropagation();
		});

		$(".js-record-close").click(function(){
			$(".prize-cover").hide();
		});
		// document.querySelector(".js-record-close").addEventListener("touchstart",function(e){
		// 	$(".prize-cover").hide();
		// },false);

		$(".js-tips-close").click(function(){
			$(".tips-box").hide();
		});

		//滚动加载主播
		scrollLoad('.js-anchor-sort .sort-table',120,function(){
			if(scrollLock0) return;
			page++;
			scrollLock0 = true;
			getModRank(page);
		});

		//滚动加载用户
		scrollLoad('.js-user-sort .sort-table',120,function(){
			if(scrollLock1) return;
			userPage++;
			scrollLock1 = true;
			getUserRank(userPage);
		});

		//滚动历史记录
		scrollLoad('.record-wrap',120,function(){
			if(scrollLock2) return;
			prizePage++;
			scrollLock2 = true;
			getUserPrizes(prizePage);
		});

		//跳转个人主页
		$(".part1-box").on("click",".js-sort-avator",function(){
			var mid = $(this).data("mid");
			common.goPersonalPage(mid);
		});
		$(".winning-avator img").click(function(){
			var mid = $(this).data("mid");
			common.goPersonalPage(mid);
		});

		//关注主播
		$(".js-anchor-sort").on("click",".top-atttend",function(){
			if(loveLock || $(this).hasClass("following")) return;
			loveLock = true;
			var mid = $(this).parent().find(".js-sort-avator").data("mid");
			$(this).addClass("following").html("FOLLOWING");
			addAttention($(this),mid);
		});
		$(".js-anchor-sort").on("click",".top-avator-btn",function(){
			if(loveLock || $(this).hasClass("following")) return;
			loveLock = true;
			var mid = $(this).parents(".sort-lists").find(".js-sort-avator").data("mid");
			$(this).addClass("following").html("FOLLOWING");
			addAttention($(this),mid);
		});

		//关注用户
		$(".js-user-sort").on("click",".top-avator-btn",function(){
			if(loveLock || $(this).hasClass("following")) return;
			loveLock = true;
			var mid = $(this).data("mid");
			$(this).addClass("following").html("FOLLOWING");
			addAttention($(this),mid);
		});


		//置顶
		var tempTop = $(".turntable-wrap").offset().top;
		$(window).scroll(function(){
			var scrollTop = $(window).scrollTop();
			if(scrollTop > tempTop){
				$(".to-top").show();
			}else{
				$(".to-top").hide();
			}
		});

	}

	function initXHR(){
		getModRank(page);
		getUserRank(userPage);
		getUserMsg();
		getUserPrizes(prizePage);
	}

	initEvents();
	initXHR()

})