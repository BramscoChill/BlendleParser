import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Backdrop } from '@blendle/lego';
import classNames from 'classnames';
import CheckIcon from 'components/icons/Check';
import CSS from './AcquiredBackdrop.scss';

export default class AcquiredBackdrop extends PureComponent {
  static propTypes = {
    innerColor: PropTypes.string,
    backdropClassName: PropTypes.string,
  };

  render() {
    const { innerColor, backdropClassName } = this.props;

    return (
      <Backdrop
        className={CSS.acquiredBackdrop}
        color="transparent"
        innerColor={innerColor}
        innerClassName={classNames(CSS.acquiredBackdropShape, backdropClassName)}
      >
        <CheckIcon className={CSS.acquiredIcon} />
      </Backdrop>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/AcquiredBackdrop/index.js