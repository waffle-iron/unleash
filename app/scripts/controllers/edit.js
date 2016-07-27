/**
 * @ngdoc function
 * @name unleashApp.controller:EditPathController
 * @todo Implement thee-way data binding to fully remove flickering
 * @description
 * # EditPathController
 * Controls data for the /account page
 */

'use strict';
angular.module('unleashApp')
  .controller('EditPathController', function ($window, $document, $rootScope, $scope, $location, $routeParams, growl, templatesService, cardsService, userService) {
    $scope.params = $routeParams;
    $scope.templates = {
      available: [],
      filtered: []
    };
    $scope.paths = [];
    $scope.tags = [];
    $scope.bookmarkTop = 0;
    $scope.showTemplates = true;

    if (!$rootScope.user.isAdmin && $rootScope.user.username !== $routeParams.userId) {
      growl.error('You are not authorized to see this page!');

      $location.path('/');
    }

    var setupPath = function(uid) {
      // List cards that user has been assigned with
      cardsService.listPaths(uid).then(function(paths) {
        $scope.paths = paths;
      }).catch(function(error) {
        console.error(error);
      });
    };

    // List templates that are still available to use for the current user
    var getTemplates = function() {
      templatesService.list.then(function(templates) {
        $scope.templates.available = templates;
        $scope.templates.filtered = templates;
        for (var i = 0; i < templates.length; i++) {
          if (templates[i].tags) {
            $scope.tags = $scope.tags.concat(templates[i].tags);
          }
        }
        $scope.tags.sort();
        $scope.tags = Array.from(new Set($scope.tags));
      }).catch(function(error) {
        console.error(error);
      });
    };

    userService.getByUsername($routeParams.userId).then(function(user) {
      $scope.currentUser = user.id;
      $scope.currentPathOwner = user;
      setupPath(user.id);
      getTemplates();
    });

    // Handle drag and drop interface
    $scope.dropCard = function(event, index, card, external, type) {
      var pathId = event.target.id ? event.target.id : event.target.parentNode.id;
      if (type === 'template') {
        card.order = index + 1;
        cardsService.addFromTemplate(pathId, card).then(function(cards) {
          angular.forEach($scope.paths, function(path) {
            if (path.id === pathId) {
              path.goals = cards;
            }
          });
        });
      }

      if (type === 'card') {
        cardsService.move(pathId, card, index).then(function(paths) {
          $scope.paths = paths;
        });
      }

      return false;
    };

    // @todo Temporary fix to remove available cards flickering
    $scope.removeAvailable = function(index) {
      $scope.templates.available.splice(index, 1);
    };

    $scope.addCard = function(card, pathId) {
      return cardsService.add(pathId, card).then(function(cards) {
        angular.forEach($scope.paths, function(path) {
          if (path.id === pathId) {
            path.goals = cards;
          }
        });
      });
    };

    $scope.removeCard = function(card, pathId) {
      cardsService.remove(pathId, card).then(function(paths) {
        $scope.paths = paths;
      });
    };

    $scope.editCard = function(card, pathId) {

    };

    $scope.toggleCards = function() {
      $scope.showTemplates = !$scope.showTemplates;
    };

    $scope.controlTemplates = function() {
      var top =  $scope.bookmarkTop - $window.innerHeight / 2;
      return {
          freeze: ($window.scrollY || $document[0].body.scrollTop) > top,
          freezeTop: top
      };
    };

    $scope.controlCards = function() {
      var top =  $scope.bookmarkTop - $window.innerHeight / 2;
      return {
        freeze: ($window.scrollY || $document[0].body.scrollTop) < top,
        tetherMode: true,
        tetherTop: top
      };
    };

    $scope.createPath = function() {
      cardsService.createPath($scope.currentUser).then(function(paths) {
        $scope.paths = paths;
      });
    };

    $scope.filter = function(tag) {
      $scope.currentFilter = tag;
      $scope.templates.filtered = [];
      $scope.templates.available.map(function(template) {
        if (template.tags && template.tags.indexOf(tag) !== -1) {
          $scope.templates.filtered.push(template);
        }
      });
    };

    $scope.editPathName = function(event) {
      if (event.keyCode === 13) {
        growl.info('Updating path name');
        var name = event.target.value;
        var id = event.target.name.replace('path_', '');
        cardsService.updatePath(id, {name: name})
          .then(function() {
            growl.success('Path name updated successfully');
          })
          .catch(function() {
            growl.error('There was an error updating the path name');
          });
      }
    };

    $scope.clearFilters = function() {
      $scope.templates.filtered = $scope.templates.available;
      $scope.currentFilter = null;
    };
  });
