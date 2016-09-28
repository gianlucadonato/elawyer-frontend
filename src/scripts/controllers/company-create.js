(function() {
  'use strict';

  /**=========================================================
  * File: company-create.js
  * Company Create Controller
  =========================================================*/

  App.controller('CompanyCreateCtrl', function($scope, $state, $http, Company, User, Notify, $localStorage) {

    $scope.company = Company.getTemplate();
    $scope.showOwnerInput = false;
    $scope.ownerObj = undefined;

    if($localStorage.current_user)
      $scope.company.owners.push($localStorage.current_user);

    $scope.createCompany = function(data){
      var company = angular.copy(data);
      company.owners = (company.owners || []).map(function(item){
        return item.id;
      });
      Company.create(company).then(function(data){
        $scope.company.id = data.id;
        Notify.success("OK!", "Azienda creata con successo!");
        $state.go('page.company-list');
      }).catch(function(err){
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

    $scope.showAddOwner = function() {
      $scope.showOwnerInput = !$scope.showOwnerInput;
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
