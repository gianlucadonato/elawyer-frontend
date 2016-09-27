(function() {
  'use strict';

  /**=========================================================
  * File: company-create.js
  * Company Create Controller
  =========================================================*/

  App.controller('SearchUserCtrl', function($scope, $state, $http, Company, User, Notify) {

    $scope.tabUser = true;
    $scope.tabCompany = false;
    $scope.query = '';
    $scope.isLoading = false;

    $scope.search = function(query) {
      $scope.users = [];
      User.search({q: query}).then(function(users){
        $scope.users = users;
      });
      $scope.companies = [];
      Company.search({q: query}).then(function(companies){
        $scope.companies = companies;
      });
    };

    // Create Company
    $scope.createCompany = function(company){
      $scope.isLoading = true;
      company.owners = company.owners.map(function(item){
        return item.id;
      });
      Company.create(company).then(function(data){
        $scope.isLoading = false;
        $scope.company = data;
        Notify.success("OK!", "Azienda creata con successo!");
        $state.go('page.company-list');
      }).catch(function(err){
        $scope.isLoading = false;
        Notify.error("Error!", "Unable to fetch companies");
      });
    };

    $scope.addOwner = function(owner) {
      $scope.company.owners.push(owner);
      $scope.ownerObj = undefined;
    };

    $scope.removeOwner = function(owner) {
      var index = $scope.company.owners.indexOf(owner);
      $scope.company.owners.splice(index, 1);
    };

    $scope.getLocation = function(val) {
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

  });

})();
