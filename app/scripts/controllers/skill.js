'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:SkillController
 * @description
 * # SkillController
 * Controller of the unleashApp
 */
angular.module('unleashApp')
  .controller('SkillController', function ($scope, $q, $routeParams, growl, resourceService, skillService, userService) {

    $scope.isLoading = true;

    var getSkills = skillService.getBySlug($routeParams.slug).then(function(skill) {
      if (typeof skill === 'undefined') {
        growl.error('Skill ' + $routeParams.slug + ' does not exist');
      }
      $scope.skill = skill;
    });

    var getResources = resourceService.listBySkill($routeParams.slug).then(function(result) {
      $scope.resources = result;
    });

    var getUsers = userService.findBySkill($routeParams.slug).then(function (users) {
      $scope.users = users;
    });

    $q.all([getSkills, getResources, getUsers]).then(function() {
      $scope.isLoading = false;
    });

  });
