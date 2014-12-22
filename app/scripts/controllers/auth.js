'use strict';

angular.module('unleashApp')
  .controller('AuthController', ['$scope', 'userService', function ($scope, userService) {
    // Detect if user is logged in initially
    var isLoggedInInitially = $scope.user ? 1 : 0;

    userService.listen(isLoggedInInitially);

    $scope.login = function() {
      userService.login();
    };

    $scope.logout = function() {
      userService.logout();
    };
  }]);
