import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AuthStore from 'stores/AuthStore';
import Auth from 'controllers/auth';
import Analytics from 'instances/analytics';
import SignUpManager from 'managers/signup';
import ConfirmationTokenDoesNotExist from 'components/dialogues/ConfimationTokenDoesNotExist';
import { history } from 'byebye';
import makeCancelable from 'helpers/makeCancelable';
import { countryEligibleForPremium } from 'helpers/premiumEligibility';

function getRouterState() {
  return {
    returnUrl: countryEligibleForPremium() ? '/getpremium/channels' : '/signup/deeplink',
  };
}

class EmailVerificationContainer extends PureComponent {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  state = {
    error: false,
  };

  componentDidMount() {
    const { emailToken, itemId } = this.props.params;

    this._cancelablePromise = makeCancelable(SignUpManager.confirmEmail(emailToken));

    this._cancelablePromise.promise
      .then(Auth.loginWithToken)
      .then(() => {
        Analytics.track('Signup/Verify email', {
          platform: 'blendle',
          internal_location: 'deeplink',
        });
        history.navigate(`/item/${itemId}`, { trigger: true, replace: true });
      })
      .catch((err) => {
        if (err.isCanceled) {
          return;
        }

        this.setState({ error: true });

        // If the user is logged in and gets this error, just show the article
        const { user } = AuthStore.getState();
        if (user) {
          history.navigate(`/item/${itemId}`, { trigger: true, replace: true }, getRouterState());
          return;
        }

        this.setState({ error: true });

        if (err.type !== 'ConfirmationTokenDoesNotExist') {
          throw err;
        }
      });
  }

  componentWillUnmount() {
    this._cancelablePromise.cancel();
  }

  _onClose = () =>
    history.navigate(
      `/item/${this.props.params.itemId}`,
      { trigger: true, replace: true },
      getRouterState(),
    );

  render() {
    if (this.state.error) {
      return <ConfirmationTokenDoesNotExist onClose={this._onClose} />;
    }

    return <div />;
  }
}

export default EmailVerificationContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/EmailVerificationContainer.js