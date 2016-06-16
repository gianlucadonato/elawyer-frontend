(function() {
  'use strict';

  /* =========================================================
   * File: media.js
   * Media Plugins
   * =========================================================*/

  App
    // =========================================================================
    // MEDIA ELEMENT
    // =========================================================================
    .directive('mediaElement', function(){
      return {
        restrict: 'A',
        link: function(scope, element) {
          element.mediaelementplayer();
        }
      };
    })
    // =========================================================================
    // LIGHTBOX
    // =========================================================================
    .directive('lightbox', function(){
      return {
        restrict: 'C',
        link: function(scope, element) {
          element.lightGallery({
            enableTouch: true
          });
        }
      };
    });

})();
