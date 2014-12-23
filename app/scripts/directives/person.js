'use strict';

angular.module('unleashApp').directive('unleashPerson', function() {
  return {
    templateUrl: 'views/partials/person.html',
    scope: {
      name: '@',
      thumb: '@'
    }
  };
});
