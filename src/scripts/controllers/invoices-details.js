(function() {
  'use strict';

  /**=========================================================
  * File: invoice-details.js
  * InvoiceDetails Controller
  =========================================================*/

  App.controller('InvoiceDetailsCtrl', function($scope, $stateParams, $state, Invoice, Notify, RetainerAgreement, $window, $timeout, $uibModal, StripeCheckout, Uploader, $rootScope) {

    $scope.invoice = {};

    function activate() {
      getInvoice();
    }

    activate();

    function getInvoice() {
      return Invoice.get($stateParams.id).then(function(data) {
        $scope.invoice = data;
      }).catch(function(err){
        Notify.error('Error!', 'Unable to load invoice');
      });
    }

    // Download PDF
    $scope.download = function() {
      if($scope.invoice.invoice_link) {
        $window.open($scope.invoice.invoice_link, '_blank');
      } else {
        // Generate Invoice Link
        var newWin = $window.open('', '_blank');
        Invoice.api.download($scope.invoice.id).then(function(data){
          var file = new Blob([data], { type: 'application/pdf' });
          var fileURL = URL.createObjectURL(file);
          newWin.location = fileURL;
        }).catch(function(err){
          console.log('Unable to download pdf', err);
        });
      }
    };

    // Update Invoice Number
    $scope.update = function() {
      Invoice.update($scope.invoice).then(function(data) {
        Notify.success('Success!', 'Invoice edited succesfully');
      }).catch(function(err){
        Notify.error('Error!', err.data.message);
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

      console.log($scope.invoice)

      var total = $scope.invoice.info.final_price;
      var stripe = StripeCheckout.configure({});
      var options = {
        paying: parseInt(total) * 100,
        invoice_type: $scope.invoice.invoice_type,
        payment_method: 'stripe',
        email: $scope.invoice.matter.customer.email
      };
      stripe.open({
        amount: options.paying,
        currency: "EUR",
        email: options.email
      })
      .then(function(result) {
        options.stripe_token = result[0].id;
        RetainerAgreement.api.pay($scope.invoice.retainer_agreement, options).then(function(res) {
          swal({
            title: "OK!",
            text: "La lettera d'incarico è stata pagata correttamente.",
            type: "success",
            showCancelButton: false,
            confirmButtonText: "OK!",
            closeOnConfirm: true
          }, function() {
            $state.go('page.matter-list');
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
          RetainerAgreement.api.pay($scope.invoice.retainer_agreement, {
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
              $state.go('page.matter-list');
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
