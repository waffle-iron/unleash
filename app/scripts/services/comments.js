'use strict';

/**
 * @ngdoc service
 * @name unleashApp.commentsService
 * @description
 * # comments
 * Factory in the unleashApp.
 */
angular.module('unleashApp')
  .factory('commentsService', function ($q, $http, PATHS_API_URL, growl, cardsService, userService, mailService, slackService) {

    return {
      /**
       * Add a comment
       * @param data An array containing a comment, its author and the card owner
       */
      add: function(data) {
        var defer = $q.defer();

        $http.post(
          PATHS_API_URL + '/' + data.cardOwnerId + '/goals/' + data.cardId + '/comments',
          {
              author: data.author.username,
              text: data.message
          }
        ).then(function(response) {
          // Notify Card Owner if someone else made a comment
          if (data.cardOwner.username !== data.author.username) {
            slackService.notifyCardOwner(data);
            mailService.notifyCardOwner(data);
          }
          defer.resolve(response.data.comments);
        }).catch(function() {
          console.error('There was a problem posting the comment.');
          defer.reject(new Error('There was a problem posting the comment.'));
        });

        return defer.promise;
      },

      /**
       * Add a reply to a comment
       * @param data Object containing a reply comment, its author, card owner and author of the parent comment
       */
      addReply: function(data) {
        var comments = [];
        var mailPromises = [];
        var slackPromises = [];

        var cardOwner = data.cardOwner.username,
            parentAuthor = data.parent.author.name; // Author of the comment, to which someone replied

        // Notify Card Owner only if someone else replied. Do not send, if parentAuthor == cardOwner
        if (data.author.username !== cardOwner && parentAuthor !== cardOwner) {
          mailPromises.push( mailService.notifyCardOwnerReply(data));
          slackPromises.push( slackService.notifyCardOwnerReply(data));
        }
        // Notify Comment Author if someone else replied
        if (parentAuthor !== data.author.username) {
          mailPromises.push( mailService.notifyCommentAuthor(data));
          slackPromises.push( slackService.notifyCommentAuthor(data));
        }

        return $http.post(
          PATHS_API_URL + '/' + data.cardOwnerId + '/goals/' + data.card.id + '/comments',
          {
              author: data.author.username,
              text: data.message,
              replyTo: data.parent.id
          }
        ).then(function (response) {
          comments = response.data.comments;
          var replies = [];
          comments.map(function(comment) {
            if (comment.id === data.parent.id) {
              replies = comment.replies;
            }
          });

          if ( replies.length > 1 ) {
            return replies[ replies.length - 2 ].author;
          }

          return data.parent.author.name;
        })
        .then(function(username) {
          return userService.getByUsername(username);
        })
        .then(function(previousAuthor) {
          previousAuthor.name = previousAuthor.username;

          if ( previousAuthor.name !== data.author.username ) {
            mailPromises.push( mailService.notifyReplyAuthor(data, previousAuthor));
            slackPromises.push( slackService.notifyReplyAuthor(data, previousAuthor));
          }
        })
        .then(function () {
          return $q.all([].concat(mailPromises, slackPromises));
        })
        .then(function() {
          return comments;
        }).catch(function() {
          console.error('There was a problem posting the reply.');
          growl.error('There was a problem posting the reply.');
        });
      }
    };
  });
