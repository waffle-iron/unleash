'use strict';
/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashSkillPersonAdd
 * @description
 * # unleashSkillPersonAdd
 */
angular.module('unleashApp')
  .directive('unleashSkillPersonAdd', function ($rootScope, userService) {

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

    var update = function(scope, skill, user) {
      userService.addSkillToUser(user, skill).then(function() {
        scope.users.push(user);
        scope.user = null;
        scope.allUsers = usersDiff(scope.allUsers, scope.users);
      });
    };

    return {
      templateUrl: 'views/partials/skillPersonAdd.html',
      link: function postLink(scope) {
        scope.allUsers = usersDiff($rootScope.allUsers, scope.users);
        scope.update = function(skill, user) {
          update(scope, skill, user);
        };
      },
      scope: {
        users: '=',
        skill: '='
      }
    };
  });
