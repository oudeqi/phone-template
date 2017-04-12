;(function(){

    "use strict";
    var app = angular.module("app",["app.confirm","app.openInBrowser"]);
    app.constant("HOST","https://api.2tai.com");
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
            },
            weiXin : function(){
                return find('micromessenger');
            },
            iosQqApp : function(){//iosQqApp
                return find('qq') && find('iphone') && !find('mqqbrowser');
            }
        };
    }]);

    app.controller("detail",["$scope","$http","HOST","$rootScope","device","$timeout","confirmModal","openInBrowser",
        function($scope,$http,HOST,$rootScope,device,$timeout,confirmModal,openInBrowser){
            $scope.w = parseInt(device.screenW());
            $scope.h = parseInt(device.screenW()*200/155);

            window.addEventListener("scroll",function(e){
                if(window.innerHeight + document.body.scrollTop > document.querySelector(".warpper").offsetHeight - 1){
                    if($scope.loading == "0" || $scope.loading == "2"){
                        console.log("加载数据...");
                        $scope.getList();
                    }
                }
            },false);

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
                console.log("dataForWeixin:",dataForWeixin);

            }).catch(function(error){
                console.log(error);
            });

            $scope.goPlayerDetail = function(id){
                localStorage.setItem("currentPage",$scope.pageIndex);
                localStorage.setItem("currentScrollTop",document.body.scrollTop);
                localStorage.setItem("currentKeywords",$scope.keywords);
                location.href = "./vote.player.html?id="+id+"&vote="+$rootScope.id;
            };

            $scope.goVoteDetail = function(id){
                location.href = "./vote.detail.html?id="+id;
            };

            $scope.goSignup = function(id){
                location.href = "./vote.signup.html?id="+id;
            };

            $scope.download = function(){
                location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.union.ertai";
            };

            $scope.confirm = function(){
                if(device.weiXin() || device.iosQqApp()){
                    openInBrowser.open();
                }else{
                    var modalInstance = confirmModal.open({
                        tit:"温馨提示",
                        desc:"本投票活动由2台app提供，需要安装2台app才可进行投票，若已经安装则不需要下载。是否前往下载？",
                        cancelBtnTxt:"拒绝",
                        okBtnTxt:"前往下载",
                    });
                    modalInstance.then(function(data){
                        console.log(data);
                        $scope.download();
                    },function(data){
                        console.log(data);
                    });
                    var param = {
                        h5Url:"http://vote.2tai.net/index.html?id="+$rootScope.id,
                        action:1,
                        busType:30,
                    };
                    var paramStr = JSON.stringify(param);
                    location.href = "union://ertai?content="+encodeURIComponent(paramStr);
                }
            };

            $scope.keywords = "";
            $scope.pageSize = 10;
            $scope.pageIndex = 1;
            $scope.list = [];
            $scope.loading = 0;//1，加载中 2，加载更多 3，加载完所有 4，历史加载中 5,暂无数据
            $scope.getList = function(){
                $scope.loading = 1;
                $http.get(HOST+"/v1/player/list",{
                    params: {
                        id: $rootScope.id,
                        type: 2,//type:1 最新，2，排名
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
                        if(res.data.data.rowCount === 0){
                            $scope.loading = 5;
                        }else{
                            if(res.data.data.pageCount == res.data.data.pageIndex){
                                $scope.loading = 3;
                            }else{
                                $scope.pageIndex = res.data.data.pageIndex + 1;
                                $scope.loading = 2;
                            }
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

            var currentPage = localStorage.getItem("currentPage");
            var currentScrollTop = localStorage.getItem("currentScrollTop");
            var currentKeywords = localStorage.getItem("currentKeywords");
            console.log(currentPage,currentScrollTop,currentKeywords);
            if(currentPage && currentScrollTop){
                $scope.loading = 4;
                $http.get(HOST+"/v1/player/list",{
                    params: {
                        id: $rootScope.id,
                        type: 1,//type:1 最新，2，排名
                        keywords:currentKeywords,
                        pageSize:(parseInt(currentPage)-1)*$scope.pageSize,
                        pageIndex:1
                    },
                    headers:{
                        "Authorization":""
                    }
                }).then(function(res){
                    console.log("获取参选者列表：",res);
                    localStorage.removeItem("currentPage");
                    localStorage.removeItem("currentScrollTop");
                    localStorage.removeItem("currentKeywords");
                    if(res.data.data.data && typeof res.data.data.data==="object"){
                        angular.forEach(res.data.data.data,function(item){
                            $scope.list.push(item);
                        });

                        $timeout(function(){
                            document.body.scrollTop = currentScrollTop;
                            if(res.data.data.pageCount == res.data.data.pageIndex){
                                $scope.loading = 3;
                            }else{
                                $scope.pageIndex = parseInt(currentPage);
                                $scope.loading = 2;
                            }
                        },300);
                    }else{
                        $scope.loading = 0;
                    }

                }).catch(function(error){
                    $scope.loading = 0;
                    localStorage.removeItem("currentPage");
                    localStorage.removeItem("currentScrollTop");
                    localStorage.removeItem("currentKeywords");
                    console.log(error);
                });
            }else{
                $scope.getList();
            }

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

        }
    ]);
})();
