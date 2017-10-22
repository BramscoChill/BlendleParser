import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import emailProvider from 'helpers/emailProviderWebclient';
import Link from 'components/Link';
import EnvelopeIcon from 'components/icons/Envelope';
import { translate } from 'instances/i18n';
import classNames from 'classnames';
import CSS from './OpenMail.scss';

class OpenMailButton extends PureComponent {
  static propTypes = {
    email: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  render() {
    const { email, className } = this.props;

    if (emailProvider(email)) {
      const classes = classNames('btn btn-green', CSS.openMail, { [className]: className });

      return (
        <Link href={emailProvider(email)} className={classes}>
          <EnvelopeIcon height="18" className={CSS.envelope} />
          {translate('settings.emails.go_to_mailbox')}
        </Link>
      );
    }

    return null;
  }
}

export default OpenMailButton;



// WEBPACK FOOTER //
// ./src/js/app/components/buttons/OpenMail/index.js