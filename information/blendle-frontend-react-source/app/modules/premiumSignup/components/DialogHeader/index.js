import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSS from './DialogHeader.scss';

class DialogHeader extends PureComponent {
  static propTypes = {
    children: PropTypes.string.isRequired,
  };

  render() {
    const { children, className } = this.props;
    const headerClasses = classNames(className, CSS.header);

    return <h1 className={headerClasses}>{children}</h1>;
  }
}

export default DialogHeader;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/DialogHeader/index.js