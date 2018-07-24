> As of version `1.0.0` this library exposes ES modules. Use an ES module aware transpiler such as Webpack, Rollup or Browserify + babelify to bundle it for the browser.

# scroll-tabs

[![Build Status](https://travis-ci.org/bpmn-io/scroll-tabs.svg?branch=master)](https://travis-ci.org/bpmn-io/scroll-tabs)

A tiny utility that adds tab scrolling functionality.

![scrollTabs screenshot](https://raw.githubusercontent.com/bpmn-io/scroll-tabs/master/docs/screencast.gif "scrollTabs screenshot")


## How it works

ScrollTabs adds scroll buttons on the left and right side of the tabs container
if not all tabs are visible. It also adds a mouse wheel listener on the
container.

If either a button is clicked or the mouse wheel is used over the tabs,
a 'scroll' event is being fired. This event contains the node elements
of the new and old active tab, and the direction in which the tab has
changed relative to the old active tab.


## How to use

### Provide a tab container

```javascript
var $el = (
  <div>
    <ul class="my-tabs-container">
      <li class="my-tab i-am-active"></li>
      <li class="my-tab"></li>
      <li class="my-tab ignore-me"></li>
    </ul>
  </div>
);
```

### Initialize scrollTabs

```javascript
var scroller = scrollTabs($el, {
  selectors: {
    tabsContainer: '.my-tabs-container',
    tab: '.my-tab',
    ignore: '.ignore-me',
    active: '.i-am-active'
  }
});
```

### Listen to the scroll event

```javascript
scroller.on('scroll', function(newActiveNode, oldActiveNode, direction) {
  // activate the new active tab
});
```

### Update scroller

Every time tabs change and or the tab container resizes, update the scroller:

```javascript
scroller.update();
```

## How to test

```
npm run test
```

## License

MIT