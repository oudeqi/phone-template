var app = angular.module('app',[]);
app.constant('APP_HOST', 'http://partner.uoolle.com');
// app.constant('APP_HOST', 'http://192.168.10.254:8082/');
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
app.controller('lottery',['$scope','$http','APP_HOST','$interval',
    function($scope,$http,APP_HOST,$interval){

        var timer;
        $scope.getDate = function(){
            $http.get(APP_HOST+'/v1/meeting/prize')
            .success(function(data){
                console.log(data);
                if(!data.errMessage){
                    $scope.lottery = data.data;
                    if($scope.lottery.lucks.lenght >= $scope.lottery.luckNumber){
                        $interval.cancel(timer);
                        timer = undefined;
                    }
                }
            }).error(function(data){

            });
        };
        $scope.getDate();
        timer = $interval($scope.getDate,3000);
        $scope.modalIsShow = false;
        $scope.newLottery = {
            number:"",
            luckNumber:""
        };
        $scope.addNew = function(){
            console.log($scope.newLottery);
            if(!!$scope.newLottery.number && !!$scope.newLottery.luckNumber && $scope.newLottery.number > $scope.newLottery.luckNumber){
                $http.post(APP_HOST+'/v1/meeting/prize',{
                    number:$scope.newLottery.number,
                    luckNumber:$scope.newLottery.luckNumber
                }).success(function(data){
                    console.log(data);
                    if(!data.errMessage){
                        location.reload();
                    }
                }).error(function(data){

                });
            }
        };
    }
]);
