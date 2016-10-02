(function() {
  'use strict';

  /**=========================================================
  * File: drive.js
  * Documents Controller
  =========================================================*/

  App.controller('DriveCtrl', function($scope, GoogleClient, Drive, User, Notify, $localStorage) {

    $scope.showSignInOverlay = false;
    $scope.showInitFolders = false;

    init();

    function init() {
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

    function activate() {
      // getFolderList();
      // initFolders();
      // GoogleClient.signOut().then(function(){
      //   console.log('Signed Out!');
      // });
    }

    function getUser() {
      return User.get($localStorage.current_user);
    }

    function getFolderList() {
      Drive.list().then(function(data){
        console.log('list folders', data);
      }).catch(function(err){
        if(err.status === 418) {
          console.log('Unable to Fetch Files', err);
          GoogleClient.signOut().then(function(){
            console.log('Signed Out!');
          });
        }
      });
    }

    function initFolders() {
      Drive
        .initDriveFolders()
        .then(function(res){
          console.log('init resp', res);
        })
        .catch(function(err){
          console.log('error', err);
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
                activate();
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

  });

})();
