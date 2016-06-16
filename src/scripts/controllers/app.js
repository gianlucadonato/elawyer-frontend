(function() {
  'use strict';

  /**=========================================================
  * File: app.js
  * Application Controller
  =========================================================*/

  App.controller('AppCtrl', function($rootScope, $scope, $state, $timeout, Auth) {

    var self = this;

    $rootScope.appInfo = {
      name: 'eLawyer',
      description: 'eLawyer',
      year: ((new Date()).getFullYear())
    };

    // Detact Mobile Browser
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      angular.element('html').addClass('ismobile');
    }

    // Events
    $rootScope.$on('isAuthenticated', function(){
      $rootScope.current_user = Auth.getUser();
      self.layoutType = 1;
    });

    $rootScope.$on('isNotAuthenticated', function(){
      self.layoutType = 0;
    });

    // By default Sidbars are hidden in boxed layout and in wide layout only the right sidebar is hidden.
    this.showSidebar = {
      left: false,
      right: false
    };

    // Toggle sidebar on click
    this.toggleSidebar = function(pos) {
      this.showSidebar[pos] = !this.showSidebar[pos];
    };

    // App Layout:
    // (0) Full Layout - Default
    // (1) Boxed layout with fixed sidebar
    this.layoutType = 0;

    this.toggleLayoutType = function() {
      self.layoutType = self.layoutType === 0 ? 1 : 0;
    };

    // For Mainmenu Active Class
    this.$state = $state;

    //Close sidebar on click
    this.sidebarStat = function(event) {
      if (!angular.element(event.target).parent().hasClass('active')) {
        this.showSidebar.left = false;
      }
    };

    //Listview Search (Check listview pages)
    this.listviewSearchStat = false;

    this.lvSearch = function() {
      this.listviewSearchStat = true;
    };

    //Listview menu toggle in small screens
    this.lvMenuStat = false;

    //Blog
    this.wallCommenting = [];

    this.wallImage = false;
    this.wallVideo = false;
    this.wallLink = false;

    //Skin Switch
    this.currentSkin = 'blue';

    this.skinList = [
      'lightblue',
      'bluegray',
      'cyan',
      'teal',
      'green',
      'orange',
      'blue',
      'purple'
    ];

    this.skinSwitch = function (color) {
      this.currentSkin = color;
    };

  });

})();
