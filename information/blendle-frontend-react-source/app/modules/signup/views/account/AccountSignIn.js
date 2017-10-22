const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const Translate = require('components/shared/Translate');
const i18n = require('instances/i18n').locale;
const SubmitPaneButton = require('../SubmitPaneButton');
const PrevPaneButton = require('../PrevPaneButton');
const formMixin = require('../mixins/formMixin');
const Input = require('components/Input');

const AccountSignIn = createReactClass({
  displayName: 'AccountSignIn',
  mixins: [formMixin],
  mainField: 'password',

  propTypes: {
    user: PropTypes.object,
    onPrev: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onForgotPassword: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      forgotMail: null, // no email has been sent
    };
  },

  onForgotPassword(ev) {
    const self = this;
    ev.preventDefault();

    this.props.onForgotPassword(this.props.user.get('email')).then(
      () => {
        self.setState({ forgotMail: true });
      },
      () => {
        self.setState({ forgotMail: false });
      },
    );
  },

  render() {
    let passwordLink;
    if (this.state.forgotMail === null) {
      passwordLink = (
        <small>
          <a onClick={this.onForgotPassword}>{i18n.signup.signin.forgotPassword}</a>
        </small>
      );
    } else if (this.state.forgotMail) {
      passwordLink = (
        <small className="l-success">
          <Translate
            find="signup.signin.forgotPasswordSend"
            args={[this.props.user.get('email')]}
            sanitize={false}
          />
        </small>
      );
    } else {
      passwordLink = (
        <small>
          <a onClick={this.onForgotPassword}>{i18n.signup.signin.forgotPasswordRetry}</a>
        </small>
      );
    }

    return (
      <form
        className="v-signup-account-signin signup-single-form slide-animation"
        onSubmit={this.onSubmit}
        noValidate
      >
        <h2>{i18n.signup.signin.title}</h2>
        <p>
          <Input
            className={this.getFieldClassNames()}
            type="password"
            name="password"
            autoComplete="off"
            ref="mainField"
            onChange={this.onMainFieldChange}
            placeholder={i18n.signup.signin.placeholder}
          />
        </p>
        <SubmitPaneButton
          value={i18n.signup.signin.submit}
          disabled={!this.state.navigateNext || this.props.disabled}
          loading={this.state.loading}
        >
          {passwordLink}
        </SubmitPaneButton>

        <PrevPaneButton onClick={this.props.onPrev} />
      </form>
    );
  },
});

module.exports = AccountSignIn;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/account/AccountSignIn.js