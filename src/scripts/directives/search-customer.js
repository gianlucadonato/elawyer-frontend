(function() {
  'use strict';

  /**=========================================================
  * File: search-customer.js
  * Open Customer Search Modal
  =========================================================*/

  App.directive('searchCustomer', ['$uibModal', 'User', 'Company', 'Notify', '$http',
  function($uibModal, User, Company, Notify, $http) {
    return {
      restrict: 'A',
      scope: {
        searchCustomer: '=',
        searchCustomerCb: '='
      },
      link: function(scope, element, attrs) {

        $(element).click(function() {
          scope.currentModal = $uibModal.open({
            animation: false,
            size: 'lg',
            backdrop: true,
            keyboard: true,
            templateUrl: 'views/modals/searchCustomer.html',
            scope: scope
          });
        });

        scope.tabUser = true;
        scope.tabCompany = false;
        scope.showCreateUser = false;
        scope.showCreateCompany = false;
        scope.query = '';

        scope.search = function(query) {
          scope.users = [];
          User.search({q: query}).then(function(users){
            scope.users = users;
          });
          scope.companies = [];
          Company.search({q: query}).then(function(companies){
            scope.companies = companies;
          });
        };

        scope.createNewCustomer = function(type) {
          switch(type) {
            case 'user':
              scope.showCreateUser = true;
              break;
            case 'company':
              scope.showCreateCompany = true;
              break;
          }
        };

        scope.goBack = function() {
          scope.showCreateUser = false;
          scope.showCreateCompany = false;
        };

        scope.selectUser = function(user) {
          if(scope.searchCustomerCb)
            scope.searchCustomerCb(user, 'user');
          scope.currentModal.dismiss();
          scope.goBack();
        };

        scope.selectCompany = function(company) {
          if(scope.searchCustomerCb)
            scope.searchCustomerCb(company, 'company');
          scope.currentModal.dismiss();
          scope.goBack();
        };

        // Create User
        scope.createUser = function(data) {
          if(data.birthday) {
            // Transform data in ms
            var bd = data.birthday.split('/');
            data.birthday = new Date(bd[2], bd[1], bd[0]).getTime();
          }
          User
            .create(data)
            .then(function(user){
              scope.selectUser(user);
              Notify.success('OK!','User created successfully!');
            })
            .catch(function(err){
              Notify.error('Error!','Unable to create user');
            });
        };

        // Create Company
        scope.company = Company.getTemplate();
        scope.ownerObj = undefined;
        scope.collabObj = undefined;

        scope.createCompany = function(company){
          company.owners = company.owners.map(function(item){
            return item.id;
          });
          company.users = company.users.map(function(item){
            return item.id;
          });
          Company.create(company).then(function(data){
            scope.selectCompany(data);
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

        scope.addCollab = function(collab) {
          if(collab) scope.company.users.push(collab);
          scope.collabObj = undefined;
        };

        scope.removeCollab = function(collab) {
          var index = scope.company.users.indexOf(collab);
          scope.company.users.splice(index, 1);
        };

        scope.getOwners = function(owner) {
          return User.search({q: owner}).then(function(users){
            return users;
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
