'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashResourceView
 * @description
 * # unleashResourceView
 */
angular.module('unleashApp')
  .directive('unleashResourceView', function () {
    return {
      templateUrl: 'views/partials/resourceView.html',
      scope: {
        resource: '='
      }
    };
  });
