App.controller('MatterCreateCtrl', function($rootScope, $scope, $state, $timeout, Service, $uibModal, Matter, $stateParams, $interval) {

  $scope.areas = [];

  //expose editor functions
  $scope.editor = Matter.editor;

  $scope.areas = []


   var Saving = function(bool) {
    if (!bool) {
      $scope.saved = false;
    } else {
      $scope.saved = true;
    }
   }


  if (!$stateParams.id) {
    $scope.matter = Matter.template();

    $timeout(function() {
      startWatching();
    },500);

    $scope.draftable = true;
  } else {
     Matter.api.get($stateParams.id).then(function (res) {
      $scope.matter = res;

      if (!res.items)
        $scope.matter.items = [];

      // if (!$scope.matter.items)
      //   $scope.matter.items = new Array();

      $timeout(function() {
        startWatching();
      },500);
     }, function(err) {

     })
  }


  var interval;


  //autosave as draft
  function startWatching() {
    //watch matter, autosave and recompute toal
    $scope.$watch('matter', function(oldval, newval) {
      $scope.totale = 0;
      for(var i in $scope.matter.items) {
        $scope.totale+= parseFloat($scope.matter.items[i].price) || 0;
      }

      if (!angular.equals(oldval, newval)) {

        Saving(false);

        $interval.cancel(interval);
        interval = null;

        interval = $interval(function() {

          if (!$scope.unsaved)
              $scope.matter.is_draft = true;
          else
            $scope.matter.is_draft = false;


          Matter.editor.save($scope.matter, function(res) {

             Saving(true);

            if (res && res.id) {
              console.log(res)
              $scope.matter.id = res.id;
            }

          });
          $interval.cancel(interval);
          interval = null;
        }, 1000);
      }
    }, true);
  }



  $scope.save = function(matter) {
    console.log(matter)

      console.log(matter)

      if (matter.title && matter.description && matter.area && !(!matter.items || matter.items.length == 0)) {

        if (!matter.customer_id) {
            swal("Errore", "Devi associare la pratica ad un cliente prima di poterla salvare", "error");
          } else {
              $scope.unsaved = true;
              matter.is_draft = false;
              Matter.editor.save(matter, function(res) {
                $scope.matter.id = res.id;
                 Saving(true);
              })
            }
        } else {
          if (!matter.items || matter.items.length == 0)
            swal("Errore", "Stai inviando una pratica vuota. Inserisci almeno un servizio", "error");
          else
            swal("Errore", "Inserisci un Titolo, una descrizione e una categoria a questa pratica prima di inviarla al cliente", "error");
        }




  }


  $scope.saveAsModel = function(matter) {
    if (matter.id) {
       delete matter.id;
       delete matter.customer_id;
    }
    matter.is_model = true;
    matter.is_draft = false;

    Matter.editor.save(matter, function(res) {

      $scope.undraftable = true;
      $scope.drafts.push(res);

      $timeout(function() {
        $scope.undraftable = false;
      }, 5000);


    });
  }


  $scope.$watch('matter.area', function() {
    if ($scope.matter && $scope.matter.area == '__area_create') {
      $scope.createMode = true;
      $scope.matter.area = '';
    }
  })

  // $scope.treeOptions = {
  //   dragStart: function(ev) {},
  // };


  $scope.services = [];
  $scope.drafts = [];
  $scope.page = 0;
  $scope.per_page = 5;
  $scope.u_page = 0;
  $scope.u_per_page = 5;

  $scope.getFromBucket = function(item, $event) {
    $event.stopPropagation();
    $event.preventDefault();
    var item = angular.copy(item);
    $scope.matter.items.push(item);
     swal("Servizio aggiunto correttamente", "success");
  }

  $scope.getMFromBucket = function(item, $event) {
    $event.stopPropagation();
    $event.preventDefault();
    var item = angular.copy(item);

    if (!$scope.matter.title)
      $scope.matter.title = item.title;

    if (!$scope.matter.description)
      $scope.matter.description = item.description;

    if (!$scope.matter.area)
      $scope.matter.area = item.area;


    for (var i in item.items) {
      $scope.matter.items.push(item.items[i]);
    }

    swal("Modello importato correttamente", "success");
  }

  $scope.getExistingServices = function(a) {
    Service.api.get({page: $scope.page, per_page: $scope.per_page}).then(function(res) {
      a(res)
    }, function() {});
  }

  $scope.getExistingDrafts = function(a) {
    Matter.api.index({page: $scope.page, per_page: $scope.per_page, is_draft: false, is_model: true}).then(function(res) {
      a(res)
    }, function() {});
  }

  //Always trigger once when initialized
  $scope.$watch('[u_page,u_per_page]', function () {
    $scope.getExistingDrafts(function(a) {
      $scope.drafts = a;
    });
  }, true);

  $scope.services = [];
  $scope.$watch('[page,per_page]', function () {
    $scope.getExistingServices(function(a) {
      $scope.services = a;
    });
  }, true);


  $scope.saveService = function(i) {
    Matter.editor.saveService(i, function(res) {
      $scope.services.push(res);
    })
  }

  $scope.openModel = function(w, index) {
      var modalInstance = $uibModal.open({
        animation: false,
        templateUrl: 'views/partials/modal-edit-template.html',
        controller: 'editModelCtrl',
        size: "100%",
        resolve: {
          matter: function () {
            return w;
          },
          models: function () {
            return $scope.drafts;
          },
          services: function() {
            return $scope.services;
          },
          areas: function() {
            return $scope.areas;
          },
          index: function() {
            return index;
          }
        }
      });
  }


  $scope.openService = function(service, index) {
      var modalInstance = $uibModal.open({
        animation: false,
        templateUrl: 'views/pages/edit-service.html',
        controller: 'editServiceCtrl',
        size: "80%",
        resolve: {
          service: function () {
            return service;
          },
          serv: function() {
            return $scope.serv;
          },
          index: function() {
            return index;
          }
        }
      });

      //get a result when model
      // modalInstance.result.then(function (selectedItem) {
      //   $scope.selected = selectedItem;
      //   console.log('confirmed')
      // }, function () {
      //   console.log('closed')
      // });
  }

  $scope.openDraft = function(draft, index) {
      return true;
  }

});
