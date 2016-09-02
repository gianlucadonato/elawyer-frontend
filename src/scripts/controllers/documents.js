(function() {
  'use strict';

  /**=========================================================
  * File: documents.js
  * Documents Controller
  =========================================================*/

  App.controller('DocumentsCtrl', function($rootScope, $scope, $state, User, GoogleClient, Auth) {

    $scope.showSignInOverlay = false;

    function activate() {
      checkAuth();
    }
    activate();

    function checkAuth() {
      Auth.getUser().then(function(user){
        console.log('currentUser', user);
        if(!user.oauth.google.access_token) {
          GoogleClient
          .checkAuth()
          .then(function(res){
            // GoogleClient.signOut().then(function(){
            //   console.log('signed out');
            // });
          })
          .catch(function(err){
            $scope.showSignInOverlay = true;
            //GoogleClient.render('btn-gdrive');
          });
        } else {
          console.log('user connected: do nothing.');
        }
      });
    }

    $scope.signInDrive = function($event) {
      GoogleClient
        .signIn()
        .then(function(user){
          $scope.showSignInOverlay = false;
          var auth = user.getAuthResponse();
          User.update({
            id: 'me',
            oauth: {
              google: {
                id_token: auth.id_token,
                access_token: auth.access_token,
                expires_at: auth.expires_at,
                scope: auth.scope,
              }
            }
          }).then(function(res){
            console.log('user updated!', res);
          });
        })
        .catch(function(err){
          console.log('User is NOT authenticated');
        });
    };

  });

})();
