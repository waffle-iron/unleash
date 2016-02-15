'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:SkillController
 * @description
 * # SkillController
 * Controller of the unleashApp
 */
angular.module('unleashApp')
  .controller('SkillController', function ($scope, $routeParams, resourceService) {

    resourceService.listBySkill($routeParams.skillId).then(function(result) {
      $scope.resources = result;
    });

    $scope.resource = {
      skill: $routeParams.skillId
    };

  });
