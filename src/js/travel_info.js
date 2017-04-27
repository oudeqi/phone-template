/*联联旅游 资讯详情页*/
/*chemingwei rain@myi.us */
var APP_HOST="https://api.2tai.com"
var app=angular.module("app",[]);
app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    }
]);

//app.run(['$rootScope', '$location',"$window",
//  function($rootScope, $location,$window) {
//      if($location.search().token && $location.search().token != "null" && $location.search().token != "undefined"){
//          localStorage.token_nn = $location.search().token;
//      }else{
//          localStorage.removeItem("token_nn");
//      }
//  }
//]);
app.run(["$rootScope", "$location",
    function($rootScope, $location) {
        $rootScope.id = $location.search().id;
        $rootScope.token =$location.search().token || "";
    }
]);
app.factory("device",["$window",function($window){
    var userAgent = $window.navigator.userAgent.toLowerCase();
    function find(needle){
        return userAgent.indexOf(needle) !== -1;
    }
    return {
        screenW : function(){
            return parseInt($window.innerWidth);
        },
        iphone : function(){
            return find('iphone');
        },
        android : function(){
            return find('android');
        }
    };
}]);

app.controller("appct",["$scope","$http","$rootScope","$sce",
	function($scope,$http,$rootScope,$sce){
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
		
			$scope.manx={
				"height":"6.1rem",
			}
			$scope.reward_more={
				"transform": "rotate(90deg)"
			}
			$scope.loady=true;
			$scope.loadLike=function(){
				if($scope.loady){
					$scope.manx={
					"height":"auto",
					}
					$scope.reward_more={
					"transform": "rotate(270deg)"
					}
					$scope.loady=false;
				}else{
					$scope.manx={
					"height":"7rem",
					}
					$scope.reward_more={
					"transform": "rotate(90deg)"
					}
					$scope.loady=true;
				}
				
			}
			
			/*打开评论*/
			$scope.commentShow=false;
			$scope.openComment=function(num){
//				if($scope.token){
					if(num==1){
					$scope.commentShow=true;
					}
					if(num==2){
						$scope.commentShow=false;
					}
//				}else{
//					$scope.openLogin();
//				}
				
				
				
			}
			
			/*相机*/
			$scope.cac=null;
			
			/*图片*/
			$scope.caa=null;
			
			$scope.ctlog=function(){
				alert($scope.cac);
				alert($scope.caa);
			}
			$scope.gogogo=null;
			$scope.delpic=function(){
				console.log("删除图片")
				$scope.gogogo='dffdf';
				$scope.gogogo='sdsd';
				$scope.checkPic=false;
				$scope.checkPic1={
					"width":"calc(92.8% - .8rem)"
				}
				$scope.checkPic2={
					"transform":"translate(0,0)"
				}
			}
			$scope.checkPic=false;
			$scope.checkPic1={
//				"width":"calc(92.8% - 6rem)"
				"width":"calc(92.8% - .8rem)"
			}
			$scope.checkPic2={
//				"transform":"translate(4rem,0)"
				"transform":"translate(0,0)"
			}
			$scope.fileChange = function(_this,i){
                var content = _this.parentNode.parentNode.parentNode;
                var file = _this.files[0];
                if(!/image\/\w+/.test(file.type)){
                    return false;
                }
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload=function(e){
                	$scope.gogogo=e.target.result;
                	$scope.checkPic=true;
                	$scope.checkPic1={
						"width":"calc(92.8% - 6rem)"
					}
                	$scope.checkPic2={
						"transform":"translate(4rem,0)"
					}
                    $scope.$apply(function(){
                        $scope["pic"+i] = true;
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
            
            
        /*评论该文章*/
//     {
//		"busType":"30",
//		"busId":"",
//		"pid":"",
//		"content":"",
//		"imgBase64List":["base64 img","base64 img"]
//		}
       $scope.ctContent=null;
       $scope.ctImg=null; /*base64 位图片*/
       $scope.busId=$rootScope.id;
       
       $scope.goComment=function(){
       	$http.post(APP_HOST+"/v1/aut/common/comment",{
       		busType:30,
       		busId:$scope.busId,
       		pid:'',
       		content:$scope.ctContent,
       		imgBase64List:[$scope.ctImg]
       	},{
       		headers:{
      				'Authorization': $rootScope.token
      			}
       	}).success(function(data){
       		
       	}).error(function(data){
       		
       	})
       }
            
            
        /*获取详情*/
        $http.get(APP_HOST + "/v1/info/visitor/"+$rootScope.id,{
            params: {
                token: $rootScope.token
            }
        }).success(function(res){
            console.log("获取详情：",res);
            if(res.data && typeof res.data === "object"){
            	//分享信息
                dataForWeixin.imgUrl = res.data.shareImg;
    			dataForWeixin.descContent = res.data.introduction;
    			dataForWeixin.shareTitle = res.data.title;
                // 显示数据
                $scope.detail = res.data;
                $scope.tpl = $sce.trustAsHtml(res.data.templateData[0].content);
                //修复微信视频
                setTimeout(function(){
                    var iframeArr = document.querySelectorAll("iframe");
                    var tplDom = document.querySelector(".tpl_content");
                    var style = window.getComputedStyle ? window.getComputedStyle(tplDom,null) : null || tplDom.currentStyle;
                    var w = style.width;
                    for (var i = 0; i < iframeArr.length; i++) {
                        iframeArr[i].width = w;
                        iframeArr[i].height = parseInt(w)*258/345+"px";
                        // console.log(iframeArr[i].contentWindow.document.querySelector("video"));
                    }
                    console.log(iframeArr);
                },300);
            }
        }).error(function(res){

        });
         //点赞
        $http.get(APP_HOST + "/v1/common/follow?busType=30&isFollow=0&busId="+$rootScope.id)
        .success(function(res){
        	$scope.liket=res;
            console.log("获取点赞：",res);
            if(res.data && typeof res.data === "object"){
                $scope.praise = res.data;
                var praiseList = [];
                $scope.praise.forEach(function(item,i){
                    praiseList.push(item.nickName);
                });
                $scope.praiseList = praiseList.join("、");
            }
        }).error(function(res){

        });
        
         //评论
        $scope.pageIndex = 1;
        $scope.rowCount = 0;
        $scope.commentList = [];
        $scope.getComment = function(){
            $http.get(APP_HOST + "/v1/common/comment?busType=30&pageIndex="+$scope.pageIndex+"&pageSize=5&busId="+$rootScope.id)
            .success(function(res){
                console.log("获取评论：",res);
                if(res && typeof res === "object"){
                    $scope.rowCount = res.rowCount;
                    if(res.data.length > 0){
                        $scope.pageIndex ++;
                        angular.forEach(res.data,function(item,i){
                            $scope.commentList.push(item);
                        });
                    }
                }
            }).error(function(res){

            });
        };
        $scope.getComment();
        
        //获取 Ticket
        $http.get(APP_HOST + "/v1/wx/token")
        .success(function(res){
            console.log("获取Ticket：",res);
            var signature = "jsapi_ticket=" + res.data.ticket + "&noncestr=" + dataForWeixin.nonceStr + "&timestamp=" + dataForWeixin.timestamp + "&url=" + dataForWeixin.signurl;
            // console.log(signature);
            signature = CryptoJS.SHA1(signature).toString();
            wx.config({
				debug: false,
				appId: dataForWeixin.appid,
				timestamp: dataForWeixin.timestamp,
				nonceStr: dataForWeixin.nonceStr,
				signature: signature,
				jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline','onMenuShareQQ']
			});
            // wx.error(function(res) {});
            wx.ready(function(e) {
    			//分享给好友
    			wx.onMenuShareAppMessage({
    				title: dataForWeixin.shareTitle,
    				desc: dataForWeixin.descContent,
    				link: dataForWeixin.lineLink,
    				imgUrl: dataForWeixin.imgUrl,
    				trigger: function(res) {
    					dataForWeixin.cbtrigger(res);
    				},
    				success: function(res) {
    					dataForWeixin.cbsuccess(res);
    				},
    				cancel: function(res) {
    					dataForWeixin.cbcancel(res);
    				},
    				fail: function(res) {
    					dataForWeixin.cbfail(res);
    				}
    			});
    			//分享到朋友圈
    			wx.onMenuShareTimeline({
    				title: dataForWeixin.shareTitle,
    				link: dataForWeixin.lineLink,
    				imgUrl: dataForWeixin.imgUrl,
    				trigger: function(res) {
    					dataForWeixin.cbtrigger(res);
    				},
    				success: function(res) {
    					dataForWeixin.cbsuccess(res);
    				},
    				cancel: function(res) {
    					dataForWeixin.cbcancel(res);
    				},
    				fail: function(res) {
    					dataForWeixin.cbfail(res);
    				}
    			});
    			//分享到qq
    			wx.onMenuShareQQ({
    				title: dataForWeixin.shareTitle,
    				desc: dataForWeixin.descContent,
    				link: dataForWeixin.lineLink,
    				imgUrl: dataForWeixin.imgUrl,
    				trigger: function(res) {
    					dataForWeixin.cbtrigger(res);
    				},
    				complete: function(res) {
    					dataForWeixin.cbcomplete(res);
    				},
    				success: function(res) {
    					dataForWeixin.cbsuccess(res);
    				},
    				cancel: function(res) {
    					dataForWeixin.cbcancel(res);
    				},
    				fail: function(res) {
    					dataForWeixin.cbfail(res);
    				}
    			});
    		});
        }).error(function(res){

        });

		/*share*/
		$scope.goShare=function(){
				var n1="邀请您加入「2台」了解本地资讯，分享快乐生活";
                var n2="Hi,我向您砸了1000U币，快来下载2台APP，了解本地资讯，优惠购买地方特产，赶快领取吧！";
                var n3="http://tpl.2tai.net/img/logo.jpg";
				var n4="http://a.app.qq.com/o/simple.jsp?pkgname=com.union.ertai"
               if(typeof h5=="object"){
                    h5.showNativeShareDialog(n1,n2,n3,n4)
                } 
		}
		
		/*调用原生登录*/
        $scope.openLogin=function(){
            if(typeof h5=="object"){
                h5.openLogin();
            }
        }
			
			

	}
])

