(function() {
  'use strict';

  /**=========================================================
   * Module: routes.js
   * App routes and resources configuration
   =========================================================*/

  App.config(function ($stateProvider, $locationProvider, $urlRouterProvider, RouteHelpersProvider) {

    var helper = RouteHelpersProvider;
    $locationProvider.html5Mode(false);
    $urlRouterProvider.otherwise('/');

    //
    // Application Routes
    // -----------------------------------

    $stateProvider
      .state('home', {
        url: '/',
        title: 'Home',
        templateUrl: helper.pagesPath('home.html'),
        controller: 'HomeCtrl'
      })
      //------------------------------
      // AUTHENTICATION
      //------------------------------
      .state ('auth', {
        url: '/auth',
        templateUrl: helper.partialsPath('common.html')
      })
      .state('auth.login', {
        url: '/login',
        title: 'Login',
        templateUrl: helper.pagesPath('login.html'),
        controller: 'AuthenticationCtrl'
      })
      .state('auth.signup', {
        url: '/signup',
        title: 'Signup',
        templateUrl: helper.pagesPath('signup.html'),
        controller: 'AuthenticationCtrl'
      })
      //------------------------------
      // PROFILE
      //------------------------------
      .state ('profile', {
        url: '/profile/:id',
        abstract: true,
        requireLogin: true,
        templateUrl: helper.pagesPath('profile.html')
        // resolve: helper.resolveFor('lightgallery')
      })
      .state ('profile.details', {
        url: '/details',
        requireLogin: true,
        templateUrl: helper.pagesPath('profile-details.html')
      })
      .state ('profile.timeline', {
        url: '/timeline',
        requireLogin: true,
        templateUrl: 'views/demos/profile-timeline.html'
      })
      .state ('profile.photos', {
        url: '/photos',
        requireLogin: true,
        templateUrl: 'views/demos/profile-photos.html'
      })
      .state ('profile.connections', {
        url: '/connections',
        requireLogin: true,
        templateUrl: 'views/demos/profile-connections.html'
      })
      //------------------------------
      // DOCUMENTS
      //------------------------------
      .state ('page', {
        abstract: true,
        templateUrl: helper.partialsPath('common.html')
      })
      .state('page.matter-create', {
        url: '/matters/create',
        title: 'Create Matter',
        requireLogin: true,
        templateUrl: helper.pagesPath('matter-edit.html'),
        controller: 'MatterCreateCtrl'
      })
      .state('page.matter-list', {
        url: '/matters',
        title: 'Matter List',
        requireLogin: true,
        templateUrl: helper.pagesPath('matter-list.html'),
        controller: 'MatterListCtrl'
      })
      .state('page.matter-details', {
        url: '/matters/:id',
        title: 'Matter Details',
        requireLogin: true,
        templateUrl: helper.pagesPath('matter-details.html'),
        controller: 'MatterDetailsCtrl'
      })
      .state('page.matter-edit', {
        url: '/matters/:id/edit',
        title: 'Edit Matter',
        requireLogin: true,
        templateUrl: helper.pagesPath('matter-edit.html'),
        controller: 'MatterEditCtrl'
      })

      .state('page.documents', {
        url: '/documents',
        title: 'Documents',
        requireLogin: true,
        templateUrl: helper.pagesPath('documents.html'),
        controller: 'DocumentsCtrl'
      })

      //------------------------------
      // ADMIN PAGES
      //------------------------------
      .state('page.customer-list', {
        url: '/customers',
        title: 'Customer List',
        requireLogin: true,
        templateUrl: helper.pagesPath('customer-list.html'),
        controller: 'CustomerListCtrl',
        data: {
          permissions: {
            only: ['ADMIN']
          }
        }
      })
      //------------------------------
      // TYPOGRAPHY
      //------------------------------
      .state ('typography', {
        url: '/typography',
        templateUrl: 'views/demos/typography.html'
      })
      //------------------------------
      // WIDGETS
      //------------------------------
      .state ('widgets', {
        url: '/widgets',
        templateUrl: 'views/demos/common.html'
      })
      .state ('widgets.widgets', {
        url: '/widgets',
        templateUrl: 'views/demos/widgets.html',
        resolve: helper.resolveFor('mediaelement')
      })
      .state ('widgets.widget-templates', {
        url: '/widget-templates',
        templateUrl: 'views/demos/widget-templates.html',
      })
      //------------------------------
      // TABLES
      //------------------------------
      .state ('tables', {
        url: '/tables',
        templateUrl: 'views/demos/common.html'
      })
      .state ('tables.tables', {
        url: '/tables',
        templateUrl: 'views/demos/tables.html'
      })
      .state ('tables.data-table', {
        url: '/data-table',
        templateUrl: 'views/demos/data-table.html'
      })
      //------------------------------
      // FORMS
      //------------------------------
      .state ('form', {
        url: '/form',
        templateUrl: 'views/demos/common.html'
      })
      .state ('form.basic-form-elements', {
        url: '/basic-form-elements',
        templateUrl: 'views/demos/form-elements.html'
      })
      .state ('form.form-components', {
        url: '/form-components',
        templateUrl: 'views/demos/form-components.html',
        resolve: helper.resolveFor('chosen')
      })
      .state ('form.form-examples', {
        url: '/form-examples',
        templateUrl: 'views/demos/form-examples.html'
      })
      .state ('form.form-validations', {
        url: '/form-validations',
        templateUrl: 'views/demos/form-validations.html'
      })
      //------------------------------
      // USER INTERFACE
      //------------------------------
      .state ('user-interface', {
        url: '/user-interface',
        templateUrl: 'views/demos/common.html'
      })
      .state ('user-interface.ui-bootstrap', {
        url: '/ui-bootstrap',
        templateUrl: 'views/demos/ui-bootstrap.html'
      })
      .state ('user-interface.colors', {
        url: '/colors',
        templateUrl: 'views/demos/colors.html'
      })
      .state ('user-interface.animations', {
        url: '/animations',
        templateUrl: 'views/demos/animations.html'
      })
      .state ('user-interface.box-shadow', {
        url: '/box-shadow',
        templateUrl: 'views/demos/box-shadow.html'
      })
      .state ('user-interface.buttons', {
        url: '/buttons',
        templateUrl: 'views/demos/buttons.html'
      })
      .state ('user-interface.icons', {
        url: '/icons',
        templateUrl: 'views/demos/icons.html'
      })
      .state ('user-interface.alerts', {
        url: '/alerts',
        templateUrl: 'views/demos/alerts.html'
      })
      .state ('user-interface.preloaders', {
        url: '/preloaders',
        templateUrl: 'views/demos/preloaders.html'
      })
      .state ('user-interface.notifications-dialogs', {
        url: '/notifications-dialogs',
        templateUrl: 'views/demos/notification-dialog.html'
      })
      .state ('user-interface.media', {
        url: '/media',
        templateUrl: 'views/demos/media.html',
        resolve: helper.resolveFor('mediaelement', 'lightgallery')
      })
      .state ('user-interface.other-components', {
        url: '/other-components',
        templateUrl: 'views/demos/other-components.html'
      })
      //------------------------------
      // CHARTS
      //------------------------------
      .state ('charts', {
        url: '/charts',
        templateUrl: 'views/demos/common.html'
      })
      .state ('charts.flot-charts', {
        url: '/flot-charts',
        templateUrl: 'views/demos/flot-charts.html',
      })
      .state ('charts.other-charts', {
        url: '/other-charts',
        templateUrl: 'views/demos/other-charts.html'
      })
      //------------------------------
      // CALENDAR
      //------------------------------
      .state ('calendar', {
        url: '/calendar',
        templateUrl: 'views/demos/calendar.html'
      })
      //------------------------------
      // PHOTO GALLERY
      //------------------------------
      .state ('photo-gallery', {
        url: '/photo-gallery',
        templateUrl: 'views/demos/common.html',
        resolve: helper.resolveFor('mediaelement', 'lightgallery')
      })
      .state ('photo-gallery.photos', {
        url: '/photos',
        templateUrl: 'views/demos/photos.html'
      })
      .state ('photo-gallery.timeline', {
        url: '/timeline',
        templateUrl: 'views/demos/photo-timeline.html'
      })
      //------------------------------
      // GENERIC CLASSES
      //------------------------------
      .state ('generic-classes', {
        url: '/generic-classes',
        templateUrl: 'views/demos/generic-classes.html'
      })
      //------------------------------
      // PAGES
      //------------------------------
      .state ('pages', {
        url: '/pages',
        templateUrl: 'views/demos/common.html'
      })
      .state ('pages.listview', {
        url: '/listview',
        templateUrl: 'views/demos/list-view.html'
      })
      .state ('pages.messages', {
        url: '/messages',
        templateUrl: 'views/demos/messages.html'
      })
      .state ('pages.pricing-table', {
        url: '/pricing-table',
        templateUrl: 'views/demos/pricing-table.html'
      })
      .state ('pages.contacts', {
        url: '/contacts',
        templateUrl: 'views/demos/contacts.html'
      })
      .state ('pages.invoice', {
        url: '/invoice',
        templateUrl: 'views/demos/invoice.html'
      })
      .state ('pages.wall', {
        url: '/wall',
        templateUrl: 'views/demos/wall.html',
      });

  });

})();
