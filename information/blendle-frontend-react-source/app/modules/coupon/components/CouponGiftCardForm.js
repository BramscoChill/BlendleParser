import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { COUPON_REDEEMED, COUPON_EXPIRED, COUPON_EXCEEDED_MAX } from 'app-constants';
import { translate } from 'instances/i18n';
import Button from 'components/Button';
import Link from 'components/Link';
import LoginContainer from 'components/login/LoginContainer';

class CouponGiftCardForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChangeCode: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    initialCode: PropTypes.string,
    error: PropTypes.object,
    placeholder: PropTypes.string.isRequired,
    user: PropTypes.object,
    isLoading: PropTypes.bool,
  };

  _onSubmit = (ev) => {
    ev.preventDefault();
    this.props.onSubmit(ReactDOM.findDOMNode(this.refs.code).value.trim());
  };

  _onChangeCode = (ev) => {
    ev.preventDefault();

    this.props.onChangeCode(ev.target.value);
  };

  _renderError = () => {
    if (!this.props.error) {
      return null;
    }

    const type = this.props.error.type;
    let message = translate('settings.coupons.redeem.error_invalid');

    if (type === COUPON_REDEEMED) {
      message = translate('settings.coupons.redeem.error_already_redeemed');
    } else if (type === COUPON_EXCEEDED_MAX) {
      message = translate('settings.coupons.redeem.error_exceeded_maximum');
    } else if (type === COUPON_EXPIRED) {
      message = translate('settings.coupons.redeem.error_expired');
    }

    return <div className="error-message visible">{message}</div>;
  };

  _renderSignInMessage = () => (
    // This is only temporary (only for the weekend) and only for Dutch people, so hardcoded
    // strings are fine for now
    <div className="v-form v-coupon-entercode s-login">
      <h2>Voor wie is het?</h2>
      <p>
        We moeten natuurlijk wel even weten aan wie we het cadeautje mogen overhandigen. Log
        hieronder in of maak een account aan.
      </p>
      <LoginContainer />
      <Link href="/signup" className="btn btn-fullwidth btn-white btn-signup">
        Ik wil een nieuw account
      </Link>
    </div>
  );

  render() {
    if (!this.props.user) {
      return this._renderSignInMessage();
    }

    return (
      <div className="v-form v-coupon-entercode">
        <form className="frm frm-couponcode" onSubmit={this._onSubmit} name="coupon-form">
          <h2>{translate('coupons.entercode.title')}</h2>
          <div className="frm-field-wrapper">
            <input
              className="inp inp-text inp-code"
              ref="code"
              onChange={this._onChangeCode}
              onFocus={this.props.onFocus}
              onBlur={this.props.onBlur}
              placeholder={this.props.placeholder}
              defaultValue={this.props.initialCode}
              name="couponcode"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
            />
            {this._renderError()}
          </div>
          <Button className="btn-green btn-redeem" loading={this.props.isLoading}>
            {translate('settings.coupons.redeem.redeem')}
          </Button>
        </form>
      </div>
    );
  }
}

export default CouponGiftCardForm;



// WEBPACK FOOTER //
// ./src/js/app/modules/coupon/components/CouponGiftCardForm.js