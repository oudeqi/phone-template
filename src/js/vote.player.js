;(function(){

    'use strict';

    var app = angular.module("app",["app.confirm","app.openInBrowser"]);
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
            }).catch(function(error){
                console.log(error);
            });

            $scope.download = function(){
                location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.union.ertai";
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

        }
    ]);
})();
