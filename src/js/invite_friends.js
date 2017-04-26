(function(win,doc){
    var docEl = document.documentElement,
        resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize',
        recalc = function() {
            if(docEl.clientWidth > 750){
                docEl.style.fontSize = (750 * 14 / 375) + 'px';
            }else if(docEl.clientWidth <= 320){
                docEl.style.fontSize = (320 * 14 / 375) + 'px';
            }else{
                docEl.style.fontSize = (docEl.clientWidth * 14 / 375) + 'px';
            }
        };
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(window,document);
function loginBackToken(token){
    localStorage.token_yq=token;
    localStorage.token_nn=token;
    var appElement = document.querySelector('[ng-controller="appct"]');
    var $scope = angular.element(appElement).scope();
    $scope.getInfox();//k$apply()
    $scope.$apply();
    // location.reload();
}


// var APP_HOST="http://192.168.10.254:8080"
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
			$scope.xd=null;
            $scope.show=false;
            $scope.openShow=function(){
                if(localStorage.token_nn){
                        $scope.getInfox();
                   }else{
                     $scope.openLogin();
                     return;
                   }
                $scope.show=true;
            }
            $scope.closeShow=function(){
                $scope.show=false;
            }
            /*调用原生登录*/
            $scope.openLogin=function(){
                if(typeof h5=="object"){
                    h5.openLogin();
                }
            }



           // if(localStorage.token_nn){

           // }else{
           //   $scope.openLogin();
           // }
            

            


            
            
            $scope.goShare=function(){
                if(localStorage.token_nn){
                   }else{
                     $scope.openLogin();
                     return;
                   }
            
                var n1=$scope.xd.nickName+"邀请您加入「2台」了解本地资讯，分享快乐生活";
                var n2="Hi,我向您砸了1000U币，快来下载2台APP，了解本地资讯，优惠购买地方特产，赶快领取吧！";
                var n3="http://tpl.2tai.net/img/logo.jpg";
//              var n4="http://tpl.2tai.net/webreg.html?code="+$scope.xd.inviteCode;
				var n4="http://a.app.qq.com/o/simple.jsp?pkgname=com.union.ertai"
               if(typeof h5=="object"){
                    h5.showNativeShareDialog(n1,n2,n3,n4)
                 // h5.showNativeShareDialog(xd.nickName+"邀请您加入「2台」了解本地资讯，分享快乐生活", "Hi,我向您砸了1000U币，快来下载2台APP，了解本地资讯，优惠购买地方特产，赶快领取吧！","img/logo.jpg", APP_HOST+"/webreg.html?code="+xd.inviteCode);
                } 
            }
            
			// http://localhost:8080/v1/aut/invite/barcode?token=
			// localStorage.token

            $scope.getInfox=function(){
                if(localStorage.token_nn){
                    $http.get(APP_HOST+"/v1/aut/invite/barcode", {
                    headers: {
                        'Authorization':localStorage.token_nn,
                    }
                    }).success(function(data){
                        $scope.xd=data.data;
                       console.log($scope.xd); 
                    }).error(function(data){
                       console.log(data);
                    });
               }else{
                  
               }
            }
            $scope.getInfox();

                
			

	}
])
