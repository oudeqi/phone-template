;(function(){
    "use strict";
    var app = angular.module("app.back",[]);
    app.directive("appBack",function(){
        return {
            restrict:"E",
            replace:true,
            template:function(el,attrs){
                var tpl = '';
                if(!!attrs.back && attrs.back !== ''){
                    tpl += '<a href="javascript:void(0);" ng-click="'+attrs.back+'" class="app-back" type="button">';
                }else{
                    tpl += '<a href="javascript:history.go(-1);" class="app-back" type="button">';
                }
                tpl += '<i class="icon"></i>';
                tpl += '</a>';
                return tpl;
            }
        };
    });

})();
