(function() {
  'use strict';

  /**=========================================================
  * File: matter-list.js
  * MatterList Controller
  =========================================================*/

  App.controller('MatterListCtrl', function($rootScope, $scope, $state, Matter) {

    $scope.matterList = [];
    $scope.drafts = [];

    $scope.page = 0; $scope.per_page = 10;
    $scope.getExistingMatters = function() {
        Matter.api.index({page: $scope.page, per_page: $scope.per_page, is_draft: false, is_model:false}).then(function(res) {
          $scope.matterList = res;
        }, function() {});
    }

    $scope.$watch('[page,per_page]', function () {
        $scope.serv = [];
        $scope.getExistingMatters();
    }, true);

    $scope.u_page = 0; $scope.u_per_page = 10;
    $scope.getExistingDrafts = function() {
        Matter.api.index({page: $scope.u_page, per_page: $scope.u_per_page, is_draft: true, is_model:false}).then(function(res) {
          $scope.drafts = res;
        }, function() {});
    }

    $scope.$watch('[u_page,u_per_page]', function () {
        $scope.drafts = [];
        $scope.getExistingDrafts();
    }, true);


    $scope.open = function(el) {
      if (!el.is_draft) {

        var st = '';
        if (el.customer) {
          st += el.customer.first_name + " " + el.customer.last_name;
        } else if (el.company) {
          st += el.company.company_name;
        }

        swal({
          title: "Sei sicuro ?",
          text: "La lettera di incarico selezionata è già stata inviata a " + st + ". Il cliente potrà vedere le tue modifiche.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#F44336",
          confirmButtonText: "Si, modifica",
          cancelButtonText: "No",
          closeOnConfirm: true,
          closeOnCancel: true
        }, function(isConfirm){
          if (isConfirm) {
            $state.go('page.matter-edit', {id: el.id});
          } else {
            return false;
          }
        });
      }
    }




  });

})();
