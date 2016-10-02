(function() {
  'use strict';

  /**=========================================================
  * File: documents.js
  * Documents Controller
  =========================================================*/

  App.controller('DocumentsCtrl', function($rootScope, $scope, GoogleClient, Drive, User, Notify, $localStorage) {

    $scope.showSignInOverlay = false;
    $scope.showInitFolders = false;

    activate();

    function getUser() {
      return User.get($localStorage.current_user);
    }

    function activate() {
      GoogleClient
      .checkAuth()
      .then(function(res){
        getUser().then(function(user){
          if(user.accounts.google) activate();
          else $scope.showSignInOverlay = true;
        }).catch(function(err){
          Notify.error('Error!', 'Unable to get current user!');
        });
      })
      .catch(function(err){
        getUser().then(function(user){
          if(user.accounts.google) activate();
          else $scope.showSignInOverlay = true;
        });
      });
    }

    $scope.signInDrive = function($event) {
      GoogleClient
        .signIn({ prompt: 'consent' })
        .then(function(auth){
          Drive.setupGoogleAccount(auth).then(function(res){
            $scope.showInitFolders = true;
            Drive
              .initDriveFolders()
              .then(function(res){
                $scope.showSignInOverlay = false;
                $scope.showInitFolders = false;
                $rootScope.$broadcast('refresh-file-manager');
              })
              .catch(function(err){
                console.log('Unable to setup folders!', err);
                Notify.error('Error!', 'Unable to set up folders!');
              });
          }).catch(function(err){
            console.log('Unable to Set Google Account!', err);
            Notify.error('Error!', 'Unable to Set Google Account!');
          });
        })
        .catch(function(err){
          Notify.error('Error!', 'Unable to Login with Google!');
        });
    };

    $scope.signOut = function() {
      GoogleClient.signOut().then(function(){
        console.log('Signed Out!');
      });
    };

  });

})();
