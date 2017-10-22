import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'instances/i18n';
import EmailSuggestion from './EmailSuggestion';
import { USER_ID_TAKEN } from 'app-constants';

export default class extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    error: PropTypes.object,
  };

  state = {
    email: this.props.email,
  };

  _onInputEmailChange = (ev) => {
    this.setState({
      email: ev.target.value,
    });
  };

  _onSuggestion = (email) => {
    this.setState({
      email,
    });
  };

  _renderEmailExists = () => {
    const error = this.props.error;
    if (error && error.type === USER_ID_TAKEN) {
      const email = this.props.email;
      return (
        <p className="email-exists">
          {i18n.translate('signup.user.email_used')}{' '}
          <a href={`/logout/${email}`}>{i18n.translate('signup.email.login_as', [email])}</a>
        </p>
      );
    }

    return null;
  };

  render() {
    return (
      <form className="v-change-email-form" name="change-email" onSubmit={this._onSubmit}>
        <h2>{i18n.translate('deeplink.signup.email')}</h2>
        <p>
          <input
            className="inp inp-text inp-fullwidth"
            ref="email"
            type="email"
            name="email"
            onChange={this._onInputEmailChange}
            value={this.state.email}
          />
          <EmailSuggestion email={this.state.email} onClick={this._onSuggestion} />
        </p>
        {this._renderEmailExists()}
        <p>
          <input
            className="btn btn-submit btn-fullwidth"
            type="submit"
            value={i18n.translate('app.buttons.edit')}
          />
        </p>
      </form>
    );
  }

  _onSubmit = (ev) => {
    ev.preventDefault();
    this.props.onSubmit(this.state.email);
  };
}



// WEBPACK FOOTER //
// ./src/js/app/components/forms/ChangeEmailForm.js