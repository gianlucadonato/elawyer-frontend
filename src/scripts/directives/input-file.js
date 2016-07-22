

(function() {
  'use strict';

  /**=========================================================
  * File: default-src.js
  * Module: unipiazza::default-src
  * Default image for ng-src
  =========================================================*/

  App.directive('uploadfile', function () {
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.bind('click', function(e) {
          angular.element(e.target).siblings('#upload').trigger('click');
        });
      }
    };
  });

})();
