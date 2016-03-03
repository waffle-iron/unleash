'use strict';

angular.module('unleashApp')
  .factory('slackService', function($http, FBURL, $q, userService, SLACK_CONFIG, $window) {
    var token = Math.random().toString(36).replace(/^../, ''),
        userId;

    userService.getUserDetails()
      .then(function(details) {
        return userService.getUserUid(details.username);
      })
      .then(function(uid) {
        userId = uid;
        new $window.Firebase(FBURL).child('slack').child(uid).set(token);
      });

    function notify(params) {
      if (!userId) {
        return;
      }
      var deferred = $q.defer();

      $http.post(SLACK_CONFIG.botUrl + '/notify', {
        uid: userId,
        token: token,
        text: params.text,
        queryString: params.queryString,
        attachments: params.attachments,
        user: params.user
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function () {
        deferred.reject('');
      });

      return deferred.promise;
    }

    var cardUrl = function (data) {
      return 'http://unleash.x-team.com/paths/' + data.cardOwner.name + '/?' + data.cardId;
    };

    return {
      /*jshint camelcase: false */
      notifyAchieved: function(data) {
        notify({
          text: '*' + data.cardOwner.fullName + '* has completed a goal! :sparkles:' +
            (data.additionalMessage ? ('\n' + data.additionalMessage) : ''),
          queryString: '/paths/' + data.cardOwner.name + '/?' + data.card.$id,

          attachments: [
            {
              color: 'good',
              fallback: data.cardOwner.fullName + ' has completed the ' + data.card.type + '* goal! :sparkles:',
              title: data.card.type || '',
              text: data.card.task || '',
              fields: [
                {
                  title: 'Level',
                  value: data.card.level || 'none',
                  short: true
                },
                {
                  title: 'Comments',
                  value: _.size(data.card.comments) || '0',
                  short: true
                }
              ],
              thumb_url: data.cardOwner.picture
            }
          ],
          user: 'general'
        });
      },
      notifyCardOwner: function(data) {
        notify({
          text: [
            'Hello, ' + data.cardOwner.name + '!',
            data.author.fullName + ' just commented on your "' + data.cardType + '" goal:',
            data.message,
            '<' + cardUrl(data) + '|Visit the Path to read the full conversation!>'
          ].join('\n'),
          user: '@' + data.cardOwner.email
        });
      },
      notifyCardOwnerReply: function(data) {
        notify({
          text: [
            'Hello, ' + data.cardOwner.name + '!',
            data.author.fullName + ' just replied to the comment on your "' + data.cardType + '" goal:',
            data.message,
            '<' + cardUrl(data) + '|Visit the Path to read the full conversation!>'
          ].join('\n'),
          user: '@' + data.cardOwner.email
        });
      },
      notifyCommentAuthor: function(data) {
        notify({
          text: [
            'Hello, ' + data.parent.author.name + '!',
            data.author.fullName + ' just replied to your comment on the "' + data.cardType + '" goal:',
            data.message,
            '<' + cardUrl(data) + '|Visit the Path to read the full conversation!>'
          ].join('\n'),
          user: '@' + data.parent.author.email
        });
      },
      notifyReplyAuthor: function(data, previousAuthor) {
        notify({
          text: [
            'Hello, ' + previousAuthor.name + '!',
            data.author.fullName + ' just replied to your reply to the comment on the "' + data.cardType + '" goal:',
            data.message,
            '<' + cardUrl(data) + '|Visit the Path to read the full conversation!>'
          ].join('\n'),
          user: '@' + previousAuthor.email
        });
      }
      /*jshint camelcase: false */
    };
  });
