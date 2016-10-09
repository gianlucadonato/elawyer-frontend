(function() {
  'use strict';

  /**=========================================================
  * File: form-list.js
  * FormList Controller
  =========================================================*/

  App.controller('notifications', function($scope, $filter, Answer, Notify, ngTableParams, Auth) {

    $scope.answers = [];
    $scope.isLoading = false;
    $scope.perPage = 15;
    $scope.totalItems = 0;

    function activate() {
      getForms();
    }

    activate();

    function getForms() {
      $scope.isLoading = true;
      Answer.api.index({
        is_draft: false,
        is_template: false,
        per_page: $scope.perPage
      }).then(function(data){
        $scope.answers = data.answers;
        $scope.totalItems = data.total_items;
        $scope.isLoading = false;
        initTable();
      }).catch(function(err){
        $scope.isLoading = false;
      });
    }

    function initTable() {
      $scope.retainer_agreementsTable = new ngTableParams({
        page: 1,
        count: $scope.perPage
      }, {
        total: $scope.totalItems,
        getData: function($defer, params) {
          Answer.api.index({
            page: params.page() - 1,
            per_page: params.count()
          }).then(function(data){
            $scope.totalItems = data.total_items;
            $scope.answers = params.sorting() ? $filter('orderBy')(data.answers, params.orderBy()) : data.answers;
            $defer.resolve($scope.answers);
          }).catch(function(err){
            Notify.error('Error!', "Unable to fetch answers");
          });
        }
      });
    }


    $scope.copyLink = function(m) {
      //for testing
      if (window.location.href.indexOf('localhost'))
        window.prompt("Copy to clipboard: Ctrl+C, Enter", "http://localhost:3000/#/forms/"+m.id+"/answer");
      else
        window.prompt("Copy to clipboard: Ctrl+C, Enter", "http://elawyer.herokuapp.com/#/forms/"+m.id+"/answer");
    };

    $scope.sendLink = function(m) {
      var msg = window.prompt("Inserisci testo personalizzato. Allegheremo il link per permettere all'utente di inizializzare il suo account", "Salve, clicca sul bottone sottostante per impostare la tua password elawyer e rispondere al nostro questionario");

      if (msg)
        Auth.reset_password({
          text: msg,
          link: "http://elawyer.herokuapp.com/#/forms/"+m.id+"/answer",
          email: m.customer.email,

        }).then(function success(data) {
           Notify.success('OK!', "Email di invtio inviata con successo!");
        }, function bad(error) {
            Notify.error('Error!', "C'è stato un problema ad inviare la mail di invito");
        });
    };

    $scope.deleteForm = function(m) {
      swal({
        title: "Are you sure?",
        text: "Sei sicuro di volere eliminare questo questionario ?.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#F44336",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(isConfirm){
        if (isConfirm) {
          Answer.api.delete(m).then(function(data){
            var index = $scope.answers.indexOf(m);
            $scope.answers.splice(index, 1);
            Notify.success('OK!', "Questionario eliminato con successo!");
          }).catch(function(err){
            Notify.error('Error!', "Non è stato possibile eliminare questo questionario");
          });
        } else {
          return false;
        }
      });
    };

  });

})();
