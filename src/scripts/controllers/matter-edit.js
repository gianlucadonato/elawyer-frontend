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



  });

})();
