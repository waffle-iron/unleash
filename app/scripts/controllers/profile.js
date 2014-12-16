'use strict';

angular.module('unleashApp')
  .controller('ProfileController', ['$scope', 'userService', function ($scope, userService) {
    userService.listen();

    $scope.login = function() {
      userService.login();
    };

    $scope.logout = function() {
      userService.logout();
    };
  }]);
