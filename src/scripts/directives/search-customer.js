(function() {
  'use strict';

  /**=========================================================
  * File: search-customer.js
  * Open Customer Search Modal
  =========================================================*/

  App.directive('searchCustomer', ['$uibModal', 'User', 'Company', 'Notify', '$http', '$localStorage',
  function($uibModal, User, Company, Notify, $http, $localStorage) {
    return {
      restrict: 'A',
      scope: {
        searchCustomer: '=?',
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
          init();
        });

        scope.isTabCompanyActive = false;
        scope.showTabUser = true;
        scope.showTabCompany = true;
        scope.showCreateUser = false;
        scope.showCreateCompany = false;
        scope.user = User.getModel();
        scope.showCompanyInput = false;
        scope.companyObj = undefined;
        scope.userExistsError = false;
        scope.ownerBlankError = false;
        scope.query = '';

        function init() {
          scope.isTabUserActive = true;
          scope.isTabCompanyActive = false;
          scope.showTabUser = true;
          scope.showTabCompany = true;
          scope.showCreateUser = false;
          scope.showCreateCompany = false;
          scope.user = User.getModel();
          scope.showCompanyInput = false;
          scope.companyObj = undefined;
          scope.userExistsError = false;
          scope.ownerBlankError = false;
          scope.query = '';
          if(attrs.only) {
            switch(attrs.only) {
              case 'user':
                scope.showTabCompany = false;
                scope.isTabUserActive = true;
                break;
              case 'company':
                scope.showTabUser = false;
                scope.isTabCompanyActive = true;
                break;
            }
          }
        }

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

        scope.selectUser = function(user, action) {
          if(!action) action = 'actionSelect';
          if(scope.searchCustomerCb)
            scope.searchCustomerCb(user, {
              resourceType: 'user',
              action: action
            });
          scope.currentModal.dismiss();
          scope.goBack();
        };

        scope.selectCompany = function(company, action) {
          if(!action) action = 'actionSelect';
          if(scope.searchCustomerCb)
            scope.searchCustomerCb(company, {
              resourceType: 'company',
              action: action
            });
          scope.currentModal.dismiss();
          scope.goBack();
        };

        // Create User
        scope.createUser = function(data) {
          var user = angular.copy(data);
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
          User
            .create(user)
            .then(function(res){
              scope.selectUser(res, 'actionCreate');
              Notify.success('OK!','User created successfully!');
            })
            .catch(function(err){
              if(err.status === 409)
                scope.userExistsError = true;
              else
                Notify.error('Error!','Unable to create user');
            });
        };

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

        // Create Company
        scope.company = Company.getTemplate();

        if($localStorage.current_user)
          scope.company.owners.push($localStorage.current_user);

        scope.createCompany = function(data){
          var company = angular.copy(data);
          company.owners = (company.owners || []).map(function(item){
            return item.id;
          });
          if(company.owners.length) {
            Company.create(company).then(function(data){
              scope.selectCompany(data, 'actionCreate');
            }).catch(function(err){
              Notify.error("Error!", "Unable to create company");
            });
          } else {
            scope.ownerBlankError = true;
          }
        };

        scope.addOwner = function(owner) {
          if(owner && owner.id)
            scope.company.owners.push(owner);
        };

        scope.removeOwner = function(owner) {
          var index = scope.company.owners.indexOf(owner);
          scope.company.owners.splice(index, 1);
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
