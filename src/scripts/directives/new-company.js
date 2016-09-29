(function() {
  'use strict';

  /**=========================================================
  * File: new-company.js
  * Open New Company Modal
  =========================================================*/

  App.directive('newCompany', ['$uibModal', 'User', 'Company', 'Notify', '$http', '$localStorage',
  function($uibModal, User, Company, Notify, $http, $localStorage) {
    return {
      restrict: 'EA',
      scope: {
        newCompany: '=',
        newCompanyCb: '='
      },
      link: function(scope, element, attrs) {

        $(element).click(function() {
          scope.currentModal = $uibModal.open({
            animation: false,
            size: 'lg',
            backdrop: true,
            keyboard: true,
            templateUrl: 'views/modals/newCompany.html',
            scope: scope
          });
        });

        // Create Company
        scope.company = Company.getTemplate();
        scope.showOwnerInput = false;
        scope.ownerObj = undefined;

        if($localStorage.current_user)
          scope.company.owners.push($localStorage.current_user);

        scope.createCompany = function(data){
          var company = angular.copy(data);
          company.owners = (company.owners || []).map(function(item){
            return item.id;
          });
          Company.create(company).then(function(data){
            if(scope.newCompanyCb)
              scope.newCompanyCb(company);
            scope.currentModal.dismiss();
          }).catch(function(err){
            Notify.error("Error!", "Unable to create company");
          });
        };

        scope.addOwner = function(owner) {
          if(owner) scope.company.owners.push(owner);
          scope.ownerObj = undefined;
        };

        scope.removeOwner = function(owner) {
          var index = scope.company.owners.indexOf(owner);
          scope.company.owners.splice(index, 1);
        };

        scope.getOwners = function(owner) {
          return User.search({q: owner}).then(function(users){
            return users;
          });
        };

        scope.showAddOwner = function() {
          scope.showOwnerInput = !scope.showOwnerInput;
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
