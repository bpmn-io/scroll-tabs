/* global sinon */

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


  describe('scrolling', function() {

    it('should scroll for each wheel event per default', function() {

      // given
      var scrollSpy = sinon.spy();

      if (!Math.sign) {
        Math.sign = signPolyfill;
      }

      var scroller = scrollTabs(node, {
        selectors: {
          tabsContainer: '.my-tabs-container',
          tab: '.my-tab',
          ignore: '.ignore-me',
          active: '.i-am-active'
        }
      });

      scroller.on('scroll', scrollSpy);

      // when
      var wheelEvent = getWheelEvent(1);

      node.dispatchEvent(wheelEvent);
      node.dispatchEvent(wheelEvent);

      // then
      expect(scrollSpy).to.be.calledTwice;
    });


    it('should allow to use a custom function to normalize scrolling speed', function() {

      // given
      var eventHandlerSpy = sinon.spy(),
          normalizeWheelStub = sinon.stub().returns(eventHandlerSpy);

      scrollTabs(node, {
        selectors: {
          tabsContainer: '.my-tabs-container',
          tab: '.my-tab',
          ignore: '.ignore-me',
          active: '.i-am-active'
        },
        normalizeWheel: normalizeWheelStub
      });

      // when
      var wheelEvent = getWheelEvent(1);

      node.dispatchEvent(wheelEvent);
      node.dispatchEvent(wheelEvent);

      // then
      expect(normalizeWheelStub).to.be.calledOnce;
      expect(eventHandlerSpy).to.be.calledTwice;
      expect(eventHandlerSpy).to.be.calledWith(wheelEvent);
    });

  });


  it('update');

});



// helpers /////////

function getWheelEvent(deltaY) {
  var event;

  try {
    event = new WheelEvent('wheel', { deltaY: deltaY });
  } catch (error) {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent('wheel');
    event.deltaY = deltaY;
  }

  return event;
}

/**
 * Polyfill for `Math.sign` for PhantomJS
 * @param {any} value
 */
function signPolyfill(value) {
  return (value > 0 ? 1 : 0) + (value < 0 ? -1 : 0) || +value;
}
