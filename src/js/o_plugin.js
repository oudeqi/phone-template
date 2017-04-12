// TODO 举报插件
(function($){
	$.fn.report = function(fn){
		var _this = this;
		//初始化
		$(_this).css("display","-webkit-box");
		$(_this).find(".item").removeClass("active");
		$.fn.report.cbOk = fn;
		$(_this).find(".cancel").tap(function(){
			$.fn.report.destroy.call(_this);
		});
		$(_this).find(".ok").tap(function(){
			$.fn.report.ok.call(_this,$.fn.report.cbOk);
		});
		$(_this).find(".item").tap(function(){
			$(_this).find(".active").removeClass("active");
			$(this).addClass("active");
		});
		$(_this).bind("touchstart",function(e){
			e.preventDefault();
		});
	};
	$.fn.report.destroy = function(arg){
		var _this = this;
		if(arg){
			_this = arg;
		}
		$(_this).find(".cancel").untap("click");
		$(_this).find(".ok").untap("click");
		$(_this).find(".item").untap("click");
		$(_this).css("display","none");
		
	};
	$.fn.report.ok = function(fn){
		var active = $(this).find(".item.active").data("type");
		if(!active){
			active = "";
		}
		fn.call(this,active,$.fn.report.destroy);
	};
	$.fn.report.cbOk = function(){};
})(jQuery);

/*
 * 
$("#reportModal").report(function(str,destroy){
	console.log(str); 选择的按钮
	console.log(this); 
	//destroy(this); 销毁组件
});
 * */

// TODO 弹出二维码插件
(function($){
	$.fn.popup = function(){
		console.log(this)
		var _this = this;
		var popclose = function(){
			$(_this).css("display","none");
		}
		var popopen = function(){
			$(_this).bind("touchmove",function(e){
				e.preventDefault();
			});
			$(_this).css("display","-webkit-box");
		}
		$(_this).find(".close").untap().tap(popclose);
		var res = {};
		res.open = popopen;
		res.close = popclose;
		return res;
	}
	
})(jQuery);

// TODO 弹出二维码插件2
(function($){
	$.fn.popupCode = function(str){
		console.log(this)
		var _this = this;
		_this.find(".codepic img").attr('src',str);
		var popclose = function(){
			$(_this).css("display","none");
		}
		var popopen = function(){
			$(_this).bind("touchmove",function(e){
				e.preventDefault();
			});
			$(_this).css("display","-webkit-box");
		}
		$(_this).find(".close").untap().tap(popclose);
		var res = {};
		res.open = popopen;
		res.close = popclose;
		return res;
	}
	
})(jQuery);

// TODO tap事件
(function($){
	$.fn.tap = function(fn){
		var _this = this;
		for (var i=0; i<_this.length; i++) {
			(function(curr){
				var start;
				$(curr).bind("touchstart",function(e){
					start = new Date().getTime();
				});
				$(curr).bind("touchend",function(e){
					var time = new Date().getTime()-start;
//						console.log("时间间隔："+time);
					if(time<300 && time>10){
//							console.log("tap：触发了");
						fn.call(curr,e);
					}else{
						console.log("------------------没有触发");
					}
				});
			})(_this[i]);
		}
	};
	$.fn.untap = function(){
		var _this = this;
		for (var i=0; i<_this.length; i++) {
			var curr = _this[i];
			$(curr).unbind("touchstart");
			$(curr).unbind("touchend");
		}
		return _this;
	}
})(jQuery);

/*
 $(".xxx").tap(function(e){
	console.log(this.innerHTML);
	console.log(e);
});
 * */

// TODO 行内tap事件
(function($){
	var start;
	$(document).on("touchstart","[tap]",function(){
		start = new Date().getTime();
	});
	$(document).on("touchend","[tap]",function(){
		var time = new Date().getTime()-start;
//		console.log("时间间隔xxxxxxxxx："+time);
		if(time<300 && time>10){
			var fn =$(this).attr("tap");
			console.log(fn);
			eval(fn);
		}else{
			console.log("------------------没有触发");
		}
	});
})(jQuery);
/*
 <div class="yyy" tap="say(this);">4</div>
 * */














