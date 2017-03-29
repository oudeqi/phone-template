var app = angular.module('app', []);
app.constant('host', 'https://api.uoolle.com/');
app.config([
    '$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    }
]);
app.controller('reg', [
    '$scope',
    'host',
    '$timeout',
    '$interval',
    '$http',
    '$location',
    function($scope, host, $timeout, $interval, $http, $location) {

        if ($location.search().comeinCode) {
            $scope.comeinCode = $location.search().comeinCode;
        } else {
            $scope.comeinCode = "";
        }

        if ($location.search().rpOpenid) {
            $scope.rpOpenid = $location.search().rpOpenid;
        } else {
            $scope.rpOpenid = "";
        }

        $scope.tel = '';
        $scope.vcode = '';
        $scope.pwd = '';

        // 注册是否成功
        $scope.regSucc = false;

        var reg = /^1\d{10}$/;
        $scope.eyeOpen = false;
        $scope.eyeSwitch = function() {
            $scope.eyeOpen = !$scope.eyeOpen;
        };

        // 去下载app
        $scope.downloadApp = function() {
            window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.union.ertai";
        };

        var counter = 60;
        $scope.codeBtnTxt = '发送验证码';
        $scope.codeBtnClicked = false;

        $scope.countDown = function() {
            $scope.codeBtnTxt = counter + '秒重新发送';
            var timer = $interval(function() {
                if (counter > 0) {
                    counter--;
                    $scope.codeBtnTxt = counter + '秒重新发送';
                } else {
                    $interval.cancel(timer);
                    $scope.codeBtnClicked = false;
                    counter = 60;
                    $scope.codeBtnTxt = '发送验证码';
                }
            }, 1000);
        };

        $scope.sendCode = function() {
            if ($scope.tel === '') {
                $scope.msg = '手机号码不能为空';
                $timeout(function() {
                    $scope.msg = '';
                }, 1500);
                return;
            }
            if ($scope.tel.match(reg)) {
                $scope.codeBtnClicked = true; //不能点击
                $http.post(host + '/v1/user/check', {phoneNumber: $scope.tel}).success(function(data) {
                    console.log(data);
                    if (data.data == 1) {
                        $scope.msg = '该手机号码已被注册';
                        $timeout(function() {
                            $scope.msg = '';
                        }, 1500);
                        $scope.codeBtnClicked = false; //能点击
                    } else {
                        // 手机号未被注册 --发送验证码
                        $http.post(host + '/v1/msg/sendVerifyCode', {phone: $scope.tel}).success(function(data) {
                            console.log(data);
                            if (data.data) {
                                $scope.countDown(); //倒计时
                            } else { //验证码发送失败
                                $scope.codeBtnClicked = false; //能点击
                                $scope.msg = data.errMessage;
                                $timeout(function() {
                                    $scope.msg = '';
                                }, 1500);
                            }
                        }).error(function() {
                            $scope.codeBtnClicked = false; //能点击
                        });
                    }
                }).error(function(data) {
                    $scope.codeBtnClicked = false; //能点击
                });
            } else { //手机号码格式错误
                $scope.msg = '手机号码格式错误';
                $timeout(function() {
                    $scope.msg = '';
                }, 1500);
            }
        };

        $scope.webReg = function() {
            if ($scope.tel === '') {
                $scope.msg = '手机号码不能为空';
                $timeout(function() {
                    $scope.msg = '';
                }, 1500);
                return;
            }
            if (!$scope.tel.match(reg)) {
                $scope.msg = '手机号码格式错误';
                $timeout(function() {
                    $scope.msg = '';
                }, 1500);
                return;
            }
            if ($scope.vcode === '') {
                $scope.msg = '请填写手机验证码';
                $timeout(function() {
                    $scope.msg = '';
                }, 1500);
                return;
            }
            if ($scope.pwd.length < 6 || $scope.pwd.length > 20) {
                $scope.msg = '密码长度为 6-20 位';
                $timeout(function() {
                    $scope.msg = '';
                }, 1500);
                return;
            }
            $http.post(host + '/v1/msg/verifyMsg', {
                phone: $scope.tel,
                code: $scope.vcode
            }).success(function(data) {
                console.log(data);
                if (data.data) { //验证成功
                    $http.post(host + '/v1/user/register', {
                        phoneNumber: $scope.tel,
                        password: $scope.pwd,
                        comeinCode: $scope.comeinCode,
                        wxUserInfo:{
                            rpOpenid:$scope.rpOpenid
                        }
                    }).success(function(data) {
                        if (data.errMessage) {
                            $scope.msg = data.errMessage;
                            $timeout(function() {
                                $scope.msg = '';
                            }, 1500);
                        } else {
                            //注册成功
                            $scope.msg = '';
                            $scope.regSucc = true;
                            $scope.token = data.data.token;
                            $http.get(host + "/v1/aut/download/barcode", {
                                headers: {
                                    'Authorization': $scope.token,
                                    'Content-Type': 'application/json;charset=utf-8'
                                }
                            }).success(function(data) {
                                $scope.userCount = data.data.userCount;
                                $scope.inviteName = data.data.inviteName;
                            });
                        }
                    });
                } else {
                    //未发送过验证码的号码，提示 请验证手机号码
                    $scope.msg = "验证码错误";
                    $timeout(function() {
                        $scope.msg = '';
                    }, 1500);
                }
            });
        };
    }
]);
