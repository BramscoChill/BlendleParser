import React from 'react';
import { history } from 'byebye';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import { STATUS_OK, STATUS_ERROR, PREMIUM_ALL_SUBSCRIPTION_PRODUCTS } from 'app-constants';
import ensurePremiumSubscription from 'higher-order-components/ensurePremiumSubscription';
import DocumentTitle from 'helpers/title';
import ItemActions from 'actions/ItemActions';
import ItemStore from 'stores/ItemStore';
import ProviderStore from 'stores/ProviderStore';
import { getManifestBody, getContentAsText, getTitle } from 'helpers/manifest';
import { providerById } from 'selectors/providers';
import DeeplinkError from './components/DeeplinkError';
import Deeplink from './components/Deeplink';

class DeeplinkContainer extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const variant = window.location.search.match(/medium=(newsletter|email)/) ? 'login' : 'signUp';
    this.state = { variant };
  }

  componentDidMount() {
    ItemActions.fetchItem.defer(this.props.params.itemId);
    document.body.classList.add('m-deeplink');
  }

  componentWillUnmount() {
    document.body.classList.remove('m-deeplink');
    DocumentTitle.reset();
  }

  _onLogin() {
    history.loadUrl(history.fragment);
  }

  _onFacebookSignUp() {
    // Trigger a refresh, the user is now loggedin so it will open the reader
    history.navigate(
      history.fragment,
      { trigger: true, replace: true },
      { returnUrl: '/signup/deeplink' },
    );
  }

  _onVariantChange(variant) {
    this.setState({ variant });
  }

  _renderDeeplink(item, providerState) {
    const manifest = item.get('manifest');
    const manifestBody = getManifestBody(manifest);
    const providerId = manifest.get('provider').id;
    const manifestTitle = getContentAsText(getTitle(manifestBody));
    DocumentTitle.set([manifestTitle, providerById(providerState, providerId).name]);

    return (
      <Deeplink
        item={item}
        variant={this.state.variant}
        onToSignUp={() => this._onVariantChange('signUp')}
        onVariantChange={this._onVariantChange.bind(this)}
        onFacebookSignUp={this._onFacebookSignUp.bind(this)}
        onLogin={this._onLogin.bind(this)}
      />
    );
  }

  render() {
    return (
      <AltContainer
        stores={{ itemState: ItemStore, providerState: ProviderStore }}
        render={({ itemState, providerState }) => {
          if (itemState.status === STATUS_ERROR) {
            return <DeeplinkError />;
          } else if (itemState.status === STATUS_OK) {
            return this._renderDeeplink(itemState.item, providerState);
          }
          return null;
        }}
      />
    );
  }
}

export default ensurePremiumSubscription({
  onlyActive: false,
  oneOfSubscriptions: PREMIUM_ALL_SUBSCRIPTION_PRODUCTS,
  subscriptionStatus: ['pending'],
})(DeeplinkContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/deeplink/DeeplinkContainer.js