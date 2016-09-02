(function() {
  'use strict';

  /**=========================================================
  * File: matter-list.js
  * MatterList Controller
  =========================================================*/

  App.controller('FormListCtrl', function($scope, $filter, Answer, Notify, ngTableParams) {

    $scope.answers = [];
    $scope.isLoading = false;
    $scope.perPage = 15;
    $scope.totalItems = 0;

    function activate() {
      getForms();
    }

    activate();

    function getForms() {
      $scope.isLoading = true;
      Answer.api.index({
        is_draft: false,
        is_template: false,
        per_page: $scope.perPage
      }).then(function(data){
        $scope.answers = data.answers;
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
          Answer.api.index({
            page: params.page() - 1,
            per_page: params.count()
          }).then(function(data){
            $scope.totalItems = data.total_items;
            $scope.answers = params.sorting() ? $filter('orderBy')(data.answers, params.orderBy()) : data.answers;
            $defer.resolve($scope.answers);
          }).catch(function(err){
            Notify.error('Error!', "Unable to fetch answers");
          });
        }
      });
    }

    $scope.deleteMatter = function(m) {
      swal({
        title: "Are you sure?",
        text: "Sei sicuro di volere eliminare questo questionario ? il tuo avvocato non potrà più consultarne le risposte.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#F44336",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(isConfirm){
        if (isConfirm) {
          Answer.api.delete(m).then(function(data){
            var index = $scope.answers.indexOf(m);
            $scope.answers.splice(index, 1);
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
