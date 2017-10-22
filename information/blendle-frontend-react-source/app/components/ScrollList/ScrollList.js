import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { throttle, debounce } from 'lodash';
import classNames from 'classnames';
import smoothScroll from 'helpers/scroll';
import Scroller from 'react-list';
import browserEnv from 'instances/browser_environment';
import { innerHeight, innerWidth } from 'helpers/innerSize';
import CSS from './ScrollList.scss';
import ScrollListItem from './ScrollListItem';

const OFFSET_SIZE_KEYS = {
  x: 'offsetWidth',
  y: 'offsetHeight',
};

// larger on iPad since it doesn't trigger onScroll so often, causing empty spaces while scrolling
const PAGE_SIZE = browserEnv.isIPad() ? 15 : 5;
const hasTouch = browserEnv.hasTouch();

export default class ScrollList extends PureComponent {
  static propTypes = {
    axis: PropTypes.oneOf(['x', 'y']),
    children: PropTypes.node,
    className: PropTypes.string,
    scrollWindow: PropTypes.bool,
    threshold: PropTypes.number,
    initialIndex: PropTypes.number,

    onScroll: PropTypes.func,
    onEnd: PropTypes.func,
    onNearEnd: PropTypes.func,
  };

  static defaultProps = {
    axis: 'y',
    threshold: 0,
    initialIndex: 0,
  };

  constructor(props) {
    super();

    this.state = {
      scrolling: false,
      availableTileSize: { width: 0, height: 0 },
    };

    this._list = null;
    this._children = Children.toArray(props.children);
    this._visibleRange = [0, 5];

    this._throttleOnScroll = throttle(this._onScroll.bind(this), 200, {
      leading: true,
      trailing: false,
    });
    this._debounceOnScrollEnd = debounce(this._onScrollEnd.bind(this), 250, {
      leading: false,
      trailing: true,
    });
    this._throttleOnResize = throttle(this._onResize.bind(this), 100, {
      leading: false,
      trailing: true,
    });

    this._setListRef = (ref) => {
      this._list = ref;
    };
  }

  componentDidMount() {
    this._getScrollParent().addEventListener('scroll', this._throttleOnScroll);
    window.addEventListener('resize', this._throttleOnResize);

    this._updateAvailableTileSize();

    if (this.props.initialIndex) {
      // the react-list component doesn't always scrolls to the correct index when being called
      // the first time, since it doesn't has the sizes of all the tiles.
      const to = this.props.initialIndex;
      this.scrollTo(to, 'easeInQuart', () => {
        this.scrollTo(to, 'easeOutQuart');
      });
    }

    // in the next UI frame to prevent 'cannot dispatch during dispatch'
    this._posEventsTimeout = setTimeout(() => {
      this._invokePositionEvents(this.getVisibleRange(true));
    });
  }

  componentWillReceiveProps(nextProps) {
    this._children = Children.toArray(nextProps.children);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children.length !== this._children.length) {
      // in the next UI frame to prevent 'cannot dispatch during dispatch'
      clearTimeout(this._posEventsTimeout);
      this._posEventsTimeout = setTimeout(() => {
        this._invokePositionEvents(this.getVisibleRange(true));
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this._posEventsTimeout);
    cancelAnimationFrame(this._raf);

    this._throttleOnScroll.cancel();
    this._debounceOnScrollEnd.cancel();
    this._throttleOnResize.cancel();

    this._getScrollParent().removeEventListener('scroll', this._throttleOnScroll);
    window.removeEventListener('resize', this._throttleOnResize);
  }

  // Put the element at index at the top of the viewport.
  scrollTo(index, smooth = false, finish) {
    if (!smooth) {
      this._list.scrollTo(index);
      return;
    }

    // calculate the duration based on the scroll distance
    const from = this._list.getScroll();
    const to = this._list.getSpaceBefore(index);
    const duration = Math.min(Math.max(200, Math.abs(from - to) / 5), 1750);

    const easing = typeof smooth === 'string' ? smooth : 'easeInOutQuart';

    smoothScroll.scroll(this.props.axis, this._getScrollParent(), to, { duration, easing, finish });
  }

  // Return the indices of the first and last items that are at all visible in the viewport.
  getVisibleRange(forceUpdate = false) {
    if (forceUpdate) {
      this._visibleRange = this._list.getVisibleRange();
    }
    return this._visibleRange;
  }

  _invokePositionEvents(visibleRange) {
    const { onEnd, onNearEnd } = this.props;
    const childrenCount = this._children.length;
    const [start, end] = visibleRange;

    if (onEnd && end === childrenCount - 1) {
      onEnd(visibleRange);
    }

    if (onNearEnd && end > childrenCount - Math.max(end - start, 10)) {
      onNearEnd(visibleRange);
    }
  }

  _updateAvailableTileSize() {
    const element = findDOMNode(this._list);
    this.setState({
      availableTileSize: {
        height: innerHeight(element),
        width: innerWidth(element),
      },
    });
  }

  _onResize() {
    this._updateAvailableTileSize();
  }

  _onScroll() {
    if (this._raf) {
      return;
    }

    this._raf = requestAnimationFrame(() => {
      this._raf = null;
      this._onScrollRAF();
    });
  }

  _onScrollRAF() {
    const { onScroll } = this.props;
    this._visibleRange = this._list.getVisibleRange(true);

    if (onScroll) {
      onScroll(this._visibleRange);
    }

    this._invokePositionEvents(this._visibleRange);

    this.setState({ scrolling: true });
    this._debounceOnScrollEnd();
  }

  _onScrollEnd() {
    this.setState({ scrolling: false });
  }

  _getScrollParent = () => (this.props.scrollWindow ? window : findDOMNode(this));

  _getItemSize = (index) => {
    if (!this._list) {
      return 340;
    }

    const offsetKey = OFFSET_SIZE_KEYS[this.props.axis];
    const domChildren = findDOMNode(this._list).children;
    // child is rendered, pick its dimension!
    if (domChildren[index]) {
      return domChildren[index][offsetKey];
    }
    // pick the center element, the first element is in most cases an explanation card
    return domChildren[Math.floor(domChildren.length / 2)][offsetKey];
  };

  _renderItems = (items, ref) => (
    <ul className="pane-contents" ref={ref}>
      {items}
    </ul>
  );

  _renderItem = (index, key) => {
    const { axis, threshold } = this.props;

    const node = this._children[index];
    const itemClassName = classNames(CSS.item, CSS[`item${axis.toUpperCase()}`]);

    const [min, max] = this._visibleRange;
    const isVisible = index >= min - threshold && index <= max + threshold;

    return (
      <ScrollListItem
        key={node.key || key}
        axis={axis}
        className={itemClassName}
        scrolling={this.state.scrolling}
        availableSize={this.state.availableTileSize}
        visible={isVisible}
      >
        {node}
      </ScrollListItem>
    );
  };

  render() {
    const { axis, scrollWindow, className } = this.props;

    const containerClassName = classNames(
      CSS.container,
      CSS[`container${axis.toUpperCase()}`],
      className,
      {
        [CSS.scrollable]: !scrollWindow,
        [CSS.isScrolling]: this.state.scrolling,
        [CSS.scrollPerf]: this.state.scrolling && !hasTouch,
      },
    );

    return (
      <div className={containerClassName}>
        <Scroller
          type="simple"
          axis={axis}
          pageSize={PAGE_SIZE}
          threshold={1000}
          ref={this._setListRef}
          length={this._children.length}
          scrollParentGetter={this._getScrollParent}
          itemsRenderer={this._renderItems}
          itemRenderer={this._renderItem}
          itemSizeGetter={this._getItemSize}
        />
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/ScrollList/ScrollList.js