'use strict';

angular.module('unleashApp').directive('cardTemplate', function() {
  return {
    templateUrl: 'views/partials/card-template.html',
    scope: true,
    replace: true,
    transclude: true
  };
});
