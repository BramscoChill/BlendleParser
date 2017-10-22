const React = require('react');
const PropTypes = require('prop-types');
const i18n = require('instances/i18n').locale;
const Button = require('components/Button');

class SubmitPaneButton extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    value: PropTypes.string,
    children: PropTypes.element,
  };

  static defaultProps = {
    disabled: false,
    loading: false,
    value: null,
  };

  render() {
    return (
      <div className="v-navigate-next">
        <Button
          type="submit"
          loading={this.props.loading}
          disabled={this.props.disabled}
          onClick={this.props.onClick}
        >
          {this.props.value || i18n.signup.next}
        </Button>
        {this.props.children}
      </div>
    );
  }
}

module.exports = SubmitPaneButton;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/SubmitPaneButton.js