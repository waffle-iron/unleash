'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:SkillController
 * @description
 * # SkillController
 * Controller of the unleashApp
 */
angular.module('unleashApp')
  .controller('SkillController', function ($scope, $routeParams, growl, resourceService, skillService, userService) {

    skillService.getBySlug($routeParams.slug).then(function(skill) {
      if (typeof skill === 'undefined') {
        growl.error('Skill ' + $routeParams.slug + ' does not exist');
      }
      $scope.skill = skill;
    });

    resourceService.listBySkill($routeParams.slug).then(function(result) {
      $scope.resources = result;
    });

    userService.findBySkill($routeParams.slug).then(function (users) {
      $scope.users = users;
    });

  });
