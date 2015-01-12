'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashAuth
 * @description
 * # Displays information related to the logged in user
 */
angular.module('unleashApp')
  .directive('unleashAuth', function() {
    var ctrlFn = function($scope, userService) {
      // Detect if user is logged in initially
      userService.listen(!!$scope.user);

      $scope.login = function() {
        userService.login();
      };

      $scope.logout = function() {
        userService.logout();
      };
    };

    return {
      replace: true,
      templateUrl: 'views/partials/auth.html',
      controller: ctrlFn
    };
  });
