(function() {
  'use strict';

  /**=========================================================
  * File: company-details.js
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
          if($localStorage.current_user.role >= 10) {
            $scope.isOwner = true;
          } else {
            data.owners.forEach(function(owner){
              if(owner.id == $localStorage.current_user.id)
              $scope.isOwner = true;
            });
          }
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

    $scope.updateCompany = function(data) {
      var company = angular.copy(data);
      company.owners = (company.owners || []).map(function(owner) {
        return owner.id;
      });
      if(company.owners.length) {
        Company
        .update(company)
        .then(function(data){
          Notify.success('OK!','Informazioni salvate con successo!');
          $scope.editProfileInfo = false;
        })
        .catch(function(err){
          Notify.error('Error!','Unable to update company');
        });
      } else {
        Notify.error('Errore','Inserire almeno un proprietario!');
      }
    };

    $scope.addOwner = function(owner) {
      if(owner && owner.id)
        $scope.company.owners.push(owner);
    };

    $scope.removeOwner = function(owner) {
      if(owner) {
        var index = $scope.company.owners.indexOf(owner);
        $scope.company.owners.splice(index, 1);
      }
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
