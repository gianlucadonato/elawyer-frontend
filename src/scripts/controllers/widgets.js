(function() {
  'use strict';

  /**=========================================================
  * File: widgets.js
  * WidgetsCtrl Controller
  =========================================================*/

  App.controller('WidgetsCtrl', function($scope, $filter, $sce, $http, BestSelling, RecentItem, RecentPost, ToDo, TableService, ngTableParams, $uibModal) {

    /* =============
     * HOME PAGE
     * ============*/
    // Get Best Selling widget Data
    this.img = BestSelling.img;
    this.name = BestSelling.name;
    this.range = BestSelling.range;

    this.bsResult = BestSelling.getBestselling(this.img, this.name, this.range);

    //Get Recent Items Widget Data
    this.id = RecentItem.id;
    this.name = RecentItem.name;
    this.parseInt = RecentItem.price;
    this.riResult = RecentItem.getRecentitem(this.id, this.name, this.price);

    //Get Todo List Widget Data
    this.todo = ToDo.todo;
    this.tdResult = ToDo.getTodo(this.todo);
    //Add new Item (closed by default)
    this.addTodoStat = false;

    //Get Recent Posts Widget Items
    this.img = RecentPost.img;
    this.user = RecentPost.user;
    this.text = RecentPost.text;
    this.rpResult = RecentPost.getRecentpost(this.img, this.user, this.text);

    /* =============
     * WIDGETS PAGE
     * ============*/
    $scope.tabs = [
      {
        title:'Home',
        content:'In hac habitasse platea dictumst. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Nam eget dui. In ac felis quis tortor malesuada pretium. Phasellus consectetuer vestibulum elit. Duis lobortis massa imperdiet quam. Pellentesque commodo eros a enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Phasellus a est. Pellentesque commodo eros a enim. Cras ultricies mi eu turpis hendrerit fringilla. Donec mollis hendrerit risus. Vestibulum turpis sem, aliquet eget, lobortis pellentesque, rutrum eu, nisl. Praesent egestas neque eu enim. In hac habitasse platea dictumst.'
      },
      {
        title:'Profile',
        content:'Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nulla sit amet est. Praesent ac massa at ligula laoreet iaculis. Vivamus aliquet elit ac nisl. Nulla porta dolor. Cras dapibus. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.',
      },
      {
        title:'Messages',
        content:'Etiam rhoncus. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Cras id dui. Curabitur turpis. Etiam ut purus mattis mauris sodales aliquam. Aenean viverra rhoncus pede. Nulla sit amet est. Donec mi odio, faucibus at, scelerisque quis, convallis in, nisi. Praesent ac sem eget est egestas volutpat. Cras varius. Morbi mollis tellus ac sapien. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Fusce vel dui.Morbi mattis ullamcorper velit. Etiam rhoncus. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Cras id dui. Curabitur turpis. Etiam ut purus mattis mauris sodales aliquam. Aenean viverra rhoncus pede. Nulla sit amet est. Donec mi odio, faucibus at, scelerisque quis, convallis in, nisi. Praesent ac sem eget est egestas volutpat. Cras varius. Morbi mollis tellus ac sapien. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Fusce vel dui.',
      },
      {
        title:'Settings',
        content:'Praesent turpis. Phasellus magna. Fusce vulputate eleifend sapien. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis.',
      }
    ];

    /* =============
     * DATA-TABLE PAGE
     * ============*/
    var data = TableService.data;
    //Basic Example
    this.tableBasic = new ngTableParams({
      page: 1,            // show first page
      count: 10           // count per page
    }, {
      total: data.length, // length of data
      getData: function ($defer, params) {
        $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

    //Sorting
    this.tableSorting = new ngTableParams({
      page: 1,            // show first page
      count: 10,           // count per page
      sorting: {
        name: 'asc'     // initial sorting
      }
    }, {
      total: data.length, // length of data
      getData: function($defer, params) {
        // use build-in angular filter
        var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

    //Filtering
    this.tableFilter = new ngTableParams({
      page: 1,            // show first page
      count: 10
    }, {
      total: data.length, // length of data
      getData: function($defer, params) {
        // use build-in angular filter
        var orderedData = params.filter() ? $filter('filter')(data, params.filter()) : data;

        this.id = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
        this.name = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
        this.email = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
        this.username = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
        this.contact = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve(this.id, this.name, this.email, this.username, this.contact);
      }
    });

    //Editable
    this.tableEdit = new ngTableParams({
      page: 1,            // show first page
      count: 10           // count per page
    }, {
      total: data.length, // length of data
      getData: function($defer, params) {
        $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

    // =========================================================================
    // COMMON FORMS
    // =========================================================================

    //Input Slider
    this.nouisliderValue = 4;
    this.nouisliderFrom = 25;
    this.nouisliderTo = 80;
    this.nouisliderRed = 35;
    this.nouisliderBlue = 90;
    this.nouisliderCyan = 20;
    this.nouisliderAmber = 60;
    this.nouisliderGreen = 75;

    //Color Picker
    this.color = '#03A9F4';
    this.color2 = '#8BC34A';
    this.color3 = '#F44336';
    this.color4 = '#FFC107';

    //====================================
    // DATE PICKER
    //====================================
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.openDP = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope[opened] = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    //====================================
    // ALERT
    //====================================
    $scope.alerts = [
      { type: 'info', msg: "Well done! You successfully read this important alert message." },
      { type: 'success', msg: "Well done! You successfully read this important alert message." },
      { type: 'warning', msg: "Warning! Better check yourself, you're not looking too good." },
      { type: 'danger', msg: "Oh snap! Change a few things up and try submitting again." }
    ];

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    //====================================
    // BUTTONS
    //====================================
    $scope.singleModel = 1;
    $scope.radioModel = 'Middle';
    $scope.checkModel = {
      left: false,
      middle: true,
      right: false
    };

    //====================================
    // CAROUSEL
    //====================================
    $scope.myInterval = 0;
    $scope.isCollapsed = false;
    $scope.slides = [
      {
        img: 'c-1.jpg',
        title: 'First Slide Label',
        text: 'Some sample text goes here...'
      },
      {
        img: 'c-2.jpg',
        title: 'Second Slide Label',
        text: 'Some sample text goes here...'
      },
      {
        img: 'c-3.jpg'
      }
    ];

    //====================================
    // DROPDOWN
    //====================================
    $scope.items = [
      { name: 'The first choice!', icon: 'home' },
      { name: 'And another choice', icon: 'account' },
      { name: 'But wait! A third!', icon: 'email' },
      { name: 'And fourth on here', icon: 'pin' }
    ];

    //====================================
    // MODAL
    //====================================
    $scope.modalContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sodales orci ante, sed ornare eros vestibulum ut. Ut accumsan vitae eros sit amet tristique. Nullam scelerisque nunc enim, non dignissim nibh faucibus ullamcorper. Fusce pulvinar libero vel ligula iaculis ullamcorper. Integer dapibus, mi ac tempor varius, purus nibh mattis erat, vitae porta nunc nisi non tellus. Vivamus mollis ante non massa egestas fringilla. Vestibulum egestas consectetur nunc at ultricies. Morbi quis consectetur nunc.';
    //Create Modal
    function modalInstances(animation, size, backdrop, keyboard) {
      var modalInstance = $uibModal.open({
        animation: animation,
        size: size,
        backdrop: backdrop,
        keyboard: keyboard,
        templateUrl: 'views/modals/myModal.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          content: function () {
            return $scope.modalContent;
          }
        }
      });
    }

    //Custom Sizes
    $scope.open = function (size) {
      modalInstances(true, size, true, true);
    };

    //Without Animation
    $scope.openWithoutAnimation = function() {
      modalInstances(false, '', true, true);
    };

    //Prevent Outside Click
    $scope.openStatic = function () {
      modalInstances(true, '', 'static', true);
    };

    //Disable Keyboard
    $scope.openKeyboard = function () {
      modalInstances(true, '', true, false);
    };

    //====================================
    // PAGINATION
    //====================================
    $scope.totalItems = 64;
    $scope.currentPage = 4;

    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };

    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;

    //====================================
    // POPOVER
    //====================================
    $scope.dynamicPopover = {
      templateUrl: 'myPopoverTemplate.html',
    };

    //====================================
    // PROGRESSBAR
    //====================================
    $scope.max = 200;

    $scope.random = function() {
      var value = Math.floor((Math.random() * 100) + 1);
      var type;

      if (value < 25) {
        type = 'success';
      }
      else if (value < 50) {
        type = 'info';
      }
      else if (value < 75) {
        type = 'warning';
      }
      else {
        type = 'danger';
      }

      $scope.showWarning = (type === 'danger' || type === 'warning');
      $scope.dynamic = value;
      $scope.type = type;
    };

    $scope.random();

    $scope.randomStacked = function() {
      $scope.stacked = [];
      var types = ['success', 'info', 'warning', 'danger'];

      for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
        var index = Math.floor((Math.random() * 4));
        $scope.stacked.push({
          value: Math.floor((Math.random() * 30) + 1),
          type: types[index]
        });
      }
    };

    $scope.randomStacked();

    //====================================
    // TABS
    //====================================
    $scope.tabs = [
      {
        title:'Home',
        content:'In hac habitasse platea dictumst. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Nam eget dui. In ac felis quis tortor malesuada pretium. Phasellus consectetuer vestibulum elit. Duis lobortis massa imperdiet quam. Pellentesque commodo eros a enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Phasellus a est. Pellentesque commodo eros a enim. Cras ultricies mi eu turpis hendrerit fringilla. Donec mollis hendrerit risus. Vestibulum turpis sem, aliquet eget, lobortis pellentesque, rutrum eu, nisl. Praesent egestas neque eu enim. In hac habitasse platea dictumst.'
      },
      {
        title:'Profile',
        content:'Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nulla sit amet est. Praesent ac massa at ligula laoreet iaculis. Vivamus aliquet elit ac nisl. Nulla porta dolor. Cras dapibus. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.',
      },
      {
        title:'Messages',
        content:'Etiam rhoncus. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Cras id dui. Curabitur turpis. Etiam ut purus mattis mauris sodales aliquam. Aenean viverra rhoncus pede. Nulla sit amet est. Donec mi odio, faucibus at, scelerisque quis, convallis in, nisi. Praesent ac sem eget est egestas volutpat. Cras varius. Morbi mollis tellus ac sapien. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Fusce vel dui.Morbi mattis ullamcorper velit. Etiam rhoncus. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Cras id dui. Curabitur turpis. Etiam ut purus mattis mauris sodales aliquam. Aenean viverra rhoncus pede. Nulla sit amet est. Donec mi odio, faucibus at, scelerisque quis, convallis in, nisi. Praesent ac sem eget est egestas volutpat. Cras varius. Morbi mollis tellus ac sapien. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Fusce vel dui.',
      },
      {
        title:'Settings',
        content:'Praesent turpis. Phasellus magna. Fusce vulputate eleifend sapien. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis.',
      }
    ];

    //====================================
    // TOOLTIPS
    //====================================
    $scope.htmlTooltip = $sce.trustAsHtml('I\'ve been made <b>bold</b>!');

    //====================================
    // TYPEAHEAD
    //====================================
    $scope.selected = undefined;
    $scope.states = [
      'Alabama',
      'Alaska',
      'Arizona',
      'Arkansas',
      'California',
      'Colorado',
      'Connecticut',
      'Delaware',
      'Florida',
      'Georgia',
      'Hawaii',
      'Idaho',
      'Illinois',
      'Indiana',
      'Iowa',
      'Kansas',
      'Kentucky',
      'Louisiana',
      'Maine',
      'Maryland',
      'Massachusetts',
      'Michigan',
      'Minnesota',
      'Mississippi',
      'Missouri',
      'Montana',
      'Nebraska',
      'Nevada',
      'New Hampshire',
      'New Jersey',
      'New Mexico',
      'New York',
      'North Dakota',
      'North Carolina',
      'Ohio',
      'Oklahoma',
      'Oregon',
      'Pennsylvania',
      'Rhode Island',
      'South Carolina',
      'South Dakota',
      'Tennessee',
      'Texas',
      'Utah',
      'Vermont',
      'Virginia',
      'Washington',
      'West Virginia',
      'Wisconsin',
      'Wyoming'
    ];

    // Any function returning a promise object can be used to load values asynchronously
    $scope.getLocation = function(val) {
      return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: val,
          sensor: false
        }
      }).then(function(response){
        return response.data.results.map(function(item){
          return item.formatted_address;
        });
      });
    };

  })
  // =========================================================================
  // SWAL DEMO
  // =========================================================================
  .controller('SwalCtrl', function($scope){
    $scope.swalBasic = function() {
      swal("Here's a message!");
    };

    $scope.swalText = function() {
      swal("Here's a message!", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lorem erat, tincidunt vitae ipsum et, pellentesque maximus enim. Mauris eleifend ex semper, lobortis purus sed, pharetra felis");
    };

    $scope.swalSuccess = function() {
      swal("Good job!","Here's a message!", "success");
    };

    $scope.swalWarning = function() {
      swal({
        title: "Are you sure?",
        text: "You will not be able to recover this imaginary file!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
      }, function(){
          swal("Deleted!", "Your imaginary file has been deleted.", "success");
      });
    };

    $scope.swalParams = function() {
      swal({
        title: "Are you sure?",
        text: "You will not be able to recover this imaginary file!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel plx!",
        closeOnConfirm: false,
        closeOnCancel: false
      }, function(isConfirm){
        if (isConfirm) {
            swal("Deleted!", "Your imaginary file has been deleted.", "success");
        } else {
            swal("Cancelled", "Your imaginary file is safe :)", "error");
        }
      });
    };

    $scope.swalImg = function() {
      swal({
        title: "Sweet!",
        text: "Here's a custom image.",
        imageUrl: "img/thumbs-up.png"
      });
    };

    $scope.swalTimer = function() {
      swal({
        title: "Auto close alert!",
        text: "I will close in 2 seconds.",
        timer: 2000,
        showConfirmButton: false
      });
    };

  })
  // =========================================================================
  // ANIMATIONS DEMO
  // =========================================================================
  .controller('animCtrl', function($timeout){

      //Animation List
      this.attentionSeekers = [
          { animation: 'bounce', target: 'attentionSeeker' },
          { animation: 'flash', target: 'attentionSeeker' },
          { animation: 'pulse', target: 'attentionSeeker' },
          { animation: 'rubberBand', target: 'attentionSeeker' },
          { animation: 'shake', target: 'attentionSeeker' },
          { animation: 'swing', target: 'attentionSeeker' },
          { animation: 'tada', target: 'attentionSeeker' },
          { animation: 'wobble', target: 'attentionSeeker' }
      ];
      this.flippers = [
          { animation: 'flip', target: 'flippers' },
          { animation: 'flipInX', target: 'flippers' },
          { animation: 'flipInY', target: 'flippers' },
          { animation: 'flipOutX', target: 'flippers' },
          { animation: 'flipOutY', target: 'flippers'  }
      ];
       this.lightSpeed = [
          { animation: 'lightSpeedIn', target: 'lightSpeed' },
          { animation: 'lightSpeedOut', target: 'lightSpeed' }
      ];
      this.special = [
          { animation: 'hinge', target: 'special' },
          { animation: 'rollIn', target: 'special' },
          { animation: 'rollOut', target: 'special' }
      ];
      this.bouncingEntrance = [
          { animation: 'bounceIn', target: 'bouncingEntrance' },
          { animation: 'bounceInDown', target: 'bouncingEntrance' },
          { animation: 'bounceInLeft', target: 'bouncingEntrance' },
          { animation: 'bounceInRight', target: 'bouncingEntrance' },
          { animation: 'bounceInUp', target: 'bouncingEntrance'  }
      ];
      this.bouncingExits = [
          { animation: 'bounceOut', target: 'bouncingExits' },
          { animation: 'bounceOutDown', target: 'bouncingExits' },
          { animation: 'bounceOutLeft', target: 'bouncingExits' },
          { animation: 'bounceOutRight', target: 'bouncingExits' },
          { animation: 'bounceOutUp', target: 'bouncingExits'  }
      ];
      this.rotatingEntrances = [
          { animation: 'rotateIn', target: 'rotatingEntrances' },
          { animation: 'rotateInDownLeft', target: 'rotatingEntrances' },
          { animation: 'rotateInDownRight', target: 'rotatingEntrances' },
          { animation: 'rotateInUpLeft', target: 'rotatingEntrances' },
          { animation: 'rotateInUpRight', target: 'rotatingEntrances'  }
      ];
      this.rotatingExits = [
          { animation: 'rotateOut', target: 'rotatingExits' },
          { animation: 'rotateOutDownLeft', target: 'rotatingExits' },
          { animation: 'rotateOutDownRight', target: 'rotatingExits' },
          { animation: 'rotateOutUpLeft', target: 'rotatingExits' },
          { animation: 'rotateOutUpRight', target: 'rotatingExits'  }
      ];
      this.fadeingEntrances = [
          { animation: 'fadeIn', target: 'fadeingEntrances' },
          { animation: 'fadeInDown', target: 'fadeingEntrances' },
          { animation: 'fadeInDownBig', target: 'fadeingEntrances' },
          { animation: 'fadeInLeft', target: 'fadeingEntrances' },
          { animation: 'fadeInLeftBig', target: 'fadeingEntrances'  },
          { animation: 'fadeInRight', target: 'fadeingEntrances'  },
          { animation: 'fadeInRightBig', target: 'fadeingEntrances'  },
          { animation: 'fadeInUp', target: 'fadeingEntrances'  },
          { animation: 'fadeInBig', target: 'fadeingEntrances'  }
      ];
      this.fadeingExits = [
          { animation: 'fadeOut', target: 'fadeingExits' },
          { animation: 'fadeOutDown', target: 'fadeingExits' },
          { animation: 'fadeOutDownBig', target: 'fadeingExits' },
          { animation: 'fadeOutLeft', target: 'fadeingExits' },
          { animation: 'fadeOutLeftBig', target: 'fadeingExits'  },
          { animation: 'fadeOutRight', target: 'fadeingExits'  },
          { animation: 'fadeOutRightBig', target: 'fadeingExits'  },
          { animation: 'fadeOutUp', target: 'fadeingExits'  },
          { animation: 'fadeOutUpBig', target: 'fadeingExits'  }
      ];
      this.zoomEntrances = [
          { animation: 'zoomIn', target: 'zoomEntrances' },
          { animation: 'zoomInDown', target: 'zoomEntrances' },
          { animation: 'zoomInLeft', target: 'zoomEntrances' },
          { animation: 'zoomInRight', target: 'zoomEntrances' },
          { animation: 'zoomInUp', target: 'zoomEntrances'  }
      ];
      this.zoomExits = [
          { animation: 'zoomOut', target: 'zoomExits' },
          { animation: 'zoomOutDown', target: 'zoomExits' },
          { animation: 'zoomOutLeft', target: 'zoomExits' },
          { animation: 'zoomOutRight', target: 'zoomExits' },
          { animation: 'zoomOutUp', target: 'zoomExits'  }
      ];

      //Animate
      this.ca = '';

      this.setAnimation = function(animation, target) {
        var animationDuration;
        if (animation === "hinge") {
          animationDuration = 2100;
        } else {
          animationDuration = 1200;
        }

        angular.element('#'+target).addClass(animation);

        $timeout(function(){
          angular.element('#'+target).removeClass(animation);
        }, animationDuration);
      };

  })
  //=================================================
  // CALENDAR
  //=================================================
  .controller('CalendarCtrl', function($modal){

    //Create and add Action button with dropdown in Calendar header.
    this.month = 'month';

    this.actionMenu = '<ul class="actions actions-alt" id="fc-actions">' +
      '<li class="dropdown" dropdown>' +
        '<a href="" dropdown-toggle><i class="zmdi zmdi-more-vert"></i></a>' +
        '<ul class="dropdown-menu dropdown-menu-right">' +
          '<li class="active">' +
            '<a data-calendar-view="month" href="">Month View</a>' +
          '</li>' +
          '<li>' +
            '<a data-calendar-view="basicWeek" href="">Week View</a>' +
          '</li>' +
          '<li>' +
            '<a data-calendar-view="agendaWeek" href="">Agenda Week View</a>' +
          '</li>' +
          '<li>' +
            '<a data-calendar-view="basicDay" href="">Day View</a>' +
          '</li>' +
          '<li>' +
            '<a data-calendar-view="agendaDay" href="">Agenda Day View</a>' +
          '</li>' +
        '</ul>' +
        '</div>' +
      '</li>';


    //Open new event modal on selecting a day
    this.onSelect = function(argStart, argEnd) {
      var modalInstance  = $modal.open({
        templateUrl: 'views/modals/addEvent.html',
        controller: 'AddEventCtrl',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          calendarData: function() {
            var x = [argStart, argEnd];
            return x;
          }
        }
      });
    };
  })

  // =========================================================================
  // PHOTO GALLERY
  // =========================================================================
  .controller('PhotoCtrl', function(){

    //Default grid size (2)
    this.photoColumn = 'col-md-2';
    this.photoColumnSize = 2;

    this.photoOptions = [
      { value: 2, column: 6 },
      { value: 3, column: 4 },
      { value: 4, column: 3 },
      { value: 1, column: 12 },
    ];

    //Change grid
    this.photoGrid = function(size) {
      this.photoColumn = 'col-md-'+size;
      this.photoColumnSize = size;
    };

  })

  //=================================================
  // LOGIN
  //=================================================
  .controller('loginCtrl', function(){
    //Status
    this.login = 1;
    this.register = 0;
    this.forgot = 0;
  });

})();
