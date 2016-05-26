'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashAuth
 * @description
 * # Displays information related to the logged in user
 */
angular.module('unleashApp')
  .directive('unleashAuth', function() {
    var ctrlFn = function($scope, $rootScope, googleService) {

      $scope.login = function() {
        googleService.signIn();
      };

      $scope.logout = function() {
        googleService.signOut();
      };
    };

    return {
      replace: true,
      templateUrl: 'views/partials/auth.html',
      controller: ctrlFn
    };
  });
