'use strict';

var scrollTabs = require('.');

var domify = require('min-dom').domify;

var TEST_MARKUP =
  '<div>' +
    '<ul class="my-tabs-container">' +
      '<li class="my-tab i-am-active" data-id="A"></li>' +
      '<li class="my-tab" data-id="B"></li>' +
      '<li class="my-tab ignore-me" data-id="C"></li>' +
    '</ul>' +
  '</div>';

describe('scrollTabs', function() {

  var node;

  beforeEach(function() {
    node = domify(TEST_MARKUP);
  });


  it('should create scroller', function() {

    // when
    var scroller = scrollTabs(node, {
      selectors: {
        tabsContainer: '.my-tabs-container',
        tab: '.my-tab',
        ignore: '.ignore-me',
        active: '.i-am-active'
      }
    });

    // then
    expect(scroller).to.exist;
  });


  it('should act as singleton', function() {

    // given
    var scroller = scrollTabs(node, {
      selectors: {
        tabsContainer: '.my-tabs-container',
        tab: '.my-tab',
        ignore: '.ignore-me',
        active: '.i-am-active'
      }
    });

    // when
    var cachedScroller = scrollTabs.get(node);

    // then
    expect(cachedScroller).to.equal(scroller);
  });


  it('scrolling');

  it('update');

});