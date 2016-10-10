(function() {
  'use strict';

  /**=========================================================
  * File: company-create.js
  * Company Create Controller
  =========================================================*/

  App.controller('CompanyCreateCtrl', function($scope, $state, $http, Company, User, Notify, $localStorage) {

    $scope.company = Company.getTemplate();

    if($localStorage.current_user)
      $scope.company.owners.push($localStorage.current_user);

    $scope.createCompany = function(data){
      var company = angular.copy(data);
      company.owners = (company.owners || []).map(function(item){
        return item.id;
      });
      if(company.owners.length) {
        Company.create(company).then(function(data){
          $scope.company.id = data.id;
          Notify.success("OK!", "Azienda creata con successo!");
          $state.go('page.company-list');
        }).catch(function(err){
          Notify.error("Error!", "Unable to fetch companies");
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
