'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:NavController
 * @description
 * # NavController
 * Controller for the global navigation
 */
angular.module('unleashApp')
  .controller('NavController', function ($scope, fbutil) {
    $scope.newComments = $scope.user ? fbutil.syncArray('users/' + $scope.user.uid + '/newComments') : [];
  });
