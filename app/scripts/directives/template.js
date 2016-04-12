'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashTemplate
 * @description
 * # Displays a template
 */
angular.module('unleashApp')
  .directive('unleashTemplate', function() {
    return {
      templateUrl: 'views/partials/template.html',
      scope: {
        card: '='
      },
      replace: true
    };
  });
