;(function(){

    "use strict";

    var app = angular.module("app.confirm",[]);
    app.run(["$rootScope","confirmModal",function($rootScope,confirmModal){
        var tpl = '';
        tpl += '<div class="confirm" ng-show="isConfirmShow">';
        tpl += '    <div class="inner">';
        tpl += '        <h3 class="confirm-header">{{confirmTit}}</h3>';
        tpl += '        <div class="confirm-body">';
        tpl += '            <p>{{confirmDesc}}</p>';
        tpl += '        </div>';
        tpl += '        <div class="confirm-footer">';
        tpl += '            <div class="btns">';
        tpl += '                <button type="button" name="button" ng-click="confirmCancel()">{{confirmCancelBtnTxt}}</button>';
        tpl += '            </div>';
        tpl += '            <div class="btns">';
        tpl += '                <button type="button" name="button" ng-click="confirmOk()">{{confirmOkBtnTxt}}</button>';
        tpl += '            </div>';
        tpl += '        </div>';
        tpl += '    </div>';
        tpl += '</div>';
        var newNode = document.createElement("div");
        newNode.innerHTML = tpl;
        document.body.appendChild(newNode);
        $rootScope.isConfirmShow = confirmModal.isConfirmShow;
        $rootScope.confirmTit = confirmModal.confirmTit;
        $rootScope.confirmDesc = confirmModal.confirmDesc;
        $rootScope.confirmCancelBtnTxt = confirmModal.confirmCancelBtnTxt;
        $rootScope.confirmOkBtnTxt = confirmModal.confirmOkBtnTxt;
        $rootScope.confirmCancel = function(){
            $rootScope.isConfirmShow = false;
            confirmModal.deferred.reject("取消");
        };
        $rootScope.confirmOk = function(){
            $rootScope.isConfirmShow = false;
            confirmModal.deferred.resolve("确认");
        };
    }]);
    app.factory("confirmModal",["$rootScope","$q",function($rootScope,$q){
        function getDeferred() {
            return $q.defer();
        }
        return {
            deferred : null,
            isConfirmShow:false,
            confirmTit:"温馨提示",
            confirmDesc:"描述",
            confirmCancelBtnTxt:"取消",
            confirmOkBtnTxt:"确认",
            open:function(obj){
                if(obj){
                    $rootScope.confirmTit = obj.tit || this.confirmTit;
                    $rootScope.confirmDesc = obj.desc || this.confirmDesc;
                    $rootScope.confirmCancelBtnTxt = obj.cancelBtnTxt || this.confirmCancelBtnTxt;
                    $rootScope.confirmOkBtnTxt = obj.okBtnTxt || this.confirmOkBtnTxt;
                }else{
                    $rootScope.confirmTit = this.confirmTit;
                    $rootScope.confirmDesc = this.confirmDesc;
                    $rootScope.confirmCancelBtnTxt = this.confirmCancelBtnTxt;
                    $rootScope.confirmOkBtnTxt = this.confirmOkBtnTxt;
                }
                $rootScope.isConfirmShow = true;
                this.deferred = getDeferred();
                return this.deferred.promise;
            }
        };
    }]);


})();
