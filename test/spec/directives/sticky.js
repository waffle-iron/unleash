'use strict';

describe('Directive: unleashSticky', function () {

  var element,
    outerScope,
    innerScope,
    timeoutCalled,
    timeoutCallback,
    events = {},
    control = {},
    timeoutMock = function(callback) {
      timeoutCallback = callback;
      timeoutCalled = true;
    };
  timeoutMock.cancel = function() {};

  beforeEach(module(function($provide) {
    $provide.value('$timeout', timeoutMock);

    $provide.value('$window', {
      Firebase: window.MockFirebase,
      addEventListener: function(event, callback) {
        events[event] = callback;
      },
      scrollY: 1000
    });

    $provide.value('$document', [
      {
        body: {
          scrollTop: 0
        }
      }
    ]);

    $provide.service('googleApi', function() {
      return {
        load: function(callback) {
        }
      }
    });
  }));
  beforeEach(module('unleashApp'));
  beforeEach(module('views/home.html'));


  beforeEach(inject(function($rootScope, $compile) {
    element = angular.element('<div unleash-sticky control="control"></div>');

    outerScope = $rootScope;

    outerScope.control = function() {
      return control
    }

    $compile(element)(outerScope);

    outerScope.$digest();


    innerScope = element.scope();

    timeoutCalled = false;
    timeoutCallback = null;

    control.freeze = false;
    control.tetherMode = false;
  }));

  describe( 'sticky', function () {

    it('should move element on scroll', function() {
      events['scroll']();
      expect(timeoutCalled).to.be.true();
      expect(timeoutCallback).not.to.be.null();
    });

    it('should not move element when frozen', function() {
      control.freeze = true;
      events['scroll']();
      expect(timeoutCalled).to.be.false();
    });

    it('should', function() {
      control.tetherMode = true;
      control.tetherTop = 100;

      // We need to freeze then unfreeze the sticky to enable tethering.
      control.freeze = true;
      events['scroll']();
      control.freeze = false;
      events['scroll']();

      var css = sinon.spy(jQuery.fn, 'css');
      timeoutCallback();
      expect(css.args[0][1]).to.equal(900); // Scroll position is 1000, tether length 100.
      css.restore();
    })
  });
});
