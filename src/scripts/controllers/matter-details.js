(function() {
  'use strict';



  App.controller('MatterEditCtrl', function($rootScope, $scope, $state, $timeout) {

    $scope.matter = {};
    $scope.services = {};

    function activate() {
      getMatterDetails();
    }

    activate();

    function getMatterDetails() {
      $scope.matter = {
        id: 1,
        name: 'Matter#1',
        description: 'Lorem ipsum',
        practice_area: 'Diritto Societario',
        status: 'open',
        open_date: new Date()
      };

      $scope.services = [{
        title: 'Registro startup innovativa',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 0,
        activated: false
      }, {
        title: 'Approfondimento giuridico del modello di business',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 0,
        activated: false
      }, {
        title: 'Patto Parasociale',
        description: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 0,
        activated: false
      }];
    }
  });


  App.controller('MatterCreateCtrl', function($rootScope, $scope, $state, $timeout, Service) {

    $scope.matter = {};
    $scope.services = {};


    console.log('diocannn')

    $scope.services = [{
      title: '',
      description: '',
      price: 0,
      activated: false,
      items: []
    }];

    $scope.dropping = 'dropping';

    $scope.treeOptions = {
      dragStart: function(ev) {
        $scope.show
      },
    };

    $scope.addSubItem = function(item) {
      item.items.push({
        title: '',
        description: '',
        price: 0,
        mandatory: false,
        items: []
      });
    }
    
    $scope.addItem = function(data) {

      if (!data)
        data = {}
      $scope.services.push({
        title: data.title || '',
        description: data.description || '',
        price: data.price || 0,
        mandatory: data.mandatory || false,
        items: data.items || []
      });
    }

    $scope.removeSub = function(item, index) {
      item.items.splice(index, 1)
    }

    $scope.remove = function(index) {
      $scope.services.splice(index, 1);
    }

    $scope.serv = [];

    $scope.getFromBucket = function(item) {
      $scope.addItem(item);
    }


    $scope.page = 0; $scope.per_page = 5;
    $scope.getExistingServices = function() {
      Service.get($scope.page, $scope.per_page).then(function(res) {
        $scope.serv = res;
      }, function() {});
    }

    $scope.$watch('[page,per_page]', function () {
      $scope.getExistingServices();
    }, true);

    $scope.getExistingServices();

    $scope.saveService = function(item) {

      console.log(item)

      Service.post(item).then(function() {
        $scope.serv.push(item);
      }, function() {});
    }



  });



  /**=========================================================
  * File: matter-details.js
  * MatterDetails Controller
  =========================================================*/

  App.controller('MatterDetailsCtrl', function($rootScope, $scope, $state, $timeout) {

    $scope.matter = {};
    $scope.services = {};

    function activate() {
      getMatterDetails();
    }

    activate();

    // $timeout(function() {
    //   var wrap = $("#wrap");

    //   $(window).on("scroll", function(e) {

        
    //     var dist = wrap.offset().top - $(window).scrollTop();
    //     console.log(dist)
          
    //     if (dist < 60) {
    //       console.log('adding class')
    //       wrap.addClass("fix-search");
    //     } else {
    //       wrap.removeClass("fix-search");
    //       console.log('removing class')
    //     }
        
    //   });
    // }, 0)


    function getMatterDetails() {
      $scope.matter = {
        id: 1,
        name: 'Matter#1',
        description: 'Lorem ipsum',
        practice_area: 'Diritto Societario',
        status: 'open',
        open_date: new Date()
      };

      $scope.services = [{
        title: 'Registro startup innovativa',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 0,
        activated: false
      }, {
        title: 'Approfondimento giuridico del modello di business',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 0,
        activated: false
      }, {
        title: 'Patto Parasociale',
        description: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 0,
        activated: false
      }];
    }




  });

})();
