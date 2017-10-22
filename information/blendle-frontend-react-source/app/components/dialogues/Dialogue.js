import React from 'react';
import PropTypes from 'prop-types';
import PortalDialog from 'components/PortalDialog';
import classNames from 'classnames';
import { keyCode } from 'app-constants';

export default class extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    allowClose: PropTypes.bool,
    hideClose: PropTypes.bool,
    closeOnEscapeKey: PropTypes.bool,
    onKeyDown: PropTypes.func,
    children: PropTypes.any,
  };

  static defaultProps = {
    allowClose: true,
    hideClose: false,
    closeOnEscapeKey: true,
  };

  state = {};

  componentDidMount() {
    window.addEventListener('keydown', this._onKeyDown);
    document.body.classList.add('prevent-scroll');
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._onKeyDown);
    document.body.classList.remove('prevent-scroll');
  }

  _onKeyDown = (ev) => {
    // Close dialog on esc
    if (ev.keyCode === keyCode.ESC && this.props.closeOnEscapeKey) {
      return this._onClose(ev);
    }

    this.props.onKeyDown && this.props.onKeyDown(ev);
  };

  _onClose = (e) => {
    if (!this.props.allowClose) {
      return;
    }

    // Allow some time before actually removing the dialog. This is needed for the animation
    this.setState({
      willClose: true,
    });

    setTimeout(() => {
      this.setState({
        closed: true,
      });

      this.props.onClose && this.props.onClose(e);
    }, 200);
  };

  _onScroll = (e) => {
    e.stopPropagation();
  };

  _renderCloseButton = () => {
    if (this.props.hideClose || !this.props.allowClose) {
      return false;
    }

    return <div className="btn btn-close" aria-label="Close" onClick={this._onClose} />;
  };

  render() {
    if (this.state.closed) {
      return false;
    }

    const portalClasses = classNames({
      'will-close': this.state.willClose,
    });

    return (
      <PortalDialog onClick={this._onClose} className={portalClasses}>
        <dialog
          className={`${this.props.className} dialog-animation center`}
          open="open"
          onScroll={this._onScroll}
        >
          {this._renderCloseButton()}
          {this.props.children}
        </dialog>
      </PortalDialog>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/Dialogue.js