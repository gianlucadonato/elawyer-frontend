(function() {
  'use strict';

  /**=========================================================
  * File: matter-edit.js
  * Matter Edit Controller
  =========================================================*/

  App.controller('MatterEditCtrl', function($scope, $stateParams, Matter, Notify) {

    function activate() {
      getMatter();
    }

    activate();

    function getMatter() {
      Matter.api.get($stateParams.id).then(function(data) {
        console.log('data', data);
        $scope.matter = data;
      }).catch(function(err){
        Notify.error('Error!', 'Unable to load matter');
      });
    }

    Matter.api.areas().then(function(data) {
      $scope.areas = data;
    }).catch(function(err) {
      Notify.error('Error!', 'Unable to load areas');
    });


    $scope.$watch('matter', function(newValue, oldValue) {
      if(!angular.equals(oldValue, newValue) && !preventSave) {
        if ($scope.matter.area_of_interest == '____manual____') {
          $scope.matter.area_of_interest = '';
          $scope.manual = true;
        }
      }
    });



  });

})();
