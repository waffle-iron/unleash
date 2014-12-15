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
    'unleashApp.authService',
    'unleashApp.cardsService'
  ])

.controller('MainController', ['$scope', 'fbutil', 'Auth', 'userService', function($scope, fbutil, Auth, userService) {
    $scope.auth = Auth;
    $scope.user = $scope.auth.$getAuth();

    $scope.allUsers = fbutil.syncArray('users');

    // Todo: find a workaround for the delay
    if($scope.user) {
      userService.getUsername.then(function(data) {
        $scope.user.username = data;
      }, function(err) {
        console.err(err);
      });
    }
  }]);
