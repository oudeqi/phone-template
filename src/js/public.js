//服务器接口
//var IFaddr = "http://192.168.0.189:8080/YOULE";
// var IFaddr = "https://api.2tai.com";
// var IFaddr = "http://101.201.76.235";
var IFaddr = "http://101.200.129.132";
// var IFaddr = "https://api.2tai.com";
// var shareHost = "http://fx.2tai.net/";
var shareHost = "http://fx.2tai.net";
// var appid= "wx518839c486443ce1";
var appid= "wx7c0b913b4c5452ad";



var telReg = /^1\d{10}$/;

//验证电话号码格式
function isTel(str) {
	return telReg.test($.trim(str));
}

//验证密码是否为空
function isNull(str) {
	return $.trim(str) === "";
}

//底部导航切换
$("#footer .item").hammer().bind("tap",function(){
	var name = $(this).attr("data-href");
	window.location.href = name+".html";
});

//获取验证码
function getYZM(tel){
	$.ajax({
		type:"post",
		contentType:"application/json",
		url:IFaddr+"/v1/msg/sendVerifyCode",
		data: JSON.stringify({phone:tel}),
		dataType:"json",
		beforeSend:function(a,b){

		},
		success:function(res,states,xhr){

			if(res.errMessage == ""){
				toast(res.data);
			}else{
				toast(res.errMessage);
			}
			console.log(res);
		},
		error:function(a,b,c){
			toast(b);
		}

	});
}


//获取所有兴趣爱好
function getInterest(callback){
	$.ajax({
		type:"get",
		contentType:"application/json",
		url:IFaddr+"/v1/user/getWelcomeData",
		dataType:"json",
		success:function(data,status,xhr){
			callback("",data.interest);
		},
		error:function(data,states,c){
			callback("error",data);
		}
	});
}


//获取所有职业
function getProfessions(callback){
	$.ajax({
		type:"get",
		contentType:"application/json",
		url:IFaddr+"/v1/user/getWelcomeData",
		dataType:"json",
		success:function(data,status,xhr){
			callback("",data.profession);
		},
		error:function(data,states,c){
			callback("error",data);
		}
	});
}

//根据id找到职业名字
function getJobById(id,jobs,callback){
	for(var i=0;i<jobs.length;i++){
		if(parseInt(jobs[i].id) == id){
			return callback("",jobs[i].name);
		}else{
			if(jobs[i].subProfession){
				for(var j=0; j<jobs[i].subProfession.length; j++){
					if(parseInt(jobs[i].subProfession[j].id) == id){
						return callback("",jobs[i].subProfession[j].name);
					}
				}
			}

		}
	}
	return callback("err","没有找到对应的职业");
}

//找到对应id下职业的列表
function getJobsById(id,arr,callback){
	for(var i=0; i<arr.length; i++){
		if(id == arr[i].id){
			return callback("",arr[i].subProfession);
		}
	}
	callback("err","没有找到对应的职业");
}


//获取所有城市
function getCities(callback){
	$.ajax({
		type:"get",
		contentType:"application/json",
		url:IFaddr+"/v1/city/getAllCity",
		dataType:"json",
		success:function(data,status,xhr){
			if(data.errMessage){
				callback(data.errMessage,data);
			}else{
				callback("",data.data);
			}
		},
		error:function(data,states,c){
			callback("error",data);
		}
	});
}

//根据城市code获取城市
function getCityByCode(code,cities,callback){
	for(var i=0; i<cities.length; i++){
		if(cities[i].code.substr(0,2) == code.substr(0,2)){
			if(cities[i].code == code){
				return callback("",cities[i].name);
			}else{
				for(var j=0; j<cities[i].cityList.length; j++){

					if(cities[i].cityList[j].code.substr(2,2) == code.substr(2,2)){

						if(cities[i].cityList[j].code == code){
							return callback("",cities[i].cityList[j].name);
						}else{
							for(var k=0; k<cities[i].cityList[j].townList.length; k++){
								if(cities[i].cityList[j].townList[k].code == code){
									return callback("",cities[i].cityList[j].townList[k].name);
								}
							}
						}
					}
				}
			}
		}
	}
	return callback("error","获取城市信息异常");
}

//设置昵称
function setNickName(name,callback){
	$.ajax({
		type:"post",
		contentType:"application/json",
		url:IFaddr+"/v1/aut/user/updateUser",
		data: JSON.stringify({
			nickName : name
		}),
		dataType:"json",
		beforeSend: function(xhr, setting) {
			xhr.setRequestHeader("Authorization",localStorage.getItem("token"));
		},
		success:function(data,status,xhr){
			if(data.errMessage){
				callback(data.errMessage,data.data);
			}else{
				callback("",data.data);
			}
		},
		error:function(data,states,c){
			callback("error",data);
		}
	});
}

//设置爱好
function setInterest(interest,callback){
	$.ajax({
		type:"post",
		contentType:"application/json",
		url:IFaddr+"/v1/aut/user/updateUser",
		data: JSON.stringify({
			interest : interest
		}),
		dataType:"json",
		beforeSend: function(xhr, setting) {
			xhr.setRequestHeader("Authorization",localStorage.getItem("token"));
		},
		success:function(data,status,xhr){
			if(data.errMessage){
				callback(data.errMessage,data.data);
			}else{
				callback("",data.data);
			}
		},
		error:function(data,states,c){
			callback("error",states);
		}
	});
}

//设置年龄
function setAge(age,callback){
	$.ajax({
		type:"post",
		contentType:"application/json",
		url:IFaddr+"/v1/aut/user/updateUser",
		data: JSON.stringify({
			age : age
		}),
		dataType:"json",
		beforeSend: function(xhr, setting) {
			xhr.setRequestHeader("Authorization",localStorage.getItem("token"));
		},
		success:function(data,status,xhr){
			if(data.errMessage){
				callback(data.errMessage,data.data);
			}else{
				callback("",data.data);
			}
		},
		error:function(data,states,c){
			callback("error",data);
		}
	});
}

//设置性别
function setGender(gender,callback){
	$.ajax({
		type:"post",
		contentType:"application/json",
		url:IFaddr+"/v1/aut/user/updateUser",
		data: JSON.stringify({
			gender : gender
		}),
		dataType:"json",
		beforeSend: function(xhr, setting) {
			xhr.setRequestHeader("Authorization",localStorage.getItem("token"));
		},
		success:function(data,status,xhr){
			if(data.errMessage){
				callback(data.errMessage,data.data);
			}else{
				callback("",data.data);
			}
		},
		error:function(data,states,c){
			callback("error",data);
		}
	});
}

//设置职业
function setJob(id,callback){
	$.ajax({
		type:"post",
		contentType:"application/json",
		url:IFaddr+"/v1/aut/user/updateUser",
		data: JSON.stringify({
			professionId : id
		}),
		dataType:"json",
		beforeSend: function(xhr, setting) {
			xhr.setRequestHeader("Authorization",localStorage.getItem("token"));
		},
		success:function(data,status,xhr){
			if(data.errMessage){
				callback(data.errMessage,data.data);
			}else{
				callback("",data.data);
			}
		},
		error:function(data,states,c){
			callback("error",data);
		}
	});
}

//修改用户信息成功后将数据保存到本地
function saveToLocal(data){
	localStorage.setItem("age",data.age);
	localStorage.setItem("cityId",data.cityId);
	localStorage.setItem("comeinCode",data.comeinCode);
	localStorage.setItem("createDate",data.createDate);
	localStorage.setItem("email",data.email);
	localStorage.setItem("gender",data.gender);
	localStorage.setItem("headIconUrl",data.headIconUrl);
	localStorage.setItem("identityCard",data.identityCard);
	localStorage.setItem("interest",data.interest);
	localStorage.setItem("inviteCode",data.inviteCode);
	localStorage.setItem("nickName",data.nickName);
	localStorage.setItem("personalityId",data.personalityId);
	localStorage.setItem("phoneNumber",data.phoneNumber);
	localStorage.setItem("professionId",data.professionId);
	localStorage.setItem("realName",data.realName);
	localStorage.setItem("token",data.token);
	localStorage.setItem("type",data.type);
	localStorage.setItem("uid",data.uid);
	localStorage.setItem("wbUserInfoId",data.wbUserInfoId);
	localStorage.setItem("wxUserInfoId",data.wxUserInfoId);
	localStorage.setItem("qqUserInfoId",data.qqUserInfoId);
}

//设置位置
function setAddr(code,callback){
	$.ajax({
		type:"post",
		contentType:"application/json",
		url:IFaddr+"/v1/aut/user/updateUser",
		data: JSON.stringify({
			cityId : code
		}),
		dataType:"json",
		beforeSend: function(xhr, setting) {
			xhr.setRequestHeader("Authorization",localStorage.getItem("token"));
		},
		success:function(data,status,xhr){
			if(data.errMessage){
				callback(data.errMessage,data.data);
			}else{
				callback("",data.data);
			}
		},
		error:function(data,states,c){
			callback("error",data);
		}
	});
}

//睡眠
function sleep(numberMillis) {
	var now = new Date();
	var exitTime = now.getTime() + numberMillis;
	while (true) {
		now = new Date();
		if (now.getTime() > exitTime){
			return;
		}
    }
}

//未登录 或者 为注册 跳到登陆页面
function loginValidate(){
	if(localStorage.getItem("token") == null || localStorage.getItem("token") == ""){
		window.location.href = './login.html';
	}
}

//日志
function log(arg){
	console.log(arg);
}
//错误
function err(arg){
	console.error(arg);
}
//信息
function info(arg){
	console.info(arg);
}


//**获取页面参数
function getUrlParam(id){
	var url = window.location.href;
	if(url.lastIndexOf('?') == -1) return "";
	var params = url.split('?')[1];
	if(params.length == 0) return "";
	var p={};
	var r = params.split('&');
	for(var i=0; i<r.length; i++){
		if(r[i].indexOf('=') == -1) continue;
		var a = r[i].split('=');
		p[a[0]]=a[1];
	}
	return typeof p[id] == 'undefined' ? '' : decodeURI(p[id]);
}



//toast
function toast(str) {
	$("#toast").remove();
	$("body").prepend('<div id="toast"><div>' + str + '</div></div>');
	$("#toast")
		.css({
			"position": "fixed",
			"top": "0",
			"left": "0",
			"z-index": "1000",
			"width": "100%",
			"height": "100%",
			"display": "-webkit-box",
			"-webkit-box-pack": "center",
			"-webkit-box-align": "center"
		})
		.find("div")
		.css({
			"background": "rgba(0,0,0,0.5)",
			"border-radius": "5px",
			"padding": "0.9em 1em 1em 1em",
			"color": "#fff",
			"font-size": "0.9375em",
			"line-height": "1"
		});

	var timer = setTimeout(function() {
		$("#toast").remove();
		clearTimeout(timer);
	}, 1000);

	$("#toast").one("touchstart", function(e) {
		e.preventDefault();
		clearTimeout(timer);
		$("#toast").remove();
	});

}


var tool = {
	ArrHasEle: function(arr, ele) {
		var flag = false;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == ele) {
				flag = true;
			}
		}
		return flag;
	}
}

//数组乱序
Array.prototype.shuffle = function() {
	for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
	return this;
};

// 删除数组指定下标或指定对象
Array.prototype.remove=function(obj){
	for(var i =0;i <this.length;i++){
		var temp = this[i];
		if(!isNaN(obj)){
			temp=i;
		}
		if(temp == obj){
			for(var j = i;j <this.length;j++){
				this[j]=this[j+1];
			}
			this.length = this.length-1;
		}
	}
}

//格式化日期
Date.prototype.Format = function(formatStr) {
	var str = formatStr;
	var Week = ['日', '一', '二', '三', '四', '五', '六'];
	str = str.replace(/yyyy|YYYY/, this.getFullYear());
	str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
	str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
	str = str.replace(/M/g, (this.getMonth() + 1));
	str = str.replace(/w|W/g, Week[this.getDay()]);
	str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
	str = str.replace(/d|D/g, this.getDate());
	str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
	str = str.replace(/h|H/g, this.getHours());
	str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
	str = str.replace(/m/g, this.getMinutes());
	str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
	str = str.replace(/s|S/g, this.getSeconds());
	return str
}

/*
 *
 * 获取剩余时间，返回的数据传给callback回调
 *
 * @param {Number} Millisecond 剩余毫秒数
 * @param {Function} callback 回调
 * @return {Object} Object.d 返回剩余的天数
 * @return {Object} Object.h 返回剩余的小时
 * @return {Object} Object.m 返回剩余的分钟
 * @return {Object} Object.s 返回剩余的秒数
 *
 */
function getLeftTime(millisecond,callback){

	var day = parseInt(millisecond/24/60/60/1000);
	var hour = parseInt((millisecond - day*24*60*60*1000)/60/60/1000);
	var minute = parseInt((millisecond - day*24*60*60*1000 - hour*60*60*1000)/60/1000);
	var second = parseInt((millisecond - day*24*60*60*1000 - hour*60*60*1000 - minute*60*1000)/1000);

	callback({
		d:day,
		h:hour,
		m:minute,
		s:second,
	});

}


// 字符串长度截取
function cutstr(str, len) {
	var temp,
		icount = 0,
		patrn = /[^\x00-\xff]/,
		strre = "";
	for (var i = 0; i < str.length; i++) {
		if (icount < len - 1) {
			temp = str.substr(i, 1);
			if (patrn.exec(temp) == null) {
				icount = icount + 1
			} else {
				icount = icount + 2
			}
			strre += temp
		} else {
			break;
		}
	}
	return strre + "...";
}

//替换全部
String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}

//清除空格
String.prototype.trim = function() {
	var reExtraSpace = /^\s*(.*?)\s+$/;
	return this.replace(reExtraSpace, "$1")
}

//清除左右空格
function ltrim(s){ return s.replace( /^(\s*|　*)/, ""); }
function rtrim(s){ return s.replace( /(\s*|　*)$/, ""); }

//判断是否以某个字符串开头
String.prototype.startWith = function (s) {
	return this.indexOf(s) == 0
}

//判断是否以某个字符串结尾
String.prototype.endWith = function (s) {
	var d = this.length - s.length;
	return (d >= 0 && this.lastIndexOf(s) == d)
}



//判断是否为数字类型
function isDigit(value) {
	var patrn = /^[0-9]*$/;
	if (patrn.exec(value) == null || value == "") {
		return false
	} else {
		return true
	}
}


//转义html标签
//function HtmlEncode(text) {
//	return text.replace(/&/g, '&').replace(/\"/g, '"').replace(/</g, '<').replace(/>/g, '>')
//}


//设置cookie
//function setCookie(name, value, Hours) {
//	var d = new Date();
//	var offset = 8;
//	var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
//	var nd = utc + (3600000 * offset);
//	var exp = new Date(nd);
//	exp.setTime(exp.getTime() + Hours * 60 * 60 * 1000);
//	document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString() + ";domain=360doc.com;"
//}

//获取cookie
//function getCookie(name) {
//	var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
//	if (arr != null) return unescape(arr[2]);
//	return null
//}

//加入收藏
//function AddFavorite(sURL, sTitle) {
//	try {
//		window.external.addFavorite(sURL, sTitle)
//	} catch(e) {
//		try {
//			window.sidebar.addPanel(sTitle, sURL, "")
//		} catch(e) {
//			alert("加入收藏失败，请使用Ctrl+D进行添加")
//		}
//	}
//}

//设为首页
//function setHomepage() {
//	if (document.all) {
//		document.body.style.behavior = 'url(#default#homepage)';
//		document.body.setHomePage('http://w3cboy.com')
//	} else if (window.sidebar) {
//		if (window.netscape) {
//			try {
//				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
//			} catch(e) {
//				alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true")
//			}
//		}
//		var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
//		prefs.setCharPref('browser.startup.homepage', 'http://w3cboy.com')
//	}
//}

//加在样式文件
//function LoadStyle(url) {
//	try {
//		document.createStyleSheet(url)
//	} catch(e) {
//		var cssLink = document.createElement('link');
//		cssLink.rel = 'stylesheet';
//		cssLink.type = 'text/css';
//		cssLink.href = url;
//		var head = document.getElementsByTagName('head')[0];
//		head.appendChild(cssLink)
//	}
//}

//返回脚本内容
//function evalscript(s) {
//	if(s.indexOf('<script') == -1) return s;
//	var p = /<script[^\>]*?>([^\x00]*?)<\/script>/ig;
//	var arr = [];
//	while(arr = p.exec(s)) {
//		var p1 = /<script[^\>]*?src=\"([^\>]*?)\"[^\>]*?(reload=\"1\")?(?:charset=\"([\w\-]+?)\")?><\/script>/i;
//		var arr1 = [];
//		arr1 = p1.exec(arr[0]);
//		if(arr1) {
//			appendscript(arr1[1], '', arr1[2], arr1[3]);
//		} else {
//			p1 = /<script(.*?)>([^\x00]+?)<\/script>/i;
//			arr1 = p1.exec(arr[0]);
//			appendscript('', arr1[2], arr1[1].indexOf('reload=') != -1);
//		}
//	}
//	return s;
//}

//清除脚本内容
//function stripscript(s) {
//	return s.replace(/<script.*?>.*?<\/script>/ig, '');
//}

//动态加在脚本文件
//function appendscript(src, text, reload, charset) {
//	var id = hash(src + text);
//	if(!reload && in_array(id, evalscripts)) return;
//	if(reload && $(id)) {
//		$(id).parentNode.removeChild($(id));
//	}
//
//	evalscripts.push(id);
//	var scriptNode = document.createElement("script");
//	scriptNode.type = "text/javascript";
//	scriptNode.id = id;
//	scriptNode.charset = charset ? charset : (BROWSER.firefox ? document.characterSet : document.charset);
//	try {
//		if(src) {
//			scriptNode.src = src;
//			scriptNode.onloadDone = false;
//			scriptNode.onload = function () {
//				scriptNode.onloadDone = true;
//				JSLOADED[src] = 1;
//			};
//			scriptNode.onreadystatechange = function () {
//				if((scriptNode.readyState == 'loaded' || scriptNode.readyState == 'complete') && !scriptNode.onloadDone) {
//					scriptNode.onloadDone = true;
//					JSLOADED[src] = 1;
//				}
//			};
//		} else if(text){
//			scriptNode.text = text;
//		}
//		document.getElementsByTagName('head')[0].appendChild(scriptNode);
//	} catch(e) {}
//}

//返回按id检索的元素对象
//function $(id) {
//	return !id ? null : document.getElementById(id);
//}

//跨浏览器绑定事件
//function addEventSamp(obj,evt,fn){
//	if(!oTarget){return;}
//	if (obj.addEventListener) {
//		obj.addEventListener(evt, fn, false);
//	}else if(obj.attachEvent){
//		obj.attachEvent('on'+evt,fn);
//	}else{
//		oTarget["on" + sEvtType] = fn;
//	}
//}

//跨浏览器删除事件
//function delEvt(obj,evt,fn){
//	if(!obj){return;}
//	if(obj.addEventListener){
//		obj.addEventListener(evt,fn,false);
//	}else if(oTarget.attachEvent){
//		obj.attachEvent("on" + evt,fn);
//	}else{
//		obj["on" + evt] = fn;
//	}
//}


//返回顶部
//$('a.top').click(function () {
//	$(document.body).animate({scrollTop: 0}, 800);
//	return false;
//});
//<a class="top" href="#">Back to top</a>


//预加载图片
//$.preloadImages = function () {
//	for (var i = 0; i < arguments.length; i++) {
//		$('<img>').attr('src', arguments[i]);
//	}
//};
//$.preloadImages('img/hover1.png','img/hover2.png');

//检查图片是否加载完成
//$('img').load(function () {
//	console.log('image load successful');
//});

//自动修改破损图片
//$('img').on('error', function () {
//	$(this).prop('src', 'img/broken.png');
//});

//阻止链接加载
//$('a.no-link').click(function (e) {
//	e.preventDefault();
//});
