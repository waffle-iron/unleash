'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashAuth
 * @description
 * # Displays information related to the logged in user
 */
angular.module('unleashApp')
  .directive('unleashAuth', function() {
    return {
      templateUrl: 'views/partials/auth.html',
      controller: 'AuthController'
    };
  });
