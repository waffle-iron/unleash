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
    'unleashApp.services'
  ])

.controller('MainCtrl', ['$scope', 'Auth', 'userService', function($scope, Auth, userService) {
    $scope.auth = Auth;
    $scope.user = $scope.auth.$getAuth();

    $scope.login = function() {
      userService.login();
    };

    $scope.logout = function() {
      userService.logout();
    };

    $scope.testLogin = function() {
      userService.testLogin();
    };
  }]);
