;(function(){

    "use strict";
    var app = angular.module("app",["app.confirm","app.back"]);
    app.constant("HOST","https://api.2tai.com");
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
            },
            weiXin : function(){
                return find('micromessenger');
            },
            iosQqApp : function(){//iosQqApp
                return find('qq') && find('iphone') && !find('mqqbrowser');
            }
        };
    }]);
    app.controller("signup",["$scope","$rootScope","$http","HOST","$timeout","confirmModal",
        function($scope,$rootScope,$http,HOST,$timeout,confirmModal){

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

            $scope.pic0 = false;
            $scope.pic1 = false;
            $scope.pic2 = false;

            $scope.fileChange = function(_this,i){
                var content = _this.parentNode.parentNode.parentNode;
                var file = _this.files[0];
                if(!/image\/\w+/.test(file.type)){
                    return false;
                }
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload=function(e){
                    $scope.$apply(function(){
                        $scope["pic"+i] = true;
                    });
                    content.querySelector(".pic-view").innerHTML='<img src="' + e.target.result +'" alt="" />';
                };
            };

            $scope.delPic = function(i){
                var picView = document.querySelector("#signup").querySelectorAll(".pic-view")[i];
                picView.innerHTML = "";
                $timeout(function(){
                    $scope["pic"+i] = false;
                },0);
            };

            //报名
            $scope.postData = {
                voteSetId:$rootScope.id,
                name:"",
                phoneNo:"",
                declaration:"",
                base64Photos:[]
            };

            $scope.goShare = function(id){
                location.href = "./vote.share.html?id="+$rootScope.id;
            };

            $scope.nameInvalid = false;
            $scope.phoneNoInvalid = false;

            $scope.checkName = function(){
                if(!!$scope.postData.name){
                    $scope.nameInvalid = false;
                }else{
                    $scope.nameInvalid = true;
                }
            };
            $scope.checkPhoneNo = function(){
                if(/^(0|[1-9][0-9]{10})$/.test($scope.postData.phoneNo)){
                    $scope.phoneNoInvalid = false;
                }else{
                    $scope.phoneNoInvalid = true;
                }
            };

            $scope.loading = 0;
            $scope.signUp = function(){
                if(!$scope.postData.name){
                    $scope.nameInvalid = true;
                    return false;
                }else{
                    $scope.nameInvalid = false;
                }
                if(!/^(0|[1-9][0-9]{10})$/.test($scope.postData.phoneNo)){
                    $scope.phoneNoInvalid = true;
                    return false;
                }else{
                    $scope.phoneNoInvalid = false;
                }
                var img1 = document.querySelector("#signup").querySelectorAll("img")[1];
                var img2 = document.querySelector("#signup").querySelectorAll("img")[2];
                var img3 = document.querySelector("#signup").querySelectorAll("img")[3];
                if(img1 && img2 && img3){
                    $scope.postData.base64Photos[0] = img1.getAttribute("src");
                    $scope.postData.base64Photos[1] = img2.getAttribute("src");
                    $scope.postData.base64Photos[2] = img3.getAttribute("src");
                }else{
                    return false;
                }
                console.log($scope.postData);
                if($scope.loading == 1){
                    return false;
                }
                $scope.loading = 1;
                $http.post(HOST+'/v1/vote/player',{
                    voteSetId:$scope.postData.voteSetId,
                    name:$scope.postData.name,
                    phoneNo:$scope.postData.phoneNo,
                    declaration:$scope.postData.declaration,
                    base64Photos:$scope.postData.base64Photos,
                 },{
                    headers:{
                        "Authorization":""
                    }
                }).then(function(res){
                    $scope.loading = 0;
                    console.log("报名：",res);
                    if(res.data.data){
                        var modalInstance = confirmModal.open({
                            tit:"温馨提示",
                            desc:"报名成功，请耐心等待审核！如有疑问请联系客服。",
                            cancelBtnTxt:"关闭",
                            okBtnTxt:"活动首页",
                        });
                        modalInstance.then(function(data){
                            location.href = "./vote.share.html?id="+$rootScope.id;
                        },function(data){
                            location.reload();
                            console.log($scope.postData);
                        });
                    }else{
                        alert(res.data.errMessage);
                    }
                }).catch(function(error){
                    $scope.loading = 0;
                    alert("请求失败");
                    console.log(error);
                });
            };
        }
    ]);


})();
