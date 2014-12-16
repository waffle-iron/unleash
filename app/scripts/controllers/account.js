'use strict';

angular.module('unleashApp')
  .controller('AccountController', ['$scope', 'fbutil', function ($scope, fbutil) {
    $scope.cards = {};
    $scope.cards.dropped = [];

    //$scope.cards = cardsService.list();
    $scope.cards.initial = fbutil.syncArray('cards');

    // Handle drag and drop interface
    $scope.onDropComplete = function(data){
      var index = $scope.cards.dropped.indexOf(data);
      if (index === -1) {
        $scope.cards.dropped.push(data);
      }
    };
    $scope.onDragSuccess = function(data){
      var index = $scope.cards.dropped.indexOf(data);
      if (index > -1) {
        $scope.cards.dropped.splice(index, 1);
      }
    };

  }]);
