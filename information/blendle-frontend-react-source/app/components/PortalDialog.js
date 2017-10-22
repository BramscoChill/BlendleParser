import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import portalMixin from 'components/mixins/PortalMixin';
import classNames from 'classnames';

export default createReactClass({
  displayName: 'PortalDialog',

  propTypes: {
    children: PropTypes.element.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
  },

  mixins: [portalMixin('dialog-portal')],

  _onClick(e) {
    if (!e.target.classList.contains('dialog-overlay')) {
      return;
    }

    this.props.onClick(e);
  },

  render() {
    return null;
  },

  renderLayer() {
    const detect = window.BrowserDetect;
    const noOverflow = detect.browser === 'Android Browser' && detect.version < '4.4';

    const overlayClasses = classNames({
      [this.props.className]: this.props.className,
      'dialog-overlay': true,
      'no-overflow': noOverflow,
    });

    return (
      <div className={overlayClasses} onClick={this._onClick}>
        {this.props.children}
      </div>
    );
  },
});



// WEBPACK FOOTER //
// ./src/js/app/components/PortalDialog.js