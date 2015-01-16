'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:NavController
 * @description
 * # NavController
 * Controller for the global navigation
 */
angular.module('unleashApp')
  .controller('NavController', function ($rootScope, $scope, fbutil) {
    $scope.newComments = fbutil.syncArray('users/' + $rootScope.user.uid + '/newComments');
  });
