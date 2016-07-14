(function() {
  'use strict';

  /**=========================================================
  * File: matter-list.js
  * MatterList Controller
  =========================================================*/

  App.controller('MatterListCtrl', function($scope, $state, Matter) {

    $scope.matters = [];
    $scope.isLoading = false;
    $scope.perPage = 15;
    $scope.currentPage = 0;
    $scope.totalItems = 0;

    function activate() {
      getMatters();
    }

    activate();

    function getMatters() {
      $scope.isLoading = true;
      Matter.api.index({
        is_draft: false,
        page: $scope.currentPage,
        per_page: $scope.perPage
      }).then(function(data){
        $scope.matters = data.matters;
        $scope.totalItems = data.total_items;
        $scope.isLoading = false;
      }).catch(function(err){
        $scope.isLoading = false;
      });
    }

    $scope.nextMatter = function(page) {
      $scope.currentPage = page-1;
      getMatters();
    };

    $scope.doSomething = function() {
      swal({
        title: "Sei sicuro ?",
        text: "La lettera di incarico selezionata è già stata inviata a ... Il cliente potrà vedere le tue modifiche.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#F44336",
        confirmButtonText: "Si, modifica",
        cancelButtonText: "No",
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(isConfirm){
        if (isConfirm) {
          $state.go('page.matter-edit');
        } else {
          return false;
        }
      });
    };

  });

})();
