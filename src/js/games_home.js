var app=angular.module("games",[]);
app.controller("gamesCt",["$scope","$location",
	function($scope,$location){

		$scope.back = function(){
			if(typeof h5 == "object"){
				h5.mallBack();
			}
		};

		$scope.banner=[{
			previewUrl:"img/games/bg2.png",
//			go:'http://www.jywgame.com/media.php/TuiRegister/login/pid/73/gid/10',
			go:'http://www.jywgame.com/media.php/TuiRegister/login/pid/73/gid/10?gameid=10&pid=73&id=9zEFLdcpUH4X2ddPnFHeig==&username=15184435898',
			

		},{
			previewUrl:"img/games/bg1.png",
//			go:'http://www.jywgame.com/media.php/TuiRegister/login/pid/73/gid/10',
			go:'http://www.jywgame.com/media.php/TuiRegister/login/pid/73/gid/34?gameid=34&pid=73&id=9zEFLdcpUH4X2ddPnFHeig==&username=15184435898',
		
		}]
//		http://www.yingshantongchengbang.com/media.php/TuiRegister/login/pid/10/gid/2?gameid=2&id=9zEFLdcpUH4X2ddPnFHeig==&pid=10&username=15184435898
// http://www.yingshantongchengbang.com/media.php/TuiRegister/login/pid/73/gid/74?gameid=74&id=9zEFLdcpUH4X2ddPnFHeig==&pid=73&username=15184435898
		$scope.gamesInfo=[{
			name:"大侠归来",
			content:"郭氏夫妇、东方教主、独孤…",
			subTitle:"最近超过8万人玩过",
			imgSrc:"img/games/1.png",
			go:'http://www.jywgame.com/media.php/TuiRegister/login/pid/73/gid/34?gameid=34&pid=73&id=9zEFLdcpUH4X2ddPnFHeig==&username=15184435898',
			},{
			name:"蜀山世界",
			content:"试问情仇路几番沉浮？",
			subTitle:"最近超过3万人玩过",
			imgSrc:"img/games/2.png",
//			go:"http://www.jywgame.com/media.php/TuiRegister/login/pid/73/gid/74",
			go:'http://www.jywgame.com/media.php/TuiRegister/login/pid/73/gid/74?gameid=74&pid=73&id=9zEFLdcpUH4X2ddPnFHeig==&username=15184435898',
		},{
			name:"联盟与部落",
			content:"超多经典的魔兽英雄选择",
			subTitle:"最近超过2.7万人玩过",
			imgSrc:"img/games/3.png",
//			go:"http://www.jywgame.com/media.php/TuiRegister/login/pid/73/gid/10",
go:'http://www.jywgame.com/media.php/TuiRegister/login/pid/73/gid/10?gameid=10&pid=73&id=9zEFLdcpUH4X2ddPnFHeig==&username=15184435898',
		},{
			name:"超神之刃",
			content:"燃烧军团再次觉醒…",
			subTitle:"最近超过3.6万人玩过",
			imgSrc:"img/games/4.png",
//			go:"http://www.jywgame.com/media.php/TuiRegister/login/pid/73/gid/78",
go:'http://www.jywgame.com/media.php/TuiRegister/login/pid/73/gid/78?gameid=78&pid=73&id=9zEFLdcpUH4X2ddPnFHeig==&username=15184435898',
		},{
			name:"烈火战神",
			content:"双属性逆天出击",
			subTitle:"最近超过2万人玩过",
			imgSrc:"img/games/5.png",
//			go:"http://www.jywgame.com/media.php/TuiRegister/login/pid/73/gid/75",
go:'http://www.jywgame.com/media.php/TuiRegister/login/pid/73/gid/75?gameid=75&pid=73&id=9zEFLdcpUH4X2ddPnFHeig==&username=15184435898',
		},]

		// $location.url('http://baidu.com');
		// window.location.href = 'http://baidu.com'


	}
])

app.directive("appBanner",["device",function(device){
    var w = parseInt(device.screenW * 1.5),
        h = parseInt(device.screenW * 266 / 375 * 1.5);
    return {
        restrict: 'E',
        replace: true,
        scope:{
            banner:'=bannerArr'
        },
        template:function(element, attrs){
            var tpl = '<div class="banner">';
                tpl +=      '<ul class="pic-view">';
                tpl +=          '<li ng-repeat="item in banner track by $index">';
                tpl +=              '<a ng-href="{{item.go}}">';
                tpl +=                  '<img ng-src="{{item.previewUrl}}?x-oss-process=image/resize,m_fill,h_'+h+',w_'+w+'" />';
                tpl +=              '</a>';
                tpl +=          '</li>';
                tpl +=      '</ul>';
                tpl += '</div>';
            return tpl;
        },
        link:function(scope, element, attrs){
            scope.$watch("banner",function(nv,ov){
                if(scope.banner && scope.banner.length > 0){
                    photoSlide({
                        wrap: element[0],
                        loop: true,
                        autoPlay:true,
                        autoTime:4000,
                        pagination:true
                    });
                }
            });
        }
    };
}]);


app.factory('device',['$window',function($window){
    return {
        screenW : parseInt($window.innerWidth)
    };
}]);
