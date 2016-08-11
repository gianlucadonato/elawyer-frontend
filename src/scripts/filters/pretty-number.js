(function() {
  'use strict';

  /**=========================================================
  * File: pretty-number.js
  * Prettify numbers
  =========================================================*/

  App.filter("prettyNumber", function() {
    return function(x) {
      if(!x) x = '0';
      var y = parseFloat(x).toFixed(2).replace('.', ',');
      return y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
  });

})();
