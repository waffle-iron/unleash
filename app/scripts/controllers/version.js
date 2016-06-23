'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:VersionController
 * @description
 * # VersionController
 */
angular.module('unleashApp')
  .controller('VersionController', function ($scope, BUILD_NUMBER) {

    $scope.buildNumber = BUILD_NUMBER || 'local';

  });
