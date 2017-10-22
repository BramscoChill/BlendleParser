const i18n = require('instances/i18n').locale;
const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const SubmitPaneButton = require('../SubmitPaneButton');
const PrevPaneButton = require('../PrevPaneButton');
const formMixin = require('../mixins/formMixin');
const Input = require('components/Input');
const passwordStrengthMixin = require('components/mixins/passwordStrengthMixin');

const AccountPassword = createReactClass({
  displayName: 'AccountPassword',
  mixins: [formMixin, passwordStrengthMixin],

  propTypes: {
    disabled: PropTypes.bool,
    user: PropTypes.object,
    onPrev: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      error: null,
    };
  },

  componentWillMount() {
    this.updatePasswordScore(this.props.user.get('password') || '');
  },

  changePassword(ev) {
    this.updatePasswordScore(ev.target.value || '');
    this.onMainFieldChange();
  },

  onPasswordSubmit(ev) {
    // password has to be at least 5 chars long
    if (this.getMainField().value.length < 5) {
      this.setState({
        error: i18n.error.password_too_short,
      });
      ev.preventDefault();
      return null;
    }
    return this.onSubmit(ev);
  },

  onSubmitError(err) {
    this.setState({
      error: err,
    });
  },

  _getErrorMessage() {
    if (typeof this.state.error === 'string') {
      return this.state.error;
    }

    return (
      i18n.signup.error.server_errors[this.state.error.message] || i18n.app.error.error_default
    );
  },

  render() {
    let strengthColor;
    if (this.getMainField() && this.getMainField().value.length) {
      strengthColor = {
        color: this.getPasswordScoreColor(),
      };
    }

    let error;
    if (this.state.error) {
      error = <p className="input-error">{this._getErrorMessage()}</p>;
    }

    return (
      <form
        className="v-signup-account-password signup-single-form slide-animation"
        onSubmit={this.onPasswordSubmit}
      >
        <h2>{i18n.signup.password.title}</h2>
        <p className="input-paragraph">
          <Input
            className={this.getFieldClassNames()}
            style={strengthColor}
            ref="mainField"
            type="password"
            name="password"
            readOnly={this.props.disabled}
            autoComplete="off"
            placeholder={i18n.signup.password.placeholder}
            disabled={this.props.disabled}
            onChange={this.changePassword}
            defaultValue={this.props.user.get('password') || ''}
          />
        </p>
        {error}

        <SubmitPaneButton
          disabled={!this.state.navigateNext || this.props.disabled}
          loading={this.state.loading}
        />
        <PrevPaneButton onClick={this.props.onPrev} />
      </form>
    );
  },
});

module.exports = AccountPassword;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/account/AccountPassword.js