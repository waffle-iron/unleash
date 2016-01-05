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
      notifyAchieved: function(data) {
        notify({
          text: data.card.type + 'owned by ' + data.cardOwner.name + ' was marked as achieved by ' + data.currentUser +
          (data.additionalMessage ? ('\n' + data.additionalMessage) : ''),
          user: 'general'
        });
      },
      notifyCardOwner: function(data) {
        notify({
          text: [
            'Hello, ' + data.cardOwner.name,
            data.author + ' just commented your "' + data.cardType + '" step:',
            data.message,
            '<' + cardUrl(data) + '|Visit your Path to read the full conversation!>'
          ].join('\n'),
          user: '@' + data.cardOwner.email
        });
      },
      notifyCardOwnerReply: function(data) {
        notify({
          text: [
            'Hello, ' + data.cardOwner.name,
            data.author + ' just replied to the comment on your "' + data.cardType + '" step:',
            data.message,
            '<' + cardUrl(data) + '|Visit your Path to read the full conversation!>'
          ].join('\n'),
          user: '@' + data.cardOwner.email
        });
      },
      notifyCommentAuthor: function(data) {
        notify({
          text: [
            'Hello, ' + data.parent.author.name,
            data.author + ' just replied to the comment on your "' + data.cardType + '" step:',
            data.message,
            '<' + cardUrl(data) + '|Visit your Path to read the full conversation!>'
          ].join('\n'),
          user: '@' + data.parent.author.email
        });
      },
      notifyReplyAuthor: function(data) {

      }
    };
  });
