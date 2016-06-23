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

  });

})();
