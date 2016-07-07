(function() {
  'use strict';

  /* =========================================================
   * File: auth.js
   * Authentication Controller
   * =========================================================*/

  App.controller('AuthenticationCtrl', function($scope, $state, Auth, Notify){

    /*===============
     * STD AUTH
     * ==============*/
    $scope.signup = function(credentials) {
      // Reset Form
      $scope.signupForm.$setPristine();
      $scope.signupForm.email.$error.invalid = false;
      $scope.signupForm.email.$error.alreadyInUse = false;
      $scope.signupForm.password.$error.invalid = false;

      Auth
        .signup(credentials)
        .then(function(res){
          $state.go('profile.details', {id: res.data.user.id});
        })
        .catch(function(err){
          if(err.status === 409) { // Email already in use
            $scope.signupForm.email.$error.alreadyInUse = true;
            Notify.error('Signup Error', 'Email already in use');
          }
          else {
            for(var key in err.data.data) {
              $scope.signupForm[key].$error.invalid = true;
            }
            Notify.error('Signup Error', 'Invalid Fields');
          }
        });
    };

    $scope.login = function(credentials) {
      // Reset Form
      $scope.loginForm.$setPristine();
      // $scope.loginForm.$setUntouched();
      $scope.loginForm.email.$error.invalid = false;
      $scope.loginForm.password.$error.invalid = false;

      Auth
        .login(credentials)
        .then(function(user){
          $state.go('profile.details', {id: user.id});
        })
        .catch(function(err){
          if(err.status === 404) // Invalid Email
            $scope.loginForm.email.$error.invalid = true;
          else if (err.status === 401) // Invalid Password
            $scope.loginForm.password.$error.invalid = true;
          else {
            $scope.loginForm.password.$error.invalid = true;
            Notify.error('Login Error', 'Wrong Email or Password');
          }
        });
    };

    $scope.logout = function() {
      Auth
        .logout()
        .then(function(res){
          $state.go('auth.login');
        });
    };

  });

})();
