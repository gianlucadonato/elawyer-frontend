(function() {
  'use strict';

  /**=========================================================
  * File: upload.js
  * Upload Service
  =========================================================*/

  App.factory('Uploader', function ($rootScope, $q, $http, API, Service, Upload) {

    var api = {};

    api.upload = function(data) {
      for (var i = 0; i < data.files.length; i++) {
        var fileName = data.files[i].name || 'file-'+i;
        data[fileName] = data.files[i];
      }
      var deferred = $q.defer();
      Upload.upload({
        url: API.host + '/api/documents/upload',
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
