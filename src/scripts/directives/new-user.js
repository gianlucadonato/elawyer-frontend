(function() {
  'use strict';

  /**=========================================================
  * File: new-user.js
  * Open New User Modal
  =========================================================*/

  App.directive('newUser', ['$uibModal', 'User', 'Company', 'Notify', '$http',
  function($uibModal, User, Company, Notify, $http) {
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

        scope.user = User.getModel();
        scope.showCompanyInput = false;
        scope.companyObj = undefined;

        scope.addCompany = function(company) {
          if(company && company.id)
            scope.user.companies.push(angular.copy(company));
          scope.companyObj = undefined;
        };

        scope.removeCompany = function(company) {
          if(company) {
            var index = scope.user.companies.indexOf(company);
            scope.user.companies.splice(index, 1);
          }
        };

        scope.showAddCompany = function() {
          scope.showCompanyInput = !scope.showCompanyInput;
        };

        scope.getCompanies = function(company) {
          return Company.search({q: company}).then(function(companies){
            return companies;
          });
        };


        // Create User
        scope.createUser = function(user){
          if(user.birthday) {
            // Transform data in ms
            var bd = user.birthday.split('/');
            user.birthday = new Date(bd[2], bd[1], bd[0]).getTime();
          }
          if((user.companies || []).length) {
            user.companies = user.companies.map(function(company){
              return company.id;
            });
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
            if(err.status === 409)
              scope.userExistsError = true;
            else
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
