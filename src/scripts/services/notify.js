(function() {
  'use strict';

  /*=========================================================
   * File: notify.js
   * Growl Notify Service
   =========================================================*/

  App.factory('Notify', function () {
    var notify = {};

    notify.error = function(title, message) {
      pop('danger', title, message, 'animated bounceInRight', 'animated bounceOutRight');
    };

    notify.success = function(title, message) {
      pop('success', title, message, 'animated fadeIn', 'animated fadeOut');
    };

    notify.info = function(title, message) {
      pop('info', title, message, 'animated flipInY', 'animated flipOutY');
    };

    function pop(type, title, message, animIn, animOut){
      $.notify({
        title: title,
        message: message
      },{
        element: 'body',
        type: type,
        allow_dismiss: true,
        placement: {
          from: 'top',
          align: 'right'
        },
        offset: {
          x: 20,
          y: 85
        },
        spacing: 10,
        z_index: 1031,
        delay: 2500,
        timer: 1000,
        url_target: '_blank',
        mouse_over: false,
        animate: {
          enter: animIn,
          exit: animOut
        },
        icon_type: 'class',
        template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
          '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
          '<span data-notify="icon"></span> ' +
          '<strong data-notify="title">{1}</strong><br>' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
      });
    }

    return notify;
  });

})();
