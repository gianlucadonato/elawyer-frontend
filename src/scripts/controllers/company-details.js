(function() {
  'use strict';

  /**=========================================================
  * File: matter-details.js
  * MatterDetails Controller
  =========================================================*/

  App.controller('company', function($scope, $stateParams, $localStorage, $state, User, Notify, $window, $timeout, $uibModal, Company, Upload, API) {

    $scope.editCompanyInfo = false;

    //check if it's me for editing
    $scope.me = $localStorage.current_user;

    function activate() {
      getCompany($stateParams.id);
    }

    activate();

    $scope.findWithAttr = function(array, attr, value) {
      if (array)
        for(var i = 0; i < array.length; i += 1) {
            if(array[i][attr] === value) {
                return i;
            }
        }
      return -1;
    };

    $scope.clearAndCreate = function() {
      $timeout(function() {
        $scope.company = {};
        $scope.company = Company.template();
        $scope.company.owners.push($scope.me);
        $scope.creating = true;
      }, 0);
    };

    function getCompany(companyId) {
      if (companyId && !$scope.creating)
        Company.api
          .get(companyId)
          .then(function(company){
            $scope.company = company;
          })
          .catch(function(err){
            Notify.error('Error!','Unable to fetch user');
          });
      else {
        $scope.company = {};
        $scope.company = Company.template();
        $scope.company.owners.push($scope.me);
        $scope.creating = true;
      }
    }


    $scope.uploadAvatar = function(file) {
      if(file) {
        Upload.upload({
          url: API.host + '/api/companies/'+$scope.company.id+'/upload_image',
          data: {file: file}
        }).then(function(resp) {
          $scope.company = resp.data;
          //update company.

          Notify.success('Ok!','Image saved successfully!');
        }).catch(function(err){
          Notify.error('Error!','Unable to save image');
        });
      }
    };


    $scope.addUser = function(item) {
      console.log(item)
      $scope.company.users.push(item);
    };

    $scope.addAdmin = function(item) {
      console.log(item)
      $scope.company.owners.push(item);
    };


    $scope.removeAdmin = function(index) {
      if ($scope.company.owners.length > 1)
        $scope.company.owners.splice(index, 1);
      else
        Notify.error('Error!','Deve esserci almeno un proprietario per questa azienda !');
    };

    $scope.removeUser = function(index) {
        $scope.company.users.splice(index, 1);
    };


    $scope.searchUser = function(query) {
      return User.search({
        q: query
      }).then(function(results){
        return results.map(function(user){
          user.name = user.first_name + ' ' + user.last_name;
          return user;
        });
      });
    };

    this.saveCompany = function() {

      var dataReference = $scope.company;

      dataReference.users = dataReference.users.map(function(obj) {
        return obj.id;
      });

      dataReference.owners = dataReference.owners.map(function(obj) {
        return obj.id;
      });

      if (dataReference.id)
        Company.api
          .update(dataReference)
          .then(function(response){
            Notify.success('OK!','Informazioni aziendali aggiornate correttamente');
            $scope.editCompanyInfo = false;
            $scope.company = response;
            $scope.editBillingInfo = false;
          })
          .catch(function(err){
            Notify.error('Error!','C\'è stato un errore ad aggiornare le informazioni aziendali');
          });
      else
        Company.api
          .create(dataReference)
          .then(function(response){
            Notify.success('OK!','Persona giuridica creata correttamente');
            $scope.editCompanyInfo = false;
            $scope.editBillingInfo = false;
            $state.go("company.index");
          })
          .catch(function(err){
            Notify.error('Error!','C\'è stato un errore a creare la persona giuridica');
          });
    };

    /*====================================================
     * Edit User Infos
     * =====================================================*/
    $scope.toggleCompanyInfo = function(type) {
      $scope.editCompanyInfo = !$scope.editCompanyInfo;
    };


    $scope.saveCompany = this.saveCompany;


  });

})();
