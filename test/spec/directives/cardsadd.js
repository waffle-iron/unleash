'use strict';

describe('Directive: unleashCardsAdd', function () {

  var element,
      outerScope,
      innerScope,
      cards,
      fail,
      manual,
      lastCallback,
      lastError,
      errorMessage = 'Ignore this message';

  beforeEach(module('unleashApp'));
  beforeEach(module('views/home.html'));
  beforeEach(module('views/partials/cardsAdd.html'));
  beforeEach(module('views/partials/templateIconsModal.html'));

  beforeEach(module(function($provide) {
    $provide.value('cardsService', {
      add: function(cardOwnerId, card) {
        if (!fail) {
          outerScope.cards.push(card);
        }

        return {
          then: function(callback, error) {
            if (manual) {
              lastCallback = callback;
              lastError    = error;
              return;
            }

            if (fail)
              error(errorMessage);
            else
              callback();
          }
        }
      }
    });
  }));

  beforeEach(inject(function($rootScope, $compile) {
    element = angular.element('<div unleash-cards-add></div>');

    outerScope = $rootScope;

    outerScope.cards = [];

    fail = false;
    manual = false;

    $compile(element)(outerScope);

    innerScope = element.scope();

    outerScope.$digest();
  }));

  describe('quick cards', function() {
    it('should create one blank card on create', function() {
      innerScope.create();

      expect(innerScope.newCards).to.deep.equal([
        {},
      ]);
    });

    it('should fail gracefully', function() {
      innerScope.create();
      expect(innerScope.newCards).to.deep.equal([
        {},
      ]);

      fail = true;
      innerScope.add(innerScope.newCards[0]);

      expect(innerScope.newCards).to.deep.equal([
        {},
      ]);

      expect(outerScope.cards).to.deep.equal([]);
    });

    it('should remove the specified card', function() {
      innerScope.create();
      innerScope.newCards[0].name = 'name1';

      innerScope.create();
      innerScope.newCards[1].name = 'name2';

      innerScope.create();
      innerScope.newCards[2].name = 'name3';

      innerScope.create();
      innerScope.newCards[3].name = 'name4';

      expect(innerScope.newCards).to.deep.equal([
        { name: 'name1' },
        { name: 'name2' },
        { name: 'name3' },
        { name: 'name4' }
      ]);

      innerScope.remove(2);

      expect(innerScope.newCards).to.deep.equal([
        { name: 'name1' },
        { name: 'name2' },
        { name: 'name4' }
      ]);
    });

    it('should give the card an "order" property before adding', function() {
      innerScope.create();
      expect(innerScope.newCards.length).to.equal(1);

      manual = true;

      innerScope.add(innerScope.newCards[0]);

      expect(innerScope.newCards).to.deep.equal([
        { order: 1 },
      ]);

      lastCallback();

      expect(innerScope.newCards).to.deep.equal([]);
    });

    it('should remove the "order" property on failure', function() {
      innerScope.create();
      expect(innerScope.newCards.length).to.equal(1);

      manual = true;

      innerScope.add(innerScope.newCards[0]);

      expect(innerScope.newCards).to.deep.equal([
        { order: 1 },
      ]);

      try {
        lastError(errorMessage);
      } catch (e) {
        console.log('error');
      }

      expect(innerScope.newCards).to.deep.equal([
        {},
      ]);

    });

    it('should place each new card at the end', function() {
      manual = true;
      innerScope.create();
      innerScope.newCards[0].name = 'name1';

      innerScope.create();
      innerScope.newCards[1].name = 'name2';

      innerScope.create();
      innerScope.newCards[2].name = 'name3';

      innerScope.create();
      innerScope.newCards[3].name = 'name4';

      expect(innerScope.newCards).to.deep.equal([
        { name: 'name1' },
        { name: 'name2' },
        { name: 'name3' },
        { name: 'name4' }
      ]);

      innerScope.add(innerScope.newCards[0]);
      innerScope.add(innerScope.newCards[1]);
      innerScope.add(innerScope.newCards[2]);
      innerScope.add(innerScope.newCards[3]);

      expect(outerScope.cards).to.deep.equal([
        { name: 'name1', order: 1 },
        { name: 'name2', order: 2 },
        { name: 'name3', order: 3 },
        { name: 'name4', order: 4 }
      ]);
    });
  });

});
