import React from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import AuthStore from 'stores/AuthStore';
import SignUpStore from 'stores/SignUpStore';
import SignUpActions from 'actions/SignUpActions';
import CouponStore from 'stores/CouponStore';
import AuthActions from 'actions/AuthActions';
import CouponActions from 'actions/CouponActions';
import CouponPage from './components/CouponPage';
import { getSignUpRewards } from 'managers/signup';
import { STATUS_OK } from 'app-constants';

export default class CouponContainer extends React.Component {
  static propTypes = {
    initialCode: PropTypes.string,
    campaign: PropTypes.object,
    existingUserVersions: PropTypes.object,
  };

  static defaultProps = {
    existingUserVersions: {},
  };

  state = {
    loading: false,
  };

  _onRedeem(user, code) {
    CouponActions.redeem(code, user && user.id);
  }

  _onAuthenticate(user, code) {
    // Some campaigns use a different code for existing users
    const codeToRedeem = this.props.existingUserVersions[code] || code;

    CouponActions.redeem(codeToRedeem, user && user.id);
  }

  _onFacebookSignUp(user) {
    getSignUpRewards(user.id).then((rewards) => {
      this.setState({
        facebookSignUp: STATUS_OK,
        signUpRewards: rewards,
      });
    });
  }

  render() {
    return (
      <AltContainer
        stores={{ AuthStore, CouponStore, SignUpStore }}
        render={stores => (
          <CouponPage
            initialCode={this.props.initialCode}
            campaign={this.props.campaign}
            user={stores.AuthStore.user}
            signUpStatus={stores.SignUpStore.status}
            facebookSignUpStatus={this.state.facebookSignUp}
            signUpRewards={this.state.signUpRewards}
            couponStatus={stores.CouponStore.status}
            couponData={stores.CouponStore.data}
            couponError={stores.CouponStore.error}
            onLogout={AuthActions.logout}
            onAuthenticate={this._onAuthenticate.bind(this, stores.AuthStore.user)}
            onRedeem={this._onRedeem.bind(this, stores.AuthStore.user)}
            onFacebookSignUp={user => this._onFacebookSignUp(user)}
            loading={this.state.loading}
          />
        )}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/coupon/CouponContainer.js