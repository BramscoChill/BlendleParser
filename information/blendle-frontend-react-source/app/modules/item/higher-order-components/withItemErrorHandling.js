import React, { PureComponent } from 'react';
import ItemStore from 'stores/ItemStore';
import TilesStore from 'stores/TilesStore';
import AuthStore from 'stores/AuthStore';
import { get } from 'lodash';
import Analytics from 'instances/analytics';
import PaymentActions from 'actions/PaymentActions';
import ItemActions from 'actions/ItemActions';
import history, { getPrevious } from 'libs/byebye/history';
import browserHistory from 'react-router/lib/browserHistory';
import { isBundleItem } from 'selectors/item';
import { hasAccessToPremiumFeatures } from 'helpers/premiumEligibility';
import AltContainer from 'alt-container';
import { prefillSelector, providerById } from 'selectors/providers';
import { removeTrailingSlash } from 'helpers/url';
import ItemNotFound from '../components/ItemNotFound';
import LoadFailedRetry from '../components/LoadFailedRetry';
import ConfirmAccountContainer from '../containers/ConfirmAccountContainer';
import loadItem from '../helpers/loadItem';
import ItemNotAcquirable from '../components/ItemNotAcquirable';

const isPaymentRequiredError = error => get(error, 'data._errors[0].id') === 'PaymentRequired';

export default ComposedComponent =>
  class withItemErrorHandling extends PureComponent {
    _balanceTooLowId = null;
    _previousRoute = getPrevious();

    componentDidMount() {
      ItemStore.listen(this._shouldRedirect);
      TilesStore.listen(this._shouldRedirect);
      AuthStore.listen(this._shouldRedirect);
    }

    componentWillUnmount() {
      ItemStore.unlisten(this._shouldRedirect);
      TilesStore.unlisten(this._shouldRedirect);
      AuthStore.unlisten(this._shouldRedirect);
    }

    _shouldRedirect = () =>
      setTimeout(() => {
        const { tiles, acquisition } = TilesStore.getState();
        const { selectedItemId, error, acquisitionError, returnUrl } = ItemStore.getState();
        const { user } = AuthStore.getState();
        const tile = tiles.get(selectedItemId);

        if (!tile || !user) {
          return;
        }

        const pathname = removeTrailingSlash(window.location.pathname);

        if (
          get(error, 'status') === 402 &&
          !get(acquisition, 'acquired') && // make sure the item is not acquired yet
          isPaymentRequiredError(error) &&
          !pathname.endsWith('/buy-warning') &&
          !pathname.endsWith('/acquire') &&
          !pathname.startsWith('/payment')
        ) {
          browserHistory.replace(`${pathname}/buy-warning${window.location.search}`);
        } else if (
          get(acquisitionError, 'status') === 402 &&
          this._balanceTooLowId !== selectedItemId
        ) {
          this._balanceTooLowId = selectedItemId;

          Analytics.track('Balance too low');

          const successUrl = pathname;
          PaymentActions.setReturnUrl(successUrl);

          const topupUrl =
            isBundleItem(tile) && hasAccessToPremiumFeatures(user) // TODO: remove the isBundleItem check when the item will be free if user takes premium
              ? '/payment/outofbalance'
              : '/payment';

          ItemActions.consumeErrors();

          browserHistory.replace({
            pathname: topupUrl,
            state: {
              returnUrl: returnUrl || this._previousRoute || '/',
              successUrl: `${successUrl}?verified=true`,
            },
          });
        }
      });

    _onDismiss = () => {
      const { returnUrl } = ItemStore.getState();
      history.navigate(returnUrl, { trigger: true, replace: true });
    };

    _onRetry = () => {
      const { selectedItemId } = ItemStore.getState();
      loadItem(selectedItemId);
    };

    _renderComponent = ({ itemState, tilesState }) => {
      const { error, acquisitionError, selectedItemId } = itemState;
      const { tiles } = tilesState;
      const tile = tiles.get(selectedItemId);
      const status = get(error, 'status');
      const acquisitionStatus = get(acquisitionError, 'status');

      if (acquisitionStatus === 403) {
        return <ConfirmAccountContainer onDismiss={this._onDismiss} />;
      }

      if (status === 404) {
        return <ItemNotFound onDismiss={this._onDismiss} />;
      }

      if (acquisitionStatus === 422) {
        if (tile) {
          // Wait for tile to be loaded
          const provider = prefillSelector(providerById)(tile._embedded['b:manifest'].provider.id);

          return (
            <ItemNotAcquirable
              providerName={provider.name}
              providerId={provider.id}
              itemId={selectedItemId}
              onDismiss={this._onDismiss}
            />
          );
        }

        return null;
      }

      if (error && status !== 402) {
        // Already redirects to /payment
        return <LoadFailedRetry onDismiss={this._onDismiss} onRetry={this._onRetry} />;
      }

      return <ComposedComponent {...this.props} />;
    };

    render() {
      return (
        <AltContainer
          stores={{ itemState: ItemStore, tilesState: TilesStore }}
          render={this._renderComponent}
        />
      );
    }
  };



// WEBPACK FOOTER //
// ./src/js/app/modules/item/higher-order-components/withItemErrorHandling.js