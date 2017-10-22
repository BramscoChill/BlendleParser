import { compose } from 'recompose';
import { once } from 'lodash';
import { STATUS_OK, STATUS_ERROR } from 'app-constants';
import { withRouter } from 'react-router';
import altConnect from 'higher-order-components/altConnect';
import AuthStore from 'stores/AuthStore';
import SubscriptionsActions from 'actions/SubscriptionsActions';
import { hasOneOfSubscriptions, hasOneOfActiveSubscriptions } from 'selectors/subscriptions';
import SubscriptionsStore from 'stores/SubscriptionsStore';
import { countryEligibleForPremium } from 'helpers/premiumEligibility';

const STATUS_COMPLETED = [STATUS_OK, STATUS_ERROR];
const fetchSubscriptionsOnce = once(SubscriptionsActions.fetchUserSubscriptions.defer);
const replaceOnce = once(replace =>
  setTimeout(() => replace('/payment/subscription/blendlepremium_one_week_auto_renewal')),
);

const ensurePremiumSubscription = ({
  oneOfSubscriptions = [],
  onlyActive = true,
  subscriptionStatus = ['paid'],
  ...props
}) => (ComposedComponent) => {
  let fetched = false;

  const mapStateToProps = ({ authState, subscriptionsState }, { router }) => {
    const { user } = authState;

    if (!user) {
      return { ...props, isLoading: true };
    }

    const { subscriptions, status } = subscriptionsState;
    const requestFinished = STATUS_COMPLETED.includes(status);
    const hasHadPremium = onlyActive
      ? hasOneOfActiveSubscriptions(oneOfSubscriptions, subscriptions, subscriptionStatus)
      : hasOneOfSubscriptions(oneOfSubscriptions, subscriptions, subscriptionStatus);

    if (
      !countryEligibleForPremium() ||
      hasHadPremium ||
      user.get('reads') > 0 ||
      user.hasActivePremiumSubscription()
    ) {
      return props;
    }

    if (user && user.get('reads') === 0 && !user.hasActivePremiumSubscription()) {
      fetched = true;
      fetchSubscriptionsOnce(user.id, { active: onlyActive });
    }

    if (fetched && requestFinished && !hasHadPremium) {
      setTimeout(() => replaceOnce(router.replace));
    }

    return {
      ...props,
      isLoading: !requestFinished,
    };
  };
  mapStateToProps.stores = { AuthStore, SubscriptionsStore };

  return compose(withRouter, altConnect(mapStateToProps))(ComposedComponent);
};

export default ensurePremiumSubscription;



// WEBPACK FOOTER //
// ./src/js/app/higher-order-components/ensurePremiumSubscription.js