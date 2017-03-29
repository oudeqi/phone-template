var app = angular.module("app",[]);
// http://192.168.10.96:3000/art.imgtxt.share.html?id=24017
// 24023
//app.constant("APP_HOST", "https://api.2tai.com");
   app.constant("APP_HOST", "http://101.200.129.132");
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
app.controller("detail",["$scope","$http","APP_HOST","$rootScope","$sce",
    function($scope,$http,APP_HOST,$rootScope,$sce){

		$scope.detail=null;
		
		
		$http.get(APP_HOST+"/v1/info/get?id="+$rootScope.id,{
		}).success(function(res){
			$scope.detail=res.data;
			$scope.tpl = $sce.trustAsHtml(res.data.content);
			console.log("我是新的详情",res)
		}).error(function(res){
			console.log("错误信息",res);
		})

       




    }
]);
