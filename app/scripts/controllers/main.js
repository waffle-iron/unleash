'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the unleashApp
 */
angular.module('unleashApp')
  .controller('HomeController', ['$scope', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
