var app = angular.module('app',[]);
app.directive('tap',function(){
    return function(scope, elem, attrs){
        var start,end,t,moved = false;
        elem.bind('touchstart',function(e){
            start = e.timeStamp;
            moved = false;
            elem.css("opacity","0.7");
        });
        elem.bind('touchmove',function(e){
            // e.preventDefault();
            moved = true;
        });
        elem.bind('touchend',function(e){
            elem.css("opacity","1");
            end = e.timeStamp;
            t = end - start;
            if(!moved && t>60 && t<300){
                if(attrs.tap){
                    scope.$apply(attrs.tap);
                }
            }
        });
    };
});
app.controller('lottery',['$scope',function($scope){

    $scope.downloadApp = function() {
        window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.uoolle.yunju";
    };

}]);
