(function() {
  'use strict';

  /**=========================================================
   * Module: route-helpers.js
   * Provides helper functions for routes definition
   =========================================================*/

  App.provider('RouteHelpers', ['APP_REQUIRES', function (appRequires) {

    // Set here the base of the relative path
    // for all app views
    this.partialsPath = function (uri) {
      return 'views/partials/' + uri;
    };
    this.pagesPath = function (uri) {
      return 'views/pages/' + uri;
    };

    // Generates a resolve object by passing script names
    // previously configured in constant.APP_REQUIRES
    this.resolveFor = function () {
      var _args = arguments;
      return {
        deps: ['$ocLazyLoad','$q', function ($ocLL, $q) {
          // Creates a promise chain for each argument
          var promise = $q.when(1); // empty promise
          for(var i=0, len=_args.length; i < len; i ++){
            promise = andThen(_args[i]);
          }
          return promise;

          // creates promise to chain dynamically
          function andThen(_arg) {
            // also support a function that returns a promise
            if(typeof _arg === 'function')
              return promise.then(_arg);
            else
              return promise.then(function() {
                // check and returns required script files array
                var whatToLoad = appRequires.scripts[_arg];
                // simple error check
                if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                // finally, return a promise
                // return $ocLL.load( whatToLoad );
                return $ocLL.load([{
                  insertBefore: '#vendor-styles',
                  files: whatToLoad
                }]);
              });
          }

        }]};
    }; // resolveFor

    // not necessary, only used in config block for routes
    this.$get = function(){};

  }]);

})();