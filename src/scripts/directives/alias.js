/**
 * Checklist-model
 * AngularJS directive for list of checkboxes
 * https://github.com/vitalets/checklist-model
 * License: MIT http://opensource.org/licenses/MIT
 */

App
  .directive('ngAlias', function ngAlias($compile) {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
            var splits = attrs['alias'].trim().split(/\s+as\s+/);
            scope.$watch(splits[0], function(val) {
                scope.eval(splits[1]+'=('+splits[0]+')');
            });
        }
    }
  });


