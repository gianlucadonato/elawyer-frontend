(function() {
  'use strict';

  /**=========================================================
  * File: retainer_agreement-details.js
  * RetainerAgreement Details Controller
  =========================================================*/

  App.controller('RetainerAgreementDetailsCtrl', function($scope, $stateParams, $state, RetainerAgreement, Notify, $window, $timeout, $uibModal, StripeCheckout, Uploader) {

    $scope.readMode = false;
    $scope.showNext = true;
    $scope.invoice_type = 'deposit'; // full | deposit | balance
    $scope.showFullInvoice = false;

    function activate() {
      getRetainerAgreement();
    }

    activate();

    function getRetainerAgreement() {
      RetainerAgreement.api.get($stateParams.id).then(function(data) {
        $scope.retainer_agreement = data;
        if(data.invoice_id || data.deposit_invoice_id )
          $scope.readMode = true;
      }).catch(function(err){
        Notify.error('Error!', 'Unable to load retainer_agreement');
      });
    }

    $scope.$watch('retainer_agreement', function(newValue, oldValue) {
      if(!angular.equals(newValue, oldValue))
        $scope.invoice = RetainerAgreement.calcInvoice(newValue);
    }, true);

    $scope.next = function() {
      // Update selected services and show next
      RetainerAgreement.api.update($scope.retainer_agreement).then(function(data) {
        $scope.showNext = true;
        $window.scrollTo(0, 0);
      });
    };

    $scope.previous = function() {
      $scope.showNext = false;
      $window.scrollTo(0, 0);
    };

    $scope.checkDiscount = function(value) {
      $scope.showFullInvoice = value;
      if(value) {
        $scope.invoice_type = 'full';
      } else if($scope.retainer_agreement.deposit_invoice_id){
        $scope.invoice_type = 'balance';
      } else {
        $scope.invoice_type = 'deposit';
      }
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
      var total = $scope.invoice[$scope.invoice_type].final_price;
      var stripe = StripeCheckout.configure({});
      var options = {
        paying: parseInt(total) * 100,
        invoice_type: $scope.invoice_type,
        payment_method: 'stripe',
        email: $scope.retainer_agreement.customer.email
      };
      stripe.open({
        amount: options.paying,
        currency: "EUR",
        email: options.email
      })
      .then(function(result) {
        options.stripe_token = result[0].id;
        RetainerAgreement.api.pay($scope.retainer_agreement, options).then(function(res) {
          swal({
            title: "Paid!",
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
            title: "Error!",
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
      choosePaymentModal.dismiss();
      Uploader.upload(data.files)
        .then(function(data) {
          RetainerAgreement.api.pay($scope.retainer_agreement, {
            invoice_type: $scope.invoice_type,
            payment_method: 'bank_transfer'
          }).then(function(res) {
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

    // Sticky Summary
    $(window).scroll(function(){
      if ($(this).scrollTop() > 230) {
        $("#summary-box").addClass("fixed-top");
      } else {
        $("#summary-box").removeClass("fixed-top");
      }
    });
  });

})();
