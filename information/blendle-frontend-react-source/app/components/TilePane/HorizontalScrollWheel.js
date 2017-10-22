import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

export default class HorizontalScrollWheel extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    locked: PropTypes.bool,
  };

  constructor() {
    super();

    this._delta = 0;
    this._raf = null;
  }

  componentDidMount() {
    document.querySelector('.a-content').addEventListener('wheel', this._onWheel);
    const target = findDOMNode(this);

    // deltaMode is representing the unit of the delta values scroll amount
    this._deltaModeCorrections = {
      [WheelEvent.DOM_DELTA_PIXEL]: 1,
      [WheelEvent.DOM_DELTA_LINE]: parseInt(window.getComputedStyle(target).fontSize, 10),
      [WheelEvent.DOM_DELTA_PAGE]: target.offsetWidth,
    };
  }

  componentWillUnmount() {
    document.querySelector('.a-content').removeEventListener('wheel', this._onWheel);
    cancelAnimationFrame(this._raf);
  }

  _onWheel = (ev) => {
    if (this.props.locked) {
      return;
    }

    ev.preventDefault();
    this._delta += this._getDelta(ev);

    if (!this._raf) {
      this._raf = requestAnimationFrame(() => {
        if (!this.props.locked) {
          findDOMNode(this).scrollLeft += this._delta;
        }

        this._delta = 0;
        this._raf = null;
      });
    }
  };

  _getDelta(ev) {
    const delta = Math.abs(ev.deltaX) > Math.abs(ev.deltaY) ? ev.deltaX : ev.deltaY;
    return delta * this._deltaModeCorrections[ev.deltaMode];
  }

  render() {
    return this.props.children;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/TilePane/HorizontalScrollWheel.js