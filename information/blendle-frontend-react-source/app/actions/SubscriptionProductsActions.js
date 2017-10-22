import alt from 'instances/altInstance';
import SubscriptionsManager from 'managers/subscriptions';

export default alt.createActions({
  fetchProduct(id) {
    return (dispatch) => {
      dispatch();

      return SubscriptionsManager.fetchProduct(id)
        .then(this.fetchProductSuccess)
        .catch(this.fetchProductError);
    };
  },

  fetchProductSuccess: x => x,

  fetchProductError: x => x,

  fetchProviderProducts(providerId) {
    SubscriptionsManager.fetchProviderProducts(providerId)
      .then(products => this.fetchProviderProductsSuccess({ providerId, products }))
      .catch((error) => {
        this.fetchProviderProductsError({ providerId, error });

        if (error.status !== 404) {
          throw error;
        }
      });

    return providerId;
  },

  fetchProviderProductsSuccess: x => x,

  fetchProviderProductsError: x => x,
});



// WEBPACK FOOTER //
// ./src/js/app/actions/SubscriptionProductsActions.js