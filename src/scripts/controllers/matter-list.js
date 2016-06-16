(function() {
  'use strict';

  /**=========================================================
  * File: matter-list.js
  * MatterList Controller
  =========================================================*/

  App.controller('MatterListCtrl', function($rootScope, $scope, $state) {

    $scope.matterList = [];

    function activate() {
      getMatterList();
    }

    activate();

    function getMatterList() {
      $scope.matterList = [
        {
          id: 1,
          name: 'Matter#1',
          description: 'Lorem ipsum',
          practice_area: 'Diritto Societario',
          status: 'open',
          open_date: new Date()
        }
      ];
    }


  });

})();
