import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Button extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.element]),
    className: PropTypes.string,
    type: PropTypes.string,
    onSubmit: PropTypes.func,
    onClick: PropTypes.func,
  };

  _onSubmit = (e) => {
    if (this.props.loading) {
      return;
    }

    this.props.onSubmit && this.props.onSubmit(e);
  };

  _onClick = (e) => {
    if (this.props.loading) {
      return;
    }

    this.props.onClick && this.props.onClick(e);
  };

  render() {
    const className = classNames({
      btn: true,
      [this.props.className]: this.props.className,
      's-inactive': this.props.disabled,
      's-loading': this.props.loading,
    });

    return (
      <button
        onSubmit={this._onSubmit}
        onClick={this._onClick}
        className={className}
        type={this.props.type}
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;



// WEBPACK FOOTER //
// ./src/js/app/components/Button.js