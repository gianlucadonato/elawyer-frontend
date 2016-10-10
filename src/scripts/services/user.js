(function() {
  'use strict';

  /**=========================================================
  * File: user.js
  * User Service
  =========================================================*/

  App.factory('User', function ($rootScope, $q, $http, API) {
    var api = {};

    api.getModel = function() {
      return {
        first_name: '',
        last_name: '',
        email: '',
        mobile_phone: '',
        phone: '',
        avatar_url: '',
        birthday: '',
        vat_number: '',
        fiscal_code: '',
        birth_place: '',
        residence: '',
        domicile: '',
        address: '',
        role: '',
        accounts: {},
        companies: [],
      };
    };

    api.list = function(query) {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/users', {
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

    api.get = function(user) {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/users/' + user.id)
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
        .get(API.host + '/api/users/search', {
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

    api.create = function(user) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/users', user)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.update = function(user) {
      var deferred = $q.defer();
      $http
        .put(API.host + '/api/users/' + user.id, user)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.delete = function(user) {
      var deferred = $q.defer();
      $http
        .delete(API.host + '/api/users/' + user.id)
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
