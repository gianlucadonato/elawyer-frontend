(function() {
  'use strict';

  /**=========================================================
  * File: new-matter.js
  * Open New Matter Modal
  =========================================================*/

  App.directive('editMatter', ['$uibModal', 'Matter', 'Notify', function($uibModal, Matter, Notify) {
    return {
      restrict: 'EA',
      scope: {
        editMatter: '=?',
        editMatterCb: '='
      },
      link: function(scope, element, attrs) {

        scope.showAddArea = false;
        scope.matter = {};

        angular.element(element).click(function() {
          scope.currentModal = $uibModal.open({
            animation: false,
            size: 'lg',
            backdrop: true,
            keyboard: true,
            templateUrl: 'views/modals/editMatter.html',
            scope: scope
          });

          Matter.get_areas().then(function(data) {
            scope.matter = scope.editMatter;
            scope.areas = data;
          }).catch(function(err) {
            Notify.error('Error!', 'Unable to load areas');
          });
        });

        scope.pushArea = function(newArea) {
          if(newArea) {
            scope.areas.unshift(newArea);
            scope.matter.practice_area = newArea;
            scope.showAddArea = false;
          }
        };

        scope.setUser = function(user) {
          scope.matter.customer = user;
        };

        scope.addArea = function(){
          scope.showAddArea = !scope.showAddArea;
        };

        scope.updateMatter = function(data) {
          Matter
            .update(data)
            .then(function(matter){
              scope.currentModal.dismiss();
              if(scope.editMatterCb)
                scope.editMatterCb(matter); // exec the cb
              Notify.success('OK!','Matter edited successfully!');
            })
            .catch(function(err){
              Notify.error('Error!','Unable to edit matter');
            });
        };

      }
    };
  }]);

})();
