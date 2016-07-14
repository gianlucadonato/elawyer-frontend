(function() {
  'use strict';

  /**=========================================================
  * File: lawyer-list.js
  * Lawyer List Controller
  =========================================================*/

  App.controller('LawyerListCtrl', function($rootScope, $scope, $state, $uibModal, User, Notify) {

    var self = this;

    function activate() {
      getLawyerList();
    }

    activate();

    function getLawyerList() {
      User
        .list({role: 10})
        .then(function(res){
          $scope.lawyers = res.users;
        })
        .catch(function(err){
          Notify.error('Error!','Unable to fetch user');
        });
    }

    $scope.openNewLawyerModal = function() {
      self.newLawyerModal = $uibModal.open({
        animation: false,
        size: '',
        backdrop: true,
        keyboard: true,
        templateUrl: 'views/modals/newCustomer.html',
        resolve: {
          lawyers: function () {
            return $scope.lawyers;
          }
        },
        controller: function($scope, $uibModalInstance, lawyers){
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
                lawyers.push(data);
                Notify.success('OK!','User created successfully!');
              })
              .catch(function(err){
                Notify.error('Error!','Unable to create user');
              });
          };
        }
      });
    };

    $scope.deleteLawyer = function(user) {
      swal({
        title: "Are you sure?",
        text: "Questo avvocato verrà eliminato permanentemente.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#F44336",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(isConfirm){
        if (isConfirm) {
          User.delete(user).then(function(data){
            var index = $scope.lawyers.indexOf(user);
            $scope.lawyers.splice(index, 1);
            Notify.success('OK!', "Selected user deleted successfully!");
          }).catch(function(err){
            Notify.error('Error!', "Unable to delete selected user");
          });
        } else {
          return false;
        }
      });
    };

  });

})();
