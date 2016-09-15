(function() {
  'use strict';

  /**=========================================================
  * File: matter-list.js
  * Matter List Controller
  =========================================================*/

  App.controller('MatterListCtrl', function($scope, $uibModal, Matter, User, Notify) {

    var self = this;

    function activate() {
      getMatterList();
    }

    activate();

    function getMatterList() {
      Matter
        .index()
        .then(function(res){
          $scope.matters = res.matters;
          console.log(res.matters);
        })
        .catch(function(err){
          Notify.error('Error!','Unable to fetch matters');
        });
    }

    $scope.openNewMatterModal = function() {
      self.newCustomerModal = $uibModal.open({
        animation: false,
        size: '',
        backdrop: true,
        keyboard: true,
        templateUrl: 'views/modals/newMatter.html',
        resolve: {
          matters: function () {
            return $scope.matters;
          }
        },
        controller: function($scope, $uibModalInstance, matters){
          $scope.createMatter = function(data) {
            Matter
              .create(data)
              .then(function(matter){
                $uibModalInstance.dismiss();
                matters.push(matter);
                Notify.success('OK!','Matter created successfully!');
              })
              .catch(function(err){
                Notify.error('Error!','Unable to create matter');
              });
          };

          $scope.searchUser = function(query) {
            return User.search({
              q: query
            }).then(function(results){
              return results.map(function(user){
                return {
                  id: user.id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  name: user.first_name + " " + user.last_name,
                  email: user.email
                };
              });
            });
          };
        }
      });
    };

    // Create New Client
    $scope.openNewUser = function() {
      self.newCustomerModal = $uibModal.open({
        animation: false,
        size: '',
        backdrop: true,
        keyboard: true,
        templateUrl: 'views/modals/newUser.html',
        controller: function($scope, $uibModalInstance){
          $scope.createUser = function(data) {
            if(data.birthday) {
              // Transform data in ms
              var bd = data.birthday.split('/');
              data.birthday = new Date(bd[2], bd[1], bd[0]).getTime();
            }
            User
              .create(data)
              .then(function(user){
                $uibModalInstance.dismiss();
                Notify.success('OK!','User created successfully!');
              })
              .catch(function(err){
                Notify.error('Error!','Unable to create user');
              });
          };
        }
      });
    };

    $scope.deleteMatter = function(user) {
      swal({
        title: "Are you sure?",
        text: "La pratica verrà eliminata permanentemente.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#F44336",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(isConfirm){
        if (isConfirm) {
          Matter.delete(user).then(function(data){
            var index = $scope.matters.indexOf(user);
            $scope.matters.splice(index, 1);
            Notify.success('OK!', "Selected matter deleted successfully!");
          }).catch(function(err){
            Notify.error('Error!', "Unable to delete selected matter");
          });
        } else {
          return false;
        }
      });
    };

  });

})();
