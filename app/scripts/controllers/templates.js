'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:TemplatesController
 * @description
 * # TemplatesController
 * Controller of the unleashApp
 */
angular.module('unleashApp')
  .controller('TemplatesController', function ($scope, templatesService) {
    $scope.templates = {};
    $scope.templates.order = 'type';

    $scope.$watch(
      function() {
        return templatesService.newTemplates;
      }, function(newVal) {
        $scope.templates.new = newVal;
      }
    );

    templatesService.list.then(function(result) {
      $scope.templates.existing = result;
    });

    $scope.templates.add = function() {
      templatesService.newTemplates.push([]);
    };
  });
