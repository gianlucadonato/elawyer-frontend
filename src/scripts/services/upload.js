(function() {
  'use strict';

  /**=========================================================
  * File: matter.js
  * Matter Service
  =========================================================*/

  App.factory('Uploader', function ($rootScope, $q, $http, API, Service, Upload) {

    var api = {};

    api.upload = function(files) {

      var data = {
        parentId: 'root',
      };

      for (var i = 0; i < files.length; i++) {
        var fileName = files[i].name || 'file-'+i;
        data[fileName] = files[i];
      }

      var deferred = $q.defer();
      Upload.upload({
        url: API.host + '/api/filemanager/upload',
        data: data
      }).then(function (res) {
        deferred.resolve(res);
      }).catch(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    return api;
  });

})();

