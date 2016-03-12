'use strict';
/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashSkillAdd
 * @description
 * # unleashSkillAdd
 */
angular.module('unleashApp')
  .directive('unleashSkillAdd', function (skillService) {

    var add = function(scope, skill) {
      skillService.add(skill).then(function () {
        // do nothing
      }, function (error) {
        console.error(error);
      });
    };

    return {
      templateUrl: 'views/partials/skillAdd.html',
      link: function postLink(scope) {
        scope.add = function(skill) {
          add(scope, skill);
        };
      },
      scope: {
        skill: '='
      }
    };
  });
