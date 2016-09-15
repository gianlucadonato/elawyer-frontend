(function() {
  'use strict';

  /**=========================================================
  * File: matter-details.js
  * Matter Details Controller
  =========================================================*/

  App.controller('MatterDetailsCtrl', function($scope, $stateParams, $state, Matter, Notify) {

    function activate() {
      getMatter();
    }

    activate();

    function getMatter() {
      Matter.get($stateParams.id).then(function(data) {
        $scope.matter = data;
        console.log(data);
      }).catch(function(err){
        Notify.error('Error!', 'Unable to load matter');
      });
    }

  });

})();
