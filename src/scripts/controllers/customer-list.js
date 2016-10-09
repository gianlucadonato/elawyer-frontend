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
        .list({role: 1})
        .then(function(res){
          $scope.customers = res.users;
        })
        .catch(function(err){
          Notify.error('Error!','Unable to fetch user');
        });
    }

    $scope.addCustomer = function(user) {
      $scope.customers.unshift(user);
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
