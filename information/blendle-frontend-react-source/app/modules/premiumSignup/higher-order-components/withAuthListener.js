import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { STATUS_OK } from 'app-constants';
import ApplicationState from 'instances/application_state';
import SignUpStore from 'stores/SignUpStore';
import LoginStore from 'stores/LoginStore';
import { getOnboardingRoute } from 'helpers/onboarding';
import { shouldGetAutoRenewTrial } from 'helpers/premiumEligibility';
import { getCouponCode } from 'selectors/signUp';
import CouponActions from 'actions/CouponActions';
import Auth from 'controllers/auth';

// Landingpages should be rendered inside this HOC, as this HOC implements the logic
// for redirecting to the correct pages etc. after signing up or logging in

export default ComposedComponent =>
  class AuthListenerContainer extends Component {
    static propTypes = {
      router: PropTypes.object.isRequired,
    };

    constructor(props) {
      super(props);

      this.state = {
        signUpStatus: null,
      };
    }

    componentDidMount() {
      SignUpStore.listen(this._onSignUpStore);
      LoginStore.listen(this._onLoginStore);
    }

    componentWillUnmount() {
      SignUpStore.unlisten(this._onSignUpStore);
      LoginStore.unlisten(this._onLoginStore);
      clearTimeout(this._dispatchTimeout);
    }

    _onSignUpStore = (storeState) => {
      const { status } = storeState;
      const previousStatus = this.state.signUpStatus;
      const { router } = this.props;
      const { pathname } = window.location;

      // Only go to the onboarding URL if the store was changed by a signup
      if (status !== previousStatus && status === STATUS_OK) {
        this._dispatchTimeout = setTimeout(() => {
          if (shouldGetAutoRenewTrial()) {
            router.push('/payment/subscription/blendlepremium_one_week_auto_renewal');
          } else {
            router.push(getOnboardingRoute(pathname));
          }
        });
      }

      this.setState({ signUpStatus: status });
    };

    _onLoginStore = (storeState) => {
      if (storeState.login.status === STATUS_OK) {
        // Fixes dispatch in dispatch
        this._dispatchTimeout = setTimeout(() => {
          // If we still have a coupon code, we should redeem it
          const couponCode = getCouponCode(SignUpStore.getState());
          if (couponCode) {
            CouponActions.redeem(couponCode, Auth.getUser().id);
            return;
          }

          this.props.router.push(ApplicationState.get('requireAuthUrl') || '/');
        });
      }
    };

    render() {
      return <ComposedComponent {...this.props} />;
    }
  };



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/higher-order-components/withAuthListener.js