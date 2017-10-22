import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class ToggleButton extends React.Component {
  static propTypes = {
    onToggle: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired,
    className: PropTypes.string,
    inactive: PropTypes.bool,
  };

  render() {
    const toggleClasses = classNames(
      'l-toggle',
      'v-checkbox',
      { 'l-checked': this.props.checked },
      { 'l-unchecked': !this.props.checked },
      { 's-inactive': this.props.inactive },
      { [this.props.className]: this.props.className },
    );

    const btnClasses = classNames('btn-toggle', { 's-inactive': this.props.inactive });

    return (
      <div className={toggleClasses} onClick={this.props.onToggle}>
        <div className={btnClasses} />
      </div>
    );
  }
}

export default ToggleButton;



// WEBPACK FOOTER //
// ./src/js/app/components/buttons/Toggle.js