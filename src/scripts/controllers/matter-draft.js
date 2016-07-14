(function() {
  'use strict';

  /**=========================================================
  * File: matter-draft.js
  * MatterDraft Controller
  =========================================================*/

  App.controller('MatterDraftCtrl', function($scope, $state, Matter) {

    $scope.drafts = [];
    $scope.isLoading = false;
    $scope.perPage = 15;
    $scope.currentPage = 0;
    $scope.totalItems = 0;

    function activate() {
      getDrafts();
    }

    activate();

    function getDrafts() {
      $scope.isLoading = true;
      Matter.api.index({
        is_draft: true,
        page: $scope.currentPage,
        per_page: $scope.perPage
      }).then(function(data){
        $scope.drafts = data.matters;
        $scope.totalItems = data.total_items;
        $scope.isLoading = false;
      }).catch(function(err){
        $scope.isLoading = false;
      });
    }

    $scope.nextMatter = function(page) {
      $scope.currentPage = page-1;
      getDrafts();
    };

  });

})();
