(function() {
  'use strict';

  /* =========================================================
   * File: toggle-submenu.js
   * Toggle Submenu Directive
   * =========================================================*/

  App.directive('toggleSubmenu', function(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.click(function(){
          element.parent().toggleClass('toggled');
          element.parent().find('ul').stop(true, false).slideToggle(200);
        });
      }
    };
  });

})();