(function() {
  'use strict';

  /**=========================================================
  * File: customer-list.js
  * Customer List Controller
  =========================================================*/

  App.controller('CustomerListCtrl', function($rootScope, $scope, $state, $uibModal, User, Notify) {

    var self = this;

    function activate() {
      getUserList();
    }

    activate();

    function getUserList() {
      User
        .list()
        .then(function(users){
          $scope.customers = users;
        })
        .catch(function(err){
          Notify.error('Error!','Unable to fetch user');
        });
    }

    $scope.openNewCustomerModal = function() {
      self.newCustomerModal = $uibModal.open({
        animation: false,
        size: '',
        backdrop: true,
        keyboard: true,
        templateUrl: 'views/modals/newCustomer.html',
        resolve: {
          customers: function () {
            return $scope.customers;
          }
        },
        controller: function($scope, $uibModalInstance, customers){
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
                customers.push(data);
                Notify.success('OK!','User created successfully!');
              })
              .catch(function(err){
                Notify.error('Error!','Unable to create user');
              });
          };
        }
      });
    };

    $scope.deleteCustomer = function(user) {
      swal({
        title: "Are you sure?",
        text: "L'utente verrà eliminato permanentemente.",
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
            var index = $scope.customers.indexOf(user);
            $scope.customers.splice(index, 1);
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
