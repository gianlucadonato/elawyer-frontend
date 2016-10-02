(function() {
  'use strict';

  /*=========================================================
   * File: auth.js
   * Authentication Service
   =========================================================*/

  App.factory('Auth', function ($rootScope, $q, $http, $localStorage, jwtHelper, User, API) {
    var auth = {};

    /* =======================================
     * Getter & Setters
     * =======================================*/
    auth.getUser = function() {
      var deferred = $q.defer();
      if($localStorage.current_user) {
        auth.setUser($localStorage.current_user);
        deferred.resolve($localStorage.current_user);
      } else {
        var jwtToken = auth.getToken();
        var payload = jwtHelper.decodeToken(jwtToken);
        User.get({id: payload.owner_id}).then(function(data){
          auth.setUser(data);
          deferred.resolve(data);
        });
      }
      return deferred.promise;
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
      var jwtToken = auth.getToken();
      if(jwtToken && !jwtHelper.isTokenExpired(jwtToken)) {
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
          auth.setToken(res.data.token);
          $rootScope.isAuthenticated = true;
          deferred.resolve(res.data);
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
          auth.setToken(res.data.token);
          $rootScope.isAuthenticated = true;
          deferred.resolve(res.data);
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

    auth.change_password = function(data) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/auth/change_password', data)
        .then(function(res){
          deferred.resolve(res);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };


    auth.reset_password = function(data) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/auth/reset_password', data)
        .then(function(res){
          $rootScope.isAuthenticated = false;
          deferred.resolve(res);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    return auth;
  });

})();
