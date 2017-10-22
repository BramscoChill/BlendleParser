import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import BrowserEnv from 'instances/browser_environment';
import HorizontalScrollWheel from './HorizontalScrollWheel';
import ScrollList from 'components/ScrollList';
import NavigationArrows from './NavigationArrows';
import Tile from 'components/Tile';
import Spinner from 'components/Loading';
import classNames from 'classnames';
import CSS from './TilePane.scss';

export default class TilePane extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    loading: PropTypes.bool,
    active: PropTypes.bool,
    showButtons: PropTypes.bool,
    initialIndex: PropTypes.number,
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),
    onScroll: PropTypes.func,
    onEnd: PropTypes.func,
    onNearEnd: PropTypes.func,
  };

  static defaultProps = {
    active: true,
    initialIndex: 0,
    showButtons: BrowserEnv.isDesktop() && !BrowserEnv.hasTouch(),
    orientation: BrowserEnv.isMobile() ? 'vertical' : 'horizontal',
  };

  constructor(props) {
    super(props);

    this._endReachedAtIndex = 0;

    this._onNextItem = this._onArrowClick.bind(this, 'item', 1);
    this._onNextPage = this._onArrowClick.bind(this, 'page', 1);
    this._onPrevItem = this._onArrowClick.bind(this, 'item', -1);
    this._onPrevPage = this._onArrowClick.bind(this, 'page', -1);

    this.state = {
      scrollPos: [0, 0],
      arrows: {
        prev: false,
        next: false,
      },
    };

    this._setListRef = (ref) => {
      this._list = ref;
    };
  }

  componentDidMount() {
    this._updateArrows();

    window.scrollTo(...this.state.scrollPos);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active && !nextProps.active) {
      this.setState({
        scrollPos: [window.scrollX, window.scrollY],
      });
    }

    const nextChildCount = Children.count(nextProps.children);
    const curChildCount = Children.count(this.props.children);
    if (curChildCount > nextChildCount) {
      this._endReachedAtIndex = 0;
    }
  }

  componentDidUpdate(prevProps) {
    if (Children.count(prevProps.children) !== Children.count(this.props.children)) {
      this._updateArrows();
    }

    // restore window scroll position after activate change
    if (this.props.active && !prevProps.active) {
      window.scrollTo(...this.state.scrollPos);
    }
  }

  scrollTo(...args) {
    this._list.scrollTo(...args);
  }

  _updateArrows(visibleRange) {
    const [start, end] = visibleRange || this._list.getVisibleRange();
    const numberOfVisibleItems = end - start;

    this.setState({
      arrows: {
        prev: start !== 0,
        /*
        * The -1 because sometimes the last item is partially visible, but it's still
        * the end of the bundle so we don't want to show the 'next' arrow
        */
        next: Children.count(this._getChildren()) > end + numberOfVisibleItems - 1,
      },
    });
  }

  _onEnd = (visibleRange) => {
    if (!this.props.onEnd) {
      return;
    }

    const lastIndex = visibleRange[1];
    if (lastIndex > this._endReachedAtIndex && !this.props.loading) {
      this._endReachedAtIndex = lastIndex;
      this.props.onEnd(visibleRange);
    }
  };

  _onScroll = (visibleRange) => {
    this._updateArrows(visibleRange);
    if (this.props.onScroll) {
      this.props.onScroll(visibleRange);
    }
  };

  _onArrowClick(type, increment) {
    const [start, end] = this._list.getVisibleRange(true);
    let to = start + increment;
    if (type === 'page') {
      to = increment === 1 ? end : start - (end - start);
    }
    this._list.scrollTo(to, true);
  }

  _getChildren() {
    const children = Children.toArray(this.props.children);
    if (this.props.loading) {
      children.push(
        <Tile type="loading" key="loading">
          <Spinner />
        </Tile>,
      );
    }
    return children;
  }

  _renderScrollList(props) {
    return (
      <ScrollList
        ref={this._setListRef}
        initialIndex={this.props.initialIndex}
        onScroll={this._onScroll}
        onNearEnd={this.props.onNearEnd}
        onEnd={this._onEnd}
        {...props}
      >
        {this._getChildren()}
      </ScrollList>
    );
  }

  _renderNavigationArrows() {
    if (this.props.showButtons && this.props.active) {
      return (
        <NavigationArrows
          onNextItem={this._onNextItem}
          onNextPage={this._onNextPage}
          onPrevItem={this._onPrevItem}
          onPrevPage={this._onPrevPage}
          isNextEnabled={this.state.arrows.next}
          isPrevEnabled={this.state.arrows.prev}
        />
      );
    }
    return null;
  }

  render() {
    const baseClassName = classNames(CSS.container, this.props.className);

    if (this.props.orientation === 'horizontal') {
      return (
        <div
          className={classNames(baseClassName, CSS.containerHorizontal, 'v-horizontal-tile-pane')}
        >
          <HorizontalScrollWheel locked={!this.props.active}>
            {this._renderScrollList({
              axis: 'x',
              scrollWindow: false,
              className: classNames(CSS.scrollList, CSS.scrollListHorizontal),
            })}
          </HorizontalScrollWheel>
          {this._renderNavigationArrows()}
        </div>
      );
    }

    return (
      <div
        className={classNames(baseClassName, CSS.containerVertical, 'v-vertical-tile-pane', {
          [CSS.disabled]: !this.props.active,
        })}
      >
        {this._renderScrollList({
          axis: 'y',
          scrollWindow: true,
          className: classNames(CSS.scrollList, CSS.scrollListVertical),
        })}
        {this._renderNavigationArrows()}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/TilePane/index.js