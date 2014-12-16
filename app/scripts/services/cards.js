'use strict';

var cardsService = angular.module('unleashApp.cardsService', ['firebase']);

cardsService.factory('cardsService', ['$window', 'FBURL', function($window, FBURL) {
  var ref = new $window.Firebase(FBURL);
  var cards = ref.child('cards');

  var populateCards = function() {
    var initial = [
      {
        'type': 'Blogging',
        'level': 1,
        'task': 'Start tracking ideas'
      },
      //{
      //  'type': 'Blogging',
      //  'level': 2,
      //  'task': 'Start drafting 1 idea'
      //},
      //{
      //  'type': 'Blogging',
      //  'level': 3,
      //  'task': 'Publish a blog post'
      //},
      //{
      //  'type': 'Blogging',
      //  'level': 4
      //},
      {
        'type': 'Meetup Attender'
      },
      {
        'type': 'Meetup Speaker'
      },
      {
        'type': 'Conference Speaker'
      },
      {
        'type': 'Open Source Contributor'
      },
      {
        'type': 'Proactive',
        'level': 1
      },
      {
        'type': 'Mentoring',
        'level': 1
      },
      {
        'type': 'Leadership',
        'level': 1
      },
      {
        'type': 'Open Source Advocate',
        'level': 1
      }
    ];

    cards.set(initial);
    return initial;
  };

  return {
    list: function() {

      cards.on('value', function(snapshot) {
        if(snapshot.val()) {
          return(snapshot.val());
        }

        else {
          populateCards();
        }
      });

    }
  };
}]);
