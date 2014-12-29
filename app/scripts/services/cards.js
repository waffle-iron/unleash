'use strict';

var cardsService = angular.module('unleashApp.cardsService', ['firebase']);

cardsService.factory('cardsService', ['$window', 'FBURL', '$firebase', function($window, FBURL, $firebase) {
  var ref = new $window.Firebase(FBURL).child('cards');
  var cards = {};

  cards.stored = $firebase(ref);

  cards.initial = [
    {
      'type': 'Blogging',
      'level': 1,
      'task': 'Start tracking ideas'
    },
    {
      'type': 'Meetup Attender',
      'task': 'Attend at least 1 meeting'
    },
    {
      'type': 'Meetup Speaker',
      'task': 'Speak at a meetup'
    },
    {
      'type': 'Conference Speaker',
      'task': 'Speak at a conference'
    },
    {
      'type': 'Open Source Contributor',
      'task': 'Contribute to an Open Source project'
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
    }),
    closeSidebar: function() {
      angular.element(document.body).removeClass('has-menu');

      setTimeout(function() {
        angular.element('.achievement').remove();
      }, 250);
    }
  };
}]);
