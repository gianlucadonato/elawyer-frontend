(function() {
  'use strict';

  /**=========================================================
  * File: matter.js
  * Matter Service
  =========================================================*/

  App.factory('Invoice', function ($rootScope, $q, $http, API, Service) {

    var api = {};
    var editor = {};
    var template = {
      title: '',
      description: '',
      area_of_interest: '',
      withholding_tax: false,
      is_draft: true,
      is_template: false,
      items: [Service.template()]
    };

    /* API */
    api.index = function(params) {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/invoices', {
          params: params
        })
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.get = function(id) {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/invoices/' + id)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };


    api.update = function(obj) {
      var deferred = $q.defer();
      $http
        .put(API.host + '/api/invoices/' + obj.id, obj)
        .then(function(res){
          deferred.resolve(res.data);
        })   
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };


    return {
      api: api,
      template: function() {return angular.copy(template);}
    };

  });

})();
