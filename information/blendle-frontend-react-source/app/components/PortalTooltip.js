import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import PortalMixin from 'components/mixins/PortalMixin';
import classNames from 'classnames';
import getScrollParent from 'helpers/getScrollParent';
import Pointer from './Pointer';

const PortalTooltip = createReactClass({
  displayName: 'PortalTooltip',

  propTypes: {
    pointerSize: PropTypes.number,
    position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    layout: PropTypes.string,
    name: PropTypes.string,
    onScroll: PropTypes.func,
    className: PropTypes.string,
    onMouseEnter: PropTypes.func,
    truncate: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  },

  mixins: [PortalMixin('tooltip-portal')],

  getInitialState() {
    return {
      pos: {
        x: 0,
        y: 0,
        maxHeight: window.innerHeight,
        yPos: 'bottom',
        xPos: 'left',
      },
      truncateCount: null,
    };
  },

  getDefaultProps() {
    return {
      truncate: false,
      truncateMessage: null,
      pointerSize: 5,
    };
  },

  render() {
    return <span />;
  },

  componentDidMount() {
    this._updatePosition();

    if (this.props.onScroll) {
      this._scrollParent = getScrollParent(ReactDOM.findDOMNode(this));
      this._scrollParent.addEventListener('scroll', this.props.onScroll);
    }
  },

  componentWillUnmount() {
    if (this.props.onScroll) {
      this._scrollParent.removeEventListener('scroll', this.props.onScroll);
    }
  },

  _updatePosition() {
    const position = this._getPosition();

    if (this.props.truncate) {
      this._truncateChildren(position.maxHeight);
    }

    this.setState({
      pos: position,
    });
  },

  _getPosition() {
    const target = ReactDOM.findDOMNode(this).parentNode.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // fetch tooltip dimensions including the margin
    const ttBounds = this.getLayerDOMNode().getBoundingClientRect();
    const ttStyle = window.getComputedStyle(this.getLayerDOMNode());
    const ttMargin = {
      // only accepts px values
      x: parseInt(ttStyle.marginLeft, 0) + parseInt(ttStyle.marginRight, 0),
      y: parseInt(ttStyle.marginTop, 0) + parseInt(ttStyle.marginBottom, 0),
    };

    const tooltip = {
      width: ttBounds.width + ttMargin.x,
      height: ttBounds.height + ttMargin.y,
    };

    const pos = this._getFitPosition(target, viewport, tooltip);

    // calculate maxHeight to be able to truncate content
    pos.maxHeight = viewport.height - pos.y - ttMargin.y;

    return pos;
  },

  _getFitPosition(target, viewport, tooltip) {
    // find out on what place the tooltip will fit
    const fits = {
      top: target.top - tooltip.height > 0,
      bottom: target.top + target.height + tooltip.height < viewport.height,
      left: target.left - tooltip.width > 0,
      right: target.right + target.width + tooltip.width < viewport.width,
    };

    // calculate the xy position of the tooltip
    let x;
    let xPos;
    if (fits.right) {
      x = target.left;
      xPos = 'right';
    } else if (fits.left) {
      x = target.left - tooltip.width + target.width;
      xPos = 'left';
    } else {
      x = target.left - tooltip.width / 2 + target.width / 2;
      xPos = 'center';
    }

    let y;
    let yPos;
    const position = this.props.position;
    if (position && fits[position]) {
      y = target[position] + tooltip.height * (position === 'top' ? -1 : 1);
      yPos = position === 'top' ? 'above' : 'below';
    }

    // If it didn't fit on the preferred possition, use the regular calculation
    if (!y || !yPos) {
      if (!fits.bottom && fits.top) {
        y = target.top - tooltip.height;
        yPos = 'above';
      } else {
        y = target.top + target.height;
        yPos = 'below';
      }
    }

    return {
      x: Math.round(x),
      y: Math.round(y),
      xPos,
      yPos,
    };
  },

  _truncateChildren(maxHeight) {
    if (this.state.truncateCount !== null) {
      return;
    }

    const tooltip = this.getLayerDOMNode();
    const children = Array.from(tooltip.children);
    let top = 0;
    let truncateCount = 0;
    let lastVisibleChildIndex = 0;

    children.forEach((child, index) => {
      if (top > maxHeight) {
        truncateCount++;
      } else {
        top = child.offsetHeight + child.offsetTop;

        if (top > maxHeight) {
          truncateCount++;
        }
      }

      if (truncateCount === 0) {
        lastVisibleChildIndex = index;
      }
    });

    // if we hide one item, we also want to hide the last visible item when we want to show a truncate message
    if (truncateCount && typeof this.props.truncate === 'function') {
      truncateCount++;
    }

    this.setState({ truncateCount });
  },

  _getPointerOffset(pointerWidth) {
    const target = ReactDOM.findDOMNode(this).parentNode;

    return Math.round(target.offsetWidth / 2 - pointerWidth);
  },

  renderLayer() {
    const className = classNames([
      'v-portal-tooltip',
      `pos-${this.state.pos.xPos}`,
      `pos-${this.state.pos.yPos}`,
      { [`l-${this.props.layout}`]: this.props.layout },
      { [`tooltip-${this.props.name}`]: this.props.name },
      { [this.props.className]: this.props.className },
    ]);

    const portalStyles = {
      position: 'fixed',
      zIndex: 100000,
      left: `${this.state.pos.x}px`,
      top: `${this.state.pos.y}px`,
      maxHeight: `${this.state.pos.maxHeight}px`,
    };

    const tooltipStyles = {};

    let truncate;
    if (typeof this.props.truncate === 'function' && this.state.truncateCount) {
      truncate = this.props.truncate(this.state.truncateCount);
    }

    let pointer;

    if (this.props.pointerSize) {
      pointer = (
        <Pointer
          position={this.state.pos.yPos === 'above' ? 'bottom' : 'top'}
          direction={this.state.pos.xPos}
          offset={this._getPointerOffset(this.props.pointerSize)}
          width={this.props.pointerSize}
        />
      );
      if (this.state.pos.yPos === 'above') {
        tooltipStyles.marginBottom = `${3 + this.props.pointerSize}px`;
      } else {
        tooltipStyles.marginTop = `${3 + this.props.pointerSize}px`;
      }
    }

    const lastVisibleChildIndex = this.props.children.length - (this.state.truncateCount || 0);

    return (
      <div
        className={className}
        style={portalStyles}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
      >
        {pointer}
        <div className="tooltip" style={tooltipStyles}>
          {this.props.children.slice(0, lastVisibleChildIndex)}
          {truncate}
        </div>
      </div>
    );
  },
});

export default PortalTooltip;



// WEBPACK FOOTER //
// ./src/js/app/components/PortalTooltip.js