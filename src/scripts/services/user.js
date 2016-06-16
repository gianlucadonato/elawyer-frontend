(function() {
  'use strict';

  /**=========================================================
  * File: user.js
  * User Service
  =========================================================*/

  App.factory('User', function ($rootScope, $q, $http, API) {
    var api = {};

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

    return api;
  });

})();
