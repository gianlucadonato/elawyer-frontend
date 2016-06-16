(function() {
  'use strict';

  /*=========================================================
   * File: auth.js
   * Authentication Service
   =========================================================*/

  App.factory('Auth', function ($rootScope, $q, $http, $localStorage, API) {
    var auth = {};

    /* =======================================
     * Getter & Setters
     * =======================================*/
    auth.getUser = function() {
      return $localStorage.current_user;
    };

    auth.setUser = function(user) {
      $rootScope.current_user = user;
      $localStorage.current_user = user;
    };

    auth.deleteUser = function() {
      delete $localStorage.current_user;
    };

    auth.getToken = function() {
      return $localStorage.token;
    };

    auth.setToken = function(token) {
      $localStorage.token = token;
    };

    auth.deleteToken = function() {
      delete $localStorage.token;
    };

    // Check user auth status
    auth.isAuthenticated = function() {
      if(auth.getUser() && auth.getToken()) {
        $rootScope.isAuthenticated = true;
        $rootScope.$broadcast('isAuthenticated');
        return true;
      } else {
        $rootScope.isAuthenticated = false;
        return false;
      }
    };

    /* =======================================
     * Auth Methods
     * =======================================*/
    auth.signup = function(credentials) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/auth/sign_up', credentials)
        .then(function(res){
          auth.setUser(res.data.user);
          auth.setToken(res.data.token);
          $rootScope.isAuthenticated = true;
          deferred.resolve(res);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    auth.login = function(credentials) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/auth/sign_in', credentials)
        .then(function(res){
          auth.setUser(res.data.user);
          auth.setToken(res.data.token);
          $rootScope.isAuthenticated = true;
          deferred.resolve(res.data.user);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    auth.logout = function() {
      var deferred = $q.defer();
      auth.deleteUser();
      auth.deleteToken();
      $rootScope.isAuthenticated = false;
      $rootScope.$broadcast('isNotAuthenticated');
      deferred.resolve(true);
      return deferred.promise;
    };

    return auth;
  });

})();
