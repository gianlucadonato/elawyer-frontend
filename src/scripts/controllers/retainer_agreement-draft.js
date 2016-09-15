(function() {
  'use strict';

  /**=========================================================
  * File: retainer_agreement-draft.js
  * RetainerAgreementDraft Controller
  =========================================================*/

  App.controller('RetainerAgreementDraftCtrl', function($scope, $filter, Matter, Notify, ngTableParams) {

    $scope.drafts = [];
    $scope.isLoading = false;
    $scope.perPage = 14;
    $scope.totalItems = 0;

    function activate() {
      getDrafts();
    }

    activate();

    function getDrafts() {
      $scope.isLoading = true;
      Matter.api.index({
        is_draft: true,
        per_page: $scope.perPage
      }).then(function(data){
        $scope.drafts = data.matters;
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
            is_draft: true,
            page: params.page() - 1,
            per_page: params.count()
          }).then(function(data){
            $scope.totalItems = data.total_items;
            $scope.drafts = params.sorting() ? $filter('orderBy')(data.matters, params.orderBy()) : data.matters;
            $defer.resolve($scope.drafts);
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
            var index = $scope.drafts.indexOf(m);
            $scope.drafts.splice(index, 1);
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
