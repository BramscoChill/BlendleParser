const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const Translate = require('components/shared/Translate');
const i18n = require('instances/i18n').locale;
const SubmitPaneButton = require('../SubmitPaneButton');
const PrevPaneButton = require('../PrevPaneButton');
const Input = require('components/Input');
const formMixin = require('../mixins/formMixin');

const AccountLastName = createReactClass({
  displayName: 'AccountLastName',
  mixins: [formMixin],

  propTypes: {
    user: PropTypes.object,
    onPrev: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      lastName: '',
    };
  },

  _onChangeInput(e) {
    this.setState({
      lastName: e.target.value,
    });

    this.onMainFieldChange(e);
  },

  _renderLastname() {
    if (!this.state.lastName.length) {
      return '.';
    }

    return ` ${this.state.lastName}.`;
  },

  render() {
    return (
      <form
        name="form-lastname"
        className="v-signup-account-last-name signup-single-form slide-animation"
        onSubmit={this.onSubmit}
      >
        <h2>
          <Translate
            find="signup.lastName.title"
            args={[this.props.user.get('first_name') || '']}
          />
          {this._renderLastname()}
        </h2>
        <p className="input-paragraph">
          <Input
            className="main-input"
            type="text"
            name="lastName"
            autoComplete="off"
            placeholder={i18n.signup.lastName.placeholder}
            spellCheck="false"
            onChange={this._onChangeInput}
            readOnly={this.props.disabled}
            ref="mainField"
            disabled={this.props.disabled}
            defaultValue={this.props.user.get('last_name') || ''}
          />
        </p>
        <SubmitPaneButton disabled={!this.state.navigateNext || this.props.disabled} />
        <PrevPaneButton onClick={this.props.onPrev} />
      </form>
    );
  },
});

module.exports = AccountLastName;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/account/AccountLastName.js