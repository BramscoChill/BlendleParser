import React from 'react';
import PropTypes from 'prop-types';
import BackboneView from 'components/shared/BackboneView';
import Link from 'components/Link';
import { translate } from 'instances/i18n';
import ResetTokenForm from 'views/forms/resettoken';

class ResetPassword extends React.Component {
  static propTypes = {
    active: PropTypes.bool,
    showBack: PropTypes.bool,
    onLoginLink: PropTypes.func,
  };

  static defaultProps() {
    return {
      active: true,
    };
  }

  componentWillMount() {
    this._resetTokenForm = new ResetTokenForm();
    this._resetTokenForm.render();
    this._resetTokenForm.setDisabled(!this.props.active);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active && !this.props.active) {
      this._autofocusTimeout = setTimeout(() => this._resetTokenForm.focus(), 200);
    }
  }

  componentWillUpdate(nextProps) {
    this._resetTokenForm.setDisabled(!nextProps.active);
  }

  componentWillUnmount() {
    clearTimeout(this._autofocusTimeout);
  }

  _renderBack() {
    if (this.props.showBack) {
      return (
        <Link className="lnk-toggle-pane lnk-login" onClick={this.props.onLoginLink}>
          {translate('login.dropdown.to_login')}
        </Link>
      );
    }

    return null;
  }

  render() {
    return (
      <div className="v-reset-password">
        <BackboneView view={this._resetTokenForm} />
        {this._renderBack()}
      </div>
    );
  }
}

export default ResetPassword;



// WEBPACK FOOTER //
// ./src/js/app/components/login/ResetPassword/index.js