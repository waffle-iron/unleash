'use strict';

angular.module('unleashApp').directive('unleashCard', function() {
  return {
    templateUrl: 'views/partials/card.html',
    scope: true,
    replace: true,
    transclude: true
  };
});
