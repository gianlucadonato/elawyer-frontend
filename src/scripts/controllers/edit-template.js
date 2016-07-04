App.controller('editTemplateCtrl', function($rootScope, $scope, $state, $timeout, Service, $uibModal, Matter, $uibModalInstance, service, serv, index) {
  $scope.item = service;


  $scope.editor = Matter.editor;

  //share scope service and remove item

  $scope.delete = function(obj) {
    swal({
      title: "Sei sicuro ?",
      text: "Sei sicuro di volere eliminale questo template dal tuo bucket ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F44336",
      confirmButtonText: "Si, elimina",
      cancelButtonText: "No, mantieni",
      closeOnConfirm: false,
      closeOnCancel: false
    }, function(isConfirm){
      if (isConfirm) {
        Matter.api.delete(obj.id).then(function() {
          serv.splice(index, 1);
          swal("Template eliminata con successo", "success");
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