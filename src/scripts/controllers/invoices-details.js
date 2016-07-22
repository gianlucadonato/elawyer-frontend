(function() {
  'use strict';

  /**=========================================================
  * File: invoice-details.js
  * InvoiceDetails Controller
  =========================================================*/

  App.controller('InvoiceDetailsCtrl', function($scope, $stateParams, $state, Invoice, Notify, $window, $timeout, $uibModal, StripeCheckout, Uploader) {

    $scope.showNext = false;

    function activate() {
      getInvoice();
    }

    activate();

    function getComputedDataFromTable() {

    var output = {
        totalPrice: 0,
        deposit: 0,
        balance: 0
      }

      function getRaw(el) {
        return el.text().replace(/ /g, "").replace(/,/g, "").replace("€", "");
      }

      if ($scope.invoice.matter.withholding_tax) {
        output['totalPrice'] = getRaw($("#total_withholding_tax"));
      } else {
        output['totalPrice'] = getRaw($("#total"));
      }


      if ($scope.invoice.matter.deposit > 0) {
        if ($scope.invoice.matter.withholding_tax) {
          output['deposit'] = getRaw($("#total_withholding_tax_acconto"));
          output['balance'] = getRaw($("#total_withholding_tax_saldo"));
        } else {
          output['deposit'] = getRaw($("#total_acconto"));
          output['balance'] = getRaw($("#total_saldo"));
        }
      }

      return output;
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
        services: getComputedDataFromTable().paidServices,
        amount: getComputedDataFromTable().totalPrice * 100,
        deposit: getComputedDataFromTable().deposit * 100,
        balance: getComputedDataFromTable().balance * 100
      };

      Invoice.api.pay($scope.invoice.id, options)
        .then(function(res) {
          console.log(res)
          $scope.invoice = res;
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
        services: getComputedDataFromTable().paidServices,
        amount: getComputedDataFromTable().totalPrice * 100,
        deposit: getComputedDataFromTable().deposit * 100,
        balance: getComputedDataFromTable().balance * 100
      };

      stripe.open({amount: options.balance, currency: "EUR", email: $scope.invoice.customer.email})
        .then(function(result) {

          options['token'] = result[0].id;

          Invoice.api.pay($scope.invoice.id, options)
            .then(function(res) {
              swal({
                title: "Paid!",
                text: "La lettera d'incarico è stata pagata correttamente.",
                type: "success",
                showCancelButton: false,
                confirmButtonText: "OK!",
                closeOnConfirm: true
              }, function() {
                $scope.invoice = res;
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
      if($scope.invoice && $scope.invoice.services)
        for(var i in $scope.invoice.services) {
            $scope.total += parseFloat($scope.invoice.services[i].price);
        }
    }, true);


  });

})();
