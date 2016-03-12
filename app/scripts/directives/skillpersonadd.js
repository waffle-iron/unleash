'use strict';
/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashSkillPersonAdd
 * @description
 * # unleashSkillPersonAdd
 */
angular.module('unleashApp')
  .directive('unleashSkillPersonAdd', function ($rootScope, skillService, userService) {

    var usersDiff = function (allUsers, addedUsers) {
      return allUsers.filter(function (user) {
        for (var i in addedUsers) {
          if (addedUsers[i].username === user.username) {
            return null;
          }
        }
        return user;
      });
    };

    var update = function(scope, skill, username) {
      skillService.addUserToSkill(skill, username);
      userService.findByUsernames([username]).then(function (users) {
        scope.users.push(users.shift());
        scope.user = null;
        scope.allUsers = usersDiff(scope.allUsers, scope.users);
      });
    };

    return {
      templateUrl: 'views/partials/skillPersonAdd.html',
      link: function postLink(scope) {
        scope.allUsers = usersDiff($rootScope.allUsers, scope.users);
        scope.update = function(skill, username) {
          update(scope, skill, username);
        };
      },
      scope: {
        users: '=',
        skill: '='
      }
    };
  });
