const React = require('react');
const PropTypes = require('prop-types');
const Translate = require('components/shared/Translate');
const i18n = require('instances/i18n').locale;

module.exports = class extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
  };

  render() {
    return (
      <form onSubmit={this._onSubmit}>
        <p>
          <Translate
            find="deeplink.verification.checkEmail"
            sanitize={false}
            args={[this.props.email]}
          />
        </p>

        <p className="btn-group">
          <input
            className="btn btn-fullwidth btn-confirm"
            type="submit"
            value={i18n.app.buttons.yes}
          />
          <input
            className="btn btn-fullwidth btn-secondary"
            type="button"
            onClick={this.props.onCancel}
            value={i18n.app.buttons.no}
          />
        </p>
      </form>
    );
  }

  _onSubmit = (ev) => {
    ev.preventDefault();
    this.props.onSubmit(this.props.email);
  };
};



// WEBPACK FOOTER //
// ./src/js/app/components/forms/VerifyEmailForm.js