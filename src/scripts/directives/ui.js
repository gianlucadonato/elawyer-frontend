(function() {
  'use strict';

  /* =========================================================
   * File: ui.js
   * UI Directives
   * =========================================================*/

    // =========================================================================
    // MALIHU SCROLL
    // =========================================================================

    //On Custom Class
    App.directive('cOverflow', ['ScrollService', function(ScrollService){
      return {
        restrict: 'C',
        link: function(scope, element) {
          if (!$('html').hasClass('ismobile')) {
            ScrollService.malihuScroll(element, 'minimal-dark', 'y');
          }
        }
      };
    }])


    // =========================================================================
    // WAVES
    // =========================================================================

    // For .btn classes
    .directive('btn', function(){
      return {
        restrict: 'C',
        link: function(scope, element) {
          if(element.hasClass('btn-icon') || element.hasClass('btn-float')) {
            Waves.attach(element, ['waves-circle']);
          }
          else if(element.hasClass('btn-light')) {
            Waves.attach(element, ['waves-light']);
          }
          else {
            Waves.attach(element);
          }
          Waves.init();
        }
      };
    })
    // =========================================================================
    // STOP PROPAGATION
    // =========================================================================
    .directive('stopPropagate', function(){
      return {
        restrict: 'C',
        link: function(scope, element) {
          element.on('click', function(event){
            event.stopPropagation();
          });
        }
      };
    })

    .directive('aPrevent', function(){
      return {
        restrict: 'C',
        link: function(scope, element) {
          element.on('click', function(event){
            event.preventDefault();
          });
        }
      };
    })
    // =========================================================================
    // GROWL
    // =========================================================================

    .directive('notify', function(){
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          function notify(from, align, icon, type, animIn, animOut){
            $.notify({
              icon: icon,
              title: ' Bootstrap Growl ',
              message: 'Turning standard Bootstrap alerts into awesome notifications',
              url: ''
            },{
              element: 'body',
              type: type,
              allow_dismiss: true,
              placement: {
                from: from,
                align: align
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
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                  '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
              '</div>'
            });
          }

          element.on('click', function(e){
              e.preventDefault();

              var nFrom = attrs.from;
              var nAlign = attrs.align;
              var nIcons = attrs.icon;
              var nType = attrs.type;
              var nAnimIn = attrs.animationIn;
              var nAnimOut = attrs.animationOut;

              notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut);

          });
        }
      };
    });

})();
