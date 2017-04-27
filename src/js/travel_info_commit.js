var app = angular.module("app_travel_info_commit",[]);
app.constant("APP_HOST", "https://api.2tai.com");
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
app.controller("ctl_travel_info_commit",["$scope","$http","APP_HOST","$rootScope","$sce",
    function($scope,$http,APP_HOST,$rootScope,$sce){ 
 		  $scope.nohot='dsjlfsjdkf'; 	
}]);
    