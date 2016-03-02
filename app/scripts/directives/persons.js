'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashPersons
 * @description
 * # unleashPersons
 */
angular.module('unleashApp')
  .directive('unleashPersons', function() {
    return {
      templateUrl: 'views/partials/persons.html',
      scope: {
        users: '='
      }
    };
  });
