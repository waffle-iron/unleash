'use strict';

angular.module('unleashApp')
  .controller('AuthController', ['$scope', 'userService', function ($scope, userService) {
    // Detect if user is logged in initially
    userService.listen(!!$scope.user);

    $scope.login = function() {
      userService.login();
    };

    $scope.logout = function() {
      userService.logout();
    };
  }]);
