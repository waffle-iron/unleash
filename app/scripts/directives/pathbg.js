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
 *
 * Known bugs:
 * - Both jQuery and Angular throw an error
 *   as the SVG is being rendered before bgPoints
 *   variable is available.
 */
angular.module('unleashApp')
  .directive('unleashPathBg', function ($log) {
    var config = {
      gutter: {
        height: 270,
        first: 150,
        default: 260
      },
      margin: {
        top: 310,
        left: 40
      },
      cardsPerRow: 3,
      maxWidth: 860
    };

    var buildPolyline = function(length) {
      var polyline = config.margin.left + ',0 ' +
                     config.margin.left + ',' + config.margin.top;

      var rowCount = Math.ceil(length / config.cardsPerRow);
      var cardsInRow;
      var isOdd;
      var isFullRow;
      var hasMore;
      var newX;

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

        polyline += ' ' +
          newX + ',' +
          (i * config.gutter.height + config.margin.top);

        // Draw a corner
        if (isFullRow && hasMore) {
          polyline += ' ' +
            newX + ',' +
            ((i + 1) * config.gutter.height + config.margin.top);
        }
      }

      return polyline;
    };

    var linkFn = function postLink(scope) {
      var length = scope.cards.length;

      scope.bgPoints = buildPolyline(length);

      $log.info('Hi there! Hope you like this app. Please ignore the SVG error for now, it will be fixed ASAP. :-) ~Wojtek');
    };

    return {
      templateUrl: 'views/partials/pathbg.html',
      templateNamespace: 'svg',
      link: linkFn,
      scope: true
    };
  });
