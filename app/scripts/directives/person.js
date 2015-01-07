'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashPerson
 * @description
 * # unleashPerson
 */
angular.module('unleashApp')
  .directive('unleashPerson', function() {
    return {
      templateUrl: 'views/partials/person.html',
      scope: {
        name: '@',
        thumb: '@'
      }
    };
  });
