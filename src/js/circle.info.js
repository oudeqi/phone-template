var app = angular.module('app',[]);
app.constant('APP_HOST', 'https://api.2tai.com/');
// app.constant('APP_HOST', 'http://192.168.10.254:8080/');
app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    }
]);
app.directive('tap',function(){
    return function(scope, elem, attrs){
        var start,end,t,moved = false;
        elem.bind('touchstart',function(e){
            start = e.timeStamp;
            moved = false;
            elem.css({
                "opacity":"0.7"
            });
        });
        elem.bind('touchmove',function(e){
            end = e.timeStamp;
            t = end - start;
            if(t>300){
                e.preventDefault();
            }
            moved = true;
        });
        elem.bind('touchend',function(e){
            elem.css({
                "opacity":"1"
            });
            end = e.timeStamp;
            t = end - start;
            if(!moved && t>10 && t<300){
                if(attrs.tap){
                    scope.$apply(attrs.tap);
                }
            }
        });
    };
});
app.directive('getFocus',function(){
    return function(scope, elem, attrs){
        scope.$watch(attrs.getFocus,function(n,o){
            if(n){
                setTimeout(function(){
                    elem[0].focus();
                    elem[0].click();
                },320);
            }else{
                setTimeout(function(){
                    elem[0].blur();
                },320);
            }
        });
    };
});
app.run(['$rootScope', '$location',
    function($rootScope, $location) {
        $rootScope.worldId = $location.search().id;
        if($location.search().token && $location.search().token != "null" && $location.search().token != "undefined"){
            $rootScope.token = $location.search().token;
        }else{
            $rootScope.token = null;
        }
        console.log($rootScope.worldId);
        console.log($rootScope.token);
    }
]);
app.controller('content',['$scope','$rootScope','APP_HOST','$http','$timeout','$sce','$window','$compile',
    function($scope,$rootScope,APP_HOST,$http,$timeout,$sce,$window,$compile){

        $scope.reload = function(token){
            location.href = "./postdetail.circle.html?id="+$rootScope.worldId+"&token="+token;
        };
        
        $scope.videoUrl = function(url){  
	       return $sce .trustAsResourceUrl(url);  
	    }
        
        /*去下载页面*/
        $scope.goDownload=function(){
        	location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.union.ertai";
        }
        
        /*是否登录*/
        $scope.isLogin=function(){
        	
        }
        
	    
	    $scope.screenW = parseInt($window.innerWidth / 2);
        // console.log($window);
        //http://192.168.10.96:3000/postdetail.circle.html?id=w17031400000006&token=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2Jhc2VfaWQiOiIxMDAwNXwxNDc5MzgxNTgzODE4In0.NM3HBAxhpJgjh8WXvDpz8qO599olClzMFdDis7hh4r0
        $scope.post = null;
        /*获取详情*/
        $http.get(APP_HOST + '/v2/world/detail', {
            headers: {
                'Authorization': $rootScope.token,
            },
            params:{
                worldId:$rootScope.worldId,
            }
        }).success(function(data){
            console.log("获取详情");
            console.log(data);
            data.data.clicked = false;
            $scope.post = data.data;
            // $scope.post.isMe = 1;
            var domArr = [];
            angular.forEach($scope.post.content.split("#"),function(v,i){
                var obj = {};
                if(i%2 === 0){
                    obj.type = 0;
                    obj.value = v;
                }else{
                    obj.type = 1;
                    obj.value = "#"+v+"#";
                }
                domArr.push(obj);
            });
            $scope.domArr = domArr;
            $scope.commentList =  $scope.post.commentList || [];
            
        }).error(function(data){});
        
        
        /*评论文章*/
        $scope.postComment = function(){
            if(!$rootScope.token){
                if(typeof h5 == "object"){
                    h5.openLogin();
                }
                return;
            }
            $scope.edit = true;
            $scope.pid = null;
            $scope.holder = "";
            $scope.replyArr = [];
            $scope.index = null;
        };
	    
	    


    }
]);

function loginBackToken(token){
    console.log(token);
    var appElement = document.querySelector('[ng-controller="content"]');
    var $scope = angular.element(appElement).scope();
    $scope.reload(token);
}

//在全局调用控制器里的模型
function rewardcb(){
    var appElement = document.querySelector('[ng-controller="content"]');
    var $scope = angular.element(appElement).scope();
    $scope.getRewardList();//改变了模型，想同步到控制器中，则需要调用$apply()
    $scope.$apply();
}


//获取服务
function getAngularService(name){
    var $injector = angular.element("body").injector();
    return $injector.get(name);
}

