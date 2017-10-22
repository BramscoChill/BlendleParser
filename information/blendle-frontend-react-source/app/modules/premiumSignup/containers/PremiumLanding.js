import { compose, lifecycle } from 'recompose';
import withRouter from 'react-router/lib/withRouter';
import altConnect from 'higher-order-components/altConnect';
import { PREMIUM_TRIAL_PRODUCT } from 'app-constants';
import SubscriptionsProductsStore from 'stores/SubscriptionsProductsStore';
import AffiliatesStore from 'stores/AffiliatesStore';
import SubscriptionProductsActions from 'actions/SubscriptionProductsActions';
import Auth from 'controllers/auth';
import PremiumLanding from 'modules/premiumSignup/components/PremiumLanding';
import withAuthListener from '../higher-order-components/withAuthListener';

function mapStateToProps(
  { subscriptionsProductsState, affiliatesState },
  { header, body, footer, overlay, dialog, router, route, topBanner },
) {
  return {
    product: subscriptionsProductsState.product,
    user: Auth.getUser(),
    affiliate: affiliatesState.affiliate,
    header,
    body,
    footer,
    overlay,
    dialog,
    router,
    route,
    topBanner,
  };
}

mapStateToProps.stores = { SubscriptionsProductsStore, AffiliatesStore };

const enhance = compose(
  lifecycle({
    componentDidMount() {
      SubscriptionProductsActions.fetchProduct.defer(PREMIUM_TRIAL_PRODUCT);

      this._timeout = setTimeout(() => {
        const idToScrollTo = document.location.hash.slice(1);
        if (idToScrollTo.length > 0) {
          const elementToScrollTo = document.getElementById(idToScrollTo);
          elementToScrollTo.scrollIntoView();
        }
      }, 1000);
    },
    componentWillUnmount() {
      clearTimeout(this._timeout);
    },
  }),
  withRouter,
  withAuthListener,
  altConnect(mapStateToProps),
);

export default enhance(PremiumLanding);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/PremiumLanding.js