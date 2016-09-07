(function() {
  'use strict';

  /**=========================================================
   * Module: routes.js
   * App routes and resources configuration
   =========================================================*/

  App.config(function ($stateProvider, $locationProvider, $urlRouterProvider, RouteHelpersProvider, StripeCheckoutProvider) {

    var helper = RouteHelpersProvider;
    $locationProvider.html5Mode(false);
    $urlRouterProvider.otherwise('/');

    //
    // Application Routes
    // -----------------------------------
    $stateProvider
      // .state('home', {
      //   url: '/',
      //   title: 'Home',
      //   templateUrl: helper.pagesPath('home.html'),
      //   controller: 'HomeCtrl'
      // })
      //------------------------------
      // AUTHENTICATION
      //------------------------------
      .state ('auth', {
        abstract: true,
        templateUrl: helper.partialsPath('common.html')
      })
      .state('auth.login', {
        url: '/',
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
      .state('auth.reset_password', {
        url: '/reset_password',
        title: 'Reset password',
        templateUrl: helper.pagesPath('reset-password.html'),
        controller: 'AuthenticationCtrl'
      })
      .state('auth.change_password', {
        url: '/change_password?t&e',
        title: 'Change password',
        templateUrl: helper.pagesPath('change-password.html'),
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
      // Retainer Agreement
      //------------------------------
      .state ('page', {
        abstract: true,
        templateUrl: helper.partialsPath('common.html')
      })
      .state('page.retainer_agreement-list', {
        url: '/retainer_agreement/list',
        title: 'Retainer Agreement List',
        requireLogin: true,
        templateUrl: helper.pagesPath('retainer_agreement-list.html'),
        controller: 'RetainerAgreementListCtrl'
      })
      .state('page.retainer_agreement-draft', {
        url: '/retainer_agreement/draft',
        title: 'Retainer Agreement Draft',
        requireLogin: true,
        templateUrl: helper.pagesPath('retainer_agreement-draft.html'),
        controller: 'RetainerAgreementDraftCtrl',
        data: {
          permissions: {
            only: ['LAWYER', 'ADMIN']
          }
        }
      })
      .state('page.retainer_agreement-create', {
        url: '/retainer_agreement/create',
        title: 'Create Retainer Agreement',
        requireLogin: true,
        templateUrl: helper.pagesPath('retainer_agreement-create.html'),
        controller: 'RetainerAgreementCreateCtrl',
        data: {
          permissions: {
            only: ['LAWYER', 'ADMIN']
          }
        }
      })
      .state('page.retainer_agreement-details', {
        url: '/retainer_agreement/:id',
        title: 'Retainer Agreement Details',
        requireLogin: true,
        templateUrl: helper.pagesPath('retainer_agreement-details.html'),
        controller: 'RetainerAgreementDetailsCtrl',
        resolve: {
          stripe: StripeCheckoutProvider.load
        }
      })
      .state('page.retainer_agreement-edit', {
        url: '/retainer_agreement/:id/edit',
        title: 'Edit Retainer Agreement',
        requireLogin: true,
        templateUrl: helper.pagesPath('retainer_agreement-edit.html'),
        controller: 'RetainerAgreementCreateCtrl',
        data: {
          permissions: {
            only: ['LAWYER', 'ADMIN']
          }
        }
      })
      //------------------------------
      // FORMS
      //------------------------------
      .state('page.form-list', {
        url: '/forms/list',
        title: 'Forms List',
        requireLogin: true,
        templateUrl: helper.pagesPath('form-list.html'),
        controller: 'FormListCtrl'
      })
      .state('page.form-create', {
        url: '/forms/create',
        title: 'Forms Create',
        requireLogin: true,
        templateUrl: helper.pagesPath('form-create.html'),
        controller: 'FormCreateCtrl'
      })
      .state('page.form-answer', {
        url: '/forms/:id/answer',
        title: 'Forms Answer',
        requireLogin: true,
        templateUrl: helper.pagesPath('form-answer.html'),
        controller: 'FormAnswerCtrl'
      })
      .state('page.form-edit', {
        url: '/forms/:id/edit',
        title: 'Forms Edit',
        requireLogin: true,
        templateUrl: helper.pagesPath('form-create.html'),
        controller: 'FormCreateCtrl'
      })
      .state('page.form-draft', {
        url: '/forms/draft',
        title: 'Forms Draft',
        requireLogin: true,
        templateUrl: helper.pagesPath('form-draft.html'),
        controller: 'FormDraftCtrl',
        data: {
          permissions: {
            only: ['LAWYER', 'ADMIN']
          }
        }
      })

      //------------------------------
      // DOCUMENTS
      //------------------------------
      .state('page.documents', {
        url: '/documents',
        title: 'Documents',
        requireLogin: true,
        templateUrl: helper.pagesPath('documents.html'),
        controller: 'DocumentsCtrl'
      })
      //------------------------------
      // INVOICES
      //------------------------------
      .state('page.invoices', {
        url: '/invoices',
        title: 'Invoices',
        requireLogin: true,
        templateUrl: helper.pagesPath('invoice-list.html'),
        controller: 'InvoicesListCtrl'
      })
      .state('page.invoice-details', {
        url: '/invoices/:id',
        title: 'Invoice Detail',
        requireLogin: true,
        templateUrl: helper.pagesPath('invoice-details.html'),
        controller: 'InvoiceDetailsCtrl'
      })

      //------------------------------
      // ADMIN PAGES
      //------------------------------
      .state('page.customer-list', {
        url: '/users/customers',
        title: 'Customer List',
        requireLogin: true,
        templateUrl: helper.pagesPath('customer-list.html'),
        controller: 'CustomerListCtrl',
        data: {
          permissions: {
            only: ['LAWYER', 'ADMIN']
          }
        }
      })
      .state('page.lawyer-list', {
        url: '/users/lawyers',
        title: 'Lawyer List',
        requireLogin: true,
        templateUrl: helper.pagesPath('lawyer-list.html'),
        controller: 'LawyerListCtrl',
        data: {
          permissions: {
            only: ['LAWYER', 'ADMIN']
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
      .state('pages.listview', {
        url: '/listview',
        templateUrl: 'views/demos/list-view.html'
      })
      .state('pages.messages', {
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
