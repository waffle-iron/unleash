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

    resourceService.listBySkill($routeParams.skillId).then(function(result) {
      $scope.resources = result;
    });

    skillService.findUsernamesBySkill($routeParams.skillId).then(function (usernames) {
      userService.findByUsernames(usernames).then(function (users) {
        $scope.users = users;
      });
    });

    $scope.skill = {
      id: $routeParams.skillId
    };

    skillService.getSkillNameById($routeParams.skillId).then(function(data) {
      $scope.skill.name = data;
    });
  });
