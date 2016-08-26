/* global gapi */
/* global async */
(function(window, angular) {
  'use strict';

  var App = angular.module('google-client', []);

  App.provider('GoogleClient', function() {

    var defaults = {};
    var apiToLoad = [];

    this.defaults = function(options) {
      angular.extend(defaults, options);
      return this;
    };

    this.addApi = function(api, version) {
      apiToLoad.push({api:api, version:version});
      return this;
    };

    this.$get = ['$q', function($q) {
      return new GoogleClientService(defaults, $q);
    }];

    // Google Client
    function GoogleClientService(options, $q) {
      var isLoad = false;

      function loadApi() {
        var deferred = $q.defer();
        if(!isLoad) {
          gapi.load('client:auth2', function(){
            gapi.client.setApiKey(defaults.api_key);
            async.each(apiToLoad, function(api, next){
              gapi.client.load(api.api, api.version, function(){
                next();
              });
            }, function(err, res){
              // Init Auth
              gapi.auth2.init({
                client_id: options.client_id,
                scope: options.scopes.join(' ')
              }).then(function(){
                isLoad = true;
                deferred.resolve();
              });
            });
          });
        }
        return deferred.promise;
      }

      // Get Google Api Instance
      this.getInstance = function() {
        return gapi;
      };

      // Pop Up SignIn Dialog
      this.signIn = function() {
        var deferred = $q.defer();
        var auth = gapi.auth2.getAuthInstance();
        auth.signIn({
          scope: options.scopes.join(' ')
        }).then(function(res){
          deferred.resolve(res);
        });
        return deferred.promise;
      };

      this.signOut = function() {
        var auth = gapi.auth2.getAuthInstance();
        return auth.signOut();
      };

      // Check User Auth Session
      this.checkAuth = function(){
        function isSignedIn() {
          var deferred = $q.defer();
          var auth = gapi.auth2.getAuthInstance();
          if(auth.isSignedIn.get())
            deferred.resolve();
          else deferred.reject();
          return deferred.promise;
        }
        if(isLoad === true){
          return isSignedIn();
        } else {
          return loadApi().then(function(){
            return isSignedIn();
          });
        }
      };

      // Get User User Info
      this.getUser = function(){
        var auth = gapi.auth2.getAuthInstance();
        return auth.currentUser.get();
      };

      // Render Google Signin Btn
      this.render = function(id, handleSuccess, handleFailure) {
        function executeRender(id, opts) {
          gapi.load('signin2', function(){
            gapi.signin2.render(id, opts);
          });
        }
        var opts = {
          scope: options.scopes.join(' '),
          width: 200,
          height: 50,
          longtitle: true,
          theme: 'light',
          onsuccess: handleSuccess,
          onfailure: handleFailure
        };
        if(isLoad === true)
          executeRender(id, opts);
        else
          loadApi().then(function(){
            executeRender(id, opts);
          });
      };
    }
  });


})(window, angular);
