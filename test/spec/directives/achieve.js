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
  var button;

  beforeEach(module('unleashApp'));
  beforeEach(module('views/home.html'));
  beforeEach(module('views/partials/achieve.html'));

  beforeEach(module(function($provide) {
    $provide.service('googleApi', function() {
      return {
        load: function(callback) {
        }
      }
    });
  }));

  beforeEach(inject(function($rootScope, $compile, PROFILES_API_URL, $httpBackend) {
    $httpBackend.when('GET', PROFILES_API_URL).respond('OK');
    element = angular.element('<unleash-achieve></unleash-achieve>');

    outerScope = $rootScope;

    outerScope.card = {};
    outerScope.card.achieved = false;
    outerScope.user = {
      username: 'test.user'
    };

    $compile(element)(outerScope);

    innerScope = element.isolateScope();

    outerScope.$digest();

    button = element.find('button')[0];
  }));

  describe('directive in unachieved state', function() {
    it('render a proper button label', function() {
      expect(button.innerHTML).to.equal('Mark as achieved');
    });
  });

  describe('directive in achieved state', function() {
    beforeEach(function() {
      outerScope.card.achieved = true;
      outerScope.$apply();
    });

    it('render a proper button label', function() {
      expect(button.innerHTML).to.equal('Mark as not achieved');
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
        clickElement(button);
      });

      it('should be called', function() {
        expect(mySpy.callCount).to.equal(1);
      });
    });
  });
});
