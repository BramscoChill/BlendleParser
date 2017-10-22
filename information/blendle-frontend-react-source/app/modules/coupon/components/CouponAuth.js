import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'instances/i18n';
import FacebookConnectContainer from 'components/facebookConnect/FacebookConnectContainer';
import SignUpContainer from 'components/signUp/SignUpContainer';
import LoginContainer from 'components/login/LoginContainer';
import { SIGNUP_TYPE_COUPON } from 'app-constants';

export default class CouponAuth extends React.Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
  };

  state = {
    variant: 'signUp',
  };

  _onVariantChange(variant) {
    this.setState({ variant });
  }

  _renderFacebookConnect() {
    return (
      <FacebookConnectContainer
        signUpType={SIGNUP_TYPE_COUPON}
        analyticsPayload={{ login_type: 'manual' }}
        onLogin={this.props.onLogin}
        onSignUp={this.props.onFacebookSignUp}
        signUpContext={{
          coupon_code: this.props.code,
        }}
      />
    );
  }

  render() {
    if (this.state.variant === 'login') {
      return (
        <div className="v-coupon-login">
          <h2>{translate('deeplink.login.title')}</h2>
          <LoginContainer
            analyticsName={'Coupon Deeplink'}
            analyticsPayload={{ login_type: 'manual' }}
            onLogin={this.props.onLogin}
            onToSignUp={this._onVariantChange.bind(this, 'signUp')}
          />
          {this._renderFacebookConnect()}
        </div>
      );
    }
    return (
      <div className="v-coupon-signup">
        <h2>{translate('coupons.signup.title')}</h2>
        <SignUpContainer
          signUpType={SIGNUP_TYPE_COUPON}
          buttonHTML={translate('coupons.signup.button')}
          onToLogin={this._onVariantChange.bind(this, 'login')}
          signUpContext={{
            coupon_code: this.props.code,
          }}
          onLogin={this.props.onLogin}
        />
        {this._renderFacebookConnect()}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/coupon/components/CouponAuth.js