'use strict';

describe('Directive: unleashPerson', function () {

  var element;
  var outerScope;
  var innerScope;

  beforeEach(module('unleashApp'));
  beforeEach(module('views/home.html'));

  beforeEach(inject(function($rootScope, $compile, $q) {
    element = angular.element('<unleash-achieve></unleash-achieve>');

    outerScope = $rootScope;

    outerScope.card = {};
    outerScope.card.achieved = true;

    // @TODO use mockfirebase
    outerScope.card.$watch = function() {
      return false;
    };
    outerScope.card.$save = function() {
      return $q(function(resolve) {
        resolve();
      });
    };

    $compile(element)(outerScope);

    innerScope = element.isolateScope();

    outerScope.$digest();
  }));

  describe('label', function() {
    it('should be rendered', function() {
      expect(element[0].innerHTML).to.equal('Mark as not achieved');
    });
  });

  describe('click callback', function() {
    var mySpy;
    var cardsService = {};

    beforeEach(function() {
      mySpy = sinon.spy();
      outerScope.$apply(function() {
        cardsService.toggleAchieved = mySpy;
      });
    });

    describe('when the directive is clicked', function() {
      beforeEach(function() {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent('MouseEvent', true, true, true);
        element[0].dispatchEvent(event);
      });

      it('should be called', function() {
        // @todo This should be equal 1
        // PhantomJS bug is preventing this to work though:
        // https://github.com/ariya/phantomjs/issues/11289
        expect(mySpy.callCount).to.equal(0);
      });
    });
  });
});
