var app = angular.module("app",[]);
// http://192.168.10.96:3000/art.video.share.html?id=24118
// 24023
app.constant("APP_HOST", "https://api.2tai.com");
// app.constant("APP_HOST", "https://101.200.129.132");
// app.constant("APP_HOST", "http://192.168.10.254:8080");
app.config(["$locationProvider",
    function($locationProvider) {
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    }
]);
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
app.directive("myVideo",["device",function(device){
    return {
        restrict:"E",
        replace:true,
        transclude:true,
        scope:{
            src:"@videoSrc",
            poster:"@videoPoster"
        },
        template: function(elem,attrs){
            return '<video controls="'+attrs.controls+'" ng-transclude></video>';
        },
        link:function(scope,elem,attrs){
            var w = parseInt(device.screenW()*1.5);
            var h = parseInt(w*210/375);
            scope.$watch("src",function(){
                elem[0].src = scope.src;
                elem[0].poster = scope.poster+"?x-oss-process=image/resize,m_fill,h_"+h+",w_"+w;
            });

        }
    };
}]);

app.controller("detail",["$scope","$http","APP_HOST","$rootScope","$sce",
    function($scope,$http,APP_HOST,$rootScope,$sce){

        var dataForWeixin = {
			signurl: location.href,
			nonceStr: "2tai" + new Date().getTime(),
			timestamp: new Date().getTime(),
			imgUrl: "",
			lineLink: "http://tpl.2tai.net/art.video.share.html?id=" + $rootScope.id,
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

        // 详情
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
                $scope.videoUrl = res.data.templateData[0].videoUrl;
                $scope.poster = res.data.templateData[0].imageUrl;
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

        //获取comeinCode
        $scope.callApp = function(){
            $http.get(APP_HOST + "/v1/invite/code/info?id="+$rootScope.id)
            .success(function(res){
                console.log("获取comeinCode：",res);
                location.href = "http://tpl.2tai.net/webreg.html?comeinCode="+res.data;
            }).error(function(res){

            });
        };




    }
]);
