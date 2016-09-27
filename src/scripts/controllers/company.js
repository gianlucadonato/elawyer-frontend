(function() {
  'use strict';

  /**=========================================================
  * File: company.js
  * Company Controller
  =========================================================*/

  App.controller('CompanyCtrl', function($scope, $http, $stateParams, Company, User, Notify, Upload, API, $localStorage) {

    $scope.editProfileInfo = !!$stateParams.editMode;
    $scope.isOwner = false;
    $scope.ownerObj = undefined;

    function activate() {
      getCompany();
    }

    activate();

    function getCompany() {
      Company
        .get($stateParams.id)
        .then(function(data){
          $scope.company = data;
          data.owners.forEach(function(owner){
            if(owner.id == $localStorage.current_user.id)
              $scope.isOwner = true;
          });
        })
        .catch(function(err){
          Notify.error('Error!','Unable to fetch company');
        });
    }

    /*====================================================
     * Edit Company Info
     * =====================================================*/
    $scope.toggleProfileInfo = function(type) {
      $scope.editProfileInfo = !$scope.editProfileInfo;
    };

    $scope.updateCompany = function(company) {
      company.users = company.users.map(function(obj) {
        return obj.id;
      });
      company.owners = company.owners.map(function(obj) {
        return obj.id;
      });
      Company
        .update(company)
        .then(function(data){
          Notify.success('OK!','Informazioni salvate con successo!');
          $scope.editProfileInfo = false;
        })
        .catch(function(err){
          Notify.error('Error!','Unable to update company');
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
