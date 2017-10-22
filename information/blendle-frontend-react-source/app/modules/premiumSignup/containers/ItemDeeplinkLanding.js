import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import AltContainer from 'alt-container';
import withRouter from 'react-router/lib/withRouter';
import ItemStore from 'stores/ItemStore';
import Error from 'components/Application/Error';
import SignUpStore from 'stores/SignUpStore';
import LoginStore from 'stores/LoginStore';
import SubscriptionProductsActions from 'actions/SubscriptionProductsActions';
import ItemActions from 'actions/ItemActions';
import { STATUS_OK, NOT_FOUND, PREMIUM_TRIAL_PRODUCT, REDIRECT_TO_URL } from 'app-constants';
import ApplicationState from 'instances/application_state';
import ApplicationActions from 'actions/ApplicationActions';
import ProviderStore from 'stores/ProviderStore';
import { getOnboardingRoute } from 'helpers/onboarding';
import { getProviderId } from 'selectors/manifest';
import { providerById } from 'selectors/providers';
import ItemDeeplinkLanding from '../components/ItemDeeplinkLanding';

class ItemDeeplinkLandingContainer extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    header: PropTypes.element,
    body: PropTypes.element,
    footer: PropTypes.element,
    route: PropTypes.object,
    overlay: PropTypes.element,
  };

  componentDidMount() {
    SubscriptionProductsActions.fetchProduct(PREMIUM_TRIAL_PRODUCT);
    const itemId = this.props.routeParams.itemId;
    ItemActions.fetchItem(itemId);
    ApplicationState.set('requireAuthUrl', `/item/${itemId}`);

    SignUpStore.listen(this._onSignupStore);
    LoginStore.listen(this._onLoginStore);
  }

  componentWillUnmount() {
    SignUpStore.unlisten(this._onSignupStore);
    LoginStore.listen(this._onLoginStore);
  }

  _onLoginStore = (storeState) => {
    if (storeState.login.status === STATUS_OK) {
      ApplicationActions.set.defer(REDIRECT_TO_URL, `/item/${this.props.routeParams.itemId}`);
      // Fixes dispatch in dispatch
      setTimeout(() => {
        this.props.router.push('/');
      });
    }
  };

  _onSignupStore = (storeState) => {
    const { status } = storeState;

    if (status === STATUS_OK && !this._didSignupRedirect) {
      const nextUrl = getOnboardingRoute(window.location.pathname);

      setTimeout(() => {
        this.props.router.push(nextUrl);
      });
      this._didSignupRedirect = true;
    }
  };

  _renderLanding = ({ itemStore, providerState }) => {
    const itemId = this.props.routeParams.itemId;

    if (!itemId || get(itemStore, 'error.status', null) === 404) {
      return <Error type={NOT_FOUND} />;
    }

    const isLoading = itemStore.status !== STATUS_OK;
    const provider = !isLoading
      ? providerById(providerState, getProviderId(itemStore.item.get('manifest')))
      : null;

    return (
      <ItemDeeplinkLanding
        item={itemStore.item}
        isLoading={isLoading}
        provider={provider}
        {...this.props}
      />
    );
  };

  render() {
    return (
      <AltContainer
        stores={{
          itemStore: ItemStore,
          providerState: ProviderStore,
        }}
        render={this._renderLanding}
      />
    );
  }
}

export default withRouter(ItemDeeplinkLandingContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/ItemDeeplinkLanding.js