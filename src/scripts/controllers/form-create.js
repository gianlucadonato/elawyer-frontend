(function() {
  'use strict';

  /**=========================================================
  * File: form-create.js
  * Create New Form
  =========================================================*/

  App.controller('FormCreateCtrl', function($rootScope, $scope, $stateParams, $state, $timeout, $uibModal, Form, Question, User, Notify) {


    $scope.form = Form.template();
    $scope.editor = Form.editor();
    var modal;

    //====================================
    // DATE PICKER
    //====================================
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.openDP = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope[opened] = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];


    //====================================
    // Editor
    //====================================
    $scope.choose = function(ev) {
      $scope.form.items[$scope.usingIndex].icon = ev.toElement.innerHTML;
      modal.dismiss();
    }

    $scope.createOption = function(index, item) {
        $scope.form.items[index].options.push(item);
    }


    $scope.chooseIcon = function(index) {
      $scope.usingIndex = index;
      modal = $uibModal.open({
        animation: false,
        size: '',
        backdrop: true,
        keyboard: true,
        templateUrl: 'views/modals/icons.html',
        scope: $scope
      });
    };


    var self = this;
    var timeout = null;
    var preventSave = false;
    $scope.templates = [];
    $scope.questions = [];
    $scope.isLoading = false;
    $scope.isSaving = false;
    $scope.total = 0;

    $scope.currentTmplPage = 0;
    $scope.totalTmplItems = 0;
    $scope.currentSrvPage = 0;
    $scope.totalSrvItems = 0;
    $scope.perPage = 5;

    $scope.results = []; // Users

    function activate() {
      if($stateParams.id) { // Edit Page
        getForm();
      }
    }

    activate();

    function getForm() {
      Form.api.get($stateParams.id).then(function(data) {
        preventSave = true;
        $scope.form = data;
      }).catch(function(err){
        Notify.error('Error!', 'Unable to load form');
      });
    }


    // // Autosave
    $scope.$watch('form', function(newValue, oldValue) {

      if(!angular.equals(newValue, oldValue) && !preventSave) {

        if(newValue.title) {
          if (timeout) {
            $timeout.cancel(timeout); // debounce 1sec.
          }
          timeout = $timeout(function() {
            $scope.isSaving = true;
            $scope.errorSaving = false;
            Form.api.save(newValue).then(function(data) {
              if(!newValue.id) // Prevent double saving
                preventSave = true;
              $scope.form.id = data.id;
              $timeout(function() { // Only for design effect
                $scope.isSaving = false;
                $scope.errorSaving = false;
              }, 1000);
            }).catch(function(err){
              $scope.errorSaving = true;
              console.log('Unable to save form', err);
            });
          }, 1000);
        } else {
          $scope.errorSaving = true;
        }

      } else {
        preventSave = false;
      }
    }, true);

    /* Form Templates
     * ======================*/
    $scope.importTemplate = function() {
      fetchTemplates();
      // Open Modal
      self.addTemplateModal = $uibModal.open({
        animation: false,
        size: '',
        backdrop: true,
        keyboard: true,
        templateUrl: 'views/modals/importFormTemplate.html',
        scope: $scope
      });
    };

    $scope.addTemplate = function(item) {
      if($scope.form.id) {
        swal({
          title: "Attenzione!",
          text: "Importando un nuovo template verrà sovrascritto quanto scritto fin'ora.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#F44336",
          confirmButtonText: "Importa",
          cancelButtonText: "Annulla",
          closeOnConfirm: true,
          closeOnCancel: true
        }, function(isConfirm){
          if (isConfirm) addTemplate(item);
          else return false;
        });
      } else {
        addTemplate(item);
      }
    };

    function addTemplate(item) {
      var index = $scope.templates.indexOf(item);
      var template = angular.copy($scope.templates[index]);
      delete template.id;
      delete template.is_template;
      preventSave = true;
      $scope.form = template;
      Notify.success('OK!','Template imported successfully!');
      self.addTemplateModal.dismiss();
    }

    $scope.saveAsTemplate = function(matter) {
      matter.is_template = true;
      if(matter.id) {
        // Update Form
        Form.api.update(matter).then(function(data){
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
      } else {
        // Create New Form
        Form.api.create(matter).then(function(data){
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
      }
    };

    function fetchTemplates() {
      $scope.isLoading = true;
      Form.api.index({
        page: $scope.currentTmplPage,
        per_page: $scope.perPage,
        is_template: true
      })
      .then(function(data){
        $scope.templates = data.forms;
        $scope.totalTmplItems = data.total_items;
        $scope.isLoading = false;
      })
      .catch(function(err){
        $scope.isLoading = false;
      });
    }

    $scope.nextTemplate = function(page) {
      $scope.currentTmplPage = page-1;
      fetchTemplates();
    };

    /* Form's Questions
     * ======================*/
    $scope.importQuestion = function() {
      fetchQuestions();
      // Open Modal
      self.addQuestionModal = $uibModal.open({
        animation: false,
        size: '',
        backdrop: true,
        keyboard: true,
        templateUrl: 'views/modals/importFormQuestion.html',
        scope: $scope
      });
    };

    $scope.addQuestion = function(item) {
      var index = $scope.questions.indexOf(item);
      var service = angular.copy($scope.questions[index]);
      delete service.id;
      delete service.is_starred;
      $scope.form.items.push(service);
      Notify.success('OK!','Question imported successfully!');
      self.addQuestionModal.dismiss();
    };

    $scope.saveQuestion = function(service) {
      Question.api.create(service).then(function(data){
        var index = $scope.form.items.indexOf(service);
        $scope.form.items[index].is_starred = true;
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

    function fetchQuestions() {
      $scope.isLoading = true;
      Question.api.index({
        page: $scope.currentSrvPage,
        per_page: $scope.perPage,
        is_starred: true
      })
      .then(function(data){
        $scope.questions = data.questions;
        $scope.totalSrvItems = data.total_items;
        $scope.isLoading = false;
      })
      .catch(function(err){
        $scope.isLoading = false;
      });
    }

    $scope.nextQuestion = function(page) {
      $scope.currentSrvPage = page-1;
      fetchQuestions();
    };



  });

})();
