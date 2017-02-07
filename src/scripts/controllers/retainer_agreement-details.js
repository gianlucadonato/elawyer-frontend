(function() {
  'use strict';

  /**=========================================================
  * File: retainer_agreement-details.js
  * RetainerAgreement Details Controller
  =========================================================*/

  App.controller('RetainerAgreementDetailsCtrl', function($scope, $stateParams, $state, RetainerAgreement, Notify, Auth, $window, $timeout, $uibModal, StripeCheckout, Uploader) {

    $scope.readMode = false;
    $scope.showNext = false;
    $scope.invoice_type = 'full'; // full | deposit
    $scope.showFullInvoice = false;

    function activate() {
      getRetainerAgreement();
    }

    activate();

    function getRetainerAgreement() {
      if(!$stateParams.id) {
        $state.go('page.matters-list');
      } else {
        RetainerAgreement.api.get($stateParams.id).then(function(data) {
          $scope.retainer_agreement = data;
          console.log('retainer_agreement', data)
          if(data.deposit)
            $scope.invoice_type = 'deposit';
          if(data.invoices.length)
            $scope.readMode = true;
        }).catch(function(err){
          Notify.error('Error!', 'Unable to load retainer_agreement');
        });
      }
    }

    $scope.$watch('retainer_agreement', function(newValue, oldValue) {
      if(!angular.equals(newValue, oldValue))
        $scope.invoice = RetainerAgreement.calcInvoice(newValue);
    }, true);

    $scope.next = function() {
      var atLeastOneSelected = false;
      for(var i=0; i<$scope.retainer_agreement.items.length & !atLeastOneSelected; i++) {
        if($scope.retainer_agreement.items[i].is_selected ||
          $scope.retainer_agreement.items[i].is_mandatory) {
            atLeastOneSelected = true;
          }
      }
      if(atLeastOneSelected) {
        var curr_user = Auth.getUser();
        if($scope.retainer_agreement.owner_id == curr_user.id) {
          $scope.showNext = true;
        } else {
          // Update selected services and show next
          // $scope.retainer_agreement.is_accepted = true;
          RetainerAgreement.api.update($scope.retainer_agreement).then(function(data) {
            $scope.showNext = true;
            $window.scrollTo(0, 0);
          });
        }
      } else {
        Notify.error('Errore', 'Seleziona almeno un servizio');
      }
    };

    $scope.previous = function() {
      $scope.showNext = false;
      $window.scrollTo(0, 0);
    };

    $scope.checkDiscount = function(value) {
      if(value) {
        $scope.invoice_type = 'full';
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
        email: $scope.retainer_agreement.matter.customer.email
      };
      stripe.open({
        amount: options.paying,
        currency: "EUR",
        email: options.email
      })
      .then(function(result) {
        options.stripe_token = result[0].id;
        options.apply_discount = $scope.retainer_agreement.apply_discount;
        RetainerAgreement.api.pay($scope.retainer_agreement, options)
        .then(function(res) {
          swal({
            title: "Paid!",
            text: "La lettera d'incarico è stata pagata correttamente.",
            type: "success",
            showCancelButton: false,
            confirmButtonText: "OK!",
            closeOnConfirm: true
          }, function() {
            $state.go('page.matter-details', $scope.retainer_agreement.matter);
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
      Uploader.upload({
        files: data.files,
        parentId: $scope.retainer_agreement.matter.drive_folder.id
      })
      .then(function(data) {
        RetainerAgreement.api.pay($scope.retainer_agreement, {
          invoice_type: $scope.invoice_type,
          apply_discount: $scope.retainer_agreement.apply_discount,
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
            $state.go('page.matter-details', $scope.retainer_agreement.matter);
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

    // Download PDF
    var downloadPdfModal;
    $scope.download = function(showAll) {
      if($scope.retainer_agreement.pdf_link) {
        return $window.open($scope.retainer_agreement.pdf_link, '_blank');
      } else {
        // Generate Invoice Link
        downloadPdfModal = $uibModal.open({
          animation: false,
          size: '',
          backdrop: true,
          keyboard: true,
          templateUrl: 'views/modals/downloadPdfModal.html',
          scope: $scope
        });
        $scope.downloadingPDF = true;
        $scope.downloadingPdfError = false;
        RetainerAgreement.api.download(
          $scope.retainer_agreement,
          { show_all: !!showAll }
        ).then(function(data){
          $scope.downloadingPDF = false;
          $scope.retainer_agreement.pdf_link = data.pdf_link;
        }).catch(function(err){
          $scope.downloadingPDF = false;
          $scope.downloadingPdfError = true;
        });
      }
    };

    $scope.openPdfLink = function() {
      //downloadPdfModal.dismiss();
      $window.open($scope.retainer_agreement.pdf_link, '_blank');
    };

    /* Send Retainer Agreement to Customer
     * ======================*/
    $scope.sendRetainerAgreement = function() {
      swal({
        title: "Inviare la lettera di incarico?",
        text: "Cliccando conferma, il cliente verrà notificato via email",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "CONFERMA",
        closeOnConfirm: false
      }, function() {
        RetainerAgreement.api.send({
          id: $scope.retainer_agreement.id
        }).then(function(data){
          $scope.retainer_agreement.is_draft = false;
          swal({
            title: "Sent!",
            text: "La lettera d'incarico è stata inviata correttamente.",
            type: "success",
            showCancelButton: false,
            confirmButtonText: "OK!",
            closeOnConfirm: true
          }, function() {
            $state.go('page.matter-details', {id: $scope.retainer_agreement.matter.id});
          });
        }).catch(function(err){
          Notify.error('Error!', 'Something went wrong :(');
        });
      });
    };

    var currentModal;
    $scope.openTermsConditions = function() {
      currentModal = $uibModal.open({
        animation: false,
        size: 'lg',
        backdrop: true,
        keyboard: true,
        templateUrl: 'views/modals/terms-conditions.html',
        scope: $scope
      });
    };

    // Sticky Summary
    // $(window).scroll(function(){
    //   if ($(this).scrollTop() > 230) {
    //     $("#summary-box").addClass("fixed-top");
    //   } else {
    //     $("#summary-box").removeClass("fixed-top");
    //   }
    // });
  });

})();
