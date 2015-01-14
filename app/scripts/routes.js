'use strict';
/**
 * @ngdoc overview
 * @name unleashApp:routes
 * @description
 * # routes.js
 *
 * Configure routes for use with Angular, and apply authentication security
 */
angular.module('unleashApp')

  .run(function($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function(event, next, previous, error) {
      if (error === 'AUTH_REQUIRED') {
        $location.path('/');
      }
    });
  })

  // configure views; the authRequired parameter is used for specifying pages
  // which should only be available while logged in
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        className: 'home',
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.$waitForAuth();
          }]
        }
      })

      .when('/account', {
        templateUrl: 'views/account.html',
        controller: 'AccountController',
        className: 'account',
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.$requireAuth();
          }]
        }
      })

      .when('/paths/:userId', {
        templateUrl: 'views/path.html',
        controller: 'SinglePathController',
        className: 'path',
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.$waitForAuth();
          }]
        }
      })

      .when('/templates', {
        templateUrl: 'views/templates.html',
        controller: 'TemplatesController',
        className: 'templates',
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.$requireAuth();
          }]
        }
      })

      .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);
  });
