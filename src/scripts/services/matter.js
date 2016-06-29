(function() {
  'use strict';

  /**=========================================================
  * File: user.js
  * User Service
  =========================================================*/


  function computeParams(obj) {
    var a = "?";
    for (var i in obj) {
      a += i + "=" + obj[i] + "&";     
    }
    return a;
  }

  App.factory('Matter', function ($rootScope, $q, $http, API, Service) {
    var api = {};
    var editor = {};

    var template = {
      title: '',
      description: '',
      area: 'empty',
      ritenuta: false,
      is_draft: false,
      is_model: false,
      price: 0,
      items: []
    };

    api.post = function(user) {
      var deferred = $q.defer();
      $http
        .post(API.host + '/api/matters', user)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.areas = function() {
      var deferred = $q.defer();
      $http
        .get(API.host + '/api/matters-areas')
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
        .get(API.host + '/api/matters/' +id)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.index = function(params) {
      var deferred = $q.defer();

      var p = computeParams(params);

      var url = '/api/matters' + p;

      $http
        .get(API.host + url)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };

    api.update = function(a) {
      var deferred = $q.defer();
      $http
        .put(API.host + '/api/matters/' + a.id, a)
        .then(function(res){
          deferred.resolve(res.data);
        })
        .catch(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    };


    editor.addSubItem = function(item) {
      item.items.push(Service.template());
    }

    editor.addItem = function(data, services) {
      if (!data)
        data = {};
      services.push(angular.merge(Service.template(), data));
    }

    editor.removeSub = function(item, index) {
      item.items.splice(index, 1);
    }

    editor.remove = function(index, services) {
      services.splice(index, 1);      
    }


    editor.save = function(matter, cll) {
      var data = matter;

      if (matter.id) 
        api.update(data).then(function (res) {
          if (cll) cll(res);
          // swal("Ok!","La lettera di incarico è stata aggiornata correttamente", "success");
        }, function(err) {
          if (cll) cll(false);
          // swal("Errore!","Abbiamo riscontrato un problema nel salvare la tua lettera di incarico aggiornata", "warning");
        });
      else
        api.post(data).then(function (res) {
          if (cll) cll(res);
          // swal("Ok!","La lettera di incarico è stata salvata correttamente", "success");
        }, function(err) {
          if (cll) cll(false);
          // swal("Errore!","Abbiamo riscontrato un problema nel salvare la tua lettera di incarico", "warning");
        });
    }


    editor.saveService = function(item, cll) {
      Service.api.post(item).then(function(res) {
        if (cll) cll(res);
      }, function() {
        cll(false);
      });
    }

    

    return {api: api, editor: editor, template: function() {return angular.copy(template)}};
  });

})();
