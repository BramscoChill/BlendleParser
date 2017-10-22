import { STATUS_PENDING, STATUS_OK, STATUS_INITIAL, STATUS_ERROR } from 'app-constants';
import alt from 'instances/altInstance';
import SubscriptionProductsActions from 'actions/SubscriptionProductsActions';
import SubsriptionOrderActions from 'actions/SubscriptionOrderActions';
import { merge } from 'lodash';

class SubscriptionsProductsStore {
  constructor() {
    this.bindActions(SubscriptionProductsActions);
    this.bindAction(SubsriptionOrderActions.START_TRIAL_SUCCESS, this.onStartTrialSuccess);

    this.state = {
      product: null,
      status: STATUS_INITIAL,
      providerProducts: {},
    };
  }

  onFetchProduct() {
    this.setState({
      status: STATUS_PENDING,
      jwt: null,
    });
  }

  onFetchProductSuccess(product) {
    this.setState({
      product,
      status: STATUS_OK,
    });
  }

  onFetchProductError() {
    this.setState({
      status: STATUS_ERROR,
    });
  }

  onFetchProviderProducts(providerId) {
    const newProviderProducts = {
      [providerId]: {
        status: STATUS_PENDING,
        error: null,
        data: null,
      },
    };

    this.setState({
      providerProducts: merge(this.state.providerProducts, newProviderProducts),
    });
  }

  onFetchProviderProductsSuccess({ providerId, products }) {
    const newProviderProducts = {
      [providerId]: {
        status: STATUS_OK,
        error: null,
        data: products,
      },
    };

    this.setState({
      providerProducts: merge(this.state.providerProducts, newProviderProducts),
    });
  }

  onFetchProviderProductsError({ providerId, error }) {
    const newProviderProducts = {
      [providerId]: {
        status: STATUS_ERROR,
        error,
        data: null,
      },
    };

    this.setState({
      providerProducts: merge(this.state.providerProducts, newProviderProducts),
    });
  }

  onStartTrialSuccess(subscriptionProductId) {
    // Set trial to false
    const providerProducts = Object.keys(this.state.providerProducts)
      .map((id) => {
        const product = this.state.providerProducts[id];

        // Only mutate the updated product
        if (id !== subscriptionProductId) {
          return { id, product };
        }

        product.data._embedded['b:subscription-products'] = product.data._embedded[
          'b:subscription-products'
        ].map((p) => {
          if (p.uid === subscriptionProductId) {
            p.trial = false;
            p.eligible = false;
          }

          return p;
        });

        return { id, product };
      })
      .reduce((prev, { id, product }) => {
        prev[id] = product;
        return prev;
      }, {});

    this.setState({
      providerProducts,
    });
  }
}

export default alt.createStore(SubscriptionsProductsStore, 'SubscriptionsProductsStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/SubscriptionsProductsStore.js