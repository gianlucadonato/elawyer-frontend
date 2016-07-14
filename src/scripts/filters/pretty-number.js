(function() {
  'use strict';

  /**=========================================================
  * File: pretty-number.js
  * Prettify numbers
  =========================================================*/

  App.filter("prettyNumber", function() {
    return function(x) {
      var z = "";
      if (x) {
        x = x.toString();
        var y = x.split('.')[0];
        if (x.split('.')[1])
          z = "." + x.split('.')[1].substring(0, 2);
        return y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + z;
      } else {
        return '0';
      }
    };
  });

})();
