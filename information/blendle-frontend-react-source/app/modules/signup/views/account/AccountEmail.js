import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import EmailSuggestion from 'components/forms/EmailSuggestion';
import SubmitPaneButton from '../SubmitPaneButton';
import PrevPaneButton from '../PrevPaneButton';
import Input from 'components/Input';
import formMixin from '../mixins/formMixin';
import { locale as i18n, translate, translateElement, config as i18nConfig } from 'instances/i18n';
import {
  EMAIL_EXISTS,
  EMAIL_BLACKLISTED,
  EMAIL_CONTAINS_PLUS_SIGN,
  USER_ID_TAKEN,
  EMAIL_INVALID,
} from 'app-constants';
import Analytics from 'instances/analytics';
import Tooltip from 'components/PortalTooltip';

const Button = require('components/Button');

const AccountEmail = createReactClass({
  displayName: 'AccountEmail',
  mixins: [formMixin],

  propTypes: {
    user: PropTypes.object,
    shareInformation: PropTypes.bool,
    error: PropTypes.object,
    onPrev: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onFacebookSignIn: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    isSkipVariant: PropTypes.bool,
  },

  getInitialState() {
    return {
      email: this.props.user.get('email') || '',
      facebookLoading: false,
      open: false,
    };
  },

  componentWillUnmount() {
    clearTimeout(this.emailTimeout);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({ valid: false });
    }
  },

  _analyticsTerms() {
    Analytics.track('Signup/Terms and Conditions');
  },

  // Override formMixin.onSubmit, because it only supports one field
  _onSubmit(event) {
    event.preventDefault();

    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });

    const values = {};
    if (this.getMainField()) {
      values.email = this.getFieldValue(this.getMainField());
    }

    if (this.refs.shareInformation) {
      values.shareInformation = this.getFieldValue(this.refs.shareInformation);
    }

    this.props.onSubmit.apply(this, [values]).then(
      (res) => {
        if (this.isMounted()) {
          this.setState({ valid: true, loading: false });
          this.blurMainField();
        }

        this.onSubmitValid && this.onSubmitValid(res);
      },
      (err) => {
        if (this.isMounted()) {
          this.setState({ valid: false, loading: false });
          this.focusAndSelectMainField();
        }

        this.onSubmitError && this.onSubmitError(err);

        // don't rethrow undefined or xhr errors
        if (!err || (err && err.xhr)) {
          return;
        }

        throw err;
      },
    );
  },

  onFacebookError(e) {
    this.setState({
      facebookLoading: false,
    });
  },

  onFacebookSignIn(ev) {
    ev.preventDefault();
    this.setState({
      facebookLoading: true,
    });
    const resetLoading = () => this.isMounted() && this.setState({ facebookLoading: false });
    this.props.onFacebookSignIn().then(resetLoading, this.onFacebookError);
  },

  useSuggestion(suggestion) {
    ReactDOM.findDOMNode(this.refs.mainField).value = suggestion;

    this.onEmailChange();
  },

  setEmailStateValue() {
    this.setState({
      email: this.getMainField().value,
    });
  },

  onEmailChange(ev) {
    if (this.state.email === '' || this.getMainField().value === '') {
      this.setEmailStateValue();
    }

    clearTimeout(this.emailTimeout);
    this.emailTimeout = setTimeout(this.setEmailStateValue, 300);

    return this.onMainFieldChange(ev);
  },

  _toggleTooltip() {
    if (this.state.open) {
      this._closeTooltip();
    } else {
      this._openTooltip();
    }
  },

  _openTooltip() {
    clearTimeout(this._openTimer);
    this._openTimer = setTimeout(() => this.setState({ open: true }), 200);
  },

  _closeTooltip() {
    clearTimeout(this._openTimer);
    this.setState({ open: false });
  },

  _onShareInfoChange(ev) {
    if (ev.target.checked) {
      Analytics.track('Opt In', { type: 'providers' });
    } else {
      Analytics.track('Opt Out', { type: 'providers' });
    }
  },

  _renderError() {
    if (!this.props.error) {
      return;
    }

    const messages = {
      [EMAIL_BLACKLISTED]: translate('app.signup.blacklisted_email_warning'),
      [USER_ID_TAKEN]: translate('deeplink.signup.email_exists'),
      [EMAIL_INVALID]: translate('error.invalid_email'),
      [EMAIL_CONTAINS_PLUS_SIGN]: translate('error.invalid_email'),
    };

    const message = messages[this.props.error.type] || this.props.error;

    return <p>{message}</p>;
  },

  _renderTitle() {
    // We're testing onboarding variant that skip parts of the onboarding. In some variants, the
    // first thing users will see is "A few final questions" while this is their second step. We
    // should show them different copy.
    if (this.props.isSkipVariant === true) {
      return translate('signup.email.title_skipped');
    }

    return translate('signup.email.title');
  },

  _renderTooltip() {
    if (this.state.open) {
      const children = [
        <span dangerouslySetInnerHTML={{ __html: translate('app.text.providers_opt_in_more') }} />,
      ];

      return (
        <Tooltip
          name="privacy-tooltip"
          position="top"
          onScroll={() => {
            const isStockAndroid = window.BrowserDetect.browser === 'Android Browser';
            if (isStockAndroid && parseFloat(window.BrowserDetect.version) <= 4.3) {
              return;
            }

            this._closeTooltip();
          }}
        >
          {children}
        </Tooltip>
      );
    }
  },

  _renderPrivacy() {
    if (!i18nConfig.sharePrivacyWithProviders) {
      return null;
    }

    return (
      <p className="privacy">
        <label className="privacy-label">
          <input
            type="checkbox"
            name="shareInformation"
            disabled={this.props.disabled}
            onChange={this._onShareInfoChange}
            ref="shareInformation"
            defaultChecked={this.props.shareInformation}
          />
          {translate('signup.about.shareInfo')}
        </label>{' '}
        <span
          className="provider-opt-in"
          onClick={this._toggleTooltip}
          onMouseEnter={this._openTooltip}
          onMouseLeave={this._closeTooltip}
        >
          {translate('signup.about.moreShareInfo')}
          {this._renderTooltip()}
        </span>
      </p>
    );
  },

  render() {
    let buttonFacebook;
    buttonFacebook = (
      <p className="facebook-sign-in">
        <Button
          className="btn-facebook"
          loading={this.state.facebookLoading}
          onClick={this.onFacebookSignIn}
        >
          {i18n.signup.email.facebook.link}
        </Button>
        <small>{i18n.signup.email.facebook.after}</small>
      </p>
    );

    return (
      <form
        className="v-signup-account-email signup-single-form slide-animation"
        onSubmit={this._onSubmit}
        noValidate
      >
        <h2>{this._renderTitle()}</h2>
        <p className="input-paragraph">
          <Input
            className={this.getFieldClassNames()}
            type="email"
            name="email"
            key="email"
            autoComplete="off"
            spellCheck="false"
            ref="mainField"
            disabled={this.props.disabled}
            placeholder={i18n.signup.email.placeholder}
            onChange={this.onEmailChange}
            readOnly={this.props.disabled}
            defaultValue={this.state.email}
          />
          <EmailSuggestion email={this.state.email} onClick={this.useSuggestion} />
        </p>
        {this._renderError()}
        <div className="cta-buttons">
          <SubmitPaneButton
            loading={this.state.loading || this.props.loading}
            disabled={!this.state.email || !this.state.navigateNext}
          />
          {buttonFacebook}
        </div>
        {translateElement(
          <p className="conditions" onClick={this._analyticsTerms} />,
          'signup.about.conditions',
        )}
        {this._renderPrivacy()}
        <PrevPaneButton onClick={this.props.onPrev} />
      </form>
    );
  },
});

export default AccountEmail;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/account/AccountEmail.js