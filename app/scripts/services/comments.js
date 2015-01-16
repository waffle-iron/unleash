'use strict';

/**
 * @ngdoc service
 * @name unleashApp.commentsService
 * @description
 * # comments
 * Factory in the unleashApp.
 */
angular.module('unleashApp')
  .factory('commentsService', function ($window, FBURL, $firebase, $q, growl, cardsService, userService) {
    var ref = null;
    var currentUser = null;
    var currentUserId = null;
    var card = {};
    var comments = [];

    return {
      /**
       * Setup the service
       * @param userId ID of the owner of the card
       * @param cardId Card ID
       * @returns {*}
       */
      setup: function(userId, cardId) {
        return $q(function(resolve, reject) {

          if(userId && cardId) {
            // Initialize setup

            ref = new $window.Firebase(FBURL).child('users').child(userId).child('cards').child(cardId);
            card = $firebase(ref).$asObject();
            comments = $firebase(ref.child('comments')).$asArray();

            currentUserId = userId;

            userService.getUsername(currentUserId).then(function(username) {
              currentUser = username;
            });

            comments.$loaded().then(function() {
              resolve();
            });
          }

          else if(currentUserId) {
            // Setup has already been done
            resolve();
          }

          else {
            growl.error('You need to setup the comments service first.');

            reject();
          }

        });
      },

      /**
       * List comments
       * @returns {Promise} Comments
       */
      list: function() {
        var self = this;

        return $q(function(resolve) {
          self.setup().then(function() {
            resolve(comments);
          });
        });
      },

      /**
       * Add a comment
       * @param newComment
       * @param user
       */
      add: function(data) {
        if (data.message) {
          // push a message to the end of the array
          comments.$add({
            text: data.message,
            author: data.author,
            timestamp: $window.Firebase.ServerValue.TIMESTAMP
          })
            .then(function(ref) {
              if(data.author !== currentUser) {
                cardsService.iterateCommentCount(ref);
              }
            })
            // display any errors
            .catch(growl.error);
        }
      }
    };
  });
