(function() {
  'use strict';

  /**=========================================================
  * File: company-list.js
  * Company List Controller
  =========================================================*/

  App.controller('CompanyListCtrl', function($scope, Company, Notify) {

    $scope.isLoading = false;

    function activate() {
      getCompanies();
    }

    activate();

    function getCompanies(){
      $scope.isLoading = true;
      Company.index().then(function(data){
        $scope.companies = data;
        $scope.isLoading = false;
      }).catch(function(err){
        $scope.isLoading = false;
        Notify.error("Error!", "Unable to fetch companies");
      });
    }

    $scope.deleteCompany = function(item) {
      swal({
        title: "Are you sure?",
        text: "L'azienda verrà eliminata definitivamente.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#F44336",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(isConfirm){
        if (isConfirm) {
          Company.delete(item).then(function(data){
            var index = $scope.companies.indexOf(item);
            $scope.companies.splice(index, 1);
            $scope.isLoading = false;
          }).catch(function(err){
            $scope.isLoading = false;
            Notify.error("Error!", "Unable to fetch companies");
          });
        } else {
          return false;
        }
      });
    };

  });

})();
