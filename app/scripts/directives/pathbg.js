'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashPathBg
 * @description
 * # unleashPathBg
 *
 * PLEASE NOTE:
 * I am very unhappy about the quality of this directive
 * as I wrote it in a very fast manner blindfolded.
 * ~ Wojtek
 * @todo This should be refactored soon
 */
angular.module('unleashApp')
  .directive('unleashPathBg', function () {
    var config = {
      gutter: {
        height: 280,
        first: 150,
        default: 260
      },
      margin: {
        top: 150,
        left: 40
      },
      cardsPerRow: 3,
      maxWidth: 860,
      strokeWidth: 7
    };

    var polylineHeight;

    var buildPolyline = function(length) {
      var polyline = config.gutter.default + ','+ config.margin.top;

      var rowCount = Math.ceil(length / config.cardsPerRow);
      var cardsInRow;
      var isOdd;
      var isFullRow;
      var hasMore;
      var newX, newY;

      for (var i = 0; i < rowCount; i++) {
        cardsInRow = Math.min(config.cardsPerRow, length - (i*config.cardsPerRow));
        isOdd = i % 2;
        isFullRow = cardsInRow === config.cardsPerRow;
        hasMore = length > (i + 1) * cardsInRow;

        if (!isOdd) {
          newX = isFullRow && hasMore ?
            config.maxWidth :
            config.gutter.first + (cardsInRow - 1) * config.gutter.default;

        } else {
          newX = isFullRow && hasMore ?
            config.margin.left :
            config.maxWidth - config.gutter.first - (cardsInRow - 1) * config.gutter.default;
        }

        newY = i * config.gutter.height + config.margin.top;

        polyline += ' ' +
          newX + ',' + newY;

        // Draw a corner
        if (isFullRow && hasMore) {
          newY = (i + 1) * config.gutter.height + config.margin.top;
          polyline += ' ' +
            newX + ',' + newY;
        }
      }

      polylineHeight = newY + config.strokeWidth;

      return polyline;
    };

    var linkFn = function postLink(scope) {
      var length = scope.path.goals.length;

      scope.bgPoints = buildPolyline(length);
      scope.polylineHeight = polylineHeight || 0;
      scope.stroke = {
        width: config.strokeWidth
      };
    };

    return {
      templateUrl: 'views/partials/pathbg.html',
      templateNamespace: 'svg',
      link: linkFn,
      scope: true
    };
  });
