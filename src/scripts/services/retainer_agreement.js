(function() {
  'use strict';

  /**=========================================================
  * File: retainer_agreement.js
  * retainer_agreement Service
  =========================================================*/

  App.factory('RetainerAgreement', function ($rootScope, $q, $http, API, Service) {

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
        .get(API.host + '/api/retainer_agreement', {
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
        .get(API.host + '/api/retainer_agreement/' + id)
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
        .post(API.host + '/api/retainer_agreement', obj)
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
        .put(API.host + '/api/retainer_agreement/' + obj.id, obj)
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

    api.send = function(obj) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/retainer_agreement/'+obj.id+'/send', obj)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.pay = function(obj, opt) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/retainer_agreement/'+obj.id+'/pay', opt)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.delete = function(obj) {
      var deferred = $q.defer();
      $http
        .delete(API.host + '/api/retainer_agreement/' + obj.id)
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
        .get(API.host + '/api/retainer_agreement/areas')
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

    /* CALCULATE INVOICE */
    function calcInvoice(retainer_agreement, count_all) {
      var total_services = 0;
      retainer_agreement.items.forEach(function(item) {
        if (count_all || item.is_mandatory || item.is_selected)
          total_services += parseFloat(item.price);
      });

      var deposit_percentage = (total_services * retainer_agreement.deposit)/100;
      var balance_percentage = (total_services * (100 - retainer_agreement.deposit))/100;
      var invoice = {
        full: calcTotal(total_services, retainer_agreement.withholding_tax),
        deposit: calcTotal(deposit_percentage, retainer_agreement.withholding_tax),
        balance: calcTotal(balance_percentage, retainer_agreement.withholding_tax)
      };
      return invoice;
    }

    function calcTotal(total_services, is_withholding_tax) {
      var expenses_refund = (total_services * 15)/100;
      var social_taxes = ((total_services + expenses_refund) * 4)/100;
      var vat = ((total_services + expenses_refund + social_taxes) * 22)/100;
      var total_price = (total_services + expenses_refund + social_taxes + vat);
      var withholding_tax = (total_price * 20)/100;
      var final_price = total_price;

      if(is_withholding_tax)
        final_price = total_price - withholding_tax;

      return {
        total_services: parseFloat(total_services).toFixed(2),
        expenses_refund: parseFloat(expenses_refund).toFixed(2),
        social_taxes: parseFloat(social_taxes).toFixed(2),
        vat: parseFloat(vat).toFixed(2),
        withholding_tax: parseFloat(withholding_tax).toFixed(2),
        total_price: parseFloat(total_price).toFixed(2),
        final_price: parseFloat(final_price).toFixed(2)
      };
    }

    return {
      api: api,
      editor: function() {return editor;},
      template: function() {return angular.copy(template);},
      calcInvoice: calcInvoice
    };

  });

})();
