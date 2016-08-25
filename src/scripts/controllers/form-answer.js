(function() {
  'use strict';

  /**=========================================================
  * File: matter-details.js
  * MatterDetails Controller
  =========================================================*/

  App.controller('FormAnswerCtrl', function($scope, $stateParams, $state, Answer, Notify, $window, $timeout, $uibModal, StripeCheckout, Uploader) {

    $scope.showNext = false;
    $scope.showMode = true;

    function activate() {
      getForm();
    }

    activate();

    function getForm() {
      Answer.api.get($stateParams.id).then(function(data) {
        $scope.form = data;
      }).catch(function(err){
        Notify.error('Error!', 'Unable to load matter');
      });
    }

    $scope.save = function() {
      Answer.api.update($scope.form).then(function(data) {
        Notify.success('Congratulazioni!', 'Questionario salvato con successo');
      }).catch(function(err){
        Notify.error('Error!', 'Impossibile salvare questionario');
      });
    }

    $scope.isArray = angular.isArray;


    $scope.$watch('form.items', function() {
      console.log($scope.form)
    }, true);


    $scope.next = function() {
      $scope.showNext = true;
      $window.scrollTo(0, 0);
    };

    $scope.previous = function() {
      $scope.showNext = false;
      $window.scrollTo(0, 0);
    };








  });

})();
