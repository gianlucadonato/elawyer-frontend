(function() {
  'use strict';

  /**=========================================================
  * File: matter-details.js
  * MatterDetails Controller
  =========================================================*/

  App.controller('FormAnswerCtrl', function($scope, $stateParams, $state, Answer, Notify, $window, $timeout, $uibModal, StripeCheckout, Uploader) {

    $scope.showNext = false;
    $scope.showMode = true;


    $(window).scroll(function(){
      if ($(this).scrollTop() > 280) {
        $("#progress-box").next().css("padding-top", "60px");
        $("#progress-box").addClass("fixed-top");
        $("#progress-box").css({'border-left': '15px solid white', 'border-right': '15px solid white', 'margin-left': '-25px'});
      } else {
        $("#progress-box").removeClass("fixed-top");
        $("#progress-box").next().css("padding-top", "0px");
        $("#progress-box").css({'border-left': '0px solid white', 'border-right': '0px solid white', 'margin-left': '0'});
      }
    });

    $scope.json = JSON.stringify;

    function activate() {
      getForm();
    }

    activate();


    function recursiveCount(options, value) {

      if (typeof value == 'object')
        value = value.title;

      var answered = 0;
      var total = 0;

      for (var i = 0; i < options.length; i++) {
        var context = options[i];

        if (context.title == value) {
          for (var r = 0; r < context.subItems.length; r++) {

            var sub = context.subItems[r];

            total++;

            if (sub.value) {
              answered++;

              options[i].subItems[r].selected = false;

              if (sub.options) {
                var deepCount = recursiveCount(sub.options, sub.value);
                total += deepCount.total || 0;
                answered += deepCount.answered || 0;
              }
            } else {
              options[i].subItems[r].selected = true;
            }
          }
        }
      }

      return {total: total, answered: answered};
    }


    $scope.$watch('review', function() {
      $($window).scrollTop(0);
    })

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


    function computeAnswered() {

      if (!$scope.form)
        $scope.form = {items: []};

      $scope.form.total = 0;
      $scope.form.answered = 0;

      if ($scope.form)
        for (var i = 0; i < $scope.form.items.length; i++) {
          var context = $scope.form.items[i];

          $scope.form.total++;

          if (context.value) {
            $scope.form.answered++;

            if (context.options) {
              var deepCount = recursiveCount(context.options, context.value);
              $scope.form.total += deepCount.total || 0;
              $scope.form.answered += deepCount.answered || 0;
            }
          }
        }
    }




    function getForm() {
      Answer.api.get($stateParams.id).then(function(data) {
        $scope.form = data;
        computeAnswered()
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
    };

    $scope.ensureDate = function(a) {
      return new Date(a);
    };

    $scope.isArray = angular.isArray;
    $scope.isObject = angular.isObject;
    $scope.isDate = angular.isDate;


    $scope.$watch('form.items', function() {
      computeAnswered();
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
