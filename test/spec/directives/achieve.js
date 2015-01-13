'use strict';

var clickElement = function (el){
  var ev = document.createEvent('MouseEvent');
  ev.initMouseEvent(
    'click',
    true, true
  );
  el.dispatchEvent(ev);
};

describe('Directive: unleashAchieve', function () {

  var element;
  var mySpy;
  var outerScope;
  var innerScope;

  beforeEach(module('unleashApp'));
  beforeEach(module('views/home.html'));

  beforeEach(inject(function($rootScope, $compile) {
    element = angular.element('<unleash-achieve></unleash-achieve>');

    outerScope = $rootScope;

    outerScope.card = {};
    outerScope.card.achieved = false;

    $compile(element)(outerScope);

    innerScope = element.isolateScope();

    outerScope.$digest();
  }));

  describe('directive in unachieved state', function() {
    it('render a proper button label', function() {
      expect(element[0].innerHTML).to.equal('Mark as achieved');
    });
  });

  describe('directive in achieved state', function() {
    beforeEach(function() {
      outerScope.card.achieved = true;
      outerScope.$apply();
    });

    it('render a proper button label', function() {
      expect(element[0].innerHTML).to.equal('Mark as not achieved');
    });
  });

  describe('click callback', function() {
    var cardsService;

    beforeEach(inject(function($injector) {
      mySpy = sinon.spy();
      cardsService = $injector.get('cardsService');

      cardsService.toggleAchieved = function() {
        mySpy();

        return {
          then: function(callback) {
            return callback;
          }
        };
      };
    }));

    describe('when the directive is clicked', function() {
      beforeEach(function() {
        clickElement(element[0]);
      });

      it('should be called', function() {
        expect(mySpy.callCount).to.equal(1);
      });
    });
  });
});
