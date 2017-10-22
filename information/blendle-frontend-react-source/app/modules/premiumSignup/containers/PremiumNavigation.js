import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router/lib/withRouter';
import AltContainer from 'alt-container';
import { get } from 'lodash';
import { PREMIUM_TRIAL_PRODUCT } from 'app-constants';
import PremiumNavigation from '../components/PremiumNavigation';
import SubscriptionProductsActions from 'actions/SubscriptionProductsActions';
import SubscriptionsProductsStore from 'stores/SubscriptionsProductsStore';
import ModuleNavigationStore from 'stores/ModuleNavigationStore';
import AcceptCookieStore from 'stores/AcceptCookieStore';
import AcceptCookieActions from 'actions/AcceptCookieActions';
import { removeTrailingSlash } from 'helpers/url';
import { getRoute } from 'helpers/onboarding';
import AuthStore from 'stores/AuthStore';
import AffiliatesStore from 'stores/AffiliatesStore';
import BrowserEnvironment from 'instances/browser_environment';
import { hasAccessToPremiumFeatures } from 'helpers/premiumEligibility';

import CookieBar from '../components/CookieBar';

class PremiumNavigationContainer extends PureComponent {
  static propTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    SubscriptionProductsActions.fetchProduct(PREMIUM_TRIAL_PRODUCT);
  }

  _renderPremiumNavigation = ({
    // disable eslint since it is a false-negative
    /* eslint-disable react/prop-types */
    authStore,
    subscriptionProductsState,
    acceptCookieStore,
    moduleNavigationState,
    affiliatesState,
    /* eslint-enable */
  }) => {
    const user = authStore.user;
    const isMobile = BrowserEnvironment.isMobile();
    const hasPremiumAccess = hasAccessToPremiumFeatures(user);
    const premiumTrialProduct = subscriptionProductsState.product;
    const hideCookieBar = Boolean(acceptCookieStore.cookieBarClosed || user);
    const affiliate = affiliatesState.affiliate;

    const currentPath = removeTrailingSlash(
      moduleNavigationState.activeUrl || window.location.pathname,
    );

    const aboutUrl = getRoute('/getpremium/actie/:affiliateId#about', `${currentPath}#about`);
    const faqUrl = getRoute('/getpremium/actie/:affiliateId#faq', `${currentPath}#faq`);
    const loginUrl = get(this.props.route, 'navigation.loginUrl') || `${currentPath}/login`;

    const hideLinks = get(this.props.route, 'navigation.hideLinks');

    return (
      <div>
        <CookieBar hidden={hideCookieBar} onClose={AcceptCookieActions.cookieBarClosed} />
        <PremiumNavigation
          mobile={isMobile}
          authorizedUser={user}
          hasAccessToPremiumFeatures={hasPremiumAccess}
          premiumTrialProduct={premiumTrialProduct}
          loginUrl={loginUrl}
          aboutUrl={aboutUrl(affiliate)}
          faqUrl={faqUrl(affiliate)}
          shouldHideTryNow={!!affiliate}
          lightLoginButton={get(this.props.route, 'navigation.lightLoginButton')}
          hideLinks={hideLinks}
        />
      </div>
    );
  };

  render() {
    return (
      <AltContainer
        stores={{
          authStore: AuthStore,
          subscriptionProductsState: SubscriptionsProductsStore,
          acceptCookieStore: AcceptCookieStore,
          moduleNavigationState: ModuleNavigationStore,
          affiliatesState: AffiliatesStore,
        }}
        render={this._renderPremiumNavigation}
      />
    );
  }
}

export default withRouter(PremiumNavigationContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/PremiumNavigation.js