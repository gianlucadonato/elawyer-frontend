App.controller('createUser', function($rootScope, $scope, $state, $uibModal, User, Notify) {

  $scope.createUser = function(data) {
    if(data.birthday) {
      // Transform data in ms
      var bd = data.birthday.split('/');
      data.birthday = new Date(bd[2], bd[1], bd[0]).getTime();
    }
    data.role = 10;
    User
      .create(data)
      .then(function(user){
        $scope.creatingUser = false;
        $scope.success = true;
      })
      .catch(function(err){
        $scope.creatingUser = false;
        $scope.wrong = true;
      });
  };
});


App.controller('createCompany', function($rootScope, $scope, $state, $uibModal, Company, Notify, $localStorage, Upload, API) {

  $scope.company = {owners: [], users: []};
  $scope.creating = true;

  $scope.me = $localStorage.current_user;
  $scope.company.owners.push($scope.me);

  $scope.removeAdmin = function(index) {
    if ($scope.company.owners.length > 1)
      $scope.company.owners.splice(index, 1);
    else
      Notify.error('Error!','Deve esserci almeno un proprietario per questa azienda !');
  };

  $scope.removeUser = function(index) {
      $scope.company.users.splice(index, 1);
  };

  $scope.addUser = function(item) {
    $scope.company.users.push(item);
  };

  $scope.addAdmin = function(item) {
    $scope.company.owners.push(item);
  };

  $scope.saveCompany = function() {
    var dataReference = $scope.company;

    dataReference.users = dataReference.users.map(function(obj) {
      return obj.id;
    });

    dataReference.owners = dataReference.owners.map(function(obj) {
      return obj.id;
    });

    $scope.toggleCompanyInfo = function(type) {
      $scope.creatingCompany = false;
    };

    Company.api
      .create(dataReference)
      .then(function(response){
        $scope.success = true;
      })
      .catch(function(err){
        $scope.wrong = true;
      });
  };




});
