import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DialogFooter } from '@blendle/lego';
import Link from 'components/Link';
import CSS from './PublicationsFooter.scss';

class PublicationsFooter extends PureComponent {
  static propTypes = {
    onNext: PropTypes.func.isRequired,
    successUrl: PropTypes.string.isRequired,
  };

  render() {
    const buttonStyles = classNames('btn', [CSS.nextButton]);
    const { successUrl, onNext } = this.props;

    return (
      <DialogFooter className={CSS.footer}>
        <Link
          className={buttonStyles}
          onClick={onNext}
          href={successUrl}
          data-test-identifier="nextButton"
        >
          Oké, ga door
        </Link>
      </DialogFooter>
    );
  }
}

export default PublicationsFooter;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/PublicationsFooter/index.js