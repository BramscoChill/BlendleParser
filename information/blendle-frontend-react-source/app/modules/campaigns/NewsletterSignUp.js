import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Logo from 'components/Logo';
import Link from 'components/Link';
import { translate, translateElement } from 'instances/i18n';
import BackboneView from 'components/shared/BackboneView';
import SignUpForm from 'views/forms/signup';
import { isMobile } from 'instances/browser_environment';
import OpenMailButton from 'components/buttons/OpenMail';
import CSS from './NewsletterSignUpUS.scss';

export default class NewsletterSignUp extends React.Component {
  static propTypes = {
    analyticsEvent: PropTypes.string,
    onSignUp: PropTypes.func.isRequired,
    onShowLogin: PropTypes.func.isRequired,
    onFacebookConnect: PropTypes.func.isRequired,
    showUSVersion: PropTypes.bool,
  };

  state = {
    signupSuccess: false,
    editEmail: false,
  };

  componentWillMount() {
    this._form = new SignUpForm({
      template: require('templates/modules/campaigns/newsletterSignUp'),
      facebookButtonClassName: 'inline',
      analyticsEvent: this.props.analyticsEvent,
      onFacebookConnected: this.props.onFacebookConnect,
      onSignUp: this.props.onSignUp,
      onShowLogin: this.props.onShowLogin,
      onSignupSuccess: this._onShowVerification.bind(this),
      autofocus: !isMobile(),
    });
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this._form.el);
  }

  _onShowForm(e) {
    e.preventDefault();

    ReactDOM.unmountComponentAtNode(this._form.el);
    this.setState({ editEmail: true });
    this._form.render();
  }

  _onShowVerification(user, resent = false) {
    this.setState({
      signupSuccess: true,
      editEmail: false,
    });

    let resentMessage;
    if (resent) {
      resentMessage = (
        <p className="resent">
          <strong>{translate('campaigns.newsletter.mail_resent')}</strong>
        </p>
      );
    }

    // the verification messages need to be rendered on the form el,
    // since the backbone form view still handles the resend logic.
    ReactDOM.render(
      <div className="v-newsletter-verification">
        <h1>{translate('campaigns.newsletter.mail_sent')}</h1>
        <p>{translateElement('campaigns.newsletter.mailed_at', [user.get('email')], false)}</p>
        <OpenMailButton email={user.get('email')} className={CSS.openMail} />
        {resentMessage}
        <span className="email-links">
          <p className="resend">
            <a href="#" onClick={this._onShowVerification.bind(this, user, true)}>
              {translate('campaigns.newsletter.mail_not_received')}
            </a>
          </p>
          <p className="change">
            <a onClick={this._onShowForm.bind(this)} href="#">
              {translate('campaigns.newsletter.mail_change')}
            </a>
          </p>
        </span>
      </div>,
      this._form.el,
    );
  }

  _renderIntro() {
    if (this.state.editEmail) {
      return <h2 className="reenter">{translate('campaigns.newsletter.reenter_mail')}</h2>;
    }

    if (this.state.signupSuccess) {
      return null;
    }

    return (
      <span>
        <h1>{translate('cta.newsletter.title')}</h1>
        {translateElement(<h2 />, 'campaigns.newsletter.subtitle', false)}
        <div className="illustration">
          <img src="/img/illustrations/iphone-newsletter.png" alt="" />
        </div>
      </span>
    );
  }

  _renderUS() {
    let formTitle;
    if (!this.state.signupSuccess) {
      formTitle = <h3>{translate('campaigns.newsletter_us.formTitle')}</h3>;
    }

    return (
      <div className={CSS.container}>
        <div className={CSS.intro}>
          <h1 className={CSS.title}>{translate('campaigns.newsletter_us.title')}</h1>
          {translateElement(<h2 className={CSS.subtitle} />, 'campaigns.newsletter_us.subtitle')}
        </div>
        <div className={CSS.formContainer}>
          {formTitle}
          <BackboneView className={CSS.form} view={this._form} />
          <Link className={CSS.logo} href="/">
            <Logo />
          </Link>
        </div>
        <div className={CSS.legal}>
          <p>
            {translateElement('deeplink.footer.terms_conditions', false)}{' '}
            {translateElement('deeplink.footer.cookies', false)}
          </p>
        </div>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1588471818145525&ev=PageView&noscript=1"
          ariaHidden
        />
      </div>
    );
  }

  render() {
    if (this.props.showUSVersion) {
      return this._renderUS();
    }

    return (
      <section className="v-newsletter-signup">
        <div className="body">
          {this._renderIntro()}
          <BackboneView view={this._form} />
        </div>
        <footer>
          <p>
            {translateElement('deeplink.footer.terms_conditions', false)}{' '}
            {translateElement('deeplink.footer.cookies', false)}
          </p>
          <Link className={CSS.logo} href="/">
            <Logo />
          </Link>
        </footer>
      </section>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/campaigns/NewsletterSignUp.js