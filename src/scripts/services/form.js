(function() {
  'use strict';

  /**=========================================================
  * File: form.js
  * Form Service
  =========================================================*/

  App.factory('Form', function ($rootScope, $q, $http, API, Question) {

    var api = {};
    var editor = {};
    var template = {
      title: '',
      description: '',
      is_draft: true,
      is_template: false,
      items: [Question.template()]
    };

    /* API */
    api.index = function(params) {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/forms', {
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
        .get(API.host + '/api/forms/' + id)
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
        .post(API.host + '/api/forms', obj)
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
        .put(API.host + '/api/forms/' + obj.id, obj)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.send = function(obj) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/forms/'+obj.id+'/send', obj)
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
        .delete(API.host + '/api/forms/' + obj.id)
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
      items.push(angular.copy(Question.template()));
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
