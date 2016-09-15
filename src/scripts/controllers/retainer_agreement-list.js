(function() {
  'use strict';

  /**=========================================================
  * File: retainer_agreement-list.js
  * RetainerAgreementListCtrl Controller
  =========================================================*/

  App.controller('RetainerAgreementListCtrl', function($scope, $filter, Matter, Notify, ngTableParams) {

    $scope.matters = [];
    $scope.isLoading = false;
    $scope.perPage = 15;
    $scope.totalItems = 0;

    function activate() {
      getMatters();
    }

    activate();

    function getMatters() {
      $scope.isLoading = true;
      Matter.api.index({
        is_draft: false,
        per_page: $scope.perPage
      }).then(function(data){
        $scope.matters = data.matters;
        $scope.totalItems = data.total_items;
        $scope.isLoading = false;
        initTable();
      }).catch(function(err){
        $scope.isLoading = false;
      });
    }

    function initTable() {
      $scope.mattersTable = new ngTableParams({
        page: 1,
        count: $scope.perPage
      }, {
        total: $scope.totalItems,
        getData: function($defer, params) {
          Matter.api.index({
            is_draft: false,
            page: params.page() - 1,
            per_page: params.count()
          }).then(function(data){
            $scope.totalItems = data.total_items;
            $scope.matters = params.sorting() ? $filter('orderBy')(data.matters, params.orderBy()) : data.matters;
            $defer.resolve($scope.matters);
          }).catch(function(err){
            Notify.error('Error!', "Unable to fetch matters");
          });
        }
      });
    }

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
