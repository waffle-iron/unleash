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
    return new Promise(function(resolve, reject) {
      cards.stored.$set(data).then(function() {
        resolve(data);
      }, function(error) {
        reject(new Error(error));
      });
    });
  };

  return {
    // List initial cards
    list: new Promise(function(resolve, reject) {
      var list = cards.stored.$asArray();

      list.$loaded().then(function() {
        if (list.length) {
          resolve(list);
        }

        else {
          // No cards stored in Firebase, instantiate
          populateCards(cards.initial).then(function() {
            resolve(cards.initial);
          }, function(error) {
            reject(new Error(error));
          });
        }

      });
    }),

    edit: new Promise(function(resolve) {
      var result = cards.stored.$asObject();

      resolve(result);
    }),

    save: function(data) {
      return new Promise(function(resolve, reject) {
        if (!data || !data.type) {
          reject(new Error('No card data given.'));
        }

        else {
          var card = {
            'type': data.type,
            'task': data.task || '',
            'level': data.level || ''
          };

          cards.stored.$push(card).then(function(ref) {
            resolve(ref.key());
          }, function(error) {
            reject(error);
          });
        }
      });
    },

    closeSidebar: function() {
      angular.element(document.body).removeClass('has-menu');

      setTimeout(function() {
        angular.element('.achievement').remove();
      }, 250);
    }
  };
}]);
