(function() {
  'use strict';

  /**=========================================================
  * File: company.js
  * Company Service
  =========================================================*/

  App.factory('Company', function ($q, $http, API) {

    var api = {};

    api.getTemplate = function() {
      return {
        name: '',
        email: '',
        mobile_phone: '',
        phone: '',
        vat: '',
        address: '',
        description: '',
        owners: [],
        users: []
      };
    };

    /* API */
    api.index = function(params) {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/companies', {
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

    api.search = function(query) {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/companies/search', {
          params: query
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
        .get(API.host + '/api/companies/' + id)
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
        .post(API.host + '/api/companies', obj)
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
        .put(API.host + '/api/companies/' + obj.id, obj)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };


    api.delete = function(obj) {
      var deferred = $q.defer();
      $http
        .delete(API.host + '/api/companies/' + obj.id)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };


    return api;

  });

})();
