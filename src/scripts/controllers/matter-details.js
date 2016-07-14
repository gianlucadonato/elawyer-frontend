(function() {
  'use strict';

  /**=========================================================
  * File: matter-details.js
  * MatterDetails Controller
  =========================================================*/

  App.controller('MatterDetailsCtrl', function($scope, $stateParams, $state, Matter, Notify, $window, $timeout) {

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

    var stripe = StripeCheckout.configure({
      name: "Custom Example",
      token: function(token, args) {
        console.log("Got stripe token: " + token.id);
      }
    });

    $scope.pay = function(token, args) {
      var options = {
        description: "Ten dollahs!",
        amount: 1000
      };
      stripe.open(options)
        .then(function(result) {
          alert("Got Stripe token: " + result[0].id);
        },function() {
          alert("Stripe Checkout closed without making a sale :(");
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
