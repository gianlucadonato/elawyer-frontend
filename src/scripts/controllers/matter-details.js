(function() {
  'use strict';

  /**=========================================================
  * File: matter-details.js
  * Matter Details Controller
  =========================================================*/

  App.controller('MatterDetailsCtrl', function($scope, $stateParams, $state, Matter, RetainerAgreement, Invoice, Notify) {

    $scope.invoices = [];

    function activate() {
      getMatter();
    }

    activate();

    function getMatter() {
      Matter.get($stateParams.id).then(function(data) {
        $scope.matter = data;
        data.retainer_agreements.forEach(function(item){
          $scope.invoices = $scope.invoices.concat(item.invoices);
        });
      }).catch(function(err){
        Notify.error('Error!', 'Unable to load matter');
      });
    }

    $scope.editMatter = function(user) {
      console.log('edit matter');
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

    // RETAINER AGREEMENTS LIST
    $scope.deleteRetainerAgreement = function(item) {
      swal({
        title: "Are you sure?",
        text: "La lettera di incarico verrà eliminata permanentemente.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#F44336",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(isConfirm){
        if (isConfirm) {
          RetainerAgreement.api.delete(item).then(function(data){
            var index = $scope.matter.retainer_agreements.indexOf(item);
            $scope.matter.retainer_agreements.splice(index, 1);
            Notify.success('OK!', "Selected item deleted successfully!");
          }).catch(function(err){
            Notify.error('Error!', "Unable to delete selected item");
          });
        } else {
          return false;
        }
      });
    };

  });

})();
