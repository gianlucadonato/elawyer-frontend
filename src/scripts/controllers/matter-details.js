(function() {
  'use strict';

  App.filter("percentage", function() { 
    return function(input, n) { 
      return (input/100 * n);
    };
  });

  App.filter("date", function() { 
    return function(input) { 
      return moment(input).format("Do MMMM YYYY")
    };
  });





  App.controller('MatterEditCtrl', function($rootScope, $scope, $state, $timeout) {

    $scope.matter = {};
    $scope.services = {};

    function activate() {
      getMatterDetails();
    }

    activate();

    function getMatterDetails() {
      $scope.matter = {
        id: 1,
        name: 'Matter#1',
        description: 'Lorem ipsum',
        practice_area: 'Diritto Societario',
        status: 'open',
        open_date: new Date()
      };

      $scope.services = [{
        title: 'Registro startup innovativa',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 0,
        activated: false
      }, {
        title: 'Approfondimento giuridico del modello di business',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 0,
        activated: false
      }, {
        title: 'Patto Parasociale',
        description: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 0,
        activated: false
      }];
    }
  });


  App.controller('MatterCreateCtrl', function($rootScope, $scope, $state, $timeout, Service, $uibModal, Matter, $stateParams) {

    $scope.services = [{
      title: '',
      description: '',
      price: 0,
      activated: false,
      items: []
    }];


    $scope.totale = 0;


    $scope.$watch('services', function() {
      $scope.totale = 0;
      for(var i in $scope.services) {
        $scope.totale+= parseFloat($scope.services[i].price) || 0;
      }
    }, true)

    $scope.areas = ['fanculo']

     Matter.areas().then(function (res) {
      $scope.areas = res;
     }, function(err,res) {
      console.log('error')
     })


    if (!$stateParams.id) {
      $scope.matter = {
        title: '',
        description: '',
        area: 'empty',
        ritenuta: false,
        price: 0,
      }

      $scope.draftable = true;
    } else {


       Matter.get($stateParams.id).then(function (res) {

        $scope.matter = res;
        $scope.services = res.items;

       }, function(err) {
        alert('error');
       })
    }

    $scope.$watch('matter.area', function() {
      if ($scope.matter && $scope.matter.area == '__area_create') {
        $scope.createMode = true;
        $scope.matter.area = '';
      }
    })

    $scope.pristine = function() {
      $scope.createMode = false;
    }

    $scope.treeOptions = {
      dragStart: function(ev) {
        
      },
    };

    $scope.addSubItem = function(item) {
      item.items.push({
        title: '',
        description: '',
        price: 0,
        mandatory: false,
        items: []
      });
    }
    
    $scope.addItem = function(data) {
      if (!data)
        data = {}
      $scope.services.push({
        title: data.title || '',
        description: data.description || '',
        price: data.price || 0,
        mandatory: data.mandatory || false,
        items: data.items || []
      });
    }

    $scope.save = function(isDraft) {
      var data = $scope.matter;
      data.services = $scope.services;

      console.log(data)

      if (isDraft) {
        delete data.customer_id;
        data.is_draft = true;
      }

      if ($stateParams.id) 
        Matter.update(data).then(function (err, res) {
          swal("Ok!","La lettera di incarico è stata aggiornata correttamente", "success");
          $state.go("page.matter-list")
        }, function(err, res) {
          swal("Errore!","Abbiamo riscontrato un problema nel salvare la tua lettera di incarico aggiornata", "warning");
        });
      else
        Matter.post(data).then(function (err, res) {
          swal("Ok!","La lettera di incarico è stata salvata correttamente", "success");
        }, function(err, res) {
          swal("Errore!","Abbiamo riscontrato un problema nel salvare la tua lettera di incarico", "warning");
        });
    }

    $scope.removeSub = function(item, index) {
      item.items.splice(index, 1);
    }

    $scope.remove = function(index) {
      $scope.services.splice(index, 1);      
    }

    $scope.serv = [];

    $scope.getFromBucket = function(item, $event) {
      $event.stopPropagation();
      $event.preventDefault();
      var item = angular.extend({}, item);
      $scope.addItem(item);
    }

    $scope.getMFromBucket = function(item, $event) {
      $event.stopPropagation();
      $event.preventDefault();
      var item = angular.extend({}, item);

      for (var i in item.items) {
        $scope.services.push(item.items[i]);
      }
    }


    $scope.page = 0; $scope.per_page = 5;
    $scope.getExistingServices = function(a) {
      Service.get($scope.page, $scope.per_page).then(function(res) {
        a(res)
      }, function() {});
    }

    $scope.getExistingDrafts = function(a) {
      Matter.index($scope.page, $scope.per_page, true).then(function(res) {
        a(res)
      }, function() {});
    }

    $scope.u_page = 0; $scope.u_per_page = 5;
    $scope.drafts = [];
    $scope.$watch('[u_page,u_per_page]', function () {
      $scope.getExistingDrafts(function(a) {
        $scope.drafts = a;
      });
    }, true);


    $scope.serv = [];
    $scope.$watch('[page,per_page]', function () {
      $scope.getExistingServices(function(a) {
        $scope.serv = a;
      });
    }, true);

    

    $scope.saveService = function(item) {
      Service.post(item).then(function(res) {
        $scope.serv.push(res);
      }, function() {});
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

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
          console.log('confirmed')
        }, function () {
          console.log('closed')
        });
    }

    $scope.openDraft = function(draft, index) {
        return true;
    }

  });



  App.controller('editServiceCtrl', function($rootScope, $scope, $state, $timeout, Service, $uibModal, $uibModalInstance, service, serv, index) {

    console.log('entering here', service, serv, index)

    $scope.item = service;


    $scope.update = function(item) {

      console.log(item)

      Service.update(item).then(function(res) {
        swal("Servizio aggiornato con successo", "success");
        $uibModalInstance.dismiss('cancel');
      }, function(err) {
        swal("Errore", "Abbiamo riscontrato un errore, riprova più tardi", "error");
      })
    };

    $scope.addSubItem = function(item) {
      item.items.push({
        title: '',
        description: '',
        price: 0,
        mandatory: false,
        items: []
      });
    }


    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.delete = function(obj) {
      swal({
        title: "Sei sicuro ?",
        text: "Sei sicuro di volere eliminale questo servizio dal tuo bucket ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#F44336",
        confirmButtonText: "Si, elimina",
        cancelButtonText: "No, mantieni",
        closeOnConfirm: false,
        closeOnCancel: false
      }, function(isConfirm){
        if (isConfirm) {

          Service.delete(obj.id).then(function() {
            serv.splice(index, 1);
            swal("Voce eliminata con successo", "success");
            $uibModalInstance.dismiss('cancel');
          }, function() {
            swal("Errore", "Abbiamo riscontrato un errore, riprova più tardi", "error");
          });

          
        } else {
          swal("Operazione annullata", "L'operazione è stata annullata", "error");
         
        }
      });
    }

   
    $scope.removeSub = function(item, index) {
      item.items.splice(index, 1);
    }


  });



  /**=========================================================
  * File: matter-details.js
  * MatterDetails Controller
  =========================================================*/

  App.controller('MatterDetailsCtrl', function($rootScope, $scope, $state, $timeout, Matter, $stateParams) {

    Matter.get($stateParams.id).then(function (res) {
      console.log(res)
      $scope.matter = res;

     }, function(err) {
     })

    $scope.$watch('matter', function() {
      $scope.totale = 0;
      if ($scope.matter)
      for(var i in $scope.matter.items) {
        if ($scope.matter.items[i].mandatory || $scope.matter.items[i].selected)
          $scope.totale+= parseFloat($scope.matter.items[i].price) || 0;
      }
    }, true)



  });

})();
