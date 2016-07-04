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
    $provide.service('googleApi', function() {
      return {
        load: function(callback) {
        }
      }
    });
  }));

  beforeEach(inject(function($rootScope, $compile, PROFILES_API_URL, $httpBackend, $q) {
    $httpBackend.expectGET(PROFILES_API_URL).respond(200, 'OK');
    element = angular.element('<div unleash-cards-add></div>');

    outerScope = $rootScope;

    outerScope.paths = [{id: 1}];

    fail = false;
    manual = false;

    $compile(element)(outerScope);

    innerScope = element.scope();
    innerScope.addCard = function(card, pathId) {
      var deferred = $q.defer();
      if (outerScope.paths[0].goals) {
          outerScope.paths[0].goals.push(card);
      } else {
        outerScope.paths[0].goals = [card];
      }
      deferred.resolve();

      return deferred.promise;
    };

    outerScope.$digest();
  }));

  describe('quick cards', function() {
    it('should create one blank card on create', function() {
      innerScope.create();

      expect(innerScope.newCards).to.deep.equal([
        {path: {id: 1}},
      ]);
    });

    it('should fail gracefully', function() {
      innerScope.create();
      expect(innerScope.newCards).to.deep.equal([
        {path: {id: 1}},
      ]);

      fail = true;
      innerScope.add(innerScope.newCards[0]);

      expect(innerScope.newCards[0].path.id).to.equal(1);
      expect(innerScope.newCards[0].order).to.equal(1);
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
        { name: 'name1', path: {id: 1}},
        { name: 'name2', path: {id: 1} },
        { name: 'name3', path: {id: 1} },
        { name: 'name4', path: {id: 1} }
      ]);

      innerScope.remove(2);

      expect(innerScope.newCards).to.deep.equal([
        { name: 'name1', path: {id: 1} },
        { name: 'name2', path: {id: 1} },
        { name: 'name4', path: {id: 1} }
      ]);
    });

    it('should give the card an "order" property before adding', function() {
      innerScope.create();
      expect(innerScope.newCards.length).to.equal(1);

      manual = true;

      innerScope.add(innerScope.newCards[0]);

      expect(innerScope.newCards[0].order).to.equal(1);
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
        { name: 'name1', path: {id: 1} },
        { name: 'name2', path: {id: 1} },
        { name: 'name3', path: {id: 1} },
        { name: 'name4', path: {id: 1} }
      ]);

      innerScope.add(innerScope.newCards[0]);
      innerScope.add(innerScope.newCards[1]);
      innerScope.add(innerScope.newCards[2]);
      innerScope.add(innerScope.newCards[3]);

      expect(innerScope.newCards[0].order).to.equal(1);
      expect(innerScope.newCards[1].order).to.equal(2);
      expect(innerScope.newCards[2].order).to.equal(3);
      expect(innerScope.newCards[3].order).to.equal(4);
    });
  });

});
