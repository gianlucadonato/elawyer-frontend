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

    $scope.addLawyer = function(user) {
      $scope.lawyers.unshift(user);
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
