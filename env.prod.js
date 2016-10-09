(function() {
  'use strict';

  /**=========================================================
   * Module: constants.js
   * Define constants to inject across the application
   =========================================================*/

  angular
    .module('appConstants')
    .constant('API', {
      host: 'http://crclex.herokuapp.com'
    })
    .constant('ENV', {
      stripe_key: 'pk_test_w8PwVaNe6M1kGOWmHUxoiLa2',
      google_api_key: 'AIzaSyAk4NLGRLEjzcRJpv8M45-F6ECQ5QzgxSY',
      google_client_id: '289715728853-edmcqdam6okb6fts8s9oj74n4h8p8ghe.apps.googleusercontent.com',
      google_scopes: [
        'https://www.googleapis.com/auth/drive'
      ]
    });

})();
