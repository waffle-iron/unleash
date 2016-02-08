'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:SkillsController
 * @description
 * # SkillsController
 * Controller of the unleashApp
 */
angular.module('unleashApp')
  .controller('SkillsController', function ($scope) {
    $scope.skills = [
      {
        name: 'React',
        icon: 'test'
      },
      {
        name: 'Angular',
        icon: 'test'
      }
    ];
  });
