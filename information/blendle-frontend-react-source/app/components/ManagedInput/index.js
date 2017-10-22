import React from 'react';
import PropTypes from 'prop-types';
import CSS from './style.scss';
import classNames from 'classnames';

export default class ManagedInput extends React.Component {
  static propTypes = {
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    maskClassName: PropTypes.string,
    noState: PropTypes.bool,
    error: PropTypes.bool,
    format: PropTypes.string,
  };

  constructor(props) {
    super(props);

    if (!this.props.noState) {
      this.state = {
        value: props.value,
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.noState) {
      return;
    }

    const { value } = nextProps;

    if (value && value !== this.state.value) {
      this.setState({ value });
    }
  }

  _onChange = (e) => {
    const { value } = e.target;
    if (this.props.format && value.length > this.props.format.length) {
      return;
    }

    if (!this.props.noState) {
      this.setState({ value });
    }

    this.props.onChange(e, value);
  };

  _renderInput() {
    // eslint-disable-next-line no-unused-vars
    const { noState, error, className, maskClassName, ...remainingProps } = this.props;
    const value = noState ? this.props.value : this.state.value;

    const classes = classNames(className, {
      [CSS.error]: error,
    });

    return (
      <input {...remainingProps} className={classes} value={value} onChange={this._onChange} />
    );
  }

  _renderMask() {
    if (!this.props.value.length) {
      return null;
    }

    const value = this.props.noState ? this.props.value : this.state.value;
    const mask = this.props.format.substr(value.length);

    return (
      <div className={CSS.maskContainer}>
        <span className={CSS.hidden}>{value}</span>
        <span>{mask}</span>
      </div>
    );
  }

  render() {
    if (!this.props.format) {
      return this._renderInput();
    }

    const className = classNames(this.props.maskClassName, CSS.maskedInput);

    return (
      <div className={className}>
        {this._renderInput()}
        {this._renderMask()}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/ManagedInput/index.js