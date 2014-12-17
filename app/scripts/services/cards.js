'use strict';

var cardsService = angular.module('unleashApp.cardsService', ['firebase']);

cardsService.factory('cardsService', ['$window', 'FBURL', '$firebase', function($window, FBURL, $firebase) {
  var ref = new $window.Firebase(FBURL).child('cards');
  var cards = {};

  cards.stored = $firebase(ref.child('cards'));

  cards.initial = [
    {
      'type': 'Blogging',
      'level': 1,
      'task': 'Start tracking ideas'
    },
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

  var populateCards = function(data) {
    cards.stored.$set(data);

    return data;
  };

  return {
    // List initial cards
    list: new Promise(function(resolve) {
      ref.once('value', function(data) {
        if(data.val()) {
          // Cards already exist
          resolve(data.val());
        }
        else {
          // No cards stored in Firebase, instantiate
          resolve(populateCards(cards.initial));
        }
      });
    })
  };
}]);
