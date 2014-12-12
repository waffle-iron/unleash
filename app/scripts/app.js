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

.controller('MainController', ['$scope', 'Auth', 'userService', function($scope, Auth, userService) {
    $scope.auth = Auth;
    $scope.user = $scope.auth.$getAuth();

    userService.listen();

    $scope.login = function() {
      userService.login();
    };

    $scope.logout = function() {
      userService.logout();
    };
  }]);
