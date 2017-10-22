import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DropdownContents from 'components/login/LoginDropdownContent';
import Analytics from 'instances/analytics';
import Link from 'components/Link';
import SidebarMenu from 'components/SidebarMenu';
import { translate } from 'instances/i18n';
import CSS from './style.scss';

class LoginDropdown extends React.Component {
  static propTypes = {
    mobile: PropTypes.bool,
    open: PropTypes.bool,
    onOpen: PropTypes.func,
    activeLoginPane: DropdownContents.propTypes.active,
    className: PropTypes.string,
    onClose: PropTypes.func,
    text: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.open,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open !== this.state.open) {
      this.setState({
        isOpen: nextProps.open,
      });
    }
  }

  _toggleLoginForm(ev) {
    ev.preventDefault();

    if (!this.state.isOpen) {
      this.openLoginDropdown();
    } else {
      this.closeLoginDropdown();
    }
  }

  openLoginDropdown(activePanel) {
    Analytics.track('Open Login');
    this.setState({ isOpen: true });

    if (this.props.onOpen) {
      this.props.onOpen();
    }

    if (activePanel && this._dropdownContent) {
      this._dropdownContent.setActivePanel(activePanel);
    }
  }

  closeLoginDropdown() {
    Analytics.track('Close Login');
    this.setState({ isOpen: false });

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  _renderDropdownContents() {
    const dropdownContent = (
      <DropdownContents
        ref={c => (this._dropdownContent = c)} // eslint-disable-line
        active={this.props.activeLoginPane}
        isOpen={this.state.isOpen}
        mobile={this.props.mobile}
        onClose={e => this._toggleLoginForm(e)}
        onFacebookConnectDialogOpen={e => this._toggleLoginForm(e)}
      />
    );

    if (this.props.mobile) {
      return (
        <SidebarMenu isOpen={this.state.isOpen} fullWidth hideOnOutsideClick={false}>
          {dropdownContent}
        </SidebarMenu>
      );
    }

    const className = classNames(CSS.dropdownContainer, {
      [CSS.hidden]: !this.state.isOpen,
    });
    return <div className={className}>{dropdownContent}</div>;
  }

  _renderLoginButton() {
    const text = this.props.text || translate('app.buttons.login');

    return (
      <Link
        className={`btn btn-green ${CSS.loginButton} btn-login`}
        onClick={e => this._toggleLoginForm(e)}
      >
        {text}
      </Link>
    );
  }

  render() {
    const className = classNames(CSS.loginDropdown, this.props.className, {
      [CSS.open]: this.state.isOpen,
    });

    return (
      <div className={className}>
        {this._renderLoginButton()}
        {this._renderDropdownContents()}
      </div>
    );
  }
}

export default LoginDropdown;



// WEBPACK FOOTER //
// ./src/js/app/components/navigation/LoginDropdown/index.js