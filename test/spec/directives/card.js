'use strict';

describe('Directive: unleashCard', function () {

  var element;
  var outerScope;
  var innerScope;

  var card = {
    'type': 'Test card',
    'level': 1,
    'task': 'Test task'
  };

  beforeEach(module('unleashApp'));
  beforeEach(module('views/home.html'));
  beforeEach(module('views/partials/card.html'));

  beforeEach(inject(function($rootScope, $compile) {
    element = angular.element('<div data-card="card" unleash-card></div>');

    outerScope = $rootScope;

    outerScope.card = card;

    $compile(element)(outerScope);

    innerScope = element.isolateScope();

    outerScope.$digest();
  }));

  describe('card', function() {
    it('should render its type', function() {
      expect(element[0].querySelector('.card__type').innerHTML).to.equal(card.type);
    });

    it('should render its level', function() {
      expect(element[0].querySelector('.card__level').innerHTML).to.equal('Level ' + card.level);
    });

    it('should display its task description as title', function() {
      expect(element[0].getAttribute('title')).to.equal(card.task);
    })
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
});
