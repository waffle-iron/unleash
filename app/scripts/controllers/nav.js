'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:NavController
 * @description
 * # NavController
 * Controller for the global navigation
 */
angular.module('unleashApp')
  .controller('NavController', function ($rootScope, $scope) {
    $scope.newComments = $rootScope.user ? [] : [];
  });
