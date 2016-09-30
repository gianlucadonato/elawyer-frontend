(function() {
  'use strict';

  /**=========================================================
  * File: drive.js
  * Documents Controller
  =========================================================*/

  App.controller('DriveCtrl', function($scope, User, GoogleClient, Drive, Auth) {

    $scope.showSignInOverlay = false;

    function activate() {
      checkAuth();
    }
    activate();

    function checkAuth() {
      Auth.getUser().then(function(user){
        if(!user.oauth.google.access_token) {
          GoogleClient
          .checkAuth()
          .then(function(res){
            console.log('fesfew', res);
            getFolderList();
            // GoogleClient.signOut().then(function(){
            //   console.log('signed out');
            // });
          })
          .catch(function(err){
            $scope.showSignInOverlay = true;
          });
        } else {
          console.log('user connected: do nothing.');
        }
      });
    }

    function getFolderList() {
      Drive.list().then(function(data){
        console.log('list folders', data);
      }).catch(function(err){
        console.log('unable to fetch folders', err);
      });
    }

    $scope.signInDrive = function($event) {
      GoogleClient
        .signIn()
        .then(function(user){
          $scope.showSignInOverlay = false;
          var auth = user.getAuthResponse();
          console.log('user', user);
          console.log('auth', auth);
          Auth.set_google_account(auth).then(function(res){
            console.log('user updated!', res);
          });
        })
        .catch(function(err){
          console.log('User is NOT authenticated');
        });
    };

  });

})();
