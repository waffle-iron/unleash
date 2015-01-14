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
    'ngSanitize',
    'ngAria',
    'ngDraggable',
    'relativeDate',
    'angular-growl',
    'firebase',
    'firebase.utils'
  ])

.config(function($sceDelegateProvider) {
    // Allow loading thumbnails from Google+ in directives
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://*.googleusercontent.com/**'
    ]);
  })

.config(function(growlProvider) {
    growlProvider.globalTimeToLive(3000);
    growlProvider.globalDisableCountDown(true);
    growlProvider.globalDisableCloseButton(true);
    growlProvider.globalInlineMessages(true);
  })

.run(function($rootScope, $route) {
    $rootScope.$on('$routeChangeSuccess', function(newVal, oldVal) {
      if (oldVal !== newVal) {
        $rootScope.routeClassName = 'page-' + $route.current.className;
      }
    });
  })

.controller('MainController', function($rootScope, $scope, fbutil, Auth, userService) {
    $scope.auth = Auth;
    $scope.allUsers = fbutil.syncArray('users');

    var setUserData = function() {
      $scope.user = $scope.auth.$getAuth();

      userService.getUsername().then(function(data) {
        $scope.user.username = data;
      }, function(err) {
        console.err(err);
      });
    };

    setUserData();

    $rootScope.$on('auth-change', function() {
      setUserData();
    });
  });
