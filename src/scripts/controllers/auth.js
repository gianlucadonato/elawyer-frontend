(function() {
  'use strict';

  /* =========================================================
   * File: auth.js
   * Authentication Controller
   * =========================================================*/

  App.controller('AuthenticationCtrl', function($scope, $state, $timeout, Auth, User, Notify, $stateParams){

    $scope.confirmed = $stateParams.confirmed === 'true' ? true : false;
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
          User.get({id: res.owner_id}).then(function(user){
            Auth.setUser(user);
            $state.go('profile.details', {id: user.id});
          }).catch(function(e){
            Notify.error('Error!', 'Unable to retrieve user info');
          });
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
        .then(function(res){
          User.get({id: res.owner_id}).then(function(user){
            Auth.setUser(user);
            $state.go('profile.details', {id: user.id});
          }).catch(function(e){
            Notify.error('Error!', 'Unable to retrieve user info');
          });
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

    $scope.change_password = function(form) {
      var data = {
        password: form.password,
        token: $stateParams.t,
        email: $stateParams.e
      };
      Auth
        .change_password(data)
        .then(function(res){
          Auth.setToken(res.data.token);
          $state.go('profile.details', {id: res.data.owner_id});
          Notify.success('Success', 'Password changed successfully!');
        })
        .catch(function(err){
          Notify.error('Error', 'We encountered an error in changing your password. Maybe reset token link is expired');
        });
    };

    $scope.reset_password = function(data) {
      $scope.isSending = true;
      Auth
        .reset_password(data)
        .then(function(res){
          Notify.success('OK!', 'Ti abbiamo inviato le istruzioni, controlla la tua casella di posta');
          $scope.isSending = false;
          $state.go('auth.login');
        })
        .catch(function(err){
          $scope.isSending = false;
          if(err.status === 404)
            Notify.error('Errore!', 'L\'email inserita non è presente nel nostro database');
          else
            Notify.error('Errore!', 'Impossibile completare l\'operazione');
        });
    };

  });

})();
