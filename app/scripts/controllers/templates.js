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

    $scope.cards.edit = function(index) {
      var template = angular.element('.templates li').eq(index);
      console.log(template.find('input').eq(0).val());
    };

    $scope.cards.save = function(index) {
      var card = $scope.cards.new[index];

      cardsService.save(card).then(function() {
        $scope.cards.new.splice(index, 1);
        $scope.$apply();
      }, function(error) {
        console.log(error);
      });
    };
  });
