'use strict';
/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashSkillPersonAdd
 * @description
 * # unleashSkillPersonAdd
 */
angular.module('unleashApp')
  .directive('unleashSkillPersonAdd', function (skillService) {

    var update = function(scope, skill, username) {
      skillService.addUserToSkill(skill, username);
      scope.username = '';
    };

    return {
      templateUrl: 'views/partials/skillPersonAdd.html',
      link: function postLink(scope) {
        scope.update = function(skill, username) {
          update(scope, skill, username);
        };
      },
      scope: {
        skill: '='
      }
    };
  });
