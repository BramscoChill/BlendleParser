import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'instances/i18n';
import classNames from 'classnames';

class VerifyEmail extends React.Component {
  static propTypes = {
    isResend: PropTypes.bool,
    emailExists: PropTypes.bool,
    user: PropTypes.object.isRequired,
    onResend: PropTypes.func.isRequired,
    onChangeEmail: PropTypes.func.isRequired,
  };

  state = {
    changeEmailFormVisible: false,
    email: this.props.user.get('email'),
  };

  _onResend = (ev) => {
    ev.preventDefault();
    this.props.onResend();
  };

  _onSubmitChangeEmail = (ev) => {
    ev.preventDefault();

    this.props.onChangeEmail(this.state.email);
    this._toggleChangeEmailForm();
  };

  _onChangeEmailChange = (ev) => {
    this.setState({
      email: ev.target.value,
    });
  };

  _onCancelChangeEmailForm = (ev) => {
    ev.preventDefault();
    this.setState({
      email: this.props.user.get('email'),
    });

    this._toggleChangeEmailForm();
  };

  _toggleChangeEmailForm = () => {
    this.setState({
      changeEmailFormVisible: !this.state.changeEmailFormVisible,
    });
  };

  render() {
    let content;
    if (this.state.changeEmailFormVisible) {
      content = this._renderChangeEmailForm();
    } else if (this.props.emailExists) {
      content = this._renderEmailExists();
    } else {
      content = this._renderVerify();
    }

    let footer;
    if (!this.state.changeEmailFormVisible) {
      footer = this._renderFooter();
    }

    return (
      <form className="v-verify-email" onSubmit={this.onSubmit}>
        {content}
        {footer}
      </form>
    );
  }

  _renderVerify = () => {
    const user = this.props.user;
    return i18n.translateElement(
      <div className="verify-content" />,
      'signup.verifyEmail.body',
      [user.get('first_name'), this.state.email],
      false,
    );
  };

  _renderEmailExists = () => (
    <div className="verify-content email-taken">
      <h1>{i18n.translate('signup.emailexists.title')}</h1>
      <p>
        <a className="btn btn-white" href={`/logout/${this.state.email}`}>
          {i18n.translate('app.buttons.login')}
        </a>
      </p>
    </div>
  );

  _renderChangeEmailForm = () => (
    <form className="verify-content change-email" onSubmit={this._onSubmitChangeEmail}>
      <h1>{i18n.translate('signup.email.edit')}</h1>
      <fieldset>
        <p>
          <input
            className="inp inp-text inp-fullwidth"
            size="30"
            type="email"
            ref="changeEmail"
            name="email"
            onChange={this._onChangeEmailChange}
            placeholder={i18n.translate('signup.email.placeholder')}
            value={this.state.email}
          />
        </p>
        <p>
          <input
            className="btn btn-fullwidth"
            type="submit"
            value={i18n.translate('app.buttons.edit')}
          />
        </p>
      </fieldset>
      <p>
        <a href="" onClick={this._onCancelChangeEmailForm}>
          {i18n.translateElement('signup.email.back', false)}
        </a>
      </p>
    </form>
  );

  _renderResendLink = () => {
    const resendClasses = classNames('resend', {
      done: this.props.isResend,
    });

    return (
      <p className={resendClasses}>
        {i18n.translateElement(
          <a href="#" onClick={this._onResend} />,
          'signup.verifyEmail.resend',
        )}{' '}
        {i18n.translateElement(
          <a href="#" onClick={this._toggleChangeEmailForm} />,
          'signup.email.change_email',
        )}
      </p>
    );
  };

  _renderFooter = () => <div className="verify-footer">{this._renderResendLink()}</div>;
}

module.exports = VerifyEmail;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/verify/VerifyEmail.js