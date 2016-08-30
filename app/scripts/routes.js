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
  .config(function($locationProvider, $routeProvider, $analyticsProvider, ANALYTICS_ENABLED) {
    $analyticsProvider.developerMode(!ANALYTICS_ENABLED);
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        className: 'home'
      })

      .when('/paths/:userId/', {
        templateUrl: 'views/user.html',
        controller: 'SingleUserController',
        className: 'paths',
        reloadOnSearch: false,
        authenticate: true
      })

      .when('/paths/:userId/edit', {
        templateUrl: 'views/edit.html',
        controller: 'EditPathController',
        className: 'edit',
        reloadOnSearch: false,
        authenticate: true
      })

      .when('/templates', {
        templateUrl: 'views/templates.html',
        controller: 'TemplatesController',
        className: 'templates',
        authenticate: true
      })

      .when('/skills', {
        templateUrl: 'views/skills.html',
        controller: 'SkillsController',
        className: 'skills',
        authenticate: true
      })

      .when('/skills/:slug/', {
        templateUrl: 'views/skill.html',
        controller: 'SkillController',
        className: 'skill',
        authenticate: true
      })

      .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);
  });
