(function() {
  'use strict';

  /**=========================================================
  * File: matter-list.js
  * MatterList Controller
  =========================================================*/

  App.controller('MatterListCtrl', function($rootScope, $scope, $state, Matter) {

    $scope.matterList = [];
    $scope.drafts = [];

    $scope.page = 0; $scope.per_page = 15;
    $scope.getExistingMatters = function() {
        Matter.api.index({page: $scope.page, per_page: $scope.per_page, is_draft: false, is_model:false}).then(function(res) {
          $scope.matterList = res;
        }, function() {});
    }

    $scope.$watch('[page,per_page]', function () {
        $scope.serv = [];
        $scope.getExistingMatters();
    }, true);

    $scope.u_page = 0; $scope.u_per_page = 15;
    $scope.getExistingDrafts = function() {
        Matter.api.index({page: $scope.u_page, per_page: $scope.u_per_page, is_draft: true, is_model:false}).then(function(res) {
          $scope.drafts = res;
        }, function() {});
    }

    $scope.$watch('[u_page,u_per_page]', function () {
        $scope.drafts = [];
        $scope.getExistingDrafts();
    }, true);




  });

})();
