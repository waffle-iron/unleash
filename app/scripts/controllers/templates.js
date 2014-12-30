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
    $scope.cards.new = [];
    $scope.cards.order = 'type';

    cardsService.list.then(function(result) {
      $scope.cards.existing = result;
    });

    $scope.cards.add = function() {
      $scope.cards.new.push([]);
    };

    $scope.cards.save = function() {
      var card = $scope.cards.new[index];

      cardsService.save(card).then(function() {
        $scope.cards.new.splice(index, 1);
        $scope.$apply();
      }, function(error) {
        console.log(error);
      });
    };
  });
