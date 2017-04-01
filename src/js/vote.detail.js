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

    }]);
})();
