(function() {
  'use strict';

  /**=========================================================
  * File: user-search.js
  * Open User Search Modal
  =========================================================*/

  App.directive('userSearch', ['$uibModal', 'User', 'Company', function($uibModal, User, Company) {
    return {
      restrict: 'A',
      scope: {
        userSearch: '=',
        query: '@',
        searchCompany: '@',
        param: '='
      },
      // object is passed while making the call
      replace: true,
      link: function(scope, element, attrs) {

        scope.searchForm = {};

        $(element).click(function() {
          scope.currentModal = $uibModal.open({
            animation: false,
            size: 'lg',
            backdrop: true,
            keyboard: true,
            templateUrl: 'views/modals/searchUser.html',
            scope: scope
          });
        });

        scope.companySearch = (attrs.searchCompany === 'true');

        scope.return = function(doc, type) {
          doc.type = type;
          if(scope.userSearch)
            scope.userSearch(doc, scope.param);
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

      }
    };
  }]);

})();
