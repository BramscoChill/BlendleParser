import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Portal } from '@blendle/lego';
import CSS from './style.scss';

function stopPropagation(e) {
  e.stopPropagation();
}

class SidebarMenu extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    isOpen: PropTypes.bool,
    className: PropTypes.string,
    fullWidth: PropTypes.bool,
    hideOnOutsideClick: PropTypes.bool,
    triggerButton: PropTypes.node,
    onToggle: PropTypes.func,
  };

  static defaultProps = {
    hideOnOutsideClick: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.isOpen,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== undefined && Boolean(nextProps.isOpen) !== this.state.isOpen) {
      this._toggleOpen(!!nextProps.isOpen);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    document.body.classList.toggle(CSS.sidebarOpen, !!this.state.isOpen);

    if (!this.props.fullWidth) {
      return;
    }

    document.body.classList.toggle(CSS.sidebarOpenInFullWidth, !!this.state.isOpen);
  }

  componentWillUnmount() {
    document.body.classList.remove(CSS.sidebarOpenInFullWidth);
    document.body.classList.remove(CSS.sidebarOpen);
  }

  _renderCloseButton() {
    return <button className={CSS.closeButton} onClick={() => this._toggleOpen(false)} />;
  }

  _renderTriggerButton() {
    if (!this.props.triggerButton) {
      return null;
    }

    return React.cloneElement(this.props.triggerButton, {
      onClick: () => this._toggleOpen(!this.state.isOpen),
    });
  }

  _onHideOutsideClick = () => {
    if (this.props.hideOnOutsideClick) {
      this._toggleOpen(false);
    }
  };

  /**
   * @param {boolean} isOpen
   */
  _toggleOpen(isOpen) {
    const { onToggle } = this.props;
    this.setState({ isOpen });
    if (typeof onToggle === 'function') {
      onToggle(isOpen);
    }
  }

  _renderOverlay() {
    const className = classNames(CSS.overlay, {
      [CSS.hidden]: !this.state.isOpen,
      [CSS.fullWidth]: this.props.fullWidth,
    });

    return (
      <Portal>
        <div
          className={className}
          onTouchStart={ev => ev.preventDefault()}
          onTouchEnd={this._onHideOutsideClick}
          onClick={() => this.props.hideOnOutsideClick && this._toggleOpen(false)}
        >
          <div
            className={CSS.content}
            onClick={stopPropagation}
            onTouchStart={stopPropagation}
            onTouchEnd={stopPropagation}
          >
            {this._renderCloseButton()}
            <div onClick={this._onHideOutsideClick}>{this.props.children}</div>
          </div>
        </div>
      </Portal>
    );
  }

  render() {
    if (this.props.triggerButton) {
      return (
        <div className={CSS.sidebarMenu}>
          {this._renderTriggerButton()}
          {this._renderOverlay()}
        </div>
      );
    }

    return this._renderOverlay();
  }
}

export default SidebarMenu;



// WEBPACK FOOTER //
// ./src/js/app/components/SidebarMenu/index.js