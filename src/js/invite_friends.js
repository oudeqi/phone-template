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
var APP_HOST="http://192.168.10.254:8080"
var app=angular.module("app",[]);
app.controller("appct",["$scope","$http",
	function($scope,$http){
			$scope.xd=null;
            $scope.show=false;
            $scope.openShow=function(){
                $scope.show=true;
            }
            $scope.closeShow=function(){
                $scope.show=false;
            }
            $scope.goShare=function(){
               if(typeof h5=="object"){
                    h5.showNativeShareDialog(xd.nickName+"邀请您加入「2台」了解本地资讯，分享快乐生活", "Hi,我向您砸了1000U币，快来下载2台APP，了解本地资讯，优惠购买地方特产，赶快领取吧！","img/logo.jpg", APP_HOST+"/webreg.html?code="+xd.inviteCode);
                } 
            }
            
			// http://localhost:8080/v1/aut/invite/barcode
			// localStorage.token
			$http.get(APP_HOST+"/v1/aut/invite/barcode", {
                    headers: {
                        'Authorization':'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2Jhc2VfaWQiOiIxMDAwNXwxNDgyMjAxODEyNzAzIn0.s6AfZ_AmoK0_5_sqYO3Db0eJQaLtvKORk2EYvzr8jzg',
                    }
                }).success(function(data){
                	$scope.xd=data.data;
                   console.log($scope.xd); 
                }).error(function(data){
                   console.log(data);
                });

	}
])
