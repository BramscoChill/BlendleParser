import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router/lib/withRouter';
import AltContainer from 'alt-container';
import {
  STATUS_ERROR,
  HOME_ROUTE,
  REDIRECT_TO_URL,
  SIGNUP_TYPE_PREMIUM_ONBOARDING,
  SIGNUP_TYPE_DEEPLINK,
  SIGNUP_TYPE_AFFILIATE,
} from 'app-constants';
import { get } from 'lodash';
import LoginStore from 'stores/LoginStore';
import AuthStore from 'stores/AuthStore';
import AuthActions from 'actions/AuthActions';
import AffiliatesStore from 'stores/AffiliatesStore';
import ItemStore from 'stores/ItemStore';
import SignUpStore from 'stores/SignUpStore';
import { replaceLastPath } from 'helpers/url';
import { shouldGetAutoRenewTrial } from 'helpers/premiumEligibility';
import { getCustomCopy, getSignUpAffiliateMetaData } from 'helpers/affiliates';
import Login from 'modules/premiumSignup/components/Login';
import LoginActions from 'actions/LoginActions';
import ApplicationActions from 'actions/ApplicationActions';
import ApplicationState from 'instances/application_state';
import { createItemUri } from 'helpers/prettyurl';

/**
 * @returns {string} url to the item on deeplink or premium route
 */
const getItemUrlForDeeplink = () => {
  const { item } = ItemStore.getState();
  const manifest = get(item, '_embedded.manifest');
  if (manifest) {
    return `/${createItemUri(manifest)}`;
  }
  return HOME_ROUTE;
};

class LoginContainer extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this._onSendLoginEmail = this._onSendLoginEmail.bind(this);
    this._onStoreChange = this._onStoreChange.bind(this);

    this.state = {
      error: null,
    };
  }

  componentDidMount() {
    LoginStore.listen(this._onStoreChange);
  }

  componentWillUnmount() {
    LoginStore.unlisten(this._onStoreChange);
    clearTimeout(this._dispatchTimeout);
  }

  _clearError = () => {
    this.setState({ error: null });
  };

  _onStoreChange = (storeState) => {
    if (storeState.login.status === STATUS_ERROR) {
      this.setState({ error: storeState.login.error.message });
    }
  };

  _onSubmit = (formState) => {
    const { email, password } = formState;
    const credentials = {
      login: email,
      password,
    };

    this.setState({ formState });
    this._clearError();

    LoginActions.loginWithCredentials(credentials);
  };

  _onSendLoginEmail = (login) => {
    const { affiliate, meta } = AffiliatesStore.getState();
    let redirectUrl = HOME_ROUTE;

    if (affiliate && affiliate.name === 'vodafone' && meta && meta.vodafone_full_url) {
      const params = meta.vodafone_full_url.split('?')[1];
      redirectUrl = `/getpremium/actie/vodafone/activate?${params}`;
    } else if (window.location.pathname.includes('/item/')) {
      // redirect to item url on deeplink page
      redirectUrl = getItemUrlForDeeplink();
    }

    LoginActions.sendLoginEmail(login, null, redirectUrl, null, {
      location_in_layout: 'login-dialog',
    });
  };

  _onFacebookSignup = () => {
    const { router } = this.props;

    if (shouldGetAutoRenewTrial()) {
      router.push('/payment/subscription/blendlepremium_one_week_auto_renewal');
    } else {
      router.push(replaceLastPath(window.location.pathname, 'channels'));
    }
  };

  _onFacebookLogin = () => {
    if (ApplicationState.get('requireAuthUrl')) {
      ApplicationActions.set(REDIRECT_TO_URL, ApplicationState.get('requireAuthUrl'));
    }

    this.props.router.push('/');
  };

  _getBaseSignUpContext() {
    const itemId = this.props.params.itemId;
    const signupStoreState = SignUpStore.getState();
    const metaData = shouldGetAutoRenewTrial() // always returns false for affiliates
      ? { signup_type: 'subscription' }
      : getSignUpAffiliateMetaData(AffiliatesStore.getState());

    return {
      referrer: 'https://blendle.com/getpremium',
      ...signupStoreState.context,
      ...metaData,
      ...(itemId ? { entry_item: itemId } : null),
    };
  }

  _getFacebookSignUpType() {
    const itemId = this.props.params.itemId;
    const affiliate = AffiliatesStore.getState().affiliate;

    if (itemId) {
      return SIGNUP_TYPE_DEEPLINK;
    }

    if (affiliate) {
      return SIGNUP_TYPE_AFFILIATE;
    }

    return SIGNUP_TYPE_PREMIUM_ONBOARDING;
  }

  _renderSignUp = ({ authState, loginState, affiliatesState }) => {
    const customCopy = getCustomCopy('signUp', affiliatesState.affiliate);

    return (
      <Login
        error={this.state.error}
        loginState={loginState.login}
        emailLoginState={loginState.loginEmail}
        clearError={this._clearError}
        onSubmit={this._onSubmit}
        onFacebookSignUp={this._onFacebookSignup}
        onFacebookLogin={this._onFacebookLogin}
        facebookSignUpType={this._getFacebookSignUpType()}
        facebookSignUpContext={this._getBaseSignUpContext()}
        onSendLoginEmail={this._onSendLoginEmail}
        disabled={this.props.disabled}
        userFormValue={authState.userInput}
        onUserFormInput={AuthActions.userInputChange}
        {...customCopy}
      />
    );
  };

  render() {
    return (
      <AltContainer
        stores={{
          loginState: LoginStore,
          affiliatesState: AffiliatesStore,
          authState: AuthStore,
        }}
        render={this._renderSignUp}
      />
    );
  }
}

export default withRouter(LoginContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/Login.js