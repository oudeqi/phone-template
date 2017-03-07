var app = angular.module('app',[]);
// app.constant('APP_HOST', 'https://api.uoolle.com/');
app.constant('APP_HOST', 'http://192.168.10.254:8080/');
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
        $rootScope.token = $location.search().token;
        console.log($rootScope.worldId);
        console.log($rootScope.token);
    }
]);
app.controller('content',['$scope','$rootScope','APP_HOST','$http','$timeout','$sce','$window','$compile',
    function($scope,$rootScope,APP_HOST,$http,$timeout,$sce,$window,$compile){
        $scope.screenW = parseInt($window.innerWidth / 2);
        // console.log($window);
//http://192.168.0.200:3000/postdetail.circle.html?id=w16120600000002&token=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2Jhc2VfaWQiOiIxMDAwNXwxNDc5MzgxNTgzODE4In0.NM3HBAxhpJgjh8WXvDpz8qO599olClzMFdDis7hh4r0
        //详情 ?worldId=w16120600000010
        //线上 w16120900000008
//http://192.168.0.200:3000/postdetail.circle.html?id=w16121400000037&token=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2Jhc2VfaWQiOiIxMDAxNXwxNDgxNjg3NTk1OTcxIn0.Ibr9OKGPY058fxXZ473lFnVO5Tb21mRScFKPt_rxO54
        $scope.post = null;
        $http.get(APP_HOST + '/v2/aut/world/detail', {
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


        //图片查看
        $scope.picViewer = function(imgList,index){
            var imgStr = imgList.join("|");
            console.log(imgList);
            console.log(imgStr);
            console.log(index);
            if(typeof h5 == "undefined"){
                alert("no such obj");
            }else{
                h5.picViewer(imgStr,index);
            }
        };

        //进入个人主页
        $scope.homepage = function(uid){
            console.log(uid);
            if(typeof h5 == "undefined"){
                alert("no such obj");
            }else{
                h5.homepage(uid);
            }
        };

        //进入话题
        $scope.topic = function(topic,id){
            console.log(topic);
            console.log(id);
            if(topic.type === 0){
                return;
            }
            if(typeof h5 == "undefined"){
                alert("no such obj");
            }else{
                h5.topic(topic.value,id);
            }
        };

        //打赏
        $scope.reward = function(){
            if(typeof h5 == "undefined"){
                alert("no such obj");
            }else{
                h5.reward();
            }
        };

        //删除动态
        $scope.del = function(){
            $http.delete(APP_HOST+'/v2/aut/world/detail',{
                headers:{
                    'Authorization': $rootScope.token
                },
                params:{
                    worldId:$rootScope.worldId
                }
            }).success(function(data){
                console.log("删除动态");
                console.log(data);
                if(data.data === 1){//成功
                    $scope.delSuccInfo = "该内容不存在或已被删除";
                }else{
                    alert("删除失败");
                }
            }).error(function(data){});
        };

        //关注
        $scope.followClicked = false;
        $scope.follow = function(){
            console.log($scope.followClicked);
            if($scope.followClicked){
                return;
            }
            $scope.followClicked = true;
            $http.post(APP_HOST+'v2/aut/group/fans',{
                 uid:$scope.post.userId || null
            },{
      			headers:{
      				'Authorization': $rootScope.token
      			}
      		}).success(function(data){
                console.log(data);
                if(data.data === 1){
                    $scope.post.isFollow = 1;
                }
            }).error(function(data){
                $scope.followClicked = false;
            });
        };

        //点赞
        $scope.iLike = function(post){
            if(post.clicked){
                return;
            }
            post.clicked = true;
            if(!post.like){
                $http.post(APP_HOST+'v1/aut/common/follow',{
                    busType:33,
                    busId:post.id,
                    isFollow:0,
                 },{
                   headers:{
                       'Authorization': $rootScope.token
                   }
               }).success(function(data){
                   console.log(data);
                   if(data.data){
                       post.like = true;
                       post.likeNumbers ++;
                   }
               }).error(function(data){
                   post.clicked = false;
               });
            }
        };

        //打赏列表
        ///v2/aut/world/reward/list?busType=33&busId=w16120600000002
        $http.rewardList = [];
        $scope.getRewardList = function(){
            $http.get(APP_HOST + '/v2/aut/world/reward/list', {
                headers: {
                    'Authorization': $rootScope.token,
                },
                params:{
                    busType:33,
                    busId:$rootScope.worldId
                }
            }).success(function(data){
                console.log("打赏列表");
                console.log(data);
                if(!data.data.errMessage){
                    $scope.rewardList = data.data.data;
                }
            }).error(function(data){

            });
        };
        $scope.getRewardList();

        $scope.edit = false;
        $scope.commentContent = "";
        $scope.pid = null;

        $scope.cancelComment = function(){
            $scope.edit = false;
            $scope.commentContent = "";
            $scope.holder = "";
        };

        //评论文章
        $scope.postComment = function(){
            $scope.edit = true;
            $scope.pid = null;
            $scope.holder = "";
            $scope.replyArr = [];
            $scope.index = null;
        };

        //回复评论
        $scope.replyComment = function(item){
            console.log(item);
            $scope.edit = true;
            $scope.pid = item.id;
            $scope.holder = item.uName;
            $scope.replyArr = item.sumComment;
            $scope.index = null;
        };

        //回复回复
        $scope.replyReply = function(item,i,index){
            console.log(item);
            console.log(i);
            console.log(index);
            console.log(item.sumComment);
            $scope.edit = true;
            $scope.pid = i.id;
            $scope.replyArr = item.sumComment;
            $scope.holder = i.uName;
            $scope.index = index;
        };
        $scope.sendComment = function(){
            if(!$scope.commentContent){
                return;
            }
            var postDate = {};
            if($scope.pid){//回复
                postDate = {
                    busType:33,
                    busId:$rootScope.worldId,
                    pid:$scope.pid,
                    content:$scope.commentContent
                };
            }else{//评论
                postDate = {
                    busType:33,
                    busId:$rootScope.worldId,
                    content:$scope.commentContent
                };
            }
            $http.post(APP_HOST+'v1/aut/common/comment',postDate,{
                headers:{
                    'Authorization': $rootScope.token
                }
            }).success(function(data){
                console.log("评论成功");
                console.log(data);
                $scope.commentContent = "";
                $scope.edit = false;
                //刷新数据
                if($scope.pid){
                    if($scope.index || $scope.index === 0){//回复回复
                        data.data.uName = "我";
                        $scope.replyArr.splice($scope.index,0,data.data);
                    }else{//回复评论
                        data.data.uName = "我";
                        data.data.pUname = "";
                        $scope.replyArr.unshift(data.data);
                    }
                    $scope.replyArr = null;//清空回复数组
                }else{//评论
                    $scope.commentList.unshift(data.data);
                    $scope.post.commentNumbers ++;
                }
            }).error(function(data){

            });
        };

    }
]);

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



