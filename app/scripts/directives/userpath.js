'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashUserPath
 * @description
 * # unleashUserPath
 */
angular.module('unleashApp')
  .directive('unleashUserPath', function ($window) {
    var cardWidth = 260;

    /**
     * Update the path’s DOM every time it’s resized
     * @param element
     */
    var setupPath = function(element) {
      var itemsPerRow = getItemsPerRow(element);

      updatePath(element, itemsPerRow);

      angular.element($window).bind('resize', function() {
        var currentItemsPerRow = getItemsPerRow(element);

        if (itemsPerRow !== currentItemsPerRow) {
          itemsPerRow = currentItemsPerRow;
          updatePath(element, itemsPerRow);
        }
      });
    };

    /**
     * Calculates the amount of items per row based on config
     * @param element
     * @returns {Number}
     */
    var getItemsPerRow = function(element) {
      var path = element.find('.path__cards');

      if(path.length) {
        return parseInt(path.width() / cardWidth, 10);
      }
    };

    /**
     * Wraps items in div.row elements to allow for easier CSS modifications
     * @param element
     * @param itemsPerRow
     */
    var updatePath = function(element, itemsPerRow) {
      var rows = element.find('.row');
      var cards = element.find('.card');
      var rowCount = Math.ceil(cards.length / itemsPerRow);

      if(!itemsPerRow || !cards.length) {
        return;
      }

      // Flatten rows
      if (rows.length) {
        element.find('.row .card').unwrap();
      }

      // Wrap cards in rows
      for (var i = 0; i < rowCount; i++) {
        var start = i * itemsPerRow;
        var stop = itemsPerRow + start;

        cards.slice(start, stop).wrapAll('<div class="row"></div>');
      }
    };

    var linkFn = function postLink(scope, element) {
      scope.$watch(
        function() {
          return element.find('.card').length;
        }, function(newValue) {
        if(newValue) {
          setupPath(element);
        }
      });
    };

    return {
      templateUrl: 'views/partials/userpath.html',
      restrict: 'E',
      link: linkFn
    };
  });
