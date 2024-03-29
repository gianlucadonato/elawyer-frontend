(function() {
  'use strict';

  /**=========================================================
  * File: chosen.js
  * Chosen Directive
  =========================================================*/

  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  App.directive('chosen', function($timeout, User) {

    var CHOSEN_OPTION_WHITELIST, NG_OPTIONS_REGEXP, isEmpty, snakeCase;
    NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
    CHOSEN_OPTION_WHITELIST = ['persistentCreateOption', 'createOptionText', 'createOption', 'skipNoResults', 'noResultsText', 'allowSingleDeselect', 'disableSearchThreshold', 'disableSearch', 'enableSplitWordSearch', 'inheritSelectClasses', 'maxSelectedOptions', 'placeholderTextMultiple', 'placeholderTextSingle', 'searchContains', 'singleBackstrokeDelete', 'displayDisabledOptions', 'displaySelectedOptions', 'width', 'includeGroupLabelInSelected', 'maxShownResults'];

    snakeCase = function(input) {
      return input.replace(/[A-Z]/g, function($1) {
        return "_" + ($1.toLowerCase());
      });
    };

    isEmpty = function(value) {
      var key;
      if (angular.isArray(value)) {
        return value.length === 0;
      } else if (angular.isObject(value)) {
        for (key in value) {
          if (value.hasOwnProperty(key)) {
            return false;
          }
        }
      }
      return true;
    };

    return {
      restrict: 'A',
      require: '?ngModel',
      priority: 1,
      link: function(scope, element, attr, ngModel) {
        var chosen, empty, initOrUpdate, match, options, origRender, startLoading, stopLoading, updateMessage, valuesExpr, viewWatch;
        scope.disabledValuesHistory = scope.disabledValuesHistory ? scope.disabledValuesHistory : [];
        element = $(element);
        element.addClass('localytics-chosen');
        options = scope.$eval(attr.chosen) || {};
        angular.forEach(attr, function(value, key) {
          if (indexOf.call(CHOSEN_OPTION_WHITELIST, key) >= 0) {
            return attr.$observe(key, function(value) {
              var prefix;
              prefix = String(element.attr(attr.$attr[key])).slice(0, 2);
              options[snakeCase(key)] = prefix === '{{' ? value : scope.$eval(value);
              return updateMessage();
            });
          }
        });

        startLoading = function() {
          return element.addClass('loading').attr('disabled', true).trigger('chosen:updated');
        };
        stopLoading = function() {
          element.removeClass('loading');
          if (angular.isDefined(attr.disabled)) {
            element.attr('disabled', attr.disabled);
          } else {
            element.attr('disabled', false);
          }
          return element.trigger('chosen:updated');
        };

        chosen = null;
        empty = false;
        initOrUpdate = function() {
          if (chosen) {
            return element.trigger('chosen:updated');
          } else {
            $timeout(function() {
              chosen = element.chosen(options).data('chosen');
            });
            if (angular.isObject(chosen)) {
              var defaultText = chosen.default_text;
              return defaultText;
            }
          }
        };

        updateMessage = function() {
          if (chosen && empty) {
            element.attr('data-placeholder', chosen.results_none_found).attr('disabled', true);
          } else {
            element.removeAttr('data-placeholder');
          }
          return element.trigger('chosen:updated');
        };


        if (ngModel) {
          origRender = ngModel.$render;
          ngModel.$render = function() {
            origRender();
            return initOrUpdate();
          };
          element.on('chosen:hiding_dropdown', function() {
            return scope.$apply(function() {
              return ngModel.$setTouched();
            });
          });
          if (attr.multiple) {
            viewWatch = function() {
              return ngModel.$viewValue;
            };
            scope.$watch(viewWatch, ngModel.$render, true);
          }
        } else {
          initOrUpdate();
        }


        attr.$observe('disabled', function() {
          return element.trigger('chosen:updated');
        });

        if (attr.ngOptions && ngModel) {
          match = attr.ngOptions.match(NG_OPTIONS_REGEXP);
          valuesExpr = match[7];
          var timer;
          console.log('scope.results', scope.results);
          scope.$watchCollection(valuesExpr, function(newVal, oldVal) {
            console.log('newVal??', newVal);
            console.log('oldVal??', oldVal);
            timer = $timeout(function() {
              if (angular.isUndefined(newVal)) {
                return startLoading();
              } else {
                // empty = isEmpty(newVal);
                stopLoading();
                return updateMessage();
              }
            });
            return timer;
          });
          return scope.$on('$destroy', function(event) {
            if (typeof timer !== "undefined" && timer !== null) {
              return $timeout.cancel(timer);
            }
          });
        }
      }
    };
  });

})();
