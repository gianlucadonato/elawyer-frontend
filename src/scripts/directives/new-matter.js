(function() {
  'use strict';

  /**=========================================================
  * File: new-matter.js
  * Open New Matter Modal
  =========================================================*/

  App.directive('newMatter', ['$uibModal', 'Matter', 'Notify', function($uibModal, Matter, Notify) {
    return {
      restrict: 'EA',
      scope: {
        newMatter: '=',
        newMatterCb: '='
      },
      link: function(scope, element, attrs) {

        scope.matter = {};
        scope.showAddArea = false;

        angular.element(element).click(function() {
          scope.currentModal = $uibModal.open({
            animation: false,
            size: 'lg',
            backdrop: true,
            keyboard: true,
            templateUrl: 'views/modals/newMatter.html',
            scope: scope
          });

          Matter.get_areas().then(function(data) {
            scope.areas = data;
          }).catch(function(err) {
            Notify.error('Error!', 'Unable to load areas');
          });
        });

        scope.setUser = function(user) {
          console.log('setUser', user);
          scope.matter.customer = user;
        };

        scope.addArea = function(){
          scope.showAddArea = !scope.showAddArea;
        };

        scope.pushArea = function(newArea) {
          if(newArea) {
            scope.areas.unshift(newArea);
            scope.matter.practice_area = newArea;
            scope.showAddArea = false;
          }
        };

        scope.createMatter = function(data) {
          Matter
            .create({
              title: data.title,
              practice_area: data.practice_area,
              customer_id: data.customer.id
            })
            .then(function(matter){
              scope.currentModal.dismiss();
              scope.matter = {};
              scope.showAddArea = false;
              if(scope.newMatterCb)
                scope.newMatterCb(matter, data); // exec the cb
              Notify.success('OK!','Matter created successfully!');
            })
            .catch(function(err){
              Notify.error('Error!','Unable to create matter');
            });
        };

      }
    };
  }]);

})();
