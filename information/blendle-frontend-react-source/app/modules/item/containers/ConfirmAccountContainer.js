import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import ConfirmAccount from '../components/ConfirmAccount';
import Auth from 'controllers/auth';
import ConfirmAccountActions from 'actions/ConfirmAccountActions';
import ConfirmAccountStore from 'stores/ConfirmAccountStore';

class ConfirmAccountContainer extends PureComponent {
  static propTypes = {
    onDismiss: PropTypes.func.isRequired,
  };

  state = {
    showEdit: false,
  };

  componentDidMount() {
    ConfirmAccountActions.resetState.defer();
  }

  _onClickEdit = () => {
    this.setState({ showEdit: true });
  };

  _onCloseEdit = () => {
    this.setState({ showEdit: false });
  };

  render() {
    return (
      <AltContainer
        stores={{ ConfirmAccountStore }}
        render={stores => (
          <ConfirmAccount
            confirmAccountStore={stores.ConfirmAccountStore}
            email={Auth.getUser().get('email')}
            onClickResend={() => ConfirmAccountActions.resendConfirmationEmail(Auth.getId())}
            onClickEdit={() => this._onClickEdit()}
            onCloseEdit={() => this._onCloseEdit()}
            onChangeEmail={email => ConfirmAccountActions.changeEmail(email, Auth.getUser())}
            onClickDismiss={() => this.props.onDismiss()}
            showEdit={this.state.showEdit}
            error={stores.ConfirmAccountStore.error}
          />
        )}
      />
    );
  }
}

export default ConfirmAccountContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/ConfirmAccountContainer.js