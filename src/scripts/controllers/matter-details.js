(function() {
  'use strict';

  App.filter("percentage", function() { 
    return function(input, n) { 
      return (input/100 * n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
  });

  App.filter("prettyNumber", function() { 
    return function(x) { 
       return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

  App.controller('MatterDetailsCtrl', function($rootScope, $scope, $state, $timeout, Matter, $stateParams) {

    Matter.api.get($stateParams.id).then(function (res) {
      console.log(res)
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



  });

})();
