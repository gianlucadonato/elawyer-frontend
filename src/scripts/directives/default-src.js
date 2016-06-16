(function() {
  'use strict';

  /**=========================================================
  * File: default-src.js
  * Module: unipiazza::default-src
  * Default image for ng-src
  =========================================================*/

  App.directive('defaultSrc', function() {
    return {
      link: function(scope, element, attrs) {

        var default_path = "/images/avatar/3.png";

        element.bind('error', function() {
          if (attrs.src !== default_path) {
            attrs.$set('src', default_path);
          }
        });

        attrs.$observe('ngSrc', function(value) {
          if (!value) {
            attrs.$set('src', default_path);
          }
        });
      }
    };
  });

})();
