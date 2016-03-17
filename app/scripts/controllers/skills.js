'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:SkillsController
 * @description
 * # SkillsController
 * Controller of the unleashApp
 */
angular.module('unleashApp')
  .controller('SkillsController', function ($scope, skillService) {
    $scope.skills = [];

    skillService.list.then(function(result) {
      $scope.skills = result;
    });

    $scope.skill = {};

  });
