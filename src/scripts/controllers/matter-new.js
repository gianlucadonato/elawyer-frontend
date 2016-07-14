(function() {
  'use strict';

  /**=========================================================
  * File: matter-new.js
  * Create New Matter
  =========================================================*/

  App.controller('MatterNewCtrl', function($rootScope, $scope, $stateParams, $state, $uibModal, Matter, Service, Notify) {

    var self = this;
    $scope.matter = Matter.template();
    $scope.editor = Matter.editor();
    $scope.templates = [];
    $scope.services = [];
    $scope.isLoading = false;

    $scope.currentTmplPage = 0;
    $scope.totalTmplItems = 0;
    $scope.currentSrvPage = 0;
    $scope.totalSrvItems = 0;
    $scope.perPage = 5;

    function activate() {
      if($stateParams.id) {
        // Edit Page
        getMatter();
      }
    }

    activate();

    function getMatter() {
      Matter.api.get($stateParams.id).then(function(data) {
        $scope.matter = data;
      }).catch(function(err){
        Notify.error('Error!', 'Unable to load matter');
      });
    }

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
      $scope.matter = angular.copy($scope.templates[index]);
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
      $scope.matter.items.push($scope.services[index]);
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

  });

})();
