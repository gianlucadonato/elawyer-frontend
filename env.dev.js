(function() {
  'use strict';

  /**=========================================================
   * Module: constants.js
   * Define constants to inject across the application
   =========================================================*/

  angular
    .module('appConstants')
    .constant('API', {
      host: 'http://localhost:5000',
      // host: 'http://crclex.herokuapp.com'
    })
    .constant('ENV', {
      stripe_key: 'pk_test_w8PwVaNe6M1kGOWmHUxoiLa2',
      google_api_key: 'AIzaSyBToPHkI1XaS_cd3AwfWsjuIjl3mr83N8k',
      google_client_id: '351029471735-5lj3je6l680guouujicvtolgakdrci0s.apps.googleusercontent.com'
    });

})();
