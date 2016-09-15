(function() {
  'use strict';

  /**=========================================================
  * File: invoice-list.js
  * InvoicesList Controller
  =========================================================*/

  App.controller('InvoicesListCtrl', function($scope, $filter, Invoice, Notify, ngTableParams) {

    $scope.invoices = [];
    $scope.isLoading = false;
    $scope.perPage = 15;
    $scope.totalItems = 0;

    function activate() {
      getInvoices();
    }

    activate();

    function getInvoices() {
      $scope.isLoading = true;
      Invoice.api.index({
        per_page: $scope.perPage
      }).then(function(data){
        $scope.invoices = data.invoices;
        console.log('invoices', data.invoices);
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
          Invoice.api.index({
            page: params.page() - 1,
            per_page: params.count()
          }).then(function(data){
            $scope.totalItems = data.total_items;
            $scope.invoices = params.sorting() ? $filter('orderBy')(data.invoices, params.orderBy()) : data.invoices;
            $defer.resolve($scope.invoices);
          }).catch(function(err){
            Notify.error('Error!', "Unable to fetch retainer_agreements");
          });
        }
      });
    }

  });

})();
