import {
  domify,
  classes as domClasses,
  matches as domMatches,
  delegate as domDelegate,
  query as domQuery,
  queryAll as domQueryAll,
  event as domEvent,
  attr as domAttr
} from 'min-dom';

import {
  filter,
  assign
} from 'min-dash';

import createEmitter from 'mitt';

var DEFAULT_OPTIONS = {
  scrollSymbolLeft: '‹',
  scrollSymbolRight: '›'
};


/**
 * This component adds the functionality to scroll over a list of tabs.
 *
 * It adds scroll buttons on the left and right side of the tabs container
 * if not all tabs are visible. It also adds a mouse wheel listener on the
 * container.
 *
 * If either a button is clicked or the mouse wheel is used over the tabs,
 * a 'scroll' event is being fired. This event contains the node elements
 * of the new and old active tab, and the direction in which the tab has
 * changed relative to the old active tab.
 *
 * @example:
 * (1) provide a tabs-container:
 *
 * var $el = (
 *   <div>
 *     <!-- button added by scrollTabs -->
 *     <span class="scroll-tabs-button scroll-tabs-left"></span>
 *     <ul class="my-tabs-container">
 *       <li class="my-tab i-am-active"></li>
 *       <li class="my-tab"></li>
 *       <li class="my-tab ignore-me"></li>
 *     </ul>
 *     <!-- button added by scrollTabs -->
 *     <span class="scroll-tabs-button scroll-tabs-right"></span>
 *   </div>
 * );
 *
 *
 * (2) initialize scrollTabs:
 *
 *  var scroller = scrollTabs(tabBarNode, {
 *    selectors: {
 *      tabsContainer: '.my-tabs-container',
 *      tab: '.my-tab',
 *      ignore: '.ignore-me',
 *      active: '.i-am-active'
 *    }
 *  });
 *
 *
 * (3) listen to the scroll event:
 *
 * scroller.on('scroll', function(newActiveNode, oldActiveNode, direction) {
 *   // direction is any of (-1: left, 1: right)
 *   // activate the new active tab
 * });
 *
 *
 * (4) update the scroller if tabs change and or the tab container resizes:
 *
 * scroller.update();
 *
 *
 * @param  {DOMElement} el
 * @param  {Object} options
 * @param  {Object} options.selectors
 * @param  {String} options.selectors.tabsContainer the container all tabs are contained in
 * @param  {String} options.selectors.tab a single tab inside the tab container
 * @param  {String} options.selectors.ignore tabs that should be ignored during scroll left/right
 * @param  {String} options.selectors.active selector for the current active tab
 * @param  {String} [options.scrollSymbolLeft]
 * @param  {String} [options.scrollSymbolRight]
 */
function ScrollTabs($el, options) {

  // we are an event emitter
  assign(this, createEmitter());

  this.options = options = assign({}, DEFAULT_OPTIONS, options);
  this.container = $el;

  this._createScrollButtons($el, options);

  this._bindEvents($el);
}


/**
 * Create a clickable scroll button
 *
 * @param {Object} options
 * @param {String} options.className
 * @param {String} options.label
 * @param {Number} options.direction
 *
 * @return {DOMElement} The created scroll button node
 */
ScrollTabs.prototype._createButton = function(parentNode, options) {

  var className = options.className,
      direction = options.direction;


  var button = domQuery('.' + className, parentNode);

  if (!button) {
    button = domify('<span class="scroll-tabs-button ' + className + '">' +
                                options.label +
                              '</span>');

    parentNode.insertBefore(button, parentNode.childNodes[0]);
  }

  domAttr(button, 'data-direction', direction);

  return button;
};

/**
 * Create both scroll buttons
 *
 * @param  {DOMElement} parentNode
 * @param  {Object} options
 * @param  {String} options.scrollSymbolLeft
 * @param  {String} options.scrollSymbolRight
 */
ScrollTabs.prototype._createScrollButtons = function(parentNode, options) {

  // Create a button that scrolls to the tab left to the currently active tab
  this._createButton(parentNode, {
    className: 'scroll-tabs-left',
    label: options.scrollSymbolLeft,
    direction: -1
  });

  // Create a button that scrolls to the tab right to the currently active tab
  this._createButton(parentNode, {
    className: 'scroll-tabs-right',
    label: options.scrollSymbolRight,
    direction: 1
  });
};

/**
 * Get the current active tab
 *
 * @return {DOMElement}
 */
ScrollTabs.prototype.getActiveTabNode = function() {
  return domQuery(this.options.selectors.active, this.container);
};


/**
 * Get the container all tabs are contained in
 *
 * @return {DOMElement}
 */
ScrollTabs.prototype.getTabsContainerNode = function() {
  return domQuery(this.options.selectors.tabsContainer, this.container);
};


/**
 * Get all tabs (visible and invisible ones)
 *
 * @return {Array<DOMElement>}
 */
ScrollTabs.prototype.getAllTabNodes = function() {
  return domQueryAll(this.options.selectors.tab, this.container);
};


/**
 * Gets all tabs that don't have the ignore class set
 *
 * @return {Array<DOMElement>}
 */
ScrollTabs.prototype.getVisibleTabs = function() {
  var allTabs = this.getAllTabNodes();

  var ignore = this.options.selectors.ignore;

  return filter(allTabs, function(tabNode) {
    return !domMatches(tabNode, ignore);
  });
};


/**
 * Get a tab relative to a reference tab.
 *
 * @param  {DOMElement} referenceTabNode
 * @param  {Number} n gets the nth tab next or previous to the reference tab
 *
 * @return {DOMElement}
 *
 * @example:
 * Visible tabs: [ A | B | C | D | E ]
 * Assume tab 'C' is the reference tab:
 * If direction === -1, it returns tab 'B',
 * if direction ===  2, it returns tab 'E'
 */
ScrollTabs.prototype.getAdjacentTab = function(referenceTabNode, n) {
  var visibleTabs = this.getVisibleTabs();

  var index = visibleTabs.indexOf(referenceTabNode);

  return visibleTabs[index + n];
};

ScrollTabs.prototype._bindEvents = function(node) {
  this._bindWheelEvent(node);
  this._bindTabClickEvents(node);
  this._bindScrollButtonEvents(node);
};

/**
 *  Bind a click listener to a DOM node.
 *  Make sure a tab link is entirely visible after onClick.
 *
 * @param {DOMElement} node
 */
ScrollTabs.prototype._bindTabClickEvents = function(node) {
  var selector = this.options.selectors.tab;

  var self = this;

  domDelegate.bind(node, selector, 'click', function onClick(event) {
    self.scrollToTabNode(event.delegateTarget);
  });
};


/**
 * Bind the wheel event listener to a DOM node
 *
 * @param {DOMElement} node
 */
ScrollTabs.prototype._bindWheelEvent = function(node) {
  var self = this;

  domEvent.bind(node, 'wheel', function(e) {

    // scroll direction (-1: left, 1: right)
    var direction = Math.sign(e.deltaY);

    var oldActiveTab = self.getActiveTabNode();

    var newActiveTab = self.getAdjacentTab(oldActiveTab, direction);

    if (newActiveTab) {
      self.scrollToTabNode(newActiveTab);
      self.emit('scroll', newActiveTab, oldActiveTab, direction);
    }

    e.preventDefault();
  });
};

/**
 * Bind scroll button events to a DOM node
 *
 * @param  {DOMElement} node
 */
ScrollTabs.prototype._bindScrollButtonEvents = function(node) {

  var self = this;

  domDelegate.bind(node, '.scroll-tabs-button', 'click', function(event) {

    var target = event.delegateTarget;

    // data-direction is either -1 or 1
    var direction = parseInt(domAttr(target, 'data-direction'), 10);

    var oldActiveTabNode = self.getActiveTabNode();

    var newActiveTabNode = self.getAdjacentTab(oldActiveTabNode, direction);

    if (newActiveTabNode) {
      self.scrollToTabNode(newActiveTabNode);
      self.emit('scroll', newActiveTabNode, oldActiveTabNode, direction);
    }

    event.preventDefault();
  });
};


/**
* Scroll to a tab if it is not entirely visible
*
* @param  {DOMElement} tabNode tab node to scroll to
*/
ScrollTabs.prototype.scrollToTabNode = function(tabNode) {
  if (!tabNode) {
    return;
  }

  var tabsContainerNode = tabNode.parentNode;

  var tabWidth = tabNode.offsetWidth,
      tabOffsetLeft = tabNode.offsetLeft,
      tabOffsetRight = tabOffsetLeft + tabWidth,
      containerWidth = tabsContainerNode.offsetWidth,
      containerScrollLeft = tabsContainerNode.scrollLeft;

  if (containerScrollLeft > tabOffsetLeft) {
    // scroll to the left, if the tab is overflowing on the left side
    tabsContainerNode.scrollLeft = 0;
  } else if (tabOffsetRight > containerWidth) {
    // scroll to the right, if the tab is overflowing on the right side
    tabsContainerNode.scrollLeft = tabOffsetRight - containerWidth;
  }
};


/**
 * React on tab changes from outside (resize/show/hide/add/remove),
 * update scroll button visibility.
 */
ScrollTabs.prototype.update = function() {

  var tabsContainerNode = this.getTabsContainerNode();

  // check if tabs fit in container
  var overflow = tabsContainerNode.scrollWidth > tabsContainerNode.offsetWidth;

  // TODO(nikku): distinguish overflow left / overflow right?
  var overflowClass = 'scroll-tabs-overflow';

  domClasses(this.container).toggle(overflowClass, overflow);

  if (overflow) {
    // make sure the current active tab is always visible
    this.scrollToTabNode(this.getActiveTabNode());
  }
};


// exports ////////////////

/**
 * Create a scrollTabs instance on the given element.
 *
 * @param {DOMElement} $el
 * @param {Object} options
 *
 * @return {ScrollTabs}
 */
export default function create($el, options) {

  var scrollTabs = get($el);

  if (!scrollTabs) {
    scrollTabs = new ScrollTabs($el, options);

    $el.__scrollTabs = scrollTabs;
  }

  return scrollTabs;
}


/**
 * Return the scrollTabs instance that has been previously
 * initialized on the element.
 *
 * @param {DOMElement} $el
 * @return {ScrollTabs}
 */
function get($el) {
  return $el.__scrollTabs;
}

create.get = get;