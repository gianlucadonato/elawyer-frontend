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
      $scope.signupForm.$setUntouched();
      $scope.signupForm.email.$error.invalid = false;
      $scope.signupForm.password.$error.invalid = false;

      Auth
        .signup(credentials)
        .then(function(res){
          $state.go('profile.about');
        }, function(err){
          for(var key in err.data.data) {
            $scope.signupForm[key].$error.invalid = true;
          }
          Notify.error('Signup Error', 'Invalid Fields');
        });
    };

    $scope.login = function(credentials) {
      // Reset Form
      $scope.loginForm.$setPristine();
      $scope.loginForm.$setUntouched();
      $scope.loginForm.email.$error.invalid = false;
      $scope.loginForm.password.$error.invalid = false;

      Auth
        .login(credentials)
        .then(function(res){
          $state.go('profile.about', {id: res.id});
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
