'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashSkillView
 * @description
 * # unleashSkillView
 */
angular.module('unleashApp')
  .directive('unleashSkillView', function ($compile) {
    return {
      templateUrl: 'views/partials/skillView.html',
      scope: {
        skill: '='
      }
    };
  });
