## Notes

Unit test scripts currently use PhantomJS 1.9.8 (latest version).

It contains a known bug related to triggering events: https://github.com/ariya/phantomjs/issues/11289

For this reason we are using obsolete `initMouseEvent` method in order to trigger click events.

PhantomJS 2.0 resolves that problem and it is coming out soon: https://groups.google.com/forum/#!msg/phantomjs-dev/4lu3FeGjCvE/9SCODuEPWmcJ

As soon as the new version is released, we can replace  existing `clickElement` function with its more modern equivalent:

```javascript
var clickElement = function (el){
  var event = new MouseEvent('click', {
    'view': window,
    'bubbles': true,
    'cancelable': true
  });
  el.dispatchEvent(event);
};
```
