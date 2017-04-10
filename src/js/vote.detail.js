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
    app.controller("detail",["$scope","$http","HOST","$rootScope","device",function($scope,$http,HOST,$rootScope,device){

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
        }).catch(function(error){
            console.log(error);
        });

        $scope.download = function(){
            location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.union.ertai";
        };
        $scope.confirmStatus = 0;
        $scope.openInBrowser = 0;
        $scope.iphone = device.iphone();
        $scope.android = device.android();
        $scope.confirm = function(){
            if(device.weiXin() || device.iosQqApp()){
                $scope.openInBrowser = 1;
            }else{
                $scope.confirmStatus = 1;
                var param = {
                    h5Url:"http://vote.2tai.net/index.html?id="+$rootScope.id,
                    action:1,
                    busType:30,
                };
                var paramStr = JSON.stringify(param);
                location.href = "union://ertai?content="+encodeURIComponent(paramStr);
            }

        };
        $scope.cancel = function(){
            $scope.confirmStatus = 0;
        };

    }]);
})();
