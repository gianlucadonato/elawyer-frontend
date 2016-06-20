(function() {
  'use strict';

  /**=========================================================
  * File: user.js
  * User Service
  =========================================================*/

  App.factory('Matter', function ($rootScope, $q, $http, API) {
    var api = {};

    api.post = function(user) {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/services')
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
        .get(API.host + '/api/services')
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.update = function(a) {
      var deferred = $q.defer();
      $http
        .put(API.host + '/api/services/' + a.id, a)
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
