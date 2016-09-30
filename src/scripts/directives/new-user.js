(function() {
  'use strict';

  /**=========================================================
  * File: new-user.js
  * Open New User Modal
  =========================================================*/

  App.directive('newUser', ['$uibModal', 'User', 'Notify', '$http',
  function($uibModal, User, Notify, $http) {
    return {
      restrict: 'EA',
      scope: {
        newUser: '@?',
        newUserCb: '='
      },
      link: function(scope, element, attrs) {

        $(element).click(function() {
          scope.currentModal = $uibModal.open({
            animation: false,
            size: 'lg',
            backdrop: true,
            keyboard: true,
            templateUrl: 'views/modals/newUser.html',
            scope: scope
          });
        });
        
        // Create User
        scope.createUser = function(user){
          if(user.birthday) {
            // Transform data in ms
            var bd = user.birthday.split('/');
            user.birthday = new Date(bd[2], bd[1], bd[0]).getTime();
          }
          if(scope.newUser == 'lawyer') {
            user.role = 10;
          }

          User.create(user).then(function(data){
            if(scope.newUserCb)
              scope.newUserCb(data);
            scope.currentModal.dismiss();
            Notify.success("OK!", "Utente creato con successo");
          }).catch(function(err){
            Notify.error("Error!", "Unable to create user");
          });
        };

        scope.getLocation = function(val) {
          return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
            params: {
              address: val,
              sensor: false
            }
          }).then(function(response){
            return response.data.results.map(function(item){
              return item.formatted_address;
            });
          });
        };

      }
    };
  }]);

})();
