(function() {
  'use strict';

  /**=========================================================
  * File: matter-details.js
  * MatterDetails Controller
  =========================================================*/

  App.controller('MatterDetailsCtrl', function($scope, $stateParams, $state, Matter, Notify, $window, $timeout, $uibModal, StripeCheckout, Uploader) {

    $scope.showNext = false;
    $scope.invoice_type = 'full'; // full | deposit | balance

    function activate() {
      getMatter();
    }

    activate();

    function getMatter() {
      Matter.api.get($stateParams.id).then(function(data) {
        $scope.matter = data;
        if(data.invoice_id || data.deposit_invoice_id )
          $scope.showNext = true;
      }).catch(function(err){
        Notify.error('Error!', 'Unable to load matter');
      });
    }

    $scope.$watch('matter', function(newValue, oldValue) {
      if(!angular.equals(newValue, oldValue))
        $scope.invoice = Matter.calcInvoice(newValue);
    }, true);


    $scope.next = function() {
      // Update selected services and show next
      Matter.api.update($scope.matter).then(function(data) {
        $scope.showNext = true;
        $window.scrollTo(0, 0);
      });
    };

    $scope.previous = function() {
      $scope.showNext = false;
      $window.scrollTo(0, 0);
    };

    var choosePaymentModal;
    $scope.openPaymentModal = function(invoiceType) {
      $scope.invoice_type = invoiceType;
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
        email: $scope.matter.customer.email
      };
      stripe.open({
        amount: options.paying,
        currency: "EUR",
        email: options.email
      })
      .then(function(result) {
        options.stripe_token = result[0].id;
        Matter.api.pay($scope.matter, options).then(function(res) {
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
          Matter.api.pay($scope.matter, {
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
