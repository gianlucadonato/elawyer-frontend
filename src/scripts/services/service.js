(function() {
  'use strict';

  /**=========================================================
  * File: service.js
  * Retainer Agreement Service
  =========================================================*/

  App.factory('Service', function ($rootScope, $q, $http, API) {

    var api = {};
    var template = {
      title: '',
      description: '',
      price: 0,
      is_mandatory: false,
      items: []
    };

    /* API */
    api.index = function(params) {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/services', {
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
        .post(API.host + '/api/services', obj)
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
        .put(API.host + '/api/services/' + obj.id, obj)
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
        .delete(API.host + '/api/services/' + id)
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
