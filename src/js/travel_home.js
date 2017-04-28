/*联联旅游 主页*/
/*chemingwei rain@myi.us */
var APP_HOST="https://api.2tai.com"
var app=angular.module("app",[]);
app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    }
]);

app.run(["$rootScope", "$location",
	function($rootScope, $location) {
		$rootScope.token = $location.search().token || "";
	}
]);

app.controller("appct",["$scope","$http","$rootScope",
	function($scope,$http,$rootScope){
	$scope.ldck=true; //开启滑动加载更多
	$scope.ldtitle="点击加载更多";
	window.addEventListener("scroll",function(e){
        if(window.innerHeight + document.body.scrollTop > document.querySelector(".warpper").offsetHeight - 1){
				if($scope.ldck==true){
					 $scope.getList();
				}   
        }
    },false);

		
	//获取列表
	$scope.pageIndex=1;
	$scope.gd=[];
	$scope.getList=function(){
		$scope.ldtitle="加载中...";
		$http.get(APP_HOST + "/v1/travel/home", {
			params: {
				pageIndex:$scope.pageIndex,
			}
		}).success(function(res) {
			angular.forEach(res.data.data,function(val,ind){
				$scope.gd.push(val);
				console.log(val)
			})
			$scope.pageIndex++;
			if(res.data.data==null){
				/*列表为空*/
				$scope.ldck=false;
				$scope.ldtitle='没有更多了..'
			}else{
				$scope.ldtitle="点击加载更多";
				console.log("列表详情：", res);
				
			}
			
			
		}).error(function(res) {

		});
	}
	$scope.getList();
	
	//去详情
	$scope.goInfo=function(item){
		location.href="./travel_info.html?id="+item.infoId+"&token="+$rootScope.token;
	}
			

	}
])
