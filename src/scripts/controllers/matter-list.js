(function() {
  'use strict';

  /**=========================================================
  * File: matter-list.js
  * MatterList Controller
  =========================================================*/

  App.controller('MatterListCtrl', function($rootScope, $scope, $state, Matter) {

    $scope.matterList = [];

    function activate() {
      getMatterList();
    }

   $scope.page = 0; $scope.per_page = 15;
    $scope.getExistingMatters = function() {
      Matter.index($scope.page, $scope.per_page).then(function(res) {
        $scope.matterList = res;
      }, function() {});
    }

    $scope.$watch('[page,per_page]', function () {
      $scope.serv = [];
      $scope.getExistingMatters();
    }, true);

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
        },
        {
          id: 2,
          name: 'Matter#2',
          description: 'Lorem ipsum',
          practice_area: 'Diritto Societario',
          status: 'open',
          open_date: new Date()
        },
        {
          id: 3,
          name: 'Matter#3',
          description: 'Lorem ipsum',
          practice_area: 'Diritto Societario',
          status: 'open',
          open_date: new Date()
        }
      ];
    }


  });

})();
