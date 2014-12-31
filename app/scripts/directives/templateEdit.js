'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:templateEdit
 * @description
 * # templateEdit
 */
angular.module('unleashApp')
  .directive('unleashTemplateEdit', function (cardsService) {
    var getCardData = function(card) {
      return {
        'type': card.type,
        'level': card.level || '',
        'task': card.task || ''
      };
    };

    var cloneCardProps = function(scope) {
      scope.updated = {};

      ['type', 'level', 'task'].forEach(function(prop) {
        scope.updated[prop] = scope.card[prop];
      });
    };

    var save = function(id, data, element) {
      var card = getCardData(data);

      cardsService.update(id, card).then(function() {
        element.closest('li').removeClass('edit').addClass('view');
        element.remove();
      }, function(error) {
        console.error(error);
      });
    };

    var remove = function(id) {
      cardsService.removeStored(id);
    };

    return {
      templateUrl: 'views/partials/templateEdit.html',
      controller: function editController($scope) {
        cloneCardProps($scope);
      },
      link: function editLink(scope, element, attrs) {
        scope.save = function() {
          save(attrs.id, scope.updated, element);
        };

        scope.remove = function() {
          remove(attrs.id);
        };
      },
      transclude: true
    };
  });
