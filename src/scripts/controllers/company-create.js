(function() {
  'use strict';

  /**=========================================================
  * File: company-create.js
  * Company Create Controller
  =========================================================*/

  App.controller('CompanyCreateCtrl', function($scope, $state, $http, Company, User, Notify) {

    $scope.isLoading = false;
    $scope.company = Company.getTemplate();
    $scope.ownerObj = undefined;

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
      if(owner) $scope.company.owners.push(owner);
      $scope.ownerObj = undefined;
    };

    $scope.removeOwner = function(owner) {
      var index = $scope.company.owners.indexOf(owner);
      $scope.company.owners.splice(index, 1);
    };

    $scope.addCollab = function(collab) {
      if(collab) $scope.company.users.push(collab);
      $scope.callabObj = undefined;
    };

    $scope.removeCollab = function(collab) {
      var index = $scope.company.users.indexOf(collab);
      $scope.company.users.splice(index, 1);
    };

    $scope.getOwners = function(owner) {
      return User.search({q: owner}).then(function(users){
        return users;
      });
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
