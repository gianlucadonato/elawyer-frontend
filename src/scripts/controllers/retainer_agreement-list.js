(function() {
  'use strict';

  /**=========================================================
  * File: retainer_agreement-list.js
  * RetainerAgreementListCtrl Controller
  =========================================================*/

  App.controller('RetainerAgreementListCtrl', function($scope, $filter, RetainerAgreement, Notify, ngTableParams) {

    $scope.retainer_agreements = [];
    $scope.isLoading = false;
    $scope.perPage = 15;
    $scope.totalItems = 0;

    function activate() {
      getRetainerAgreements();
    }

    activate();

    function getRetainerAgreements() {
      $scope.isLoading = true;
      RetainerAgreement.api.index({
        is_draft: false,
        per_page: $scope.perPage
      }).then(function(data){
        $scope.retainer_agreements = data.retainer_agreements;
        $scope.totalItems = data.total_items;
        $scope.isLoading = false;
        initTable();
      }).catch(function(err){
        $scope.isLoading = false;
      });
    }

    function initTable() {
      $scope.retainer_agreementsTable = new ngTableParams({
        page: 1,
        count: $scope.perPage
      }, {
        total: $scope.totalItems,
        getData: function($defer, params) {
          RetainerAgreement.api.index({
            is_draft: false,
            page: params.page() - 1,
            per_page: params.count()
          }).then(function(data){
            $scope.totalItems = data.total_items;
            $scope.retainer_agreements = params.sorting() ? $filter('orderBy')(data.retainer_agreements, params.orderBy()) : data.retainer_agreements;
            $defer.resolve($scope.retainer_agreements);
          }).catch(function(err){
            Notify.error('Error!', "Unable to fetch Retainer Agreements");
          });
        }
      });
    }

    $scope.deleteRetainerAgreement = function(m) {
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
          RetainerAgreement.api.delete(m).then(function(data){
            var index = $scope.retainer_agreements.indexOf(m);
            $scope.retainer_agreements.splice(index, 1);
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
