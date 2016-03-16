'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:SkillController
 * @description
 * # SkillController
 * Controller of the unleashApp
 */
angular.module('unleashApp')
  .controller('SkillController', function ($scope, $routeParams, resourceService, skillService, userService) {

    resourceService.listBySkill($routeParams.slug).then(function(result) {
      $scope.resources = result;
    });

    userService.findBySkill($routeParams.slug).then(function (users) {
      $scope.users = users;
    });

    skillService.getBySlug($routeParams.slug).then(function(skill) {
      $scope.skill = skill;
    });

  });
