const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');

class Input extends React.Component {
  state = {
    value: this.props.value || this.props.defaultValue,
  };

  render() {
    let { className, onChange, ...others } = this.props;

    className = classNames(className, { 'l-value': this.state.value });

    return <input {...others} className={className} onChange={this._onChange} />;
  }

  _onChange = (e) => {
    this.setState({ value: ReactDOM.findDOMNode(this).value || null });

    this.props.onChange(e);
  };
}

module.exports = Input;



// WEBPACK FOOTER //
// ./src/js/app/components/Input.js