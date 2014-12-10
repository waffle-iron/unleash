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

  .run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
      if (error === "AUTH_REQUIRED") {
        $location.path("/");
      }
    });
  }])

  // configure views; the authRequired parameter is used for specifying pages
  // which should only be available while logged in
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'HomeCtrl',
        resolve: {
          "currentAuth": ['Auth', function(Auth) {
            return Auth.$waitForAuth();
          }]
        }
      })

      .when('/path', {
        templateUrl: 'views/path.html',
        controller: 'PathCtrl',
        resolve: {
          "currentAuth": ['Auth', function(Auth) {
            return Auth.$requireAuth();
          }]
        }
      })

      .otherwise({redirectTo: '/'});
  }]);
