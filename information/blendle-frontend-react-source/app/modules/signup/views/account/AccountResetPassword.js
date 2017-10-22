const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const Translate = require('components/shared/Translate');
const i18n = require('instances/i18n').locale;
const PrevPaneButton = require('../PrevPaneButton');
const formMixin = require('../mixins/formMixin');
const passwordStrengthMixin = require('components/mixins/passwordStrengthMixin');
const Input = require('components/Input');
const UserModel = require('models/user');

const AccountResetPassword = createReactClass({
  displayName: 'AccountResetPassword',
  mixins: [formMixin, passwordStrengthMixin],

  propTypes: {
    disabled: PropTypes.bool,
    token: PropTypes.string.isRequired,
    onPrev: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  },

  changePassword(ev) {
    this.updatePasswordScore(ev.target.value || '');
    this.onMainFieldChange();
  },

  onResetSubmit(ev) {
    ev.preventDefault();

    this.setState({ error: null });

    // password has to be at least 5 chars long
    const modelExpressions = UserModel.prototype.expressions;
    if (!modelExpressions.password.test(this.getMainField().value)) {
      this.setState({
        error: 'error.password_too_short',
      });
      return null;
    }

    // also send the token as an argument to the onsubmit method
    return this.props.onSubmit(this.getMainField().value, this.props.token).catch(() => {
      if (!this.isMounted()) return;
      this.setState({
        error: 'login.reset_token_invalid',
      });
    });
  },

  render() {
    const strengthColor = {
      color: this.getPasswordScoreColor(),
    };

    let error;
    if (this.state.error) {
      error = (
        <Translate nodeName="p" className="input-error" find={this.state.error} sanitize={false} />
      );
    }

    return (
      <form
        className="v-signup-account-password signup-single-form slide-animation"
        onSubmit={this.onResetSubmit}
      >
        <h2>{i18n.signup.resetPassword.title}</h2>
        <p>
          <Input
            className={this.getFieldClassNames()}
            style={strengthColor}
            ref="mainField"
            type="password"
            name="password"
            disabled={this.props.disabled}
            readOnly={this.props.disabled}
            autoComplete="off"
            placeholder={i18n.signup.resetPassword.placeholder}
            onChange={this.changePassword}
          />
        </p>
        {error}
        <Input
          type="submit"
          className="btn btn-submit"
          value={i18n.signup.resetPassword.submit}
          disabled={!this.state.navigateNext || this.props.disabled}
        />
        <PrevPaneButton onClick={this.props.onPrev} />
      </form>
    );
  },
});

module.exports = AccountResetPassword;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/account/AccountResetPassword.js