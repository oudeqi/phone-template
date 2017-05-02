;(function(){

    'use strict';

    var app = angular.module("app",["app.confirm","app.openInBrowser","app.back"]);
    app.constant("HOST","http://101.200.129.132");
    app.config(["$locationProvider",
        function($locationProvider) {
            $locationProvider.html5Mode({enabled: true, requireBase: false});
        }
    ]);
    app.run(["$rootScope", "$location",
        function($rootScope, $location) {
            $rootScope.id = $location.search().id;
            $rootScope.vote = $location.search().vote;
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
    app.controller("detail",["$scope","$http","HOST","$rootScope","device","confirmModal","openInBrowser",
        function($scope,$http,HOST,$rootScope,device,confirmModal,openInBrowser){

            $scope.w = parseInt(device.screenW());

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

            $http.get(HOST+"/v1/player/detail",{
                params: {
                    id: $rootScope.id
                },
                headers: {
                    "Authorization": ""
                }
            }).then(function(res){
                console.log("获取选手详情：",res);
                $scope.detail = res.data.data;
                dataForWeixin.imgUrl = res.data.data.photos[0];
                dataForWeixin.descContent = '快来给我投票吧！';
                dataForWeixin.shareTitle = '我是 '+res.data.data.name;
                shareInit();
            }).catch(function(error){
                console.log(error);
            });

            $scope.download = function(){
                location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.union.ertai";
            };

            $scope.goShare = function(id){
                location.href = "./vote.share.html?id="+$rootScope.vote;
            };

            $scope.confirm = function(){
                if(device.weiXin() || device.iosQqApp()){
                    openInBrowser.open();
                }else{
                    var modalInstance = confirmModal.open({
                        tit:"温馨提示",
                        desc:"本投票活动由2台app提供，需要安装2台app才可进行投票和报名，若已经安装则不需要下载。是否前往下载？",
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
                        h5Url:"http://vote.2tai.net/index.html?id="+$rootScope.vote,
                        action:1,
                        busType:30,
                    };
                    var paramStr = JSON.stringify(param);
                    location.href = "union://ertai?content="+encodeURIComponent(paramStr);
                }
            };

            //获取 Ticket
            function shareInit(){
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
                    wx.error(function(res) {});
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

        }
    ]);
})();
