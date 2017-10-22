import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translate } from 'instances/i18n';

class PinButton extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    marked: PropTypes.bool.isRequired,
    showText: PropTypes.bool.isRequired,
    className: PropTypes.string,
  };

  _renderText() {
    return this.props.showText ? translate('app.pin.button') : null;
  }

  render() {
    const { marked, onChange, className } = this.props;
    const classes = classNames('btn-pin', { marked }, className);

    return (
      <button className={classes} onClick={onChange}>
        {this._renderText()}
      </button>
    );
  }
}

export default PinButton;



// WEBPACK FOOTER //
// ./src/js/app/components/buttons/PinButton.js