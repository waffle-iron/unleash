'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:SkillController
 * @description
 * # SkillController
 * Controller of the unleashApp
 */
angular.module('unleashApp')
  .controller('SkillController', function ($scope) {
    $scope.resources = [
      {
        url: 'http://onet.pl',
        description: 'test 123'

      },
      {
        url: 'http://wp.pl',
        description: 'test 234'
      }
    ];
  });
