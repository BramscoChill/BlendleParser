import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextInput, EmailInput, PasswordInput, Button, Form } from '@blendle/lego';
import {
  STATUS_PENDING,
  STATUS_ERROR,
  XHR_ERROR,
  USER_ID_TAKEN,
  FIRST_NAME_INVALID,
  PASSWORD_INVALID,
} from 'app-constants';
import { translate } from 'instances/i18n';
import { replaceLastPath } from 'helpers/url';
import {
  emailErrorMessages,
  passwordErrorMessages,
  getErrorMessage,
} from 'helpers/inputErrorMessages';
import FacebookConnectContainer from 'components/facebookConnect/FacebookConnectContainer';
import Link from 'components/Link';
import CSS from './SignUp.scss';

class SignUp extends PureComponent {
  static propTypes = {
    onFacebookOpen: PropTypes.func.isRequired,
    onFacebookError: PropTypes.func.isRequired,
    onFacebookLogin: PropTypes.func.isRequired,
    onFacebookSignUp: PropTypes.func.isRequired,
    facebookSignUpContext: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    signupStatus: PropTypes.number,
    error: PropTypes.string,
    buttonText: PropTypes.string,
    disabled: PropTypes.bool,
    userFormValues: PropTypes.object.isRequired,
    onUserFormInput: PropTypes.func,
    signUpType: PropTypes.string,
    locationInLayout: PropTypes.string,
    autoFocus: PropTypes.bool,
  };

  static defaultProps = {
    buttonText: 'Start je gratis week',
    onUserFormInput: () => {},
    autoFocus: true,
  };

  _onChange = (e) => {
    const name = e.target.getAttribute('name');
    const { value } = e.target;

    this.props.onUserFormInput({ name, value });
  };

  _getEmailErrorMessage = () => {
    if (this.props.error === USER_ID_TAKEN) {
      return (
        <Link
          href={replaceLastPath(window.location.pathname, 'login')}
          className={CSS.emailError}
          dangerouslySetInnerHTML={{
            __html: getErrorMessage(this.props.error, emailErrorMessages),
          }}
        />
      );
    }

    return getErrorMessage(this.props.error, emailErrorMessages);
  };

  _getPasswordErrorMessage = () => {
    if (this.props.error === PASSWORD_INVALID && this.props.userFormValues.password.length < 5) {
      return translate('error.password_too_short');
    }

    return getErrorMessage(this.props.error, passwordErrorMessages);
  };

  _renderError() {
    const { signupStatus, error } = this.props;

    if (signupStatus === STATUS_ERROR && error === XHR_ERROR) {
      return (
        <div className={CSS.errorMessage} data-test-identifier="premium-signup-error-message">
          {translate('app.error.error_default')}
        </div>
      );
    }

    return null;
  }

  render() {
    const {
      signupStatus,
      facebookSignUpContext,
      buttonText,
      locationInLayout,
      autoFocus,
      onFacebookOpen,
      onFacebookError,
      onFacebookLogin,
      onFacebookSignUp,
      onSubmit,
      disabled,
      userFormValues,
      signUpType,
      error,
    } = this.props;

    const emailError = this._getEmailErrorMessage();
    const passwordError = this._getPasswordErrorMessage();

    return (
      <div className={CSS.signUp}>
        <FacebookConnectContainer
          buttonText={translate('deeplink.signup.facebook')}
          analyticsPayload={{ login_type: 'manual', location_in_layout: locationInLayout }}
          onClick={onFacebookOpen}
          onLogin={onFacebookLogin}
          onSignUp={onFacebookSignUp}
          onError={onFacebookError}
          signUpType={signUpType}
          signUpContext={facebookSignUpContext}
        />
        <span className={CSS.divider}>{translate('app.text.or')}</span>
        <Form
          name="premium-signup"
          onSubmit={onSubmit}
          className={CSS.signUpForm}
          disabled={disabled}
        >
          <TextInput
            name="firstname"
            autoFocus={autoFocus}
            value={userFormValues.firstname}
            className={CSS.clearGlobalMargin}
            placeholder="Wat is je voornaam?"
            onChange={this._onChange}
            error={error === FIRST_NAME_INVALID}
          />
          <EmailInput
            name="email"
            value={userFormValues.email}
            placeholder="Wat is je e-mailadres?"
            className={CSS.clearGlobalMargin}
            onChange={this._onChange}
            error={!!emailError}
            message={emailError}
          />
          <PasswordInput
            name="password"
            value={userFormValues.password}
            className={CSS.clearGlobalMargin}
            placeholder="Kies je wachtwoord"
            onChange={this._onChange}
            error={!!passwordError}
            message={this._getPasswordErrorMessage()}
          />
          <Button
            type="submit"
            className="btn-fullwidth"
            isLoading={signupStatus === STATUS_PENDING}
          >
            {buttonText}
          </Button>
          {this._renderError()}
        </Form>
      </div>
    );
  }
}

export default SignUp;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/SignUpForm/index.js