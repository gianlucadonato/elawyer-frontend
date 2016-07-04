(function() {
  'use strict';

  /**=========================================================
  * File: user.js
  * User Service
  =========================================================*/


  function computeParams(obj) {
    var a = "?";
    for (var i in obj) {
      a += i + "=" + obj[i] + "&";     
    }
    return a;
  }

  App.factory('Service', function ($rootScope, $q, $http, API) {
    var api = {};

    var template = {
      title: '',
      description: '',
      price: 0,
      mandatory: false,
      items: []
    }

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

    api.get = function(params) {
      var deferred = $q.defer();

      var p = computeParams(params);

      $http
        .get(API.host + '/api/services' + p)
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

      var r = angular.extend({}, a);

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

    return {api: api, template: function() {return angular.copy(template)}};
  });

})();
