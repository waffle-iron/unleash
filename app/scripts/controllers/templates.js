/* global angular */
'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:TemplatesController
 * @description
 * # TemplatesController
 * Controller of the unleashApp
 */
angular.module('unleashApp')
  .controller('TemplatesController', function ($scope, cardsService) {
    $scope.cards = {};
    $scope.cards.order = 'type';

    $scope.$watch(
      function() {
        return cardsService.newCards;
      }, function(newVal) {
        $scope.cards.new = newVal;
      }
    );

    cardsService.list.then(function(result) {
      $scope.cards.existing = result;
      $scope.$apply();
    });

    $scope.cards.add = function() {
      cardsService.newCards.push([]);
    };

    $scope.cards.restore = function() {
      cardsService.restore();
    };
  });
