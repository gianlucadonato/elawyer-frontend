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
      stripe_key: 'pk_test_w8PwVaNe6M1kGOWmHUxoiLa2'
    });

})();


