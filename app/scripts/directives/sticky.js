'use strict';
/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashSticky
 * @description
 * # unleashSticky
 */
angular.module('unleashApp')
  .directive('unleashSticky', function ($window, $timeout, $document) {
    return {
      restrict: 'A',
      scope: {
        control: '=?'
      },
      link: function(scope, element) {
        var offsetTop,
          promise,
          frozen = false;

        if (!scope.control) {
          scope.control = function() { return {} };
        }

        function scroll(scrollY) {
          element.css('top', Math.max(scrollY - offsetTop, 0));
        }

        scope.$watch(function() {
          return element.offset().top;
        }, function(val){
          offsetTop = val - (parseFloat(element.css('top')) || 0);
        });

        $window.addEventListener('scroll', function() {
          $timeout.cancel(promise);

          if (scope.control().freeze) {

            if (!frozen) {
              frozen = true;
              scroll(scope.control().freezeTop || 0);
            }

          } else {
            // Tether mode makes the sticky element to follow
            // the scrollbar movements from the moment it unfreezes.
            if (frozen && scope.control().tetherMode) {
              offsetTop = scope.control().tetherTop;
            }
            var scrollY = $window.scrollY || $document[0].body.scrollTop;
            frozen = false;
            promise = $timeout(function() {
              scroll(scrollY);
            }, 100, false);
          }
        });
      }
    };
  });
