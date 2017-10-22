import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import prefixedStyle from 'helpers/prefixedStyle';

export default class extends React.Component {
  static propTypes = {
    target: PropTypes.object.isRequired,
    wide: PropTypes.bool,
  };

  state = {
    style: {},
  };

  componentDidMount() {
    this._updatePosition();
  }

  componentDidUpdate() {
    this._updatePosition();
  }

  _updatePosition = () => {
    const target = ReactDOM.findDOMNode(this.props.target);

    const dropdownActive = target.querySelector('.s-active.dropdown-handle');
    const otherActive = target.querySelector('.s-active');

    const activeElement = dropdownActive || otherActive;
    if (
      !activeElement ||
      !activeElement.offsetWidth ||
      this._activeElementText === activeElement.innerHTML
    ) {
      return;
    }

    // Save innerHTML for an early return check ^
    this._activeElementText = activeElement.innerHTML;
    if (!activeElement) {
      this.setState({ style: {} });
      return;
    }

    const style = this._calculateStyle(activeElement);
    if (style) {
      this.setState({ style });
    }
  };

  _calculateStyle = (target) => {
    const parentElement = ReactDOM.findDOMNode(this.props.target);
    const parentScrollLeft = parentElement.scrollLeft || 0;
    const targetRect = target.getBoundingClientRect();
    const itemRect = parentElement.getBoundingClientRect();

    // Channels have a slightly larger margin
    const isChannel = target.classList.contains('channel');
    const left = targetRect.left - itemRect.left + parentScrollLeft;

    let margin = 0;
    if (!this.props.wide) {
      margin = isChannel ? 5 : 3;
    }

    const style = {
      transform: `translateX(${left + margin}px)`,
      width: target.offsetWidth - margin * 2,
      display: 'block',
    };

    if (isChannel) {
      const channelStyle = getComputedStyle(target);
      let color = channelStyle.borderColor;

      // 'borderColor' is an empty string in Firefox
      if (color === '') {
        color = channelStyle.borderBottomColor;
      }

      style.background = color;
    }

    return style;
  };

  render() {
    const style = prefixedStyle(this.state.style);
    return <div className="v-active-item-line" style={style} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/ActiveItemLine.js