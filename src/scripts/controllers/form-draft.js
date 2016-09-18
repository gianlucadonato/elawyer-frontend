(function() {
  'use strict';

  /**=========================================================
  * File: form-draft.js
  * Form's drafts Controller
  =========================================================*/

  App.controller('FormDraftCtrl', function($scope, $filter, Form, Notify, ngTableParams, $uibModal, User, Answer) {

    $scope.forms = [];
    $scope.isLoading = false;
    $scope.perPage = 15;
    $scope.totalItems = 0;

    function activate() {
      getForms();
    }

    activate();

    function getForms() {
      $scope.isLoading = true;
      Form.api.index({
        is_draft: true,
        is_template: false,
        per_page: $scope.perPage
      }).then(function(data){
        $scope.forms = data.forms;
        $scope.totalItems = data.total_items;
        $scope.isLoading = false;
        initTable();
      }).catch(function(err){
        $scope.isLoading = false;
      });
    }

    function initTable() {
      $scope.formsTable = new ngTableParams({
        page: 1,
        count: $scope.perPage
      }, {
        total: $scope.totalItems,
        getData: function($defer, params) {
          Form.api.index({
            is_draft: true,
            page: params.page() - 1,
            per_page: params.count()
          }).then(function(data){
            $scope.totalItems = data.total_items;
            $scope.forms = params.sorting() ? $filter('orderBy')(data.forms, params.orderBy()) : data.forms;
            $defer.resolve($scope.forms);
          }).catch(function(err){
            Notify.error('Error!', "Unable to fetch forms");
          });
        }
      });
    }

    $scope.deleteForm = function(m) {
      swal({
        title: "Are you sure?",
        text: "Il questionario verrà eliminato permanentemente.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#F44336",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(isConfirm){
        if (isConfirm) {
          Form.api.delete(m).then(function(data){
            var index = $scope.forms.indexOf(m);
            $scope.forms.splice(index, 1);
            Notify.success('OK!', "Selected item deleted successfully!");
          }).catch(function(err){
            Notify.error('Error!', "Unable to delete selected item");
          });
        } else {
          return false;
        }
      });
    };

    $scope.update = function(m) {
      Form.api.update(m).then(function(data){
        Notify.success('OK!','Saved Successfully!');
      }).catch(function(err){
        try {
          var msg = '';
          for(var key in err.data.data.errors) {
            msg += key + ' is required! ';
          }
          Notify.error('Error on saving', msg);
        } catch(err) {
          Notify.error('Error!', 'Something went wrong :(');
        }
      });
    };


    $scope.setUser = function(user, formRef) {

      if(formRef.id)
        Answer.api.create({
          id: formRef.id,
          customer_id: user.id
        }).then(function(data){
          swal({
            title: "Sent!",
            text: "Il questionario è stato inviato correttamente.",
            type: "success",
            showCancelButton: false,
            confirmButtonText: "OK!",
            closeOnConfirm: true
          }, function() {
          });
        }).catch(function(err){
          var errorMsg = 'Something went wrong :(';
          if(err.status === 404) {
            errorMsg = 'There is no user with this email!';
          }
          Notify.error('Error!', errorMsg);
        });
      else
        Notify.error('Error!', 'Inserire il titolo!');
    };

  });

})();
