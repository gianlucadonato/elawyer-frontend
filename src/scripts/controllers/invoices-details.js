(function() {
  'use strict';

  /**=========================================================
  * File: invoice-details.js
  * InvoiceDetails Controller
  =========================================================*/

  App.controller('InvoiceDetailsCtrl', function($scope, $stateParams, $state, Invoice, Notify, $window, $timeout, $uibModal, StripeCheckout) {

    $scope.showNext = false;

    function activate() {
      getInvoice();
    }

    activate();

    function getInvoice() {
      Invoice.api.get($stateParams.id).then(function(data) {
        $scope.invoice = data;
      }).catch(function(err){
        Notify.error('Error!', 'Unable to load invoice');
      });
    }

    $scope.update = function() {
      Invoice.api.update($scope.invoice).then(function(data) {
        $scope.invoice = data;
        Notify.success('Success!', 'Invoice edited succesfully');
      }).catch(function(err){
        Notify.error('Error!', 'Unable to update invoice');
      });
    };

    $scope.confirm = function() {
      swal({
          title: "Are you sure ? ",
          text: "Sei sicuro di avere ricevuto un'evidenza di pagamento valida?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "OK!",
          cancelButtonText: "Cancel",
          closeOnConfirm: true
        }, function() {
          $scope.invoice.is_confirmed = true;
          Invoice.api.update($scope.invoice).then(function(data) {
            $scope.invoice = data;
            Notify.success('Success!', 'Invoice edited succesfully');
          }).catch(function(err){
            Notify.error('Error!', 'Unable to update invoice');
          });
        }, function() {});
    };


    $scope.$watch('invoice.services', function() {
      $scope.total = 0;
      if($scope.invoice.services)
        for(var i in $scope.invoice.services) {
            $scope.total += parseFloat($scope.invoice.services[i].price);
        }
    }, true);

    
  });

})();
