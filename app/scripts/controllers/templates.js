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
    $scope.templates.order = 'name';
    $scope.templates.existing = [];
    $scope.templates.filtered = [];
    $scope.tags = [];
    $scope.currentFilter = null;

    $scope.$watch(
      function() {
        return templatesService.newTemplates;
      }, function(newVal) {
        $scope.templates.new = newVal;
      }
    );

    templatesService.list.then(function(result) {
      $scope.templates.existing = result;
      $scope.templates.filtered = result;
      for (var i = 0; i < result.length; i++) {
        if (result[i].tags) {
          $scope.tags = $scope.tags.concat(result[i].tags);
        }
      }
      $scope.tags.sort();
      $scope.tags = Array.from(new Set($scope.tags));
    });

    $scope.templates.add = function() {
      templatesService.newTemplates.push([]);
    };

    $scope.filter = function(tag) {
      $scope.currentFilter = tag;
      $scope.templates.filtered = [];
      $scope.templates.existing.map(function(template) {
        if (template.tags && template.tags.indexOf(tag) !== -1) {
          $scope.templates.filtered.push(template);
        }
      });
    };

    $scope.clearFilters = function() {
      $scope.templates.filtered = $scope.templates.existing;
      $scope.currentFilter = null;
    };
  });
