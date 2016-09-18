App.directive('userSearch', ['$uibModal', 'User', 'Company', function($uibModal, User, Company) {
    return {
      restrict: 'A',
      scope: {
          callback: '=',
          query: '@',
          searchcompany: '@',
          param: '='
      },
      // object is passed while making the call
      replace: true,
      link: function(scope, elm, attrs) {

        var callback = attrs.callback;
        scope.searchForm = {};

        scope.companySearch = attrs.searchcompany == 'false' ? false : true;

        scope.return = function(doc, type) {
          doc.type = type;
          scope.callback(doc, scope.param);
          scope.currentModal.dismiss();
        };

        scope.search = function() {

          Company.api.search({q: scope.searchForm.query}).then(function(results) {
            scope.companies = results;
            scope.currentCursor= null;
          });

          User.search({q: scope.searchForm.query}).then(function(results) {
            scope.users = results;
            scope.currentCursor = null;
          });
        };

        scope.setCurrent = function(item) {
          scope.currentCursor = item;
        };

        $(elm).click(function() {
          scope.currentModal = $uibModal.open({
            animation: false,
            size: 'lg',
            backdrop: true,
            keyboard: true,
            templateUrl: 'views/modals/search-user-directive.html',
            scope: scope
          });
        });
      }
    };
}]);
