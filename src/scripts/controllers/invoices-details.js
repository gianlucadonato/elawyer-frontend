(function() {
  'use strict';

  /**=========================================================
  * File: invoice-details.js
  * InvoiceDetails Controller
  =========================================================*/

  App.controller('InvoiceDetailsCtrl', function($scope, $stateParams, $state, Invoice, Notify, Matter, $window, $timeout, $uibModal, StripeCheckout, Uploader) {

    function activate() {
      getInvoice();
    }

    activate();

    function getInvoice() {
      return Invoice.api.get($stateParams.id).then(function(data) {
        $scope.invoice = data;
        $scope.invoice.calc = Matter.calcInvoice(data.matter)[data.invoice_type];
      }).catch(function(err){
        Notify.error('Error!', 'Unable to load invoice');
      });
    }

    // Download PDF
    $scope.download = function() {
      var newWin = $window.open('', '_blank');
      Invoice.api.download($scope.invoice.id).then(function(data){
        var file = new Blob([data], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        newWin.location = fileURL;
      }).catch(function(err){
        console.log('Unable to download pdf', err);
      });
    };

    // Update Invoice Number
    $scope.update = function() {
      Invoice.api.update($scope.invoice).then(function(data) {
        $scope.invoice.id = data.id;
        Notify.success('Success!', 'Invoice edited succesfully');
      }).catch(function(err){
        Notify.error('Error!', 'Unable to update invoice');
      });
    };

    var choosePaymentModal;
    $scope.openPaymentModal = function() {
      choosePaymentModal = $uibModal.open({
        animation: false,
        size: '',
        backdrop: true,
        keyboard: true,
        templateUrl: 'views/modals/choosePaymentMethod.html',
        scope: $scope
      });
    };

    $scope.payWithStripe = function() {
      choosePaymentModal.dismiss();
      var total = $scope.invoice.calc.final_price;
      var stripe = StripeCheckout.configure({});
      var options = {
        paying: parseInt(total) * 100,
        invoice_type: $scope.invoice.invoice_type,
        payment_method: 'stripe',
        email: $scope.invoice.customer.email
      };
      stripe.open({
        amount: options.paying,
        currency: "EUR",
        email: options.email
      })
      .then(function(result) {
        options.stripe_token = result[0].id;
        Matter.api.pay($scope.invoice.matter, options).then(function(res) {
          swal({
            title: "OK!",
            text: "La lettera d'incarico è stata pagata correttamente.",
            type: "success",
            showCancelButton: false,
            confirmButtonText: "OK!",
            closeOnConfirm: true
          }, function() {
            $state.go('page.invoices');
          });
        }).catch(function(err) {
          swal({
            title: "Errore!",
            text: "C'è stato un problema con il pagamento. Assicurati di avere abbastanza fondi.",
            type: "error",
            showCancelButton: false,
            confirmButtonText: "OK!",
            closeOnConfirm: true
          });
        });
      });
    };

    $scope.payWithBankTransfer = function(data) {
      Uploader.upload(data.files)
        .then(function(data) {
          Matter.api.pay($scope.invoice.matter, {
            invoice_type: $scope.invoice.invoice_type,
            payment_method: 'bank_transfer'
          }).then(function(res) {
            choosePaymentModal.dismiss();
            swal({
              title: "OK!",
              text: "Abbiamo ricevuto un'evidenza di pagamento. Attendi la verifica dei nostri operatori.",
              type: "success",
              showCancelButton: false,
              confirmButtonText: "OK!",
              closeOnConfirm: true
            }, function() {
              $state.go('page.invoices');
            });
          }).catch(function(err) {
            Notify.error("Oops!", "Si è verificato un problema nel caricare l'evidenza di pagamento.");
          });
        }).catch(function(err) {
          swal({
            title: "Oops!",
            text: "C'è stato un problema nel caricare l'evidenza di pagamento.",
            type: "error",
            showCancelButton: false,
            confirmButtonText: "OK!",
            closeOnConfirm: true
          });
        });
    };

    $scope.confirmPayment = function() {
      swal({
        title: "Conferma Ricezione Pagamento",
        text: "Sei sicuro di avere ricevuto un'evidenza di pagamento valida?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "OK!",
        cancelButtonText: "Cancel",
        closeOnConfirm: true
      }, function() {
        $scope.invoice.is_confirmed = true;
        Invoice.api.update($scope.invoice).then(function(data) {
          Notify.success('Success!', 'Invoice edited successfully!');
        }).catch(function(err){
          Notify.error('Error!', 'Unable to update invoice');
        });
      });
    };

  });

})();
