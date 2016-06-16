(function() {
  'use strict';

  /**=========================================================
   * Module: constants.js
   * Define constants to inject across the application
   =========================================================*/

  angular
    .module('appConstants', [])
    .constant('API', {
      host: 'http://localhost:5000',
      // host: 'http://crclex.herokuapp.com'
    })
    .constant('APP_REQUIRES', {
      scripts: {
        'sparklines':    ['vendors/jquery.sparkline.min.js'],
        'simpleWeather': ['vendors/jquery.simpleWeather.min.js'],
        'mediaelement':  ['vendors/mediaelement/mediaelement-and-player.min.js',
                          'vendors/mediaelement/mediaelementplayer.min.css'],
        'chosen':        ['vendors/chosen/chosen.jquery.js',
                          'vendors/chosen/angular-chosen-localytics.js',
                          'vendors/chosen/chosen.min.css'],
        'lightgallery':  ['vendors/lightgallery/css/lightgallery.css',
                          'vendors/lightgallery/js/lightgallery.min.js']
      }
    });

  /*========================================================
   * Global Functions
   * Only pure js stuff, if you want to use dependancy injection
   * use angular constants above;
   *=======================================================*/

  // Capitalize first letter of a string
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

})();


