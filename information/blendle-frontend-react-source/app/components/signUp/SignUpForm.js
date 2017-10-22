import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {
  EMAIL_BLACKLISTED,
  EMAIL_CONTAINS_PLUS_SIGN,
  USER_ID_TAKEN,
  EMAIL_INVALID,
  PASSWORD_INVALID,
} from 'app-constants';
import { translate } from 'instances/i18n';
import EmailSuggestion from 'components/forms/EmailSuggestion';
import Button from 'components/Button';
import { isMobile } from 'instances/browser_environment';
import URI from 'urijs';

function isPasswordError(error) {
  return error === PASSWORD_INVALID;
}

function isEmailError(error) {
  // If the error is not speficic to any other field, show it for the email
  return !isPasswordError(error);
}

export default class SignUpForm extends React.Component {
  static propTypes = {
    onToLogin: PropTypes.func.isRequired,
    onSignUp: PropTypes.func.isRequired,
    error: PropTypes.string,
    buttonHTML: PropTypes.string,
    isLoading: PropTypes.bool,
    showPasswordField: PropTypes.bool,
  };

  state = {
    email: URI(location.href).search(true).prefill_email || '',
    password: null,
    hideError: false,
  };

  componentDidMount() {
    const isOldIE =
      window.BrowserDetect.browser === 'Explorer' && window.BrowserDetect.version <= 11;
    if (!isMobile() && !isOldIE) {
      ReactDOM.findDOMNode(this.refs.email).focus();
    }
  }

  componentWillReceiveProps() {
    this.setState({ hideError: false });
  }

  _onSubmit(ev) {
    ev.preventDefault();

    const { password } = this.state;
    const { showPasswordField } = this.props;
    const context = {};

    if (showPasswordField) {
      context.password = password;
    }

    this.props.onSignUp(this.state.email, context);
  }

  _onChangeEmail(ev) {
    const email = ev.target.value.trim();
    this.setState({ email, hideError: true });
  }

  _onChangePassword(ev) {
    this.setState({ password: ev.target.value });
  }

  _onClickError(ev) {
    this.setState({ hideError: true });

    // when clicked on a link inside the error message,
    // we asume this will be a 'show login' link
    // @TODO this should be fixed. the link should contain a href with the supposed action.
    if (ev.target.nodeName === 'A') {
      ev.preventDefault();
      if (this.props.onToLogin) {
        this.props.onToLogin(this.state.email);
      }
    }
  }

  _onSuggestion(email) {
    this.setState({ email });
  }

  _renderPasswordError() {
    const error = this.props.error;
    if (!error || this.state.hideError || !isPasswordError(error)) {
      return null;
    }

    return (
      <div onClick={this._onClickError.bind(this)} className="error-message visible">
        {translate('error.password_too_short')}
      </div>
    );
  }

  _renderEmailError() {
    const error = this.props.error;
    if (!error || this.state.hideError || !isEmailError(error)) {
      return null;
    }

    const messages = {
      [EMAIL_BLACKLISTED]: translate('app.signup.blacklisted_email_warning'),
      [USER_ID_TAKEN]: translate('deeplink.signup.email_exists'),
      [EMAIL_INVALID]: translate('error.invalid_email'),
      [EMAIL_CONTAINS_PLUS_SIGN]: translate('error.invalid_email'),
    };
    const message = messages[error] || error;
    return (
      <div
        onClick={this._onClickError.bind(this)}
        className="error-message visible"
        dangerouslySetInnerHTML={{ __html: message }}
      />
    );
  }

  _renderPasswordField() {
    if (!this.props.showPasswordField) {
      return null;
    }

    return (
      <div className="frm-field-wrapper">
        <input
          ref="password"
          value={this.state.password}
          onChange={this._onChangePassword.bind(this)}
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="off"
          className="inp inp-text inp-password"
        />
        {this._renderPasswordError()}
      </div>
    );
  }

  render() {
    return (
      <form
        onSubmit={this._onSubmit.bind(this)}
        className="frm frm-user-blendle s-active"
        name="signup"
        noValidate
      >
        <div className="frm-field-wrapper">
          <input
            ref="email"
            value={this.state.email}
            onChange={this._onChangeEmail.bind(this)}
            type="email"
            name="email"
            placeholder={translate('deeplink.signup.email')}
            autoComplete="off"
            className="inp inp-text inp-email lowercase"
          />
          <EmailSuggestion
            email={this.state.email}
            onClick={this._onSuggestion.bind(this)}
            delay={300}
          />
          {this._renderEmailError()}
        </div>
        {this._renderPasswordField()}
        <div className="frm-field-wrapper form-field-submit">
          <Button
            type="submit"
            className="btn-submit btn-blendle btn-green"
            loading={this.props.isLoading}
          >
            {this.props.buttonHTML || translate('signup.buttons.create_account')}
          </Button>
        </div>
      </form>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/signUp/SignUpForm.js