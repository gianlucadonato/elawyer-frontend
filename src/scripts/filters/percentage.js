(function() {
  'use strict';

  /**=========================================================
  * File: percentage.js
  * Returns percentage result
  =========================================================*/

  App.filter("percentage", function() {
    return function(input, n) {
      return (input/100 * n);
    };
  });

})();
