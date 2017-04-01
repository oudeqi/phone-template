;(function(){

    'use strict';

    var app = angular.module("app",[]);
    app.constant("HOST","http://101.200.129.132");
    app.config(["$locationProvider",
        function($locationProvider) {
            $locationProvider.html5Mode({enabled: true, requireBase: false});
        }
    ]);
    app.run(["$rootScope", "$location",
        function($rootScope, $location) {
            $rootScope.id = $location.search().id;
        }
    ]);
    app.controller("detail",["$scope","$http","HOST","$rootScope",function($scope,$http,HOST,$rootScope){

        var dataForWeixin = {
			signurl: location.href,
			nonceStr: "2tai" + new Date().getTime(),
			timestamp: new Date().getTime(),
			imgUrl: "",
            // lineLink: "http://tpl.2tai.net/art.multpic.share.html?id=" + $rootScope.id,
            lineLink: location.href,
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

        $http.get(HOST+"/v1/vote/details",{
            params: {
                id: $rootScope.id
            },
            headers: {
                "Authorization": ""
            }
        }).then(function(res){
            console.log("获取活动详情：",res);
            $scope.detail = res.data.data;

            dataForWeixin.imgUrl = res.data.data.coverPhoto;
            dataForWeixin.descContent = res.data.data.actProfile;
            dataForWeixin.shareTitle = res.data.data.title;

        }).catch(function(error){
            console.log(error);
        });

        $scope.goPlayerDetail = function(id){
            location.href = "./vote.player.html?id="+id;
        };

        $scope.goVoteDetail = function(id){
            location.href = "./vote.detail.html?id="+id;
        };

        $scope.download = function(){
            location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.union.ertai";
        };

        $scope.keywords = "";
        $scope.pageSize = 10;
        $scope.pageIndex = 1;
        $scope.list = [];
        $scope.loading = 0;//1，加载中 2，加载更多 3，加载完所有
        $scope.getList = function(){
            $scope.loading = 1;
            $http.get(HOST+"/v1/player/list",{
                params: {
                    id: $rootScope.id,
                    type: 1,//type:1 最新，2，排名
                    keywords:$scope.keywords,
                    pageSize:$scope.pageSize,
                    pageIndex:$scope.pageIndex
                },
                headers:{
                    "Authorization":""
                }
            }).then(function(res){
                $scope.clicked = false;
                console.log("获取参选者列表：",res);
                if(res.data.data.data && typeof res.data.data.data==="object"){
                    angular.forEach(res.data.data.data,function(item){
                        $scope.list.push(item);
                    });
                    if(res.data.data.pageCount == res.data.data.pageIndex){
                        $scope.loading = 3;
                    }else{
                        $scope.pageIndex = res.data.data.pageIndex + 1;
                        $scope.loading = 2;
                    }
                }else{
                    $scope.loading = 0;
                }

            }).catch(function(error){
                $scope.clicked = false;
                $scope.loading = 0;
                console.log(error);
            });
        };
        $scope.getList();

        $scope.clicked = false;
        $scope.search = function(){
            if($scope.clicked){
                return;
            }
            $scope.clicked = true;
            $scope.pageIndex = 1;
            $scope.list = [];
            $scope.getList();
        };

        //获取 Ticket
        $http.get(HOST + "/v1/wx/token")
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







    }]);
})();
