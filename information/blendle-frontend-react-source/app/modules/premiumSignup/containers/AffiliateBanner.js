import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { STATUS_PENDING, STATUS_OK, STATUS_ERROR, AUTH_REQUIRED } from 'app-constants';
import { get } from 'lodash';
import AltContainer from 'alt-container';
import AuthActions from 'actions/AuthActions';
import AuthStore from 'stores/AuthStore';
import CouponActions from 'actions/CouponActions';
import CouponStore from 'stores/CouponStore';
import AffiliatesStore from 'stores/AffiliatesStore';
import SignUpActions from 'actions/SignUpActions';
import AffiliateBanner from '../components/AffiliateBanner';

class AffiliateBannerContainer extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      code: get(this.props, 'location.query.code'),
      error: null,
    };
  }

  componentDidMount() {
    CouponStore.listen(this._onCouponStateChange);
  }

  componentWillUnmount() {
    CouponStore.unlisten(this._onCouponStateChange);
  }

  _onCouponStateChange = (couponState) => {
    const user = AuthStore.getState().user;
    const affiliate = AffiliatesStore.getState().affiliate;

    // If an excisting user submits a coupon, we have to wait for the result. If everything is okay,
    // we still want to push them through our onboarding to improve their profile.
    if (couponState.status === STATUS_OK && user) {
      setTimeout(() => {
        this.props.router.push(`/getpremium/actie/${affiliate.name}/channels`);
      });
    }

    if (couponState.status === STATUS_ERROR) {
      // The coupon is valid, but you need to be logged in to redeem it
      if (couponState.error.type === AUTH_REQUIRED && !user) {
        setTimeout(() => {
          this.props.router.push(`/getpremium/actie/${affiliate.name}/signup`);
        });

        return;
      }

      this.setState({
        error: couponState.error,
      });
    }
  };

  _onChangeCode = (e) => {
    e.preventDefault();

    this.setState({
      code: e.target.value,
    });
  };

  _onSubmit = (e) => {
    e.preventDefault();

    const user = AuthStore.getState().user;

    // Add the coupon to the signup context
    if (!user) {
      SignUpActions.extendContext({ coupon_code: this.state.code });
    }

    // Try to redeem the coupon. If a user is not logged in, this action only validates the code.
    CouponActions.redeem(this.state.code, user && user.id);
  };

  _onClickLogout(e) {
    e.preventDefault();

    AuthActions.logout();
  }

  _renderBanner = ({ authState, couponState, affiliateState }) => (
    <AffiliateBanner
      user={authState.user}
      onChangeCode={this._onChangeCode}
      onSubmit={this._onSubmit}
      onClickLogout={this._onClickLogout}
      error={this.state.error}
      isLoading={couponState.status === STATUS_PENDING}
      titleText={get(affiliateState, 'affiliate.copy.banner.title')}
      subtitleText={get(affiliateState, 'affiliate.copy.banner.subtitle')}
      initialCode={get(this.props, 'location.query.code')}
      bannerImage={get(affiliateState, 'affiliate.bannerImage')}
    />
  );

  render() {
    return (
      <AltContainer
        stores={{
          authState: AuthStore,
          couponState: CouponStore,
          affiliateState: AffiliatesStore,
        }}
        render={this._renderBanner}
      />
    );
  }
}

export default AffiliateBannerContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/AffiliateBanner.js