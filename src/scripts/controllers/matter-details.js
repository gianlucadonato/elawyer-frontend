(function() {
  'use strict';

  App.filter("percentage", function() { 
    return function(input, n) { 
      return (input/100 * n);
    };
  });

  App.filter("prettyNumber", function() { 
    return function(x) { 

      if (x) {
       x = x.toString();
       var y = x.split('.')[0];
      if (x.split('.')[1])
        var z = "." + x.split('.')[1].substring(0, 2);
      else var z = "";

       return y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + z;
      } else return '0';
    };
  });

  App.filter("date", function() { 
    return function(input) { 
      return moment(input).format("Do MMMM YYYY")
    };
  });

  /**=========================================================
  * File: matter-details.js
  * MatterDetails Controller
  =========================================================*/

  App.controller('MatterDetailsCtrl', function($rootScope, $scope, $state, $timeout, Matter, $stateParams, $window) {

    Matter.api.get($stateParams.id).then(function (res) {
      $scope.matter = res;
     }, function(err) {
    })

    $scope.$watch('matter', function() {
      $scope.totale = 0;
      if ($scope.matter)
      for(var i in $scope.matter.items) {
        if ($scope.matter.items[i].mandatory || $scope.matter.items[i].selected)
          $scope.totale+= parseFloat($scope.matter.items[i].price) || 0;
      }
    }, true)


    $scope.next = function() {
      $scope.confirm = true;
      $window.scrollTo(0, 0);
    }

    $scope.previous = function() {
      $scope.confirm = false;
      $window.scrollTo(0, 0);

    }

    var handler = StripeCheckout.configure({
        name: "Custom Example",
        token: function(token, args) {
          $log.debug("Got stripe token: " + token.id);
        }
    });


    $scope.download = function() {
      var doc = new jsPDF();

      // We'll make our own renderer to skip this editor
      var specialElementHandlers = {
        '#editor': function(element, renderer){
          return true;
        }
      };

      console.log($("#lettera"))

      // All units are in the set measurement for the document
      // This can be changed to "pt" (points), "mm" (Default), "cm", "in"
      doc.fromHTML($('#lettera').get(0), 15, 15, {
        'width': 500, 
        // 'elementHandlers': specialElementHandlers
      });

      doc.output("dataurlnewwindow");

    }


    $scope.pay = function(token, args) {
      var options = {
        description: "Ten dollahs!",
        amount: 1000
      };
      // The default handler API is enhanced by having open()
      // return a promise. This promise can be used in lieu of or
      // in addition to the token callback (or you can just ignore
      // it if you like the default API).
      //
      // The rejection callback doesn't work in IE6-7.
      handler.open(options)
        .then(function(result) {
          alert("Got Stripe token: " + result[0].id);
        },function() {
          alert("Stripe Checkout closed without making a sale :(");
        });
    };



  });

})();
