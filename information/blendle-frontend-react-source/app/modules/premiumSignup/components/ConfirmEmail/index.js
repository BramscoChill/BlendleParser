import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getHdImage } from 'helpers/images';
import Link from 'components/Link';
import OpenMailButton from 'components/buttons/OpenMail';
import DialogHeader from 'modules/premiumSignup/components/DialogHeader';
import DialogSubheader from 'modules/premiumSignup/components/DialogSubheader';
import { translateElement } from 'instances/i18n';
import { track } from 'helpers/premiumOnboardingEvents';
import Analytics from 'instances/analytics';
import CSS from './ConfirmEmail.scss';

class ConfirmEmail extends PureComponent {
  static propTypes = {
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    resend: PropTypes.bool,
    affiliateSuccessUrl: PropTypes.string,
    buttonText: PropTypes.string,
    bodyCopy: PropTypes.string,
    isDeeplinkSignUp: PropTypes.bool,
  };

  componentDidMount() {
    track(Analytics, 'Signup/Email Confirmation');
  }

  _renderResend() {
    if (this.props.resend) {
      return translateElement('signup.verifyEmail.isResend', [this.props.email]);
    }

    return null;
  }

  _renderNoEmailLink = () => {
    if (this.props.affiliateSuccessUrl) {
      return null;
    }

    return (
      <Link
        href="/getpremium/change-email"
        className={CSS.emailLink}
        data-test-identifier="no-email-link"
      >
        Ik heb geen mail ontvangen
      </Link>
    );
  };

  _renderCta = () => {
    if (this.props.affiliateSuccessUrl) {
      const classes = classNames('btn', 'btn-green', CSS.confirm);

      return (
        <Link href={this.props.affiliateSuccessUrl} className={classes}>
          {this.props.buttonText}
        </Link>
      );
    }

    return <OpenMailButton email={this.props.email} />;
  };

  _renderTitle = () => {
    const { firstName, isDeeplinkSignUp } = this.props;

    if (isDeeplinkSignUp) {
      return firstName ? `${firstName}, check je mail!` : 'Check je mail!';
    }

    return firstName ? `${firstName}, je bent bijna zover!` : 'Je bent bijna zover!';
  };

  _renderSubtitle = () => {
    const { bodyCopy, email, isDeeplinkSignUp } = this.props;

    if (isDeeplinkSignUp) {
      return !bodyCopy
        ? `We hebben je op ${email} een link gemaild naar het gratis artikel.`
        : bodyCopy;
    }

    return !bodyCopy
      ? `Alleen nog even je e-mailadres bevestigen en je bent klaar! We hebben een linkje gemaild naar ${email}.`
      : bodyCopy.replace('${email}', email);
  };

  render() {
    const emailConfirmImageLink = getHdImage(
      '/img/illustrations/check_email.gif',
      '/img/illustrations/check_email@2x.gif',
    );

    return (
      <div data-test-identifier="email-confirm-screen">
        <DialogHeader>{this._renderTitle()}</DialogHeader>
        <DialogSubheader>{this._renderSubtitle()}</DialogSubheader>
        <img
          src={emailConfirmImageLink}
          width="400"
          height="270"
          role="presentation"
          alt=""
          className={CSS.image}
        />
        <div className={CSS.actions}>
          {this._renderCta()}
          {this._renderResend()}
          {this._renderNoEmailLink()}
        </div>
      </div>
    );
  }
}

export default ConfirmEmail;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/ConfirmEmail/index.js