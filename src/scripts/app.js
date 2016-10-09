// APP START
// -----------------------------------
var App = angular.module('eLawyer', [
  'ngAnimate',
  'ngStorage',
  'ngResource',
  'ngMessages',
  'localytics.directives', //angular chosend
  'ui.router',
  'ui.bootstrap',
  'permission',
  'permission.ui',
  'angular-loading-bar',
  'oc.lazyLoad',
  'nouislider',
  'ngTable',
  'angularMoment',
  'ngFileUpload',
  'appConstants',
  'FileManagerApp',
  'ui.tree',
  'angular-jwt',
  'stripe.checkout',
  'google-client'
]);

// APP CONFIG
// -----------------------------------
App.config(function($httpProvider, StripeCheckoutProvider, GoogleClientProvider, ENV) {

  StripeCheckoutProvider.defaults({
    key: ENV.stripe_key
  });

  GoogleClientProvider
    .addApi('drive', 'v3')
    .defaults({
      api_key: ENV.google_api_key,
      client_id: ENV.google_client_id,
      scopes: ENV.google_scopes
    });

  // Auth Interceptor
  $httpProvider.interceptors.push(function($rootScope, $injector, $q) {
    return {
      request: function (config) {
        if(config.url.indexOf('/api/') !== -1) {
          var Auth  = $injector.get('Auth');
          if(Auth.isAuthenticated()) {
            config.headers.Authorization = 'JWT ' + Auth.getToken();
          }
        }
        if(config.url.indexOf('maps.googleapis') !== -1) {
          delete config.headers.Authorization;
        }
        return config;
      },
      responseError: function (error) {
        if(error.status !== -1) {
          if (error.status === 401) {
            // TODO: Refresh Token
            var Auth    = $injector.get('Auth');
            var $state  = $injector.get('$state');
            Auth.deleteUser();
            //$state.go('auth.login');
          }
        }
        return $q.reject(error);
      }
    };
  });
});


// APP RUN
// -----------------------------------
App.run(function($rootScope, $state, $stateParams, Auth, RoleStore, amMoment, $q, $window, $templateCache, $timeout, $location) {

  amMoment.changeLocale('it');




  RoleStore.defineRole('ADMIN', function () {
    if(Auth.isAuthenticated()) {
      var deferred = $q.defer();
      Auth.getUser().then(function(user){
        if (user.role === 100) deferred.resolve(user);
        else deferred.reject();
      });
      return deferred.promise;
    } else {
      return false;
    }
  });

  RoleStore.defineRole('LAWYER', function () {
    if(Auth.isAuthenticated()) {
      var deferred = $q.defer();
      Auth.getUser().then(function(user){
        if (user.role === 10) deferred.resolve(user);
        else deferred.reject();
      });
      return deferred.promise;
    } else {
      return false;
    }
  });

  RoleStore.defineRole('CUSTOMER', function () {
    if(Auth.isAuthenticated()) {
      var deferred = $q.defer();
      Auth.getUser().then(function(user){
        if (user.role === 1) deferred.resolve(user);
        else deferred.reject();
      });
      return deferred.promise;
    } else {
      return false;
    }
  });

  var redirect = {
    url: {},
    params: {},
    set: function(s, p) {
      this.url = s;
      this.params = p;
    },
    move: function() {
      if (this.isRoot())
        $state.go('page.matter-list');
      else
        $state.go(this.url.name, this.params);
    },
    isRoot: function() {
      if (!this.url.requireLogin)
        return true;
      else return false;
    }
  };

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }


  // Redirect user to login page if not authenticated
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, $window) {

    if(toState.requireLogin && !Auth.isAuthenticated() && toState.title !== 'Comfirm') {

      event.preventDefault();

      redirect.set(toState, toParams);

      if (getParameterByName('t')) {
        //window.location.hash = '#/change_password?t='+ getParameterByName('t') + "&e=" + getParameterByName('e');
        $state.go('auth.change_password', {t: getParameterByName('t'), e: getParameterByName('e')});
      }
      else if (toState.requireLogin) {
        $state.go('auth.login');
      }
      //switch if there is invitation link

    }
    else if((fromState.title === 'Login' || fromState.title === 'Change password') && Auth.isAuthenticated()) {
      event.preventDefault();
      //if we are logging move to desired location
      redirect.move();
    }
  });

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $window.scrollTo(0, 0);
  });

  // TEMPLATE CACHE
  $templateCache.put('template/header-image-logo.html',
    "<ul class=\"header-inner clearfix\"><li id=\"menu-trigger\" data-target=\"mainmenu\" data-toggle-sidebar data-model-left=\"mactrl.sidebarToggle.left\" data-ng-class=\"{ 'open': mactrl.sidebarToggle.left === true }\"><div class=\"line-wrap\"><div class=\"line top\"></div><div class=\"line center\"></div><div class=\"line bottom\"></div></div></li><li class=\"hidden-xs\"><a href=\"index.html\" class=\"m-l-10\" data-ng-click=\"mactrl.sidebarStat($event)\"><img src=\"img/demo/logo.png\" alt=\"\"></a></li><li class=\"pull-right\"><ul class=\"top-menu\"><li id=\"top-search\" data-ng-click=\"hctrl.openSearch()\"><a href=\"\"><span class=\"tm-label\">Search</span></a></li><li class=\"dropdown\" uib-dropdown><a uib-dropdown-toggle href=\"\"><span class=\"tm-label\">Messages</span></a><div class=\"dropdown-menu dropdown-menu-lg pull-right\"><div class=\"listview\"><div class=\"lv-header\">Messages</div><div class=\"lv-body\"><a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/1.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">David Belle</div><small class=\"lv-small\">Cum sociis natoque penatibus et magnis dis parturient montes</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/2.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Jonathan Morris</div><small class=\"lv-small\">Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/3.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Fredric Mitchell Jr.</div><small class=\"lv-small\">Phasellus a ante et est ornare accumsan at vel magnauis blandit turpis at augue ultricies</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/4.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Glenn Jecobs</div><small class=\"lv-small\">Ut vitae lacus sem ellentesque maximus, nunc sit amet varius dignissim, dui est consectetur neque</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/4.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Bill Phillips</div><small class=\"lv-small\">Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet vel ante placerat</small></div></div></a></div><a class=\"lv-footer\" href=\"\">View All</a></div></div></li><li class=\"dropdown hidden-xs\" uib-dropdown><a uib-dropdown-toggle href=\"\"><span class=\"tm-label\">Notification</span></a><div class=\"dropdown-menu dropdown-menu-lg pull-right\"><div class=\"listview\" id=\"notifications\"><div class=\"lv-header\">Notification<ul class=\"actions\"><li class=\"dropdown\"><a href=\"\" data-clear=\"notification\"><i class=\"zmdi zmdi-check-all\"></i></a></li></ul></div><div class=\"lv-body\"><a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/1.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">David Belle</div><small class=\"lv-small\">Cum sociis natoque penatibus et magnis dis parturient montes</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/2.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Jonathan Morris</div><small class=\"lv-small\">Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/3.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Fredric Mitchell Jr.</div><small class=\"lv-small\">Phasellus a ante et est ornare accumsan at vel magnauis blandit turpis at augue ultricies</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/4.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Glenn Jecobs</div><small class=\"lv-small\">Ut vitae lacus sem ellentesque maximus, nunc sit amet varius dignissim, dui est consectetur neque</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/4.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Bill Phillips</div><small class=\"lv-small\">Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet vel ante placerat</small></div></div></a></div><a class=\"lv-footer\" href=\"\">View Previous</a></div></div></li><li class=\"hidden-xs\"><a target=\"_blank\" href=\"https://wrapbootstrap.com/theme/superflat-simple-responsive-admin-theme-WB082P91H\"><span class=\"tm-label\">Link</span></a></li></ul></li></ul><!-- Top Search Content --><div id=\"top-search-wrap\"><div class=\"tsw-inner\"><i id=\"top-search-close\" data-ng-click=\"hctrl.closeSearch()\" class=\"zmdi zmdi-arrow-left\"></i> <input type=\"text\"></div></div>"
  );

  $templateCache.put('template/header-textual-menu.html',
    "<ul class=\"header-inner clearfix\"><li id=\"menu-trigger\" data-target=\"mainmenu\" data-toggle-sidebar data-model-left=\"mactrl.sidebarToggle.left\" data-ng-class=\"{ 'open': mactrl.sidebarToggle.left === true }\"><div class=\"line-wrap\"><div class=\"line top\"></div><div class=\"line center\"></div><div class=\"line bottom\"></div></div></li><li class=\"logo hidden-xs\"><a data-ui-sref=\"home\" data-ng-click=\"mactrl.sidebarStat($event)\">Material Admin</a></li><li class=\"pull-right\"><ul class=\"top-menu\"><li id=\"top-search\" data-ng-click=\"hctrl.openSearch()\"><a href=\"\"><span class=\"tm-label\">Search</span></a></li><li class=\"dropdown\" uib-dropdown><a uib-dropdown-toggle href=\"\"><span class=\"tm-label\">Messages</span></a><div class=\"dropdown-menu dropdown-menu-lg pull-right\"><div class=\"listview\"><div class=\"lv-header\">Messages</div><div class=\"lv-body\"><a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/1.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">David Belle</div><small class=\"lv-small\">Cum sociis natoque penatibus et magnis dis parturient montes</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/2.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Jonathan Morris</div><small class=\"lv-small\">Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/3.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Fredric Mitchell Jr.</div><small class=\"lv-small\">Phasellus a ante et est ornare accumsan at vel magnauis blandit turpis at augue ultricies</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/4.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Glenn Jecobs</div><small class=\"lv-small\">Ut vitae lacus sem ellentesque maximus, nunc sit amet varius dignissim, dui est consectetur neque</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/4.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Bill Phillips</div><small class=\"lv-small\">Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet vel ante placerat</small></div></div></a></div><a class=\"lv-footer\" href=\"\">View All</a></div></div></li><li class=\"dropdown hidden-xs\" uib-dropdown><a uib-dropdown-toggle href=\"\"><span class=\"tm-label\">Notification</span></a><div class=\"dropdown-menu dropdown-menu-lg pull-right\"><div class=\"listview\" id=\"notifications\"><div class=\"lv-header\">Notification<ul class=\"actions\"><li class=\"dropdown\"><a href=\"\" data-clear=\"notification\"><i class=\"zmdi zmdi-check-all\"></i></a></li></ul></div><div class=\"lv-body\"><a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/1.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">David Belle</div><small class=\"lv-small\">Cum sociis natoque penatibus et magnis dis parturient montes</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/2.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Jonathan Morris</div><small class=\"lv-small\">Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/3.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Fredric Mitchell Jr.</div><small class=\"lv-small\">Phasellus a ante et est ornare accumsan at vel magnauis blandit turpis at augue ultricies</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/4.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Glenn Jecobs</div><small class=\"lv-small\">Ut vitae lacus sem ellentesque maximus, nunc sit amet varius dignissim, dui est consectetur neque</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/4.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Bill Phillips</div><small class=\"lv-small\">Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet vel ante placerat</small></div></div></a></div><a class=\"lv-footer\" href=\"\">View Previous</a></div></div></li><li class=\"hidden-xs\"><a target=\"_blank\" href=\"https://wrapbootstrap.com/theme/superflat-simple-responsive-admin-theme-WB082P91H\"><span class=\"tm-label\">Link</span></a></li></ul></li></ul><!-- Top Search Content --><div id=\"top-search-wrap\"><div class=\"tsw-inner\"><i id=\"top-search-close\" data-ng-click=\"hctrl.closeSearch()\" class=\"zmdi zmdi-arrow-left\"></i> <input type=\"text\"></div></div>"
  );


  $templateCache.put('template/header-top-menu.html',
    "<ul class=\"header-inner clearfix\"><li id=\"menu-trigger\" data-trigger=\".ha-menu\" class=\"visible-xs\"><div class=\"line-wrap\"><div class=\"line top\"></div><div class=\"line center\"></div><div class=\"line bottom\"></div></div></li><li class=\"logo hidden-xs\"><a data-ui-sref=\"home\">Material Admin</a></li><li class=\"pull-right\"><ul class=\"top-menu\"><li class=\"dropdown\" uib-dropdown><a uib-dropdown-toggle href=\"\"><i class=\"tmn-counts\">6</i> <i class=\"tm-icon zmdi zmdi-email\"></i></a><div class=\"dropdown-menu dropdown-menu-lg pull-right\"><div class=\"listview\"><div class=\"lv-header\">Messages</div><div class=\"lv-body\"><a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/1.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">David Belle</div><small class=\"lv-small\">Cum sociis natoque penatibus et magnis dis parturient montes</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/2.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Jonathan Morris</div><small class=\"lv-small\">Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/3.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Fredric Mitchell Jr.</div><small class=\"lv-small\">Phasellus a ante et est ornare accumsan at vel magnauis blandit turpis at augue ultricies</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/4.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Glenn Jecobs</div><small class=\"lv-small\">Ut vitae lacus sem ellentesque maximus, nunc sit amet varius dignissim, dui est consectetur neque</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/4.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Bill Phillips</div><small class=\"lv-small\">Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet vel ante placerat</small></div></div></a></div><a class=\"lv-footer\" href=\"\">View All</a></div></div></li><li class=\"dropdown\" uib-dropdown><a uib-dropdown-toggle><i class=\"tmn-counts\">9</i> <i class=\"tm-icon zmdi zmdi-notifications\"></i></a><div class=\"dropdown-menu dropdown-menu-lg pull-right\"><div class=\"listview\" id=\"notifications\"><div class=\"lv-header\">Notification<ul class=\"actions\"><li class=\"dropdown\"><a href=\"\" data-clear=\"notification\"><i class=\"zmdi zmdi-check-all\"></i></a></li></ul></div><div class=\"lv-body\"><a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/1.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">David Belle</div><small class=\"lv-small\">Cum sociis natoque penatibus et magnis dis parturient montes</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/2.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Jonathan Morris</div><small class=\"lv-small\">Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/3.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Fredric Mitchell Jr.</div><small class=\"lv-small\">Phasellus a ante et est ornare accumsan at vel magnauis blandit turpis at augue ultricies</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/4.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Glenn Jecobs</div><small class=\"lv-small\">Ut vitae lacus sem ellentesque maximus, nunc sit amet varius dignissim, dui est consectetur neque</small></div></div></a> <a class=\"lv-item\" href=\"\"><div class=\"media\"><div class=\"pull-left\"><img class=\"lv-img-sm\" src=\"img/profile-pics/4.jpg\" alt=\"\"></div><div class=\"media-body\"><div class=\"lv-title\">Bill Phillips</div><small class=\"lv-small\">Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet vel ante placerat</small></div></div></a></div><a class=\"lv-footer\" href=\"\">View Previous</a></div></div></li><li class=\"dropdown\" uib-dropdown><a uib-dropdown-toggle href=\"\"><i class=\"tmn-counts\">2</i> <i class=\"tm-icon zmdi zmdi-view-list-alt\"></i></a><div class=\"dropdown-menu pull-right dropdown-menu-lg\"><div class=\"listview\"><div class=\"lv-header\">Tasks</div><div class=\"lv-body\"><div class=\"lv-item\"><div class=\"lv-title m-b-5\">HTML5 Validation Report</div><div class=\"progress\"><div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"95\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 95%\"><span class=\"sr-only\">95% Complete (success)</span></div></div></div><div class=\"lv-item\"><div class=\"lv-title m-b-5\">Google Chrome Extension</div><div class=\"progress\"><div class=\"progress-bar progress-bar-success\" role=\"progressbar\" aria-valuenow=\"80\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 80%\"><span class=\"sr-only\">80% Complete (success)</span></div></div></div><div class=\"lv-item\"><div class=\"lv-title m-b-5\">Social Intranet Projects</div><div class=\"progress\"><div class=\"progress-bar progress-bar-info\" role=\"progressbar\" aria-valuenow=\"20\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 20%\"><span class=\"sr-only\">20% Complete</span></div></div></div><div class=\"lv-item\"><div class=\"lv-title m-b-5\">Bootstrap Admin Template</div><div class=\"progress\"><div class=\"progress-bar progress-bar-warning\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%\"><span class=\"sr-only\">60% Complete (warning)</span></div></div></div><div class=\"lv-item\"><div class=\"lv-title m-b-5\">Youtube Client App</div><div class=\"progress\"><div class=\"progress-bar progress-bar-danger\" role=\"progressbar\" aria-valuenow=\"80\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 80%\"><span class=\"sr-only\">80% Complete (danger)</span></div></div></div></div><a class=\"lv-footer\" href=\"\">View All</a></div></div></li><li class=\"dropdown\" uib-dropdown><a uib-dropdown-toggle href=\"\"><i class=\"tm-icon zmdi zmdi-more-vert\"></i></a><ul class=\"dropdown-menu dm-icon pull-right\"><li class=\"hidden-xs\"><a data-ng-click=\"hctrl.fullScreen()\" href=\"\"><i class=\"zmdi zmdi-fullscreen\"></i> Toggle Fullscreen</a></li><li><a data-ng-click=\"hctrl.clearLocalStorage()\" href=\"\"><i class=\"zmdi zmdi-delete\"></i> Clear Local Storage</a></li><li><a href=\"\"><i class=\"zmdi zmdi-face\"></i> Privacy Settings</a></li><li><a href=\"\"><i class=\"zmdi zmdi-settings\"></i> Other Settings</a></li></ul></li></ul></li></ul><div class=\"search\"><div class=\"fg-line\"><input type=\"text\" class=\"form-control\" placeholder=\"Search...\"></div></div><nav class=\"ha-menu\"><ul><li class=\"waves-effect\" data-ui-sref-active=\"active\"><a data-ui-sref=\"home\" data-ng-click=\"mactrl.sidebarStat($event)\">Home</a></li><li class=\"dropdown\" uib-dropdown data-ng-class=\"{ 'active': mactrl.$state.includes('headers') }\"><div class=\"waves-effect\" uib-dropdown-toggle>Headers</div><ul class=\"dropdown-menu\"><li data-ui-sref-active=\"active\"><a data-ui-sref=\"headers.textual-menu\">Textual menu</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"headers.image-logo\">Image logo</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"headers.mainmenu-on-top\">Mainmenu on top</a></li></ul></li><li class=\"waves-effect\" data-ui-sref-active=\"active\"><a data-ui-sref=\"typography\">Typography</a></li><li class=\"dropdown\" uib-dropdown><div class=\"waves-effect\" uib-dropdown-toggle>Widgets</div><ul class=\"dropdown-menu\"><li data-ui-sref-active=\"active\"><a data-ui-sref=\"widgets.widget-templates\">Templates</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"widgets.widgets\">Widgets</a></li></ul></li><li class=\"dropdown\" uib-dropdown><div class=\"waves-effect\" uib-dropdown-toggle>Tables</div><ul class=\"dropdown-menu\"><li data-ui-sref-active=\"active\"><a data-ui-sref=\"tables.tables\">Normal Tables</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"tables.data-table\">Data Tables</a></li></ul></li><li class=\"dropdown\" uib-dropdown><div class=\"waves-effect\" uib-dropdown-toggle>Forms</div><ul class=\"dropdown-menu\"><li data-ui-sref-active=\"active\"><a data-ui-sref=\"form.basic-form-elements\">Basic Form Elements</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"form.form-components\">Form Components</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"form.form-examples\">Form Examples</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"form.form-validations\">Form Validation</a></li></ul></li><li class=\"dropdown\" uib-dropdown><div class=\"waves-effect\" uib-dropdown-toggle>User Interface</div><ul class=\"dropdown-menu\"><li data-ui-sref-active=\"active\"><a data-ui-sref=\"user-interface.ui-bootstrap\">UI Bootstrap</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"user-interface.colors\">Colors</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"user-interface.animations\">Animations</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"user-interface.box-shadow\">Box Shadow</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"user-interface.buttons\">Buttons</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"user-interface.icons\">Icons</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"user-interface.alerts\">Alerts</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"user-interface.preloaders\">Preloaders</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"user-interface.notifications-dialogs\">Notifications & Dialogs</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"user-interface.media\">Media</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"user-interface.other-components\">Others</a></li></ul></li><li class=\"dropdown\" uib-dropdown><div class=\"waves-effect\" uib-dropdown-toggle>Charts</div><ul class=\"dropdown-menu\"><li data-ui-sref-active=\"active\"><a data-ui-sref=\"charts.flot-charts\">Flot Charts</a></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"charts.other-charts\">Other Charts</a></li></ul></li><li class=\"waves-effect\" data-ui-sref-active=\"active\"><a data-ui-sref=\"calendar\">Calendar</a></li></ul></nav><div class=\"skin-switch dropdown hidden-xs\" uib-dropdown><button uib-dropdown-toggle class=\"btn ss-icon\"><i class=\"zmdi zmdi-palette\"></i></button><div class=\"dropdown-menu\"><span ng-repeat=\"w in mactrl.skinList\" class=\"ss-skin bgm-{{ w }}\" data-ng-click=\"mactrl.skinSwitch(w)\"></span></div></div>"
  );

  $templateCache.put('template/profile-menu.html',
    "<li class=\"btn-wave\" data-ui-sref-active=\"active\"><a data-ui-sref=\"pages.profile.profile-about\">About</a></li><li class=\"btn-wave\" data-ui-sref-active=\"active\"><a data-ui-sref=\"pages.profile.profile-timeline\">Timeline</a></li><li class=\"btn-wave\" data-ui-sref-active=\"active\"><a data-ui-sref=\"pages.profile.profile-photos\">Photos</a></li><li class=\"btn-wave\" data-ui-sref-active=\"active\"><a data-ui-sref=\"pages.profile.profile-connections\">Connections</a></li>"
  );


  $templateCache.put('template/sidebar-left.html',
    "<div class=\"sidebar-inner c-overflow\"><div class=\"profile-menu\"><a href=\"\" toggle-submenu><div class=\"profile-pic\"><img src=\"img/profile-pics/1.jpg\" alt=\"\"></div><div class=\"profile-info\">Malinda Hollaway <i class=\"zmdi zmdi-caret-down\"></i></div></a><ul class=\"main-menu\"><li><a data-ui-sref=\"pages.profile.profile-about\" data-ng-click=\"mactrl.sidebarStat($event)\"><i class=\"zmdi zmdi-account\"></i> View Profile</a></li><li><a href=\"\"><i class=\"zmdi zmdi-input-antenna\"></i> Privacy Settings</a></li><li><a href=\"\"><i class=\"zmdi zmdi-settings\"></i> Settings</a></li><li><a href=\"\"><i class=\"zmdi zmdi-time-restore\"></i> Logout</a></li></ul></div><ul class=\"main-menu\"><li data-ui-sref-active=\"active\"><a data-ui-sref=\"home\" data-ng-click=\"mactrl.sidebarStat($event)\"><i class=\"zmdi zmdi-home\"></i> Home</a></li><li class=\"sub-menu\" data-ng-class=\"{ 'active toggled': mactrl.$state.includes('headers') }\"><a href=\"\" toggle-submenu><i class=\"zmdi zmdi-view-compact\"></i> Headers</a><ul><li><a data-ui-sref-active=\"active\" data-ui-sref=\"headers.textual-menu\" data-ng-click=\"mactrl.sidebarStat($event)\">Textual menu</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"headers.image-logo\" data-ng-click=\"mactrl.sidebarStat($event)\">Image logo</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"headers.mainmenu-on-top\" data-ng-click=\"mactrl.sidebarStat($event)\">Mainmenu on top</a></li></ul></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"typography\" data-ng-click=\"mactrl.sidebarStat($event)\"><i class=\"zmdi zmdi-format-underlined\"></i> Typography</a></li><li class=\"sub-menu\" data-ng-class=\"{ 'active toggled': mactrl.$state.includes('widgets') }\"><a href=\"\" toggle-submenu><i class=\"zmdi zmdi-widgets\"></i> Widgets</a><ul><li><a data-ui-sref-active=\"active\" data-ui-sref=\"widgets.widget-templates\" data-ng-click=\"mactrl.sidebarStat($event)\">Templates</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"widgets.widgets\" data-ng-click=\"mactrl.sidebarStat($event)\">Widgets</a></li></ul></li><li class=\"sub-menu\" data-ng-class=\"{ 'active toggled': mactrl.$state.includes('tables') }\"><a href=\"\" toggle-submenu><i class=\"zmdi zmdi-view-list\"></i> Tables</a><ul><li><a data-ui-sref-active=\"active\" data-ui-sref=\"tables.tables\" data-ng-click=\"mactrl.sidebarStat($event)\">Tables</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"tables.data-table\" data-ng-click=\"mactrl.sidebarStat($event)\">Data Tables</a></li></ul></li><li class=\"sub-menu\" data-ng-class=\"{ 'active toggled': mactrl.$state.includes('form') }\"><a href=\"\" toggle-submenu><i class=\"zmdi zmdi-collection-text\"></i> Forms</a><ul><li><a data-ui-sref-active=\"active\" data-ui-sref=\"form.basic-form-elements\" data-ng-click=\"mactrl.sidebarStat($event)\">Basic Form Elements</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"form.form-components\" data-ng-click=\"mactrl.sidebarStat($event)\">Form Components</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"form.form-examples\" data-ng-click=\"mactrl.sidebarStat($event)\">Form Examples</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"form.form-validations\" data-ng-click=\"mactrl.sidebarStat($event)\">Form Validation</a></li></ul></li><li class=\"sub-menu\" data-ng-class=\"{ 'active toggled': mactrl.$state.includes('user-interface') }\"><a href=\"\" toggle-submenu><i class=\"zmdi zmdi-swap-alt\"></i>User Interface</a><ul><li><a data-ui-sref-active=\"active\" data-ui-sref=\"user-interface.ui-bootstrap\" data-ng-click=\"mactrl.sidebarStat($event)\">UI Bootstrap</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"user-interface.colors\" data-ng-click=\"mactrl.sidebarStat($event)\">Colors</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"user-interface.animations\" data-ng-click=\"mactrl.sidebarStat($event)\">Animations</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"user-interface.box-shadow\" data-ng-click=\"mactrl.sidebarStat($event)\">Box Shadow</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"user-interface.buttons\" data-ng-click=\"mactrl.sidebarStat($event)\">Buttons</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"user-interface.icons\" data-ng-click=\"mactrl.sidebarStat($event)\">Icons</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"user-interface.alerts\" data-ng-click=\"mactrl.sidebarStat($event)\">Alerts</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"user-interface.preloaders\" data-ng-click=\"mactrl.sidebarStat($event)\">Preloaders</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"user-interface.notifications-dialogs\" data-ng-click=\"mactrl.sidebarStat($event)\">Notifications & Dialogs</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"user-interface.media\" data-ng-click=\"mactrl.sidebarStat($event)\">Media</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"user-interface.other-components\" data-ng-click=\"mactrl.sidebarStat($event)\">Others</a></li></ul></li><li class=\"sub-menu\" data-ng-class=\"{ 'active toggled': mactrl.$state.includes('charts') }\"><a href=\"\" toggle-submenu><i class=\"zmdi zmdi-trending-up\"></i>Charts</a><ul><li><a data-ui-sref-active=\"active\" data-ui-sref=\"charts.flot-charts\" data-ng-click=\"mactrl.sidebarStat($event)\">Flot Charts</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"charts.other-charts\" data-ng-click=\"mactrl.sidebarStat($event)\">Other Charts</a></li></ul></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"calendar\" data-ng-click=\"mactrl.sidebarStat($event)\"><i class=\"zmdi zmdi-calendar\"></i> Calendar</a></li><li class=\"sub-menu\" data-ng-class=\"{ 'active toggled': mactrl.$state.includes('photo-gallery') }\"><a href=\"\" toggle-submenu><i class=\"zmdi zmdi-image\"></i>Photo Gallery</a><ul><li><a data-ui-sref-active=\"active\" data-ui-sref=\"photo-gallery.photos\" data-ng-click=\"mactrl.sidebarStat($event)\">Default</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"photo-gallery.timeline\" data-ng-click=\"mactrl.sidebarStat($event)\">Timeline</a></li></ul></li><li data-ui-sref-active=\"active\"><a data-ui-sref=\"generic-classes\" data-ng-click=\"mactrl.sidebarStat($event)\"><i class=\"zmdi zmdi-layers\"></i> Generic Classes</a></li><li class=\"sub-menu\" data-ng-class=\"{ 'active toggled': mactrl.$state.includes('pages') }\"><a href=\"\" toggle-submenu><i class=\"zmdi zmdi-collection-item\"></i> Sample Pages</a><ul><li><a data-ui-sref-active=\"active\" data-ui-sref=\"pages.profile.profile-about\" data-ng-click=\"mactrl.sidebarStat($event)\">Profile</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"pages.listview\" data-ng-click=\"mactrl.sidebarStat($event)\">List View</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"pages.messages\" data-ng-click=\"mactrl.sidebarStat($event)\">Messages</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"pages.pricing-table\" data-ng-click=\"mactrl.sidebarStat($event)\">Pricing Table</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"pages.contacts\" data-ng-click=\"mactrl.sidebarStat($event)\">Contacts</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"pages.invoice\" data-ng-click=\"mactrl.sidebarStat($event)\">Invoice</a></li><li><a data-ui-sref-active=\"active\" data-ui-sref=\"pages.wall\" data-ng-click=\"mactrl.sidebarStat($event)\">Wall</a></li><li><a href=\"login.html\">Login and Sign Up</a></li><li><a href=\"lockscreen.html\">Lockscreen</a></li><li><a href=\"404.html\">Error 404</a></li></ul></li><li class=\"sub-menu\"><a href=\"\" toggle-submenu><i class=\"zmdi zmdi-menu\"></i> 3 Level Menu</a><ul><li><a href=\"\">Level 2 link</a></li><li><a href=\"\">Another level 2 Link</a></li><li class=\"sub-menu\"><a href=\"\" toggle-submenu>I have children too</a><ul><li><a href=\"\">Level 3 link</a></li><li><a href=\"\">Another Level 3 link</a></li><li><a href=\"\">Third one</a></li></ul></li><li><a href=\"\">One more 2</a></li></ul></li><li><a href=\"https://wrapbootstrap.com/theme/material-admin-responsive-angularjs-WB011H985\"><i class=\"zmdi zmdi-money\"></i> Buy this template</a></li></ul></div>"
  );


  $templateCache.put('template/carousel/carousel.html',
    "<div ng-mouseenter=\"pause()\" ng-mouseleave=\"play()\" class=\"carousel\" ng-swipe-right=\"prev()\" ng-swipe-left=\"next()\"><ol class=\"carousel-indicators\" ng-show=\"slides.length > 1\"><li ng-repeat=\"slide in slides | orderBy:'index' track by $index\" ng-class=\"{active: isActive(slide)}\" ng-click=\"select(slide)\"></li></ol><div class=\"carousel-inner\" ng-transclude></div><a class=\"left carousel-control\" ng-click=\"prev()\" ng-show=\"slides.length > 1\"><span class=\"zmdi zmdi-chevron-left\"></span></a> <a class=\"right carousel-control\" ng-click=\"next()\" ng-show=\"slides.length > 1\"><span class=\"zmdi zmdi-chevron-right\"></span></a></div>"
  );


  $templateCache.put('template/datepicker/day.html',
    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\" class=\"dp-table dpt-day\"><thead><tr class=\"tr-dpnav\"><th><button type=\"button\" class=\"pull-left btn-dp\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-long-arrow-left\"></i></button></th><th colspan=\"{{::5 + showWeeks}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" class=\"w-100 btn-dp\"><div class=\"dp-title\">{{title}}</div></button></th><th><button type=\"button\" class=\"pull-right btn-dp\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-long-arrow-right\"></i></button></th></tr><tr class=\"tr-dpday\"><th ng-if=\"showWeeks\" class=\"text-center\"></th><th ng-repeat=\"label in ::labels track by $index\" class=\"text-center\"><small aria-label=\"{{::label.full}}\">{{::label.abbr}}</small></th></tr></thead><tbody><tr ng-repeat=\"row in rows track by $index\"><td ng-if=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td><td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\"><button type=\"button\" class=\"w-100 btn-dp btn-dpday btn-dpbody\" ng-class=\"{'dp-today': dt.current, 'dp-selected': dt.selected, 'dp-active': isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"::{'dp-day-muted': dt.secondary, 'dp-day-today': dt.current}\">{{::dt.label}}</span></button></td></tr></tbody></table>"
  );


  $templateCache.put('template/datepicker/month.html',
    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\" class=\"dp-table\"><thead><tr class=\"tr-dpnav\"><th><button type=\"button\" class=\"pull-left btn-dp\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-long-arrow-left\"></i></button></th><th><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" class=\"w-100 btn-dp\"><div class=\"dp-title\">{{title}}</div></button></th><th><button type=\"button\" class=\"pull-right btn-dp\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-long-arrow-right\"></i></button></th></tr></thead><tbody><tr ng-repeat=\"row in rows track by $index\"><td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\"><button type=\"button\" class=\"w-100 btn-dp btn-dpbody\" ng-class=\"{'dp-selected': dt.selected, 'dp-active': isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"::{'dp-day-today': dt.current}\">{{::dt.label}}</span></button></td></tr></tbody></table>"
  );


  $templateCache.put('template/datepicker/popup.html',
    "<ul class=\"dropdown-menu\" ng-keydown=\"keydown($event)\"><li ng-transclude></li><li ng-if=\"showButtonBar\" class=\"dp-actions clearfix\"><button type=\"button\" class=\"btn btn-link\" ng-click=\"select('today')\">{{ getText('current') }}</button> <button type=\"button\" class=\"btn btn-link\" ng-click=\"close()\">{{ getText('close') }}</button></li></ul>"
  );


  $templateCache.put('template/datepicker/year.html',
    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\" class=\"dp-table\"><thead><tr class=\"tr-dpnav\"><th><button type=\"button\" class=\"pull-left btn-dp\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-long-arrow-left\"></i></button></th><th colspan=\"3\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"w-100 btn-dp\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><div class=\"dp-title\">{{title}}</div></button></th><th><button type=\"button\" class=\"pull-right btn-dp\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-long-arrow-right\"></i></button></th></tr></thead><tbody><tr ng-repeat=\"row in rows track by $index\"><td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\"><button type=\"button\" class=\"w-100 btn-dp btn-dpbody\" ng-class=\"{'dp-selected': dt.selected, 'dp-active': isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"::{'dp-day-today': dt.current}\">{{::dt.label}}</span></button></td></tr></tbody></table>"
  );


  $templateCache.put('template/pagination/pager.html',
    "<ul class=\"pager\"><li ng-class=\"{disabled: noPrevious(), previous: align}\"><a href ng-click=\"selectPage(page - 1, $event)\">Previous</a></li><li ng-class=\"{disabled: noNext(), next: align}\"><a href ng-click=\"selectPage(page + 1, $event)\">Next</a></li></ul>"
  );


  $templateCache.put('template/pagination/pagination.html',
    "<ul class=\"pagination\"><li ng-if=\"boundaryLinks\" ng-class=\"{disabled: noPrevious()}\"><a href ng-click=\"selectPage(1, $event)\"><i class=\"zmdi zmdi-more-horiz\"><i></i></i></a></li><li ng-if=\"directionLinks\" ng-class=\"{disabled: noPrevious()}\"><a href ng-click=\"selectPage(page - 1, $event)\"><i class=\"zmdi zmdi-chevron-left\"></i></a></li><li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active}\"><a href ng-click=\"selectPage(page.number, $event)\">{{page.text}}</a></li><li ng-if=\"directionLinks\" ng-class=\"{disabled: noNext()}\"><a href ng-click=\"selectPage(page + 1, $event)\"><i class=\"zmdi zmdi-chevron-right\"></i></a></li><li ng-if=\"boundaryLinks\" ng-class=\"{disabled: noNext()}\"><a href ng-click=\"selectPage(totalPages, $event)\"><i class=\"zmdi zmdi-more-horiz\"><i></i></i></a></li></ul>"
  );


  $templateCache.put('template/tabs/tabset.html',
    "<div class=\"clearfix\"><ul class=\"tab-nav\" ng-class=\"{'tn-vertical': vertical, 'tn-justified': justified, 'tab-nav-right': right}\" ng-transclude></ul><div class=\"tab-content\"><div class=\"tab-pane\" ng-repeat=\"tab in tabs\" ng-class=\"{active: tab.active}\" tab-content-transclude=\"tab\"></div></div></div>"
  );

});
