;(function(){
    "use strict";
    var app = angular.module("app.openInBrowser",[]);
    app.run(["$rootScope","openInBrowser","device",function($rootScope,openInBrowser,device){
        var tpl = '';
        tpl += '<div class="open-in-browser" ng-show="isOpenInBrowserShow">';
        tpl += '    <div class="contain">';
        tpl += '        <p class="p1">';
        tpl += '            <span>点击右上角 “</span>';
        tpl += '            <i></i><i></i><i></i>';
        tpl += '            <span>” 按钮</span>';
        tpl += '        </p>';
        tpl += '        <p class="p2" ng-show="openInBrowserIsAndroid">';
        tpl += '            <span>选择</span>';
        tpl += '            <img src="./img/browser.png" alt="">';
        tpl += '            <span>在浏览器中打开</span>';
        tpl += '        </p>';
        tpl += '        <p class="p2" ng-show="openInBrowserIsIphone">';
        tpl += '            <span>选择</span>';
        tpl += '            <img src="./img/safari.png" alt="">';
        tpl += '            <span>在浏览器中打开</span>';
        tpl += '        </p>';
        tpl += '        <p class="p3">即可参与投票</p>';
        tpl += '        <p class="arrow-up">';
        tpl += '            <img src="./img/arrow-up.png" alt="">';
        tpl += '        </p>';
        tpl += '        <p class="close-cont">';
        tpl += '            <button class="close-btn" type="button" ng-click="closeOpenInBrowser()">';
        tpl += '                <img src="./img/close.png" alt="">';
        tpl += '            </button>';
        tpl += '        </p>';
        tpl += '    </div>';
        tpl += '</div>';

        var newNode = document.createElement("div");
        newNode.innerHTML = tpl;
        document.body.appendChild(newNode);
        $rootScope.isOpenInBrowserShow = openInBrowser.isShow;
        $rootScope.openInBrowserIsIphone = device.iphone();
        $rootScope.openInBrowserIsAndroid = device.android();
        $rootScope.closeOpenInBrowser = function(){
            $rootScope.isOpenInBrowserShow = false;
        };
    }]);

    app.factory("openInBrowser",["$rootScope",function($rootScope){
        return {
            isShow: false,
            open: function(){
                $rootScope.isOpenInBrowserShow = true;
            },
            close: function(){
                $rootScope.isOpenInBrowserShow = false;
            }

        };
    }]);

})();
