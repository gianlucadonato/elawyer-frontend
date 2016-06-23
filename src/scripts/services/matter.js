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
        .post(API.host + '/api/matters', user)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.areas = function() {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/matters-areas')
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
        .get(API.host + '/api/matters/' +id)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.index = function(p, pp, draft) {
      var deferred = $q.defer();

      var url = '/api/matters?page='+p+"&per_page="+pp;

      if (draft)
        url += "&is_draft=true";

      $http
        .get(API.host + url)
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
        .put(API.host + '/api/matters/' + a.id, a)
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
