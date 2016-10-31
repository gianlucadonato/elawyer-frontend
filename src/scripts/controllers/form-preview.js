(function() {
  'use strict';

  /**=========================================================
  * File: form-details.js
  * FormDetails Controller
  =========================================================*/

  App.controller('FormPreviewCtrl', function($scope, $stateParams, $state, Form, Notify, $window, $timeout, $uibModal, StripeCheckout, Uploader) {

    Form.api.get($stateParams.id).then(function(data) {
      $scope.form = data;
    }).catch(function(err){
      Notify.error('Error!', 'Unable to load form');
    });

    var colorCursor = 0;
    $scope.getClass = function() {
      var colors = ['#fff9f0', '#f2f9f2', '#e2d4cf', '#ebedf8', '#f0d2f5', '#e8f8ff', '#87fff4', '#c5f8ff'];
      if (!colors[colorCursor])
        colorCursor = 0;

      colorCursor++;
      var a = colors[colorCursor - 1];
      console.log(a);
      return a;
    };

    var colorCursor = 0;
    $scope.getClassLight = function() {
      var colors = ['#F2F2F2', '#E6E6E6', '#D8D8D8', '#BDBDBD', '#A4A4A4', '#F8ECE0', '#F6E3CE', '#F5D0A9', '#E6E6E6', '#D8D8D8', '#BDBDBD'];
      if (!colors[colorCursor])
        colorCursor = 0;

      colorCursor++;
      var a = colors[colorCursor - 1];
      console.log(a);
      return a;
    };

  });
})();
