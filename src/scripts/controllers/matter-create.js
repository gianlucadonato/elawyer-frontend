(function() {
  'use strict';

  /**=========================================================
  * File: matter-create.js
  * Create New Matter
  =========================================================*/

  App.controller('MatterCreateCtrl', function($rootScope, $scope, $stateParams, $state, $timeout, $uibModal, Matter, Service, Notify) {

    var self = this;
    var timeout = null;
    var preventSave = false;
    $scope.matter = Matter.template();
    $scope.editor = Matter.editor();
    $scope.templates = [];
    $scope.services = [];
    $scope.isLoading = false;
    $scope.isSaving = false;

    $scope.currentTmplPage = 0;
    $scope.totalTmplItems = 0;
    $scope.currentSrvPage = 0;
    $scope.totalSrvItems = 0;
    $scope.perPage = 5;

    function activate() {
      if($stateParams.id) { // Edit Page
        getMatter();
      }
    }



    Matter.api.areas().then(function(data) {
      $scope.areas = data;
    }).catch(function(err) {
      Notify.error('Error!', 'Unable to load areas');
    });

    activate();

    function getMatter() {
      Matter.api.get($stateParams.id).then(function(data) {
        preventSave = true;
        $scope.matter = data;
      }).catch(function(err){
        Notify.error('Error!', 'Unable to load matter');
      });
    }

    // Autosave
    $scope.$watch('matter', function(newValue, oldValue) {
      if(!angular.equals(oldValue, newValue) && !preventSave) {


        if ($scope.matter.area_of_interest == '____manual____') {
          $scope.matter.area_of_interest = '';
          $scope.manual = true;
        }

        if (timeout) {
          $timeout.cancel(timeout); // debounce 1sec.
        }
        timeout = $timeout(function() {
          $scope.isSaving = true;
          $scope.errorSaving = false;
          Matter.api.save(newValue).then(function(data) {
            if(!newValue.id) // Prevent double saving
              preventSave = true;
            $scope.matter.id = data.id;
            $timeout(function() { // Only for design effect
              $scope.isSaving = false;
              $scope.errorSaving = false;
            }, 1000);
          }).catch(function(err){
            $scope.errorSaving = true;
            console.log('Unable to save matter', err);
          });
        }, 1000);
      } else {
        preventSave = false;
      }
    }, true);

    /* Matter Templates
     * ======================*/
    $scope.importTemplate = function() {
      fetchTemplates();
      // Open Modal
      self.addTemplateModal = $uibModal.open({
        animation: false,
        size: '',
        backdrop: true,
        keyboard: true,
        templateUrl: 'views/modals/importMatterTemplate.html',
        scope: $scope
      });
    };

    $scope.addTemplate= function(item) {
      var index = $scope.templates.indexOf(item);
      var template = angular.copy($scope.templates[index]);
      delete template.id;
      delete template.is_template;
      preventSave = true;
      $scope.matter = template;
      Notify.success('OK!','Template imported successfully!');
      self.addTemplateModal.dismiss();
    };

    $scope.saveAsTemplate = function(matter) {
      matter.is_template = true;
      if(matter.id) {
        // Update Matter
        Matter.api.update(matter).then(function(data){
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
        // Create New Matter
        Matter.api.create(matter).then(function(data){
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
      Matter.api.index({
        page: $scope.currentTmplPage,
        per_page: $scope.perPage,
        is_template: true
      })
      .then(function(data){
        $scope.templates = data.matters;
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

    /* Matter Services
     * ======================*/
    $scope.importService = function() {
      fetchServices();
      // Open Modal
      self.addServiceModal = $uibModal.open({
        animation: false,
        size: '',
        backdrop: true,
        keyboard: true,
        templateUrl: 'views/modals/importMatterService.html',
        scope: $scope
      });
    };

    $scope.addService= function(item) {
      var index = $scope.services.indexOf(item);
      var service = angular.copy($scope.services[index]);
      delete service.id;
      delete service.is_starred;
      $scope.matter.items.push(service);
      Notify.success('OK!','Service imported successfully!');
      self.addServiceModal.dismiss();
    };

    $scope.saveService = function(service) {
      Service.api.create(service).then(function(data){
        var index = $scope.matter.items.indexOf(service);
        $scope.matter.items[index].is_starred = true;
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

    function fetchServices() {
      $scope.isLoading = true;
      Service.api.index({
        page: $scope.currentSrvPage,
        per_page: $scope.perPage,
        is_starred: true
      })
      .then(function(data){
        $scope.services = data.services;
        $scope.totalSrvItems = data.total_items;
        $scope.isLoading = false;
      })
      .catch(function(err){
        $scope.isLoading = false;
      });
    }

    $scope.nextService = function(page) {
      $scope.currentSrvPage = page-1;
      fetchServices();
    };

    /* Send Matter to Customer
     * ======================*/
    $scope.sendMatterModal = function() {
      self.sendMatterModal = $uibModal.open({
        animation: false,
        size: '',
        backdrop: true,
        keyboard: true,
        templateUrl: 'views/modals/sendMatter.html',
        scope: $scope
      });
    };

    $scope.sendMatterTo = function(email) {
      Matter.api.send({
        id: $scope.matter.id,
        email: email
      }).then(function(data){
        self.sendMatterModal.dismiss();
        swal({
          title: "Sent!",
          text: "La lettera d'incarico è stata inviata correttamente.",
          type: "success",
          showCancelButton: false,
          confirmButtonText: "OK!",
          closeOnConfirm: true
        }, function() {
          $state.go('page.matter-details', $scope.matter);
        });
      }).catch(function(err){
        var errorMsg = 'Something went wrong :(';
        if(err.status === 404) {
          errorMsg = 'There is no user with this email!';
        }
        Notify.error('Error!', errorMsg);
      });
    };

  });

})();
