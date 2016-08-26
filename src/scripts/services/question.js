(function() {
  'use strict';

  /**=========================================================
  * File: question.js
  * Question Service
  =========================================================*/

  App.factory('Question', function ($rootScope, $q, $http, API) {

    var api = {};
    var template = {
      title: '',
      description: '',
      type: 'input', //textarea, select, radio, checkbox, input, date
      icon: '',
      default: '',
      placeholder: '',
      options: [],
      is_mandatory: false
    };

    /* API */
    api.index = function(params) {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/questions', {
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

    api.create = function(obj) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/questions', obj)
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
        .put(API.host + '/api/questions/' + obj.id, obj)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.delete = function(id) {
      var deferred = $q.defer();
      $http
        .delete(API.host + '/api/questions/' + id)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    return {
      api: api,
      template: function() {return angular.copy(template);}
    };

  });

})();
