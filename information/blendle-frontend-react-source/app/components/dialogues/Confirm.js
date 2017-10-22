import React from 'react';
import PropTypes from 'prop-types';
import Dialogue from './Dialogue';
import Button from 'components/Button';
import classNames from 'classnames';
import { keyCode } from 'app-constants';

class Confirm extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.node.isRequired,
    buttonText: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.any,
  };

  _onConfirm = (e) => {
    this.confirmed = true;
    this.props.onConfirm(e);
  };

  _onClose = () => {
    this.props.onClose();
  };

  _onKeyDown = (e) => {
    if (e.keyCode === keyCode.RETURN) {
      this.props.onConfirm(e);
    }
  };

  render() {
    const { className, title, message, buttonText } = this.props;
    const dialogClassName = classNames('v-confirm', 's-success', 'dialogue-content', className);

    return (
      <Dialogue {...this.props} onKeyDown={this._onKeyDown} className={dialogClassName}>
        <h2 className="title">{title}</h2>
        <p className="more">{message}</p>
        <Button className="btn-fullwidth btn-confirm" onClick={() => this._onConfirm()}>
          {buttonText}
        </Button>
      </Dialogue>
    );
  }
}

export default Confirm;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/Confirm.js