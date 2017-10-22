const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const PortalMixin = require('components/mixins/PortalMixin');
const keyCode = require('app-constants').keyCode;
const classNames = require('classnames');

const PortalPopover = createReactClass({
  displayName: 'PortalPopover',
  mixins: [PortalMixin('popover-portal')],

  propTypes: {
    issueUrl: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onScroll: PropTypes.func,
  },

  getDefaultProps() {
    return {
      x: 0,
      y: 0,
      viewport: window,
      mobile: false,
    };
  },

  getInitialState() {
    return {
      x: 0,
      y: 0,
      vertical: 'left',
      horizontal: 'top',
    };
  },

  componentWillMount() {
    this.setState({
      x: this.props.x,
      y: this.props.y,
      offset: 0,
      viewportOffsetTop: 0,
      viewportOffsetBottom: 0,
      viewportOffsetLeft: 0,
      viewportOffsetRight: 0,
    });
  },

  componentDidMount() {
    if (!this.props.mobile) {
      this.setState(this.getDimensions());
    }

    window.addEventListener('scroll', this.props.onScroll);
    window.addEventListener('wheel', this.props.onScroll);
    window.addEventListener('touchstart', this._considerClose);
    window.addEventListener('keyup', this._eKeyUp);
  },

  componentWillUnmount() {
    window.removeEventListener('scroll', this.props.onScroll);
    window.removeEventListener('wheel', this.props.onScroll);
    window.removeEventListener('touchstart', this._considerClose);
    window.removeEventListener('keyup', this._eKeyUp);
  },

  _eKeyUp(e) {
    if (e.ctrlKey) {
      return;
    }

    if (e.keyCode === keyCode.ESC) {
      this._close();
    }
  },

  _considerClose(e) {
    const domNode = this.getLayerDOMNode();

    if (e.target !== domNode && !domNode.contains(e.target)) {
      this._close();
    }
  },

  _close() {
    this.props.onClose && this.props.onClose();

    this.unrenderLayer();
  },

  // Get the dimensions object
  getDimensions() {
    const viewportBoundingRect = this.getViewportBoundingRect();

    const viewportTop = viewportBoundingRect.top + this.props.viewportOffsetTop;
    const viewportBottom = viewportBoundingRect.bottom - this.props.viewportOffsetBottom;
    const viewportLeft = viewportBoundingRect.left + this.props.viewportOffsetLeft;
    const viewportRight = viewportBoundingRect.right - this.props.viewportOffsetRight;

    const popoverBoundingRect = this.getLayerDOMNode().getBoundingClientRect();

    let width = parseInt(this.getLayerDOMNode().offsetWidth, 10);
    let height = parseInt(this.getLayerDOMNode().offsetHeight, 10);

    const popoverTop = popoverBoundingRect.top;
    let popoverBottom = popoverBoundingRect.bottom;
    const popoverLeft = popoverBoundingRect.left;
    let popoverRight = popoverBoundingRect.right;

    let x = popoverLeft + this.props.offset;
    let y = popoverTop + this.props.offset;

    if (height > viewportBottom - viewportTop) {
      height = viewportBottom - viewportTop;
      popoverBottom = popoverTop + height;
    }

    if (width > viewportRight - viewportLeft) {
      width = viewportRight - viewportLeft;
      popoverRight = popoverLeft + width;
    }

    // Popover crosses top viewport boundary
    if (popoverTop < viewportTop) {
      y = viewportTop;
    }

    // Popover crosses bottom viewport boundary
    if (popoverBottom > viewportBottom) {
      y = viewportBottom - height - this.props.offset;
    }

    // Popover crosses left viewport boundary
    if (popoverLeft < viewportLeft) {
      x = viewportLeft + this.props.offset;
    }

    // Popover crosses right viewport boundary
    if (popoverRight > viewportRight) {
      x = Math.min(viewportRight - width, x - width - this.props.offset * 2);
    }

    return { x: Math.round(x), y: Math.round(y), width, height };
  },

  getViewportBoundingRect() {
    if (this.props.viewport === window) {
      return {
        left: 0,
        right: window.innerWidth,
        top: 0,
        bottom: window.innerHeight,
      };
    }

    return this.props.viewport.getBoundingClientRect();
  },

  render() {
    return <span />;
  },

  renderLayer() {
    const className = classNames({
      'v-portal-popover': true,
      [`l-${this.props.layout}`]: this.props.layout,
    });

    const style = {
      position: 'fixed',
      zIndex: 100000,
    };

    let closeArea;

    if (this.props.mobile) {
      style.top = 0;
      style.left = 0;
      style.right = 0;
      style.bottom = 0;
      closeArea = (
        <a className="close-area" onClick={this.props.onClose} href={this.props.issueUrl} />
      );
    } else {
      style.left = `${this.state.x}px`;
      style.top = `${this.state.y}px`;

      if (this.state.height) {
        style.height = `${this.state.height}px`;
      }

      if (this.state.width) {
        style.width = `${this.state.width}px`;
      }
    }

    return (
      <div
        className={className}
        style={style}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
      >
        {closeArea}
        {this.props.children}
      </div>
    );
  },
});

module.exports = PortalPopover;



// WEBPACK FOOTER //
// ./src/js/app/components/PortalPopover.js