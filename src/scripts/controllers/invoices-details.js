(function() {
  'use strict';

  /**=========================================================
  * File: invoice-details.js
  * InvoiceDetails Controller
  =========================================================*/

  App.controller('InvoiceDetailsCtrl', function($scope, $stateParams, $state, Invoice, Notify, Matter, $window, $timeout, $uibModal, StripeCheckout, Uploader) {

    $scope.showNext = false;

    function activate() {
      getInvoice();
    }

    activate();


    function calcTotal() {
      $scope.total = $scope.total || 0;
      $scope.invoice.payment_settings = Matter.editor().getPrice(parseFloat($scope.invoice.amount));
    }


    $scope.pay = function() {
      self.pm = $uibModal.open({
        animation: false,
        size: '',
        backdrop: true,
        keyboard: true,
        templateUrl: 'views/modals/choosePaymentMethod.html',
        scope: $scope
      });
    };

    $scope.upload = function(file) {
      var tosend = file.files;

      Uploader.upload(tosend)
        .then(function(res) {
          $scope.payOffline();
        })
        .catch(function(err) {
          swal({
            title: "Error!",
            text: "C'è stato un problema a caricare l'evidenza del pagamento.",
            type: "error",
            showCancelButton: false,
            confirmButtonText: "OK!",
            closeOnConfirm: true
          });
        });
    }

    $scope.payOffline = function() {
      self.pm.dismiss();

      var options = {
        paying: ($scope.invoice.payment_settings.total - ($scope.invoice.matter.withholding_tax ? $scope.invoice.payment_settings.withholding_tax : 0)) * 100
      };

      Invoice.api.pay($scope.invoice.id, options)
        .then(function(res) {
          $scope.invoice = res;
          calcTotal();
          swal({
            title: "Evidenza ricevuta!",
            text: "Abbiamo ricevuto un'evidenda di pagamento. Attendi la verifica dei nostri operatori.",
            type: "success",
            showCancelButton: false,
            confirmButtonText: "OK!",
            closeOnConfirm: true
          }, function() {
          });
        }).catch(function(err) {
          swal({
            title: "Error!",
            text: "C'è stato un problema con il pagamento. Assciurati di avere abbastanza fondi.",
            type: "error",
            showCancelButton: false,
            confirmButtonText: "OK!",
            closeOnConfirm: true
          }, function() {});
        });

    }



    $scope.payOnline = function() {
      self.pm.dismiss();

      var stripe = StripeCheckout.configure({});

      var options = {
        paying: ($scope.invoice.payment_settings.total - ($scope.invoice.matter.withholding_tax ? $scope.invoice.payment_settings.withholding_tax : 0)) * 100
      };

      stripe.open({amount: options.paying, currency: "EUR", email: $scope.invoice.customer.email})
        .then(function(result) {

          options['token'] = result[0].id;

          Invoice.api.pay($scope.invoice.id, options)
            .then(function(res) {

              $scope.invoice = res;
              calcTotal();

              swal({
                title: "Paid!",
                text: "La lettera d'incarico è stata pagata correttamente.",
                type: "success",
                showCancelButton: false,
                confirmButtonText: "OK!",
                closeOnConfirm: true
              }, function() {

              });
            }).catch(function(err) {
              swal({
                title: "Error!",
                text: "C'è stato un problema con il pagamento. Assciurati di avere abbastanza fondi.",
                type: "error",
                showCancelButton: false,
                confirmButtonText: "OK!",
                closeOnConfirm: true
              }, function() {});
            });

        },function(err) {
          console.log(err)
      });
    }

    function getInvoice() {
      Invoice.api.get($stateParams.id).then(function(data) {
        $scope.invoice = data;
        calcTotal();
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
          text: "Sei sicuro di avere ricevuto un'evidenza di pagamento valida ?",
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
      if($scope.invoice && $scope.invoice.services)
        for(var i in $scope.invoice.services) {
            $scope.total += parseFloat($scope.invoice.services[i].price);
        }
    }, true);


  });

})();
