(function() {
  'use strict';

  /**=========================================================
  * File: user.js
  * User Service
  =========================================================*/

  App.factory('Drive', function ($rootScope, $q, $http, API) {
    var api = {};

    api.setupGoogleAccount = function(data) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/documents/setup_google_account', data)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.initDriveFolders = function(data) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/documents/init_drive_folders', data)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.list = function(query) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/documents/list', {
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

    api.get = function(doc) {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/documents/' + doc.id)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.create = function(doc) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/documents', doc)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.update = function(doc) {
      var deferred = $q.defer();
      $http
        .put(API.host + '/api/documents/' + doc.id, doc)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.delete = function(doc) {
      var deferred = $q.defer();
      $http
        .delete(API.host + '/api/documents/' + doc.id)
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
