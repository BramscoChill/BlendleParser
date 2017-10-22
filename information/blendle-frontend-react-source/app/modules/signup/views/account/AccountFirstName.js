const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const Translate = require('components/shared/Translate');
const i18n = require('instances/i18n').locale;
const SubmitPaneButton = require('../SubmitPaneButton');
const formMixin = require('../mixins/formMixin');
const Input = require('components/Input');

const AccountFirstName = createReactClass({
  displayName: 'AccountFirstName',
  mixins: [formMixin],

  propTypes: {
    user: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      hasValue: false,
    };
  },

  _onChangeInput(e) {
    this.setState({
      hasValue: !!e.target.value.length,
    });

    this.onMainFieldChange(e);
  },

  _getTitle() {
    if (!this.state.hasValue) {
      return i18n.signup.firstName.title;
    }

    return i18n.signup.firstName.title_verify;
  },

  _getButtonText() {
    if (!this.state.hasValue) {
      return null;
    }

    return i18n.signup.next_verify;
  },

  render() {
    const buttonDisabled = !this.state.navigateNext || this.props.disabled;

    return (
      <form
        name="form-firstname"
        className="v-signup-account-first-name signup-single-form slide-animation"
        onSubmit={this.onSubmit}
      >
        <h2>{this._getTitle()}</h2>
        <p className="input-paragraph">
          <Input
            className={this.getFieldClassNames()}
            type="text"
            name="firstName"
            autoComplete="off"
            placeholder={i18n.signup.firstName.placeholder}
            spellCheck="false"
            onChange={this._onChangeInput}
            ref="mainField"
            disabled={this.props.disabled}
            readOnly={this.props.disabled}
            defaultValue={this.props.user.get('first_name') || ''}
          />
        </p>
        <SubmitPaneButton value={this._getButtonText()} disabled={buttonDisabled} />
      </form>
    );
  },
});

module.exports = AccountFirstName;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/account/AccountFirstName.js