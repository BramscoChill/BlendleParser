import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CSS from './DialogSubheader.scss';

class DialogSubheader extends PureComponent {
  static propTypes = {
    children: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  render() {
    const { children, className } = this.props;

    return <h3 className={`${CSS.subheader} ${className}`}>{children}</h3>;
  }
}

export default DialogSubheader;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/DialogSubheader/index.js