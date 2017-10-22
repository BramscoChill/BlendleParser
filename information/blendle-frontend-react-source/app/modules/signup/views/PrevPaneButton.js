const React = require('react');
const PropTypes = require('prop-types');
const Translate = require('components/shared/Translate');
const i18n = require('instances/i18n').locale;
const Button = require('components/Button');
const Link = require('components/Link');

class SubmitPaneButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  onClick = (ev) => {
    ev.preventDefault();
    this.props.onClick();
  };

  render() {
    return (
      <div className="v-navigate-prev">
        <a onClick={this.onClick}>{i18n.signup.back}</a>
      </div>
    );
  }
}

module.exports = SubmitPaneButton;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/PrevPaneButton.js