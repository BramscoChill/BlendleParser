import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from 'components/Button';
import { keyCode } from 'app-constants';
import { throttle } from 'lodash';

const VISIBILITY_DURATION = 5000;

class NavigationArrows extends PureComponent {
  static propTypes = {
    onNextItem: PropTypes.func.isRequired,
    onNextPage: PropTypes.func.isRequired,
    onPrevItem: PropTypes.func.isRequired,
    onPrevPage: PropTypes.func.isRequired,
    isPrevEnabled: PropTypes.bool,
    isNextEnabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      prev: {
        visible: false,
        enabled: this.props.isPrevEnabled,
      },
      next: {
        visible: false,
        enabled: this.props.isNextEnabled,
      },
    };
  }

  componentDidMount() {
    this._mouseMove = throttle(this._toggleButtonsByMousePos.bind(this), 500);
    this._navigateByKey = throttle(this._navigateByKey.bind(this), 250, { trailing: false });

    window.addEventListener('mousemove', this._mouseMove);
    window.addEventListener('keydown', this._navigateByKey);

    // Hide the arrows after the visibility duration is expired
    this._hideNavigationTimeout = setTimeout(() => {
      this.setState({
        prev: { ...this.state.prev, visible: false },
        next: { ...this.state.next, visible: false },
      });
    }, VISIBILITY_DURATION);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      prev: { ...this.state.prev, enabled: nextProps.isPrevEnabled },
      next: { ...this.state.next, enabled: nextProps.isNextEnabled },
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.prev.visible !== nextState.prev.visible ||
      this.state.prev.enabled !== nextState.prev.enabled ||
      this.state.next.visible !== nextState.next.visible ||
      this.state.next.enabled !== nextState.next.enabled
    );
  }

  componentWillUnmount() {
    clearTimeout(this._hideNavigationTimeout);

    window.removeEventListener('mousemove', this._mouseMove);
    window.removeEventListener('keydown', this._navigateByKey);
    this._mouseMove.cancel();
    this._navigateByKey.cancel();
  }

  _navigateByKey(ev) {
    if (ev.shift || ev.target.tagName === 'INPUT' || ev.target.tagName === 'TEXTAREA') {
      return;
    }

    const keyCodes = [
      keyCode.SPACE,
      keyCode.ARROW_LEFT,
      keyCode.ARROW_UP,
      keyCode.ARROW_RIGHT,
      keyCode.ARROW_DOWN,
    ];

    if (keyCodes.indexOf(ev.keyCode) && (this.state.next.visible || this.state.prev.visible)) {
      this.setState({
        next: { ...this.state.next, visible: false },
        prev: { ...this.state.prev, visible: false },
      });
    }

    switch (ev.keyCode) {
      case keyCode.SPACE:
      case keyCode.PAGE_DOWN:
      case keyCode.ARROW_DOWN:
        this.props.onNextPage(ev);
        break;

      case keyCode.PAGE_UP:
      case keyCode.ARROW_UP:
        this.props.onPrevPage(ev);
        break;

      case keyCode.ARROW_LEFT:
        this.props.onPrevItem(ev);
        break;

      case keyCode.ARROW_RIGHT:
        this.props.onNextItem(ev);
        break;

      default:
        break;
    }
  }

  _toggleButtonsByMousePos(ev) {
    // Keydown triggers mousemove three times, but we need to ignore these events. This
    // is done by storing the x-position and checking if it has been changed
    if (this.xPos !== ev.clientX) {
      this.xPos = ev.clientX;

      // Calculate limits
      if (this.screenWidth !== document.body.clientWidth) {
        this.screenWidth = document.body.clientWidth;
        this.limit = {
          left: this.screenWidth / 4,
          right: this.screenWidth / 4 * 3,
        };
      }

      const isPrevVisible = this.xPos < this.limit.left;
      const isNextVisible = this.xPos > this.limit.right;

      this.setState({
        prev: { ...this.state.prev, visible: isPrevVisible },
        next: { ...this.state.next, visible: isNextVisible },
      });

      if (isPrevVisible || isNextVisible) {
        // Prevent the navigation from auto when the mouse is in range
        clearTimeout(this._hideNavigationTimeout);
      }
    }
  }

  _getClickHandler(direction) {
    switch (direction) {
      case 'prev':
        return this.props.onPrevItem;
      case 'next':
        return this.props.onNextItem;
      default:
        throw new Error(`${direction} is not a valid direction`);
    }
  }

  _renderButton(direction) {
    if (!this.state[direction].enabled) {
      return null;
    }
    const classes = classNames(
      'btn-icon',
      'btn-flat',
      'btn-no-text',
      's-active',
      `btn-${direction}`,
      {
        hidden: !this.state[direction].visible,
      },
    );

    return (
      <Button className={classes} onClick={this._getClickHandler(direction)}>
        {direction}
      </Button>
    );
  }

  render() {
    return (
      <div className="navigation-arrows">
        {this._renderButton('prev')}
        {this._renderButton('next')}
      </div>
    );
  }
}

export default NavigationArrows;



// WEBPACK FOOTER //
// ./src/js/app/components/TilePane/NavigationArrows.js