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
    'dndLists',
    'relativeDate',
    'angular-growl',
    'google.api',
    'LocalStorageModule',
    '720kb.datepicker'
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

.run(function($rootScope, $route, googleApi, $location, userService, googleService, localStorageService) {
  if (localStorageService.get('logged_in')) {
    $rootScope.initializing = true;
  }

  googleApi.load(function(auth2) {
    $rootScope.auth2 = auth2;

    $rootScope.auth2.isSignedIn.listen(function(signedIn) {
      $rootScope.initializing = true;
      if (signedIn) {
        userService.login(googleService.getCurrentUser())
          .then(function(user) {
            $rootScope.initializing = false;
            $rootScope.user = user;
            userService.list().then(function(users) {
              $rootScope.allUsers = users;
            });

            if ($rootScope.postLogInRoute) {
              $location.path($rootScope.postLogInRoute);
              $rootScope.postLogInRoute = null;
            }
          })
          .catch(function(error) {
            console.error(error);
          });
      } else {
        $rootScope.initializing = false;
        userService.logout();
      }
    });
  });

  $rootScope.$on('$routeChangeStart', function (event, nextRoute) {
    if (!$rootScope.user && nextRoute.authenticate) {
      $rootScope.postLogInRoute = $location.path();
      $location.path('/');
    }
  });

  $rootScope.$on('$routeChangeSuccess', function(newVal, oldVal) {
    if (oldVal !== newVal) {
      $rootScope.routeClassName = 'page-' + $route.current.className;
    }
  });
});
