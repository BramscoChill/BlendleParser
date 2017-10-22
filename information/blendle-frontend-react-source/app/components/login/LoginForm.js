import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'instances/i18n';
import { STATUS_PENDING, STATUS_ERROR, INVALID_TOKEN, MISSING_PASSWORD } from 'app-constants';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Link from 'components/Link';
import { Form } from '@blendle/lego';
import EmailLoginLink from './EmailLoginLink';

export default class LoginForm extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    onToReset: PropTypes.func,
    onSendLoginEmail: PropTypes.func.isRequired,
    loginState: PropTypes.object,
    emailLoginState: PropTypes.object,
    initialUsername: PropTypes.string,
    buttonHTML: PropTypes.string,
    isOpen: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      username: props.initialUsername || '',
      password: '',
    };
  }

  componentDidMount() {
    this._autofocusInput();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.emailLoginState !== this.props.emailLoginState) {
      this.setState({ hideEmailLogin: false });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this._autofocusInput();
    }
  }

  _autofocusInput = () => {
    if (!(window.BrowserDetect.browser === 'Explorer' && window.BrowserDetect.version <= 11)) {
      if (!this.props.initialUsername) {
        this._usernameInput.focus();
      } else {
        this._passwordInput.focus();
      }
    }
  };

  _onSubmit = () => {
    if (this.state.username.trim()) {
      this.props.onLogin(this.state.username.trim(), this.state.password);
    }
  };

  _onSendLoginEmail = () => {
    this.props.onSendLoginEmail(this.state.username.trim());
  };

  _onChangeInput = (ev) => {
    this.setState({
      [ev.target.name]: ev.target.value,
      hideEmailLogin: true,
    });
  };

  _renderError() {
    const loginState = this.props.loginState;
    if (loginState.status !== STATUS_ERROR) {
      return;
    }

    if (loginState.error.type === INVALID_TOKEN || loginState.error.type === MISSING_PASSWORD) {
      return (
        <div className="error-message visible">
          {translate('error.invalid_username_or_password')}
        </div>
      );
    }
    return <div className="error-message visible">{translate('error.invalid_email')}</div>;
  }

  _renderEmailLoginLink() {
    const loginState = this.props.loginState;
    let component = null;

    if (
      !this.state.hideEmailLogin &&
      loginState.status === STATUS_ERROR &&
      (loginState.error.type === INVALID_TOKEN || loginState.error.type === MISSING_PASSWORD)
    ) {
      component = (
        <EmailLoginLink
          email={this.state.username.trim()}
          key="link"
          emailLoginState={this.props.emailLoginState}
          onSendLoginEmail={event => this._onSendLoginEmail(event)}
        />
      );
    }

    return (
      <ReactCSSTransitionGroup
        key="link"
        component="div"
        transitionName="slide"
        transitionEnter
        transitionEnterTimeout={500}
        transitionLeave={false}
        children={component}
      />
    );
  }

  _renderLoginButton() {
    const className = classNames('btn', 'btn-submit', 'btn-blendle', 'btn-green', {
      's-loading': this.props.loginState.status === STATUS_PENDING,
    });

    return (
      <button
        type="submit"
        className={className}
        dangerouslySetInnerHTML={{
          __html: this.props.buttonHTML || translate('login.dropdown.blendle.submit'),
        }}
      />
    );
  }

  render() {
    return (
      <Form
        name="login"
        onSubmit={this._onSubmit}
        className="frm frm-user-blendle s-active"
        noValidate
      >
        <div className="frm-field-wrapper">
          <input
            onChange={this._onChangeInput}
            defaultValue={this.state.username}
            type="email"
            name="username"
            placeholder={translate('login.dropdown.blendle.username')}
            autoComplete="off"
            className="inp inp-text inp-email lowercase"
            ref={(c) => {
              this._usernameInput = c;
            }}
          />
          {this._renderError()}
        </div>

        {this._renderEmailLoginLink()}
        <div className="frm-field-wrapper password-wrapper">
          <input
            onChange={this._onChangeInput}
            type="password"
            name="password"
            placeholder={translate('login.dropdown.blendle.password')}
            autoComplete="off"
            className="inp inp-text inp-password"
            ref={(c) => {
              this._passwordInput = c;
            }}
          />
        </div>
        <div className="frm-field-wrapper form-field-submit">{this._renderLoginButton()}</div>
        <p>
          <Link className="forgot-password" href="/login/reset" onClick={this.props.onToReset}>
            {translate('login.dropdown.to_reset_token')}
          </Link>
        </p>
      </Form>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/login/LoginForm.js