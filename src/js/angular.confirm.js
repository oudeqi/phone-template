;(function(){

    "use strict";

    var app = angular.module("ng.confirm",[]);
    app.run(["$rootScope",function($rootScope){
        var tpl = '';
        //  ng-controller="ng.confirm"
        tpl += '<div class="confirm" ng-show="show">';
        tpl += '    <div class="inner">';
        tpl += '        <h3 class="confirm-header">{{tit}}</h3>';
        tpl += '        <div class="confirm-body">';
        tpl += '            <p>{{desc}}</p>';
        tpl += '        </div>';
        tpl += '        <div class="confirm-footer">';
        tpl += '            <div class="btns">';
        tpl += '                <button type="button" name="button" ng-click="cancel()">{{cancelBtnTxt}}</button>';
        tpl += '            </div>';
        tpl += '            <div class="btns">';
        tpl += '                <button type="button" name="button" ng-click="ok()">{{okBtnTxt}}</button>';
        tpl += '            </div>';
        tpl += '        </div>';
        tpl += '    </div>';
        tpl += '</div>';
        var newNode = document.createElement("div");
        newNode.innerHTML = tpl;
        document.body.appendChild(newNode);
    }]);
    app.factory("confirmModal",["$q",function($q){
        var deferred = $q.defer();
        return {
            show:false,
            tit:"",
            desc:"",
            cancelBtnTxt:"",
            okBtnTxt:"",
            deferred:deferred,
            open:function(obj){
                this.show = true;
                if(obj){
                    this.tit = obj.tit || "标题1";
                    this.desc = obj.desc || "描述1";
                    this.cancelBtnTxt = obj.cancelBtnTxt || "取消1";
                    this.okBtnTxt = obj.okBtnTxt || "确认1";
                }else{
                    this.tit = "标题";
                    this.desc = "描述";
                    this.cancelBtnTxt = "取消";
                    this.okBtnTxt = "确认";
                }
                return {
                    result:deferred.promise
                };
            }
        };
    }]);
    app.controller("ng.confirm",["$scope","confirmModal",function($scope,confirmModal){
        $scope.show = confirmModal.show;
        $scope.tit= confirmModal.tit;
        $scope.desc= confirmModal.desc;
        $scope.cancelBtnTxt= confirmModal.cancelBtnTxt;
        $scope.okBtnTxt= confirmModal.okBtnTxt;
        $scope.cancel = function(){
            confirmModal.deferred.reject("haha");
            $scope.show = false;
            confirmModal.show = false;
        };
        $scope.ok = function(){
            confirmModal.deferred.resolve('你好');
            $scope.show = false;
            confirmModal.show = false;
        };
    }]);
})();
