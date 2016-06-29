App.controller('editServiceCtrl', function($rootScope, $scope, $state, $timeout, Service, $uibModal, $uibModalInstance, service, serv, index) {
  $scope.item = service;

  $scope.update = function(item) {
    Service.api.update(item).then(function(res) {
      swal("Servizio aggiornato con successo", "success");
      $uibModalInstance.dismiss('cancel');
    }, function(err) {
      swal("Errore", "Abbiamo riscontrato un errore, riprova più tardi", "error");
    })
  };

  $scope.addSubItem = function(item) {
    console.log(item)
    item.items.push(Service.template());
  }

  $scope.removeSub = function(item, i) {
    item.items.splice(i, 1);
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
});