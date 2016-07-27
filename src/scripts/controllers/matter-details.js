(function() {
  'use strict';

  /**=========================================================
  * File: matter-details.js
  * MatterDetails Controller
  =========================================================*/

  App.controller('MatterDetailsCtrl', function($scope, $stateParams, $state, Matter, Notify, $window, $timeout, $uibModal, StripeCheckout, Uploader) {

    $scope.showNext = false;
    $scope.showMode = true;

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

    function percentage(input, percentage) {
      return input/100 * percentage;
    }

    function calcTotal() {

      $scope.total =  0;

      $scope.matter.items.forEach(function(item){
        if (item.is_mandatory || item.is_selected)
          $scope.total += parseInt(item.price);
      });

      if ($scope.matter.deposit > 0) {
        $scope.matter.payment_settings = [Matter.editor().getPrice(percentage($scope.total, $scope.matter.deposit)), Matter.editor().getPrice(percentage($scope.total, 100 - $scope.matter.deposit))];
        $scope.matter.general_invoice = [Matter.editor().getPrice($scope.total)];
      }
      else {
        $scope.matter.payment_settings = [];
        $scope.matter.general_invoice = [Matter.editor().getPrice($scope.total)];
      }

    }



    $scope.$watch('matter.items', function() {
      if($scope.matter) {
        calcTotal();
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


    $scope.pay = function(total) {

      if (total)
        $scope.payTotal = true;
      else
        $scope.payTotal = false;

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
        paidServices: []
      }

      for (var i = 0; i < $scope.matter.items.length; i++) {
        if ($scope.matter.items[i].is_selected || $scope.matter.items[i].is_mandatory)
          output.paidServices.push($scope.matter.items[i]);
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

      if (!$scope.payTotal)
        var options = {
          services: getComputedDataFromTable().paidServices,
          amount: $scope.matter.general_invoice[0].services_total * 100,
          deposit: $scope.matter.payment_settings[0].services_total * 100,
          balance: $scope.matter.payment_settings[1].services_total * 100,
          paying: ($scope.matter.payment_settings[0].total - ($scope.matter.withholding_tax ? $scope.matter.payment_settings[0].withholding_tax : 0)) * 100
        };
      else
        var options = {
          services: getComputedDataFromTable().paidServices,
          amount: $scope.matter.general_invoice[0].services_total * 100,
          paying: ($scope.matter.general_invoice[0].total - ($scope.matter.withholding_tax ? $scope.matter.general_invoice[0].withholding_tax : 0)) * 100,
          deposit: 0,
          balance: 0
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

      if (!$scope.payTotal)
        var options = {
          services: getComputedDataFromTable().paidServices,
          amount: $scope.matter.general_invoice[0].services_total * 100,
          deposit: $scope.matter.payment_settings[0].services_total * 100,
          balance: $scope.matter.payment_settings[1].services_total * 100,
          paying: ($scope.matter.payment_settings[0].total - ($scope.matter.withholding_tax ? $scope.matter.payment_settings[0].withholding_tax : 0)) * 100
        };
      else
        var options = {
          services: getComputedDataFromTable().paidServices,
          amount: $scope.matter.general_invoice[0].services_total * 100,
          paying: ($scope.matter.general_invoice[0].total - ($scope.matter.withholding_tax ? $scope.matter.general_invoice[0].withholding_tax : 0)) * 100,
          deposit: 0,
          balance: 0
        };

      stripe.open({amount: options.paying, currency: "EUR", email: $scope.matter.customer.email})
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
