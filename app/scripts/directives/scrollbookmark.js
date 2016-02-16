'use strict';

angular.module('unleashApp')
  .directive('unleashScrollBookmark', function() {
    return {
      scope: {
        offsetTop: '=',
      },
      link: function(scope, element) {
        scope.$watch(function() {
          return element.offset().top;
        }, function(newVal) {
            scope.offsetTop = newVal;
        });
      }
    };
  });
