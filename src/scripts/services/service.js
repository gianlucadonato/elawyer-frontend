(function() {
  'use strict';

  /**=========================================================
  * File: user.js
  * User Service
  =========================================================*/

  App.factory('Service', function ($rootScope, $q, $http, API) {
    var api = {};

    api.post = function(user) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/services', user)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.get = function(p, pp) {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/services?page='+p+"&per_page="+pp)
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

    api.update = function(a) {

      console.log('a is: ', a);
      var r = angular.extend({}, a);

      console.log(r)

      console.log(r.items.length)

      var deferred = $q.defer();
      $http
        .put(API.host + '/api/services/' + a.id, r)
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
