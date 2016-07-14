(function() {
  'use strict';

  /**=========================================================
  * File: matter.js
  * Matter Service
  =========================================================*/

  App.factory('Matter', function ($rootScope, $q, $http, API, Service) {

    var api = {};
    var editor = {};
    var template = {
      title: '',
      description: '',
      area_of_interest: '',
      withholding_tax: false,
      is_draft: true,
      is_template: false,
      items: [Service.template()]
    };

    /* API */
    api.index = function(params) {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/matters', {
          params: params
        })
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.get = function(id) {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/matters/' + id)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.create = function(obj) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/matters', obj)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.update = function(obj) {
      var deferred = $q.defer();
      $http
        .put(API.host + '/api/matters/' + obj.id, obj)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.save = function(obj) {
      return obj.id ? api.update(obj) : api.create(obj);
    };

    api.delete = function(obj) {
      var deferred = $q.defer();
      $http
        .delete(API.host + '/api/matters/' + obj.id)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    /* EDITOR */
    editor.addItem = function(items) {
      items.push(Service.template());
    };

    editor.removeItem = function(items, index) {
      items.splice(index, 1);
    };

    return {
      api: api,
      editor: function() {return editor;},
      template: function() {return angular.copy(template);}
    };

  });

})();
