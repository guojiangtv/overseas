define(function(require, exports, module){
	var common = require('common');

	var page = 0,
		limit = 10;
	var initAnchor = true;
	var scrollLock = false;
	var loveLock = false;
	
	function generateInitMod(data){
		var result = JSON.parse(JSON.stringify(data));
		var str = "";
		initAnchor = false;

		if(result.length > 0){
			var top1 = result.shift();
			var liveStatus = top1['isPlaying'] ? "display:block" : "display:none";
			var following = top1['isAttention'] ? "followed" : "";
			str = '<div class="anchor-top-avator" data-mid="'+top1["mid"]+'">\
					<img class="avator" src="'+top1["headPic"]+'">\
					<div class="anchor-top-number anchor-top-1 sprite"></div>\
					<div class="anchor-top-horn sprite"></div>\
					<div class="anchor-top-live sprite" style="'+liveStatus+'"></div>\
				</div>\
				<div class="anchor-top-gift-num sprite">'+top1["total"]+'</div>\
				<div class="anchor-top-nickname">\
					<span class="nickname">'+top1["nickname"]+'</span>\
					<span class="following sprite '+following+' js-following" data-mid="'+top1["mid"]+'"></span>\
				</div>\
				<div class="anchor-gift-form">\
					<div class="pumpkin">\
						<span class="pumpkin-bg sprite"></span>\
						<span class="gift-num">x'+top1["gift37"]+'</span>\
					</div>\
					<div class="horse-car">\
						<span class="horse-car-bg sprite"></span>\
						<span class="gift-num">x'+top1["gift36"]+'</span>\
					</div>\
				</div>';
			$(".js-anchor-top").html(str);
		}

		if(result.length > 0){
			str = "";
			for(var i = 0; i < 2; i++){
				if(result.length === 0) break;
				var temp = result.shift();

				var liveStatus = temp['isPlaying'] ? "display:block" : "display:none";
				var anchorTop = i===0 ? "anchor-top-left" : "anchor-top-right";
				var following = temp['isAttention'] ? "followed" : "";
				str += '<div class="'+anchorTop+'">\
					<div class="anchor-top-avator" data-mid="'+temp["mid"]+'">\
						<img class="avator" src="'+temp["headPic"]+'">\
						<div class="anchor-top-number anchor-top-'+(i+2)+' sprite"></div>\
						<div class="anchor-top-live sprite" style="'+liveStatus+'"></div>\
					</div>\
					<div class="anchor-top-gift-num sprite">'+temp["total"]+'</div>\
					<div class="anchor-top-nickname">\
						<span class="nickname">'+temp["nickname"]+'</span>\
						<span class="following sprite '+following+' js-following" data-mid="'+temp["mid"]+'"></span>\
					</div>\
					<div class="anchor-gift-form">\
						<div class="pumpkin">\
							<span class="pumpkin-bg-small sprite"></span>\
							<span class="gift-num-small">x'+temp["gift37"]+'</span>\
						</div>\
						<div class="horse-car">\
							<span class="horse-small-bg sprite"></span>\
							<span class="gift-num-small">x'+temp["gift36"]+'</span>\
						</div>\
					</div>\
				</div>';
			}

			$(".anchor-top-next").html(str);
		}

		if(result.length > 0){
			str = "";
			for(var j = 0, len = result.length; j < len; j++){
				var liveStatus = result[j]['isPlaying'] ? "display:block" : "display:none";
				var following = result[j]['isAttention'] ? "followed" : "";
				str += '<li class="anchor-item c_clearfix">\
					<span class="anchor-item-num">'+(j+4)+'</span>\
					<span class="anchor-item-avator" data-mid="'+result[j]["mid"]+'">\
						<img src="'+result[j]["headPic"]+'" class="avator">\
						<span class="anchor-item-live sprite" style="'+liveStatus+'"></span>\
						<span class="anchor-item-score sprite">'+result[j]["total"]+'</span>\
					</span>\
					<span class="anchor-item-gift">\
						<div class="anchor-item-nickname">\
							<span class="nickname">'+result[j]["nickname"]+'</span>\
							<span class="anchor-vip level_icon level_icon_'+result[j]["level"]+'"></span>\
						</div>\
						<div class="anchor-gift-form">\
							<div class="pumpkin">\
								<span class="pumpkin-bg-small sprite"></span>\
								<span class="gift-num-small">x'+result[j]["gift37"]+'</span>\
							</div>\
							<div class="horse-car">\
								<span class="horse-small-bg sprite"></span>\
								<span class="gift-num-small">x'+result[j]["gift36"]+'</span>\
							</div>\
						</div>\
					</span>\
					<span class="anchor-item-attention following sprite '+following+' js-following" data-mid="'+result[j]["mid"]+'"></span>\
				</li>'
			}
			$(".anchor-lists").html(str);
		}
	}

	function generateMod(data){
		var result = JSON.parse(JSON.stringify(data));
		var str = "";
		for(var j = 0, len = result.length; j < len; j++){
			var liveStatus = result[j]['isPlaying'] ? "display:block" : "display:none";
			var following = result[j]['isAttention'] ? "followed" : "";
			str += '<li class="anchor-item c_clearfix">\
				<span class="anchor-item-num">'+(page*10 + j + 1)+'</span>\
				<span class="anchor-item-avator" data-mid="'+result[j]["mid"]+'">\
					<img src="'+result[j]["headPic"]+'" class="avator">\
					<span class="anchor-item-live sprite" style="'+liveStatus+'"></span>\
					<span class="anchor-item-score sprite">'+result[j]["total"]+'</span>\
				</span>\
				<span class="anchor-item-gift">\
					<div class="anchor-item-nickname">\
						<span class="nickname">'+result[j]["nickname"]+'</span>\
						<span class="anchor-vip level_icon level_icon_'+result[j]["level"]+'"></span>\
					</div>\
					<div class="anchor-gift-form">\
						<div class="pumpkin">\
							<span class="pumpkin-bg-small sprite"></span>\
							<span class="gift-num-small">x'+result[j]["gift37"]+'</span>\
						</div>\
						<div class="horse-car">\
							<span class="horse-small-bg sprite"></span>\
							<span class="gift-num-small">x'+result[j]["gift36"]+'</span>\
						</div>\
					</div>\
				</span>\
				<span class="anchor-item-attention following sprite '+following+' js-following" data-mid="'+result[j]["mid"]+'"></span>\
			</li>'
		}
		$(".anchor-lists").append(str);
	}

	function generateUser(data){
		var str = "";
		for(var i = 0, len = data.length; i < len; i++){
			var following = data[i]['isAttention'] ? "followed" : "";
			if(i >= 3){
				str += '<li class="user-lists c_clearfix">\
						<span class="user-top-img">'+(i+1)+'</span>\
						<span class="user-avator" data-uid="'+data[i]["uid"]+'">\
							<img src="'+data[i]["headPic"]+'" class="avator">\
						</span>\
						<span class="user-infor">\
							<div class="user-nickname">\
								<span class="nickname">'+data[i]["nickname"]+'</span>\
								<span class="user-vip level_icon level_icon_'+data[i]["level"]+'"></span>\
							</div>\
							<div class="user-sended">\
								Already sent <em>'+data[i]["scores"]+'</em> points\
							</div>\
						</span>\
						<span class="user-item-attention following sprite '+following+' js-following" data-uid="'+data[i]["uid"]+'"></span>\
					</li>';
			}else{
				str += '<li class="user-lists c_clearfix">\
					<span class="user-top-img user-top-'+(i+1)+' sprite"></span>\
					<span class="user-avator" data-uid="'+data[i]["uid"]+'">\
						<img src="'+data[i]["headPic"]+'" class="avator">\
					</span>\
					<span class="user-infor">\
						<div class="user-nickname">\
							<span class="nickname">'+data[i]["nickname"]+'</span>\
							<span class="user-vip level_icon level_icon_'+data[i]["level"]+'"></span>\
						</div>\
						<div class="user-sended">\
							Already sent <em>'+data[i]["scores"]+'</em> points\
						</div>\
					</span>\
					<span class="user-item-attention following sprite '+following+' js-following" data-uid="'+data[i]["uid"]+'"></span>\
				</li>'
			}
		}
		$(".js-user-sort").html(str);
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
	function getModRank(page,limit){
		$.ajax({
			type:"GET",
			url:"/HalloweenActivity/ModRank",
			dataType:"json",
			data:{
				page:page,
				limit:limit
			},
			success:function(data){
				if(data.data.login === '0000'){
					return common.goLogin();
				}
				scrollLock = false;
				if(initAnchor){
					generateInitMod(data.data.result);
				}else{
					generateMod(data.data.result);
				}
			},
			error:function(err){
				console.log(err);
			}
		})
	}

	//获取用户榜单
	function getUserRank(page,limit){
		$.ajax({
			type:"GET",
			url:"/HalloweenActivity/UserRank",
			dataType:"json",
			success:function(data){
				generateUser(data.data.result);
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
					ele.addClass("followed");
				}
			},
			error:function(err){
				console.log(err);
			}
		})
	}

	function initEvents(){
		//榜单切换
		$(".top-list-btn").click(function(){
			$(this).removeClass("top-list-normal");
			$(".superfans-btn").addClass("superfans-normal");
			$(".anchor-sort").show();
			$(".user-sort").hide();
		});
		$(".superfans-btn").click(function(){
			$(this).removeClass("superfans-normal");
			$(".top-list-btn").addClass("top-list-normal");
			$(".anchor-sort").hide();
			$(".user-sort").show();
		});

		//滚动加载主播
		scrollLoad('.js-anchor-sort',120,function(){
			if(scrollLock) return;
			page++;
			if(page > 4) return;
			scrollLock = true;
			getModRank(page,limit);
		});

		//跳转到个人主页
		$(".js-anchor-sort").on("click",".anchor-item-avator,.anchor-top-avator",function(){
			var mid = $(this).data("mid");
			common.goPersonalPage(mid);
		});

		//关注主播
		$(".js-anchor-sort").on("click",".js-following",function(){
			var ele = $(this);
			var mid = ele.data('mid');
			if(ele.hasClass("followed") || loveLock) return;
			loveLock = true;
			addAttention(ele,mid);
		});

		//关注用户
		$(".js-user-sort").on("click",".js-following",function(){
			var ele = $(this);
			var uid = ele.data('uid');
			if(ele.hasClass("followed") || loveLock) return;
			loveLock = true;
			addAttention(ele,uid);
		});
	}


	function initXHR(){
		getModRank(page,limit);
		getUserRank();
	}





	initEvents();
	initXHR()

})