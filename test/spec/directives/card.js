'use strict';

describe('Directive: unleashCard', function () {

  var element;
  var outerScope;
  var innerScope;

  var card = {
    'name': 'Test card',
    'level': 1,
    'description': 'Test description'
  };

  beforeEach(module(function($provide) {
    var date = function(date) {
      if (date) {
        var internalDate = new Date(date);

        this.valueOf = function () {
          return +internalDate;
        }

        this.getTime = function() {
          return +internalDate;
        }
      } else {
        this.valueOf = function () {
          return 1442500100100; // 17 September 2015, 16:28:20
        }
      }
    };

    date.now = function() {
      return 1442500100100; // 17 September 2015, 16:28:20
    }

    $provide.value('$window', {
      Firebase: window.MockFirebase,
      Date: date
    });
  }));

  beforeEach(module('unleashApp'));

  beforeEach(module(function($provide) {
    $provide.service('cardsService', function() {
      return {
        getComments: function() {
          return {
            $loaded: function() {
              return { // Native promises are not implemented in PhantomJS.
                then: function() {}
              }
            }
          }
        }
      }
    });
  }));

  beforeEach(module('views/home.html'));
  beforeEach(module('views/partials/card.html'));


  beforeEach(inject(function($rootScope, $compile) {
    element = angular.element('<div data-card="card" unleash-card view="public" card-owner-id="1" ></div>');

    outerScope = $rootScope;

    outerScope.card = card;

    $compile(element)(outerScope);

    innerScope = element.isolateScope();

    outerScope.$digest();
  }));

  describe('card', function() {
    it('should render its name and description', function() {
      var cardType = element[0].querySelector('.card__type');

      expect(cardType.innerHTML).to.contain(card.name);
      expect(cardType.innerHTML).to.contain(card.description);
    });

    it('should render its level', function() {
      expect(element[0].querySelector('.card__level').innerHTML).to.equal('Level ' + card.level);
    });

    it('should display its description as title', function() {
      expect(element[0].getAttribute('title')).to.equal(card.description);
    });
  });

  describe('card with no level', function() {
    beforeEach(function() {
      outerScope.card.level = null;
      outerScope.$apply();
    });

    it('should not show current level', function() {
      expect(element[0].querySelectorAll('.card__level').length).to.equal(0);
    });
  });

  describe('unachieved card', function() {
    it('should not have achieved state', function() {
      expect(element[0].className.indexOf('card--is-achieved')).to.be.below(0);
    });
  });

  describe('achieved card', function() {
    beforeEach(function() {
      outerScope.card.achieved = true;
      outerScope.$apply();
    });

    it('should have achieved state', function() {
      expect(element[0].className.indexOf('card--is-achieved')).to.be.least(0);
    });
  });

  describe('card helper function', function() {
    it('should calculate the number of days left', function() {
      expect(element.isolateScope().daysLeft('21 September 2015 2:20')).to.equal(3);
    });

    it('should display zero when the achievement is overdue', function() {
      expect(element.isolateScope().daysLeft('16 September 2015 2:20')).to.equal(0);
    });

    it('should display a message when no due date is specified', function() {
      expect(element.isolateScope().daysLeft('')).to.equal('no due date');
    });
  });


});
