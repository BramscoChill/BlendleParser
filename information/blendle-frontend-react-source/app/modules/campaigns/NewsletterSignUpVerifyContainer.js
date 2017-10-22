import React from 'react';
import PropTypes from 'prop-types';
import AuthController from 'controllers/auth';
import { history } from 'byebye';
import { translateElement } from 'instances/i18n';
import SignUpManager from 'managers/signup';
import { STATUS_INITIAL, STATUS_PENDING, STATUS_ERROR, STATUS_OK } from 'app-constants';
import Analytics from 'instances/analytics';

import Dialogue from 'components/dialogues/Dialogue';
import SuccessDialogue from './NewsletterSignUpSuccessDialogue';

export default class NewsletterSignUpContainer extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    onClose: PropTypes.func,
  };

  state = {
    user: AuthController.getUser(),
    confirm: {
      status: STATUS_PENDING,
    },
    password: {
      status: STATUS_INITIAL,
    },
  };

  componentWillMount() {
    this._confirmAccount(this.props.token);
  }

  _confirmAccount(tokenString) {
    SignUpManager.confirmEmail(tokenString)
      .then(authToken => AuthController.loginWithToken(authToken))
      .then(() => {
        const user = AuthController.getUser();
        this.setState({
          user,
          confirm: { status: STATUS_OK },
        });

        Analytics.track('Newsletter Landing/validated token', {
          token: tokenString,
        });
      })
      .catch((err) => {
        if (['InvalidConfirmationToken', 'ConfirmationTokenDoesNotExist'].includes(err.type)) {
          Analytics.track('Newsletter Landing/invalid token', {
            token: tokenString,
            type: err.type,
          });

          return this.setState({ confirm: { status: STATUS_ERROR } });
        }
        throw err;
      });
  }

  _onClose() {
    history.navigate('/', { trigger: true });
  }

  render() {
    const confirmStatus = this.state.confirm.status;

    if (confirmStatus === STATUS_ERROR) {
      return (
        <Dialogue onClose={this._onClose}>
          {translateElement('signup.verifyFinalize.failed', false)}
        </Dialogue>
      );
    }

    return (
      <SuccessDialogue
        loading={confirmStatus === STATUS_PENDING || confirmStatus === STATUS_INITIAL}
        onClose={this.props.onClose}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/campaigns/NewsletterSignUpVerifyContainer.js