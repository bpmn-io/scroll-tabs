import scrollTabs from '.';

import {
  domify
} from 'min-dom';

var TEST_MARKUP =
  '<div>' +
    '<ul class="my-tabs-container">' +
      '<li class="my-tab i-am-active" data-id="A">A</li>' +
      '<li class="my-tab" data-id="B">B</li>' +
      '<li class="my-tab" data-id="C">C</li>' +
      '<li class="my-tab" data-id="D">D</li>' +
      '<li class="my-tab ignore-me" data-id="IGNORE">IGNORE</li>' +
    '</ul>' +
  '</div>';


describe('scrollTabs', function() {

  var node;

  beforeEach(function() {
    node = domify(TEST_MARKUP);

    document.body.appendChild(node);
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


  it('should allow registration of events', function() {

    // given
    var scroller = scrollTabs(node, {
      selectors: {
        tabsContainer: '.my-tabs-container',
        tab: '.my-tab',
        ignore: '.ignore-me',
        active: '.i-am-active'
      }
    });

    // then
    expect(function() {
      scroller.on('scroll', function() {
        console.log('scroll');
      });
    }).not.to.throw();
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