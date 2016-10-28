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
        })
        .catch(function(err){
          Notify.error('Error!','Unable to fetch matters');
        });
    }

    $scope.afterCreateMatter = function(matter, data) {
      matter.customer = data.customer;
      matter.owner = data.owner;
      $scope.matters.unshift(matter);
    };

    $scope.deleteMatter = function(matter) {
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
          Matter.delete(matter).then(function(data){
            var index = $scope.matters.indexOf(matter);
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
