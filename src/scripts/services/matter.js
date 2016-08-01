(function() {
  'use strict';

  /**=========================================================
  * File: matter.js
  * Matter Service
  =========================================================*/

  App.factory('Matter', function ($rootScope, $q, $http, API, Service) {

    var api = {};
    var editor = {};
    var template = {
      title: '',
      description: '',
      area_of_interest: '',
      withholding_tax: false,
      deposit: 0,
      is_draft: true,
      is_template: false,
      items: [Service.template()]
    };

    /* API */
    api.index = function(params) {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/matters', {
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
        .get(API.host + '/api/matters/' + id)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.areas = function(id) {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/matters/areas')
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.create = function(obj) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/matters', obj)
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
        .put(API.host + '/api/matters/' + obj.id, obj)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.send = function(obj) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/matters/'+obj.id+'/send', obj)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.pay = function(id, data) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/matters/'+id+'/pay', data)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.save = function(obj) {
      return obj.id ? api.update(obj) : api.create(obj);
    };

    api.delete = function(obj) {
      var deferred = $q.defer();
      $http
        .delete(API.host + '/api/matters/' + obj.id)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    /* EDITOR */
    editor.addItem = function(items) {
      items.push(Service.template());
    };

    editor.removeItem = function(items, index) {
      items.splice(index, 1);
    };

    function percentage(input, percent) {
      return input/100 * percent;
    }

    editor.getPrice = function(sum) {
      var total = sum;
      var expenses_refund_percentage = 15;
      var vat_precentage = 22;
      var social_taxes_percentage = 4;
      var expenses_refund = percentage(total, expenses_refund_percentage);
      var social_taxes = percentage(total + expenses_refund, social_taxes_percentage);
      var vat = percentage(total + expenses_refund + social_taxes, vat_precentage);
      return {
        services_total: total,
        expenses_refund: expenses_refund,
        social_taxes: percentage(total + expenses_refund, 4),
        vat: vat,
        withholding_tax: percentage(total + expenses_refund + social_taxes + vat, 20),
        total: total + expenses_refund + percentage(total + expenses_refund, 4) + vat
      };
    };

    return {
      api: api,
      editor: function() {return editor;},
      template: function() {return angular.copy(template);}
    };

  });

})();
