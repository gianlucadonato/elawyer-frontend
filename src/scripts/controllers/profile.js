(function() {
  'use strict';

  /**=========================================================
  * File: profile.js
  * Profile Controller
  =========================================================*/

  App.controller('ProfileCtrl', function($rootScope, $scope, $http, $stateParams, User, Auth, Notify, Upload, API, $localStorage) {

    $scope.editProfileInfo = false;
    $scope.editBillingInfo = false;
    $scope.docsTab1Active = true;
    $scope.docsTab2Active = false;
    
    //check if it's me for editing
    $scope.me = $localStorage.current_user;

    function activate() {
      getUser($stateParams.id);
    }

    activate();

    function getUser(userId) {
      User
        .get({id: userId})
        .then(function(user){
          $scope.user = user;
        })
        .catch(function(err){
          Notify.error('Error!','Unable to fetch user');
        });
    }


    this.uploadAvatar = function(file) {
      if(file) {
        Upload.upload({
          url: API.host + '/api/users/upload_image',
          data: {file: file}
        }).then(function(resp) {
          $scope.user = resp.data;
          Auth.setUser(resp.data);
          Notify.success('Ok!','Image saved successfully!');
        }).catch(function(err){
          Notify.error('Error!','Unable to save image');
        });
      }
    };

    $scope.addCompany = function(resource) {
      $scope.user.companies.push(resource);
    };

    /*====================================================
     * Edit User Infos
     * =====================================================*/
    $scope.toggleProfileInfo = function(type) {
      $scope.editProfileInfo = !$scope.editProfileInfo;
    };

    $scope.toggleBillingInfo = function(type) {
      $scope.editBillingInfo = !$scope.editBillingInfo;
    };

    $scope.updateUser = function(user) {
      if(user.birthday) {
        // Transform data in ms
        var bd = user.birthday.split('/');
        user.birthday = new Date(bd[2], bd[1], bd[0]).getTime();
      }
      User
        .update(user)
        .then(function(user){
          Notify.success('OK!','Infos saved successfully!');
          Auth.setUser(user);
          $scope.editProfileInfo = false;
          $scope.editBillingInfo = false;
        })
        .catch(function(err){
          Notify.error('Error!','Unable to update user');
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
