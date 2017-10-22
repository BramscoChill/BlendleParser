import alt from 'instances/altInstance';
import moment from 'moment';
import { XHR_STATUS } from 'app-constants';
import axios from 'axios';
import Auth from 'controllers/auth';

function formatPremiumSubscription(subscription) {
  const userSubscription = subscription._embedded['b:user-subscription'];
  return {
    uid: userSubscription.subscription_uid,
    renew: userSubscription.renew,
    trial: userSubscription.trial,
    expired: userSubscription.expired,
    startDate: moment(userSubscription.start_date),
    endDate: moment(userSubscription.end_date),
    provider: {
      uid: subscription.provider_uid,
    },
  };
}

function fetchSubscription(url) {
  return axios
    .get(url, {
      headers: {
        accept: 'application/hal+json',
      },
    })
    .then(resp => resp.data)
    .then(formatPremiumSubscription);
}

class PremiumSubscriptionActions {
  fetchLatestPremiumSubscriptionSuccess = x => x;
  fetchLatestPremiumSubscriptionError = x => x;

  fetchLatestPremiumSubscription(url) {
    fetchSubscription(url)
      .then(this.fetchLatestPremiumSubscriptionSuccess)
      .catch((err) => {
        // Still need to save the details of an expired subscription, but it returns a 402 status code
        if (err.status === 402 && err.data) {
          const formattedSubscription = formatPremiumSubscription(err.data);
          this.fetchLatestPremiumSubscriptionSuccess(formattedSubscription);
          return;
        }

        this.fetchLatestPremiumSubscriptionError(err);

        if (err.type !== XHR_STATUS) {
          throw err;
        }
      });

    return null;
  }

  pollFetchLatestPremiumSubscription(url) {
    const maxLoops = 10;
    let loopCount = 0;

    const fetchSubscriptionWrapper = () => {
      fetchSubscription(url)
        .then(this.fetchLatestPremiumSubscriptionSuccess)
        .then(() => Auth.renewJWT()) // Refresh user for active_subscriptions
        .catch((err) => {
          if (err.status !== 200) {
            if (loopCount < maxLoops) {
              loopCount++;
              setTimeout(fetchSubscriptionWrapper, 500 + 250 * loopCount);
            } else {
              this.fetchLatestPremiumSubscriptionError(err);
              throw new Error(`Cannot fetch valid subscription after ${loopCount + 1} times.`);
            }
            return;
          }

          this.fetchLatestPremiumSubscriptionError(err);

          if (err.type !== XHR_STATUS) {
            throw err;
          }
        });
    };

    setTimeout(fetchSubscriptionWrapper, 500);

    return null;
  }
}

export default alt.createActions(PremiumSubscriptionActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/PremiumSubscriptionActions.js