(function() {
  'use strict';

  /**=========================================================
  * File: percentage.js
  * Returns percentage result
  =========================================================*/

  App.filter("withval", function() {
    return function(u) {
      var n = 0;
      for (var i = 0; i < u.length; i++) {
        if (u[i].value)
          n++;
      }
      return n;
    }
  });

})();
