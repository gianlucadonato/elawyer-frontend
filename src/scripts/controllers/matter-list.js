(function() {
  'use strict';

  /**=========================================================
  * File: matter-list.js
  * MatterList Controller
  =========================================================*/

  App.controller('MatterListCtrl', function($scope, Matter, Notify) {

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

    $scope.deleteMatter = function(m) {
      swal({
        title: "Are you sure?",
        text: "La lettera di incarico verrà eliminata permanentemente.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#F44336",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(isConfirm){
        if (isConfirm) {
          Matter.api.delete(m).then(function(data){
            var index = $scope.matters.indexOf(m);
            $scope.matters.splice(index, 1);
            Notify.success('OK!', "Selected item deleted successfully!");
          }).catch(function(err){
            Notify.error('Error!', "Unable to delete selected item");
          });
        } else {
          return false;
        }
      });
    };

  });

})();
