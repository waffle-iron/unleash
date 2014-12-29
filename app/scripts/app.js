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
    'ngDraggable',
    'firebase',
    'firebase.utils',
    'unleashApp.authService',
    'unleashApp.cardsService'
  ])

.config(function($sceDelegateProvider) {
    // Allow loading thumbnails from Google+ in directives
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://*.googleusercontent.com/**'
    ]);
  })

.run(function($rootScope, cardsService) {
    $rootScope.$on('$routeChangeStart', function() {
      cardsService.closeSidebar();
    });
  })

.controller('MainController', ['$scope', 'fbutil', 'Auth', 'userService', function($scope, fbutil, Auth, userService) {
    $scope.auth = Auth;
    $scope.user = $scope.auth.$getAuth();

    $scope.allUsers = fbutil.syncArray('users');

    // @todo: Find a workaround for the delay
    if($scope.user) {
      userService.getUsername.then(function(data) {
        $scope.user.username = data;
      }, function(err) {
        console.err(err);
      });
    }
  }]);
