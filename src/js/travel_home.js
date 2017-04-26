
var APP_HOST="https://api.2tai.com"
var app=angular.module("app",[]);
app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    }
]);

app.run(['$rootScope', '$location',"$window",
    function($rootScope, $location,$window) {
        if($location.search().token && $location.search().token != "null" && $location.search().token != "undefined"){
            localStorage.token_nn = $location.search().token;
        }else{
            localStorage.removeItem("token_nn");
        }
    }
]);

app.controller("appct",["$scope","$http",
	function($scope,$http){
			
			

	}
])
