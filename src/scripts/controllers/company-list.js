(function() {
  'use strict';

  /**=========================================================
  * File: matter-details.js
  * MatterDetails Controller
  =========================================================*/

  App.controller('companyIndex', function($scope, $stateParams, $state, Company, Notify, $window, $timeout, $uibModal, ngTableParams, Uploader, $filter) {

    $scope.answers = [];
    $scope.isLoading = false;
    $scope.perPage = 15;
    $scope.totalItems = 0;

    function activate() {
      getCompanies();
    }

    activate();

    function getCompanies() {
      $scope.isLoading = true;
      Company.api.index({
        is_draft: false,
        is_template: false,
        per_page: $scope.perPage
      }).then(function(data){
        $scope.companies = data.companies;
        $scope.totalItems = data.total_items;
        $scope.isLoading = false;
        initTable();
      }).catch(function(err){
        $scope.isLoading = false;
      });
    }

    function initTable() {
      $scope.companyTable = new ngTableParams({
        page: 1,
        count: $scope.perPage
      }, {
        total: $scope.totalItems,
        getData: function($defer, params) {
          Company.api.index({
            page: params.page() - 1,
            per_page: params.count()
          }).then(function(data){
            console.log(data)
            $scope.totalItems = data.total_items;
            $scope.companies = params.sorting() ? $filter('orderBy')(data.companies, params.orderBy()) : data.companies;
            $defer.resolve($scope.companies);
          }).catch(function(err){
            Notify.error('Error!', "Unable to fetch companies");
          });
        }
      });
    }







  });

})();
