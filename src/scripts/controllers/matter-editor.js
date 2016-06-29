App.controller('MatterCreateCtrl', function($rootScope, $scope, $state, $timeout, Service, $uibModal, Matter, $stateParams, $interval) {

  $scope.areas = [];

  //expose editor functions
  $scope.editor = Matter.editor;

   Matter.api.areas().then(function (res) {
    $scope.areas = res;
   }, function(err,res) {
    swal("Errore!","C'e stato un errore nel caricare le aree predefinite. Ci scusiamo per il disagio", "warning");
   })


   var Saving = function(bool) {
    if (bool) {
      $scope.saving_text = 'Saving..';
      $scope.saving = true;
    } else {
      $scope.saving_text = 'Saved';

      $scope.saving = false;
    }
   }


  if (!$stateParams.id) {
    $scope.matter = Matter.template();

    $timeout(function() {
      startWatching();
    },1000);
    
    $scope.draftable = true;
  } else {
     Matter.api.get($stateParams.id).then(function (res) {
      $scope.matter = res;

      // if (!$scope.matter.items)
      //   $scope.matter.items = new Array();

      $timeout(function() {
        startWatching();
      },1000);
     }, function(err) {
       
     })
  }

  $scope.saving_text = 'Save';
  $scope.saved_text = 'Not saved';

  var interval;


  //autosave as draft
  function startWatching() {
    //watch matter, autosave and recompute toal
    $scope.$watch('matter', function(oldval, newval) {
      $scope.totale = 0;
      for(var i in $scope.matter.items) {
        $scope.totale+= parseFloat($scope.matter.items[i].price) || 0;
      }

      if (interval) {
        $scope.saved_text = 'Not saved';
      } else if (!angular.equals(oldval, newval)) {
        interval = $interval(function() {
          console.log('saving', $scope.unsaved)

          if (!$scope.unsaved) 
              $scope.matter.is_draft = true;
          else 
            $scope.matter.is_draft = false;

          Saving(false);


          Matter.editor.save($scope.matter, function(res) {

            $scope.saving_text = 'Save';
            $scope.saved_text = 'Saved';
            $scope.saving = false;

            if (res && res.id) {
              console.log(res)
              $scope.matter.id = res.id;
            }
              
          });
          $interval.cancel(interval);
          interval = null;
        }, 5000);
      }
    }, true);
  }


  
  $scope.save = function(matter) {
    $scope.unsaved = true;
    Saving(true);
    matter.is_draft = false;
    Matter.editor.save(matter, function(res) {
       Saving(false);
       $scope.saved_text = "Saved";
    })
  }


  $scope.saveAsModel = function(matter) {
    if (matter.id) {
       delete matter.id;
       delete matter.customer_id;
    }
     
    matter.is_model = true;
    Matter.editor.save(matter, function(res) {})
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
    var item = angular.extend({}, item);
    $scope.matter.items.push(item);
  }

  $scope.getMFromBucket = function(item, $event) {
    $event.stopPropagation();
    $event.preventDefault();
    var item = angular.extend({}, item);

    for (var i in item.items) {
      $scope.matter.items.push(item.items[i]);
    }
  }

  $scope.getExistingServices = function(a) {
    Service.api.get({page: $scope.page, per_page: $scope.per_page, is_draft: false, is_model: false}).then(function(res) {
      a(res)
    }, function() {});
  }

  $scope.getExistingDrafts = function(a) {
    Matter.api.index({page: $scope.page, per_page: $scope.per_page, is_draft: false, is_model: false}).then(function(res) {
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

  $scope.openModel = function(service, index) {
      var modalInstance = $uibModal.open({
        animation: false,
        templateUrl: 'views/pages/modal-edit-template.html',
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