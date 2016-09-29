(function() {
  'use strict';

  /**=========================================================
  * File: default-src.js
  * Default image for ng-src
  =========================================================*/

  App.directive('defaultSrc', function() {
    return {
      link: function(scope, element, attrs) {

        var default_path = "/images/avatar/3.png";
        if(attrs.company) {
          default_path = "/images/avatar/company.png";
        }
        if(attrs.random) {
          var num = Math.round(Math.random() * 8) + 1;
          default_path = "img/profile-pics/"+num+".jpg";
        }

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
