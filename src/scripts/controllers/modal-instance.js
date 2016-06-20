(function() {
  'use strict';

  /**=========================================================
  * File: modal-instance.js
  * ModalInstance Controller
  =========================================================*/

  // Please note that $uibModalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.

  App.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, content) {

    $scope.modalContent = content;

    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })

  //Add event Controller (Modal Instance)
  .controller('AddEventCtrl', function($scope, $modalInstance, calendarData){

      //Calendar Event Data
      $scope.calendarData = {
        eventStartDate: calendarData[0],
        eventEndDate:  calendarData[1]
      };

      //Tags
      $scope.tags = [
        'bgm-teal',
        'bgm-red',
        'bgm-pink',
        'bgm-blue',
        'bgm-lime',
        'bgm-green',
        'bgm-cyan',
        'bgm-orange',
        'bgm-purple',
        'bgm-gray',
        'bgm-black',
      ];

      //Select Tag
      $scope.currentTag = '';

      $scope.onTagClick = function(tag, $index) {
        $scope.activeState = $index;
        $scope.activeTagColor = tag;
      };

      //Add new event
      $scope.addEvent = function() {
        if ($scope.calendarData.eventName) {
          //Render Event
          $('#calendar').fullCalendar('renderEvent',{
            title: $scope.calendarData.eventName,
            start: $scope.calendarData.eventStartDate,
            end:  $scope.calendarData.eventEndDate,
            allDay: true,
            className: $scope.activeTagColor
          },true ); //Stick the event

          $scope.activeState = -1;
          $scope.calendarData.eventName = '';
          $modalInstance.close();
        }
      };

      //Dismiss
      $scope.eventDismiss = function() {
        $modalInstance.dismiss();
      };
  });

})();
