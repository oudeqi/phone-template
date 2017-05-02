var app = angular.module("app_travel_info_commit", []);
app.constant("APP_HOST", "https://api.2tai.com");
app.config(["$locationProvider",
	function($locationProvider) {
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	}
]);
app.run(["$rootScope", "$location",
	function($rootScope, $location) {
		//&sellerName="+$scope.detail.sellerName+"&createDate="+$scope.detail.createDate; 

		$rootScope.id = $location.search().id;
		$rootScope.token = $location.search().token || "";
		$rootScope.sellerName = $location.search().sellerName;
		$rootScope.createDate = $location.search().createDate;
		$rootScope.title = $location.search().title;
	}
]);
app.factory("device", ["$window", function($window) {
	var userAgent = $window.navigator.userAgent.toLowerCase();

	function find(needle) {
		return userAgent.indexOf(needle) !== -1;
	}
	return {
		screenW: function() {
			return parseInt($window.innerWidth);
		},
		iphone: function() {
			return find('iphone');
		},
		android: function() {
			return find('android');
		}
	};
}]);
app.controller("ctl_travel_info_commit", ["$scope", "$http", "APP_HOST", "$rootScope", "$sce", "$timeout",
	function($scope, $http, APP_HOST, $rootScope, $sce, $timeout) {
		$scope.id = $rootScope.id;
		$scope.token = $rootScope.token;
		$scope.sellerName = $rootScope.sellerName;
		$scope.createDate = $rootScope.createDate;
		$scope.title = $rootScope.title;

		var dataForWeixin = {
			signurl: location.href,
			nonceStr: "2tai" + new Date().getTime(),
			timestamp: new Date().getTime(),
			imgUrl: "",
			lineLink: "http://tpl.2tai.net/art.imgtxt.share.html?id=" + $rootScope.id,
			descContent: "",
			shareTitle: "",
			appid: "wx7c0b913b4c5452ad",
			cbtrigger: function(res) {
				dataForWeixin.nonceStr = "x" + new Date().getTime();
			},
			cbsuccess: function(res) {},
			cbcancel: function(res) {},
			cbfail: function(res) {},
			cbcomplete: function(res) {}
		};
		
		$scope.ldmoreShow=true;
		$scope.ldmoreShowTxt="加载更多";

		/*获取评论*/
		$scope.pageIndex = 1;
		$scope.rowCount = 0;
		$scope.commentList = [];
		$scope.getComment = function() {
			$scope.ldmoreShowTxt="加载中...";
			$http.get(APP_HOST + "/v1/common/comment?busType=30&pageIndex=" + $scope.pageIndex + "&pageSize=20&busId=" + $rootScope.id, {
					headers: {
						'Authorization': $rootScope.token
					}
				})
				.success(function(res) {
					if(res.data.length<20){
						$scope.ldmoreShow=false;
					}
					console.log("获取评论：", res);
					$scope.ldmoreShowTxt="加载更多";
					if(res && typeof res === "object") {
						$scope.rowCount = res.rowCount;
						if(res.data.length > 0) {
							$scope.pageIndex++;
							angular.forEach(res.data, function(item, i) {
								$scope.commentList.push(item);
							});
						}
					}
				}).error(function(res) {

				});
		};
		$scope.getComment();

		$scope.loading = false;
		$scope.goload = function(txth) {
			$scope.loadingtitletxt = txth;
			$scope.loadingtitlestyle = {
				"top": "0.5rem",
			}
			//			var _this=$scope.loadingtitlestyle;
			$timeout(function() {
				$scope.loadingtitlestyle = {
					"top": "-5rem",
				}
			}, 2500)
			//				setTimeout(function(){
			//					$scope.loadingtitlestyle={
			//						"top":"-5rem",
			//					}
			//				},3000)

		}
		/*打开评论*/
		$scope.commentShow = false;
		$scope.openComment = function(num) {
			//				if($scope.token){
			if(num == 1) {
				$scope.commentShow = true;
			}
			if(num == 2) {
				$scope.commentShow = false;
			}
		}
		/*相机*/
		$scope.cac = null;

		/*图片*/
		$scope.caa = null;

		$scope.ctlog = function() {
			alert($scope.cac);
			alert($scope.caa);
		}
		$scope.gogogo = null;
		$scope.delpic = function() {
			console.log("删除图片")
			$scope.gogogo = 'dffdf';
			$scope.gogogo = 'sdsd';
			$scope.checkPic = false;
			$scope.checkPic1 = {
				"width": "calc(92.8% - .8rem)"
			}
			$scope.checkPic2 = {
				"transform": "translate(0,0)"
			}
		}
		$scope.checkPic = false;
		$scope.checkPic1 = {
			//				"width":"calc(92.8% - 6rem)"
			"width": "calc(92.8% - .8rem)"
		}
		$scope.checkPic2 = {
			//				"transform":"translate(4rem,0)"
			"transform": "translate(0,0)"
		}
		$scope.fileChange = function(_this, i) {
			var content = _this.parentNode.parentNode.parentNode;
			var file = _this.files[0];
			if(!/image\/\w+/.test(file.type)) {
				return false;
			}
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(e) {
				$scope.gogogo = e.target.result;
				//              	console.log($scope.gogogo)
				$scope.checkPic = true;
				$scope.checkPic1 = {
					"width": "calc(92.8% - 6rem)"
				}
				$scope.checkPic2 = {
					"transform": "translate(4rem,0)"
				}
				$scope.$apply(function() {
					$scope["pic" + i] = true;
				});

				console.log("改变了")
				//                  console.log(e.target.result)
				//					$scope.gogogo=e.target.result;
				//					var k=document.createElement("img");
				//					k.setAttribute("class","inbtimg1");
				//					k.setAttribute("src",e.target.result);
				//					k.setAttribute("id","gogo");
				//					<img id="gogo" class="inbtimg1" ng-src="{{gogogo}}" src="img/add-pic.png" alt="" />
				//					document.getElementById("gogo").replaceNode(k);
				//                  content.querySelector(".pic-view").innerHTML='<img src="' + e.target.result +'" alt="" />';
			};
		};

		$scope.ctContent = null;
		$scope.ctImg = null; /*base64 位图片*/
		$scope.busId = $rootScope.id;

		$scope.goComment = function() {
			$scope.loading = true;
			if($scope.gogogo) {
				$scope.ctImg = $scope.gogogo.split(",")[1]
			}
			if($scope.ctContent) {} else {
				$scope.goload("请输入评论内容");
				$scope.loading = false;
				return;
			}

			$http.post(APP_HOST + "/v1/aut/common/comment", {
				busType: 30,
				busId: $scope.busId,
				pid: '',
				content: $scope.ctContent,
				imgBase64List: [$scope.ctImg]
			}, {
				headers: {
					'Authorization': $rootScope.token
				}
			}).success(function(data) {
				if(data.errMessage) {
					$scope.goload(data.errMessage);
				} else {
					$scope.ctContent = null;
					$scope.ctImg = null;
					$scope.goload("成功评论");
					$scope.delpic();
					$scope.openComment(2);
				}

				$scope.loading = false;
				console.log("评论成功:", data)
			}).error(function(data) {
				$scope.loading = false;
				$scope.goload("网络错误");
			})
		}

		/*获取详情*/
		$http.get(APP_HOST + "/v1/info/visitor/" + $rootScope.id, {
			params: {
				token: $rootScope.token
			}
		}).success(function(res) {
			console.log("获取详情：", res);
			if(res.data && typeof res.data === "object") {
				//分享信息
				dataForWeixin.imgUrl = res.data.shareImg;
				dataForWeixin.descContent = res.data.introduction;
				dataForWeixin.shareTitle = res.data.title;
				// 显示数据
				$scope.detail = res.data;
				$scope.tpl = $sce.trustAsHtml(res.data.templateData[0].content);
			}
		}).error(function(res) {

		});

		/*去文章首页*/
		$scope.goHome = function() {
			location.href = "./travel_info.html?id=" + $scope.id + "&token=" + $scope.token;
		}

		/*点赞评论*/
		$scope.likeComment = function(item) {
			//     	/v1/aut/common/follow
			$http.post(APP_HOST + "/v1/aut/common/follow", {
				busType: 11,
				busId: item.id,
			}, {
				headers: {
					'Authorization': $rootScope.token
				}
			}).success(function(data) {
				if(data.errMessage) {} else {
					item.isLike = 1;
					item.likesNumber = item.likesNumber + 1;
					$scope.closeTools();
				}

			}).error(function(data) {

			})
		}

		//评论的评论
		/*评论的评论*/
		$scope.cmtcmt="回复: 就快乐圣诞节疯狂";
		$scope.cmtcmtshow=false;
		$scope.loading1=false;
		$scope.ctContent1=null;
		$scope.cmtcmtall=null;
		/*去评论*/
		
		$scope.goComment1 = function() {
			$scope.loading1 = true;
			if($scope.ctContent1) {} else {
				$scope.goload("请输入评论内容");
				$scope.loading1 = false;
				return;
			}

			$http.post(APP_HOST + "/v1/aut/common/comment", {
				busType: 30,
				busId: $scope.cmtcmtall.busId,
				pid: $scope.cmtcmtall.id,
				content: $scope.ctContent1,
				imgBase64List: []
			}, {
				headers: {
					'Authorization': $rootScope.token
				}
			}).success(function(data) {
				if(data.errMessage) {
					$scope.goload(data.errMessage);
				} else {
					$scope.ctContent1 = null;
					$scope.goload("成功评论");
					$scope.openComment1(2,null);
				}

				$scope.loading = false;
				console.log("评论成功:", data)
			}).error(function(data) {
				$scope.loading = false;
				$scope.goload("网络错误");
			})
		}

		
		/*关闭或者打开评论窗口*/
		$scope.openComment1=function(num,item){
			$scope.cmtcmtall=item;
			if(num == 1) {
				$scope.cmtcmtshow = true;
			}
			if(num == 2) {
				$scope.cmtcmtshow = false;
			}
			$scope.closeTools();
		}
		
		//复制
		$scope.copyTxt=function(){
			$scope.goload("不支持，请自行复制");
			$scope.closeTools();
		}
		
		//分享
		$scope.goShare=function(){
				var n1=$scope.detail.title;
                var n2=$scope.detail.introduction;
                var n3=$scope.detail.shareImg;
				var n4="https://tpl.2tai.com/travel_info_share.html?id="+$scope.detail.id;
               if(typeof h5=="object"){
                    h5.showNativeShareDialog(n1,n2,n3,n4)
                } 
		}
		
		//举报
		$scope.report=function(item){
//			/v1/aut/common/report
			$http.post(APP_HOST + "/v1/aut/common/report", {
				busType:11,
				busId:item.id,
				reportType:"违规",
			}, {
				headers: {
					'Authorization': $rootScope.token
				}
			}).success(function(data) {
				if(data.errMessage) {
					$scope.goload(data.errMessage);
					
				} else {
					$scope.goload("举报成功");

				}
				$scope.openComment1(2,null);
			}).error(function(data) {
				$scope.goload("网络错误");
			})
		}
		
		//预览图片
		$scope.picViewer=function(imgx){
			if(typeof h5=="object"){
                h5.picViewer(imgx,0);
            }
		}

		/*更多工具*/
		$scope.toolsShow = false;
		$scope.toolsShowStyle = {
			"left": "0",
			"top": "0"
		}
		$scope.closeTools = function() {

			$scope.commentList.forEach(function(val, index) {
				val.showtools = false;
			})
			$scope.toolsShow = false;
		}
		$scope.showTools = function($event, item) {
			console.log($event.target.innerHTML);
			$scope.closeTools();
			item.showtools = true;
			//    	$scope.toolsShowStyle={
			//    		"top":"calc("+$event.clientY+"px - 4.57rem)",
			//    		"left":"30px"
			//	      }
			//    	$scope.toolsShow=true;
			console.log("更多工具:", $event);
			console.log("点击的屏幕位置:", $event.screenY)
		}
		$scope.toggleTools=function($event,item){
			var kk=angular.element(document.getElementById("otid"));
			kk[0].placeholder="回复 ： "+item.uName;
			console.log(kk)
			if(item.showtools){
				$scope.closeTools();
			}else{
				$scope.closeTools();
				item.showtools = true;
			}
		}

	}
]);

function hidetools() {
	var appElement = document.querySelector('[ng-controller="ctl_travel_info_commit"]');
	var $scope = angular.element(appElement).scope();
	$scope.closeTools(); //k$apply()
	$scope.$apply();
}

function cgPlea(item){
	document.getElementById("otid").placeholder="回复: "+item
}

