(function() {
  'use strict';

  /**=========================================================
  * File: matter-details.js
  * MatterDetails Controller
  =========================================================*/

  App.controller('MatterDetailsCtrl', function($scope, $stateParams, $state, Matter, Notify, $window, $timeout, $uibModal, StripeCheckout, Uploader) {

    $scope.showNext = false;

    function activate() {
      getMatter();
    }

    activate();

    function getMatter() {
      Matter.api.get($stateParams.id).then(function(data) {
        $scope.matter = data;
      }).catch(function(err){
        Notify.error('Error!', 'Unable to load matter');
      });
    }

    $scope.$watch('matter.items', function() {
      $scope.total = 0;
      if($scope.matter)
        for(var i in $scope.matter.items) {
          if ($scope.matter.items[i].is_mandatory || $scope.matter.items[i].is_selected)
            $scope.total += parseFloat($scope.matter.items[i].price);
        }
    }, true);


    $scope.next = function() {
      $scope.showNext = true;
      $window.scrollTo(0, 0);
    };

    $scope.previous = function() {
      $scope.showNext = false;
      $window.scrollTo(0, 0);
    };


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


    function getComputedDataFromTable() {

      var output = {
        totalPrice: 0,
        deposit: 0,
        balance: 0,
        paidServices: []
      }

      for (var i = 0; i < $scope.matter.items.length; i++) {
        if ($scope.matter.items[i].is_selected || $scope.matter.items[i].is_mandatory)
          output.paidServices.push($scope.matter.items[i]);
      }

      function getRaw(el) {
        return el.text().replace(/ /g, "").replace(/,/g, "").replace("€", "");
      }

      if ($scope.matter.withholding_tax) {
        output['totalPrice'] = getRaw($("#total_withholding_tax"));
      } else {
        output['totalPrice'] = getRaw($("#total"));
      }


      if ($scope.matter.deposit > 0) {
        if ($scope.matter.withholding_tax) {
          output['deposit'] = getRaw($("#total_withholding_tax_acconto"));
          output['balance'] = getRaw($("#total_withholding_tax_saldo"));
        } else {
          output['deposit'] = getRaw($("#total_acconto"));
          output['balance'] = getRaw($("#total_saldo"));
        }
      }

      return output;
    }


    $scope.evidence_image = null;

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

      Matter.api.pay($scope.matter.id, options)
        .then(function(res) {
          swal({
            title: "Evidenza ricevuta!",
            text: "Abbiamo ricevuto un'evidenda di pagamento. Attendi la verifica dei nostri operatori.",
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
            text: "C'è stato un problema con il pagamento. Assciurati di avere abbastanza fondi.",
            type: "error",
            showCancelButton: false,
            confirmButtonText: "OK!",
            closeOnConfirm: true
          }, function() {});
        });
    };


    $scope.payOnline = function() {
      self.pm.dismiss();

      var stripe = StripeCheckout.configure({});

      var options = {
        services: getComputedDataFromTable().paidServices,
        amount: getComputedDataFromTable().totalPrice * 100,
        deposit: getComputedDataFromTable().deposit * 100,
        balance: getComputedDataFromTable().balance * 100
      };

      stripe.open({amount: options.deposit ? options.deposit : options.amount, currency: "EUR", email: $scope.matter.customer.email})
        .then(function(result) {

          options['token'] = result[0].id;

          Matter.api.pay($scope.matter.id, options)
            .then(function(res) {
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
                text: "C'è stato un problema con il pagamento. Assciurati di avere abbastanza fondi.",
                type: "error",
                showCancelButton: false,
                confirmButtonText: "OK!",
                closeOnConfirm: true
              }, function() {});
            });

        },function(err) {
          console.log(err);
      });
    };




    $scope.download = function() {
      var doc = new jsPDF();
      // We'll make our own renderer to skip this editor
      var specialElementHandlers = {
        '#editor': function(element, renderer){
          return true;
        }
      };
      // All units are in the set measurement for the document
      // This can be changed to "pt" (points), "mm" (Default), "cm", "in"
      doc.fromHTML($('#print').get(0), 15, 15, {
        'width': 500,
        // 'elementHandlers': specialElementHandlers
      });
      doc.output("dataurlnewwindow");
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
