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

.controller('MainCtrl', ['$scope', 'fbutil', 'Auth', 'userService', function($scope, fbutil, Auth, userService) {
    $scope.auth = Auth;
    $scope.user = $scope.auth.$getAuth();

    $scope.login = function() {
      userService.login();
    };

    $scope.logout = function() {
      userService.logout();
    };


    $scope.testLogin = function() {
      fbutil.onAuth(function(authData) {
        if (authData) {
          console.log('UID: ' + authData.uid);
        } else {
          // logged out
        }
      });
    };
  }]);
