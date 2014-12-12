'use strict';

/**
 * @ngdoc overview
 * @name unleashApp
 * @description
 * # unleashApp
 *
 * Main module of the application.
 */
angular.module('unleashApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngTouch',
    'firebase',
    'firebase.utils',
    'unleashApp.authService'
  ])

.controller('MainController', ['$scope', 'fbutil', 'Auth', 'userService', function($scope, fbutil, Auth, userService) {
    $scope.auth = Auth;
    $scope.user = $scope.auth.$getAuth();

    // Todo: find a workaround for the delay
    if($scope.user) {
      userService.getUsername.then(function(data) {
        $scope.username = data;
      });
    }

    $scope.allUsers = fbutil.syncArray('users');

    userService.listen();

    $scope.login = function() {
      userService.login();
    };

    $scope.logout = function() {
      userService.logout();
    };
  }]);
