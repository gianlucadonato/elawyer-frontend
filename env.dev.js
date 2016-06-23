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
    });

})();


