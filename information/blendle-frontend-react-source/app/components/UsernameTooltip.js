import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import dropdownMixin from 'components/mixins/DropdownMixin';
import PortalTooltip from 'components/PortalTooltip';

export default createReactClass({
  displayName: 'UsernameTooltip',

  propTypes: {
    username: PropTypes.string.isRequired,
    className: PropTypes.string,
    children: PropTypes.object,
    position: PortalTooltip.propTypes.position,
  },

  mixins: [dropdownMixin()],

  defaultProps: {
    position: 'top',
  },

  _openTimer: null,

  _showTooltip() {
    clearTimeout(this._openTimer);
    this._openTimer = setTimeout(this.openDropdown, 200);
  },

  _hideTooltip() {
    clearTimeout(this._openTimer);
    this.closeDropdown();
  },

  _renderTooltip() {
    if (!this.state.open) {
      return false;
    }

    return (
      <PortalTooltip name="username" onScroll={this._hideTooltip} position={this.props.position}>
        {this.props.username}
      </PortalTooltip>
    );
  },

  render() {
    return (
      <div
        className={this.props.className}
        onClick={this._showTooltip}
        onMouseEnter={this._showTooltip}
        onMouseLeave={this._hideTooltip}
      >
        {this.props.children}
        {this._renderTooltip()}
      </div>
    );
  },
});



// WEBPACK FOOTER //
// ./src/js/app/components/UsernameTooltip.js