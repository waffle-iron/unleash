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

.run(function($rootScope, $route, fbutil, Auth, userService) {
    $rootScope.auth = Auth;
    $rootScope.allUsers = fbutil.syncArray('users');

    var setUserData = function() {
      $rootScope.user = $rootScope.auth.$getAuth();

      userService.getUsername().then(function(data) {
        $rootScope.user.username = data;
      }, function(err) {
        console.err(err);
      });
    };

    setUserData();

    $rootScope.$on('auth-change', function() {
      setUserData();
    });

    $rootScope.$on('$routeChangeSuccess', function(newVal, oldVal) {
      if (oldVal !== newVal) {
        $rootScope.routeClassName = 'page-' + $route.current.className;
      }
    });
  });
