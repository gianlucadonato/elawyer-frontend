(function() {
  'use strict';

  /**=========================================================
  * File: matter-details.js
  * MatterDetails Controller
  =========================================================*/

  App.controller('MatterDetailsCtrl', function($rootScope, $scope, $state) {

    $scope.matter = {};

    function activate() {
      getMatterDetails();
    }

    activate();


    function getMatterDetails() {
      $scope.matter = {
        id: 1,
        name: 'Matter#1',
        description: 'Lorem ipsum',
        practice_area: 'Diritto Societario',
        status: 'open',
        open_date: new Date()
      };
    }


  });

})();
