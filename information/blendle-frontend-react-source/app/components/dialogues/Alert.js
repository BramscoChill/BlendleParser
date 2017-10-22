import React from 'react';
import PropTypes from 'prop-types';
import Dialogue from './Dialogue';
import classNames from 'classnames';
import { keyCode } from 'app-constants';

export default class extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
    onConfirm: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.any,
  };

  _onKeyDown = (e) => {
    if (e.keyCode === keyCode.RETURN) {
      this.props.onConfirm && this.props.onConfirm(e);
    }
  };

  render() {
    const { className, ...otherProps } = this.props;

    const dialogClassName = classNames({
      'v-alert': true,
      [className]: className,
    });

    return (
      <Dialogue {...this.props} onKeyDown={this._onKeyDown} className={dialogClassName}>
        {this.props.children}
      </Dialogue>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/Alert.js