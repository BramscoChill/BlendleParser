import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { translate } from 'instances/i18n';
import { couponErrorMessage } from 'selectors/coupon';
import CouponGiftCardForm from './CouponGiftCardForm';
import Button from 'components/Button';

export default class CouponForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    initialCode: PropTypes.string,
    error: PropTypes.object,
    placeholder: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
  };

  static defaultProps = {
    placeholder: 'XXXXXXXXX',
  };

  componentDidMount() {
    const codeInput = ReactDOM.findDOMNode(this.refs.code);
    const shouldAutofocus = !(
      window.BrowserDetect.browser === 'Explorer' && window.BrowserDetect.version <= 11
    );

    if (codeInput && shouldAutofocus) {
      codeInput.focus();
    }
  }

  _onSubmit(ev) {
    ev.preventDefault();
    this.props.onSubmit(ReactDOM.findDOMNode(this.refs.code).value.trim());
  }

  _renderError() {
    if (!this.props.error) {
      return;
    }

    const type = this.props.error.type;
    const message = couponErrorMessage(type);

    return <div className="error-message visible">{message}</div>;
  }

  render() {
    if (this.props.type === 'coupon-gift-card') {
      return <CouponGiftCardForm {...this.props} />;
    }

    return (
      <div className="v-form v-coupon-entercode">
        <form
          className="frm frm-couponcode"
          onSubmit={this._onSubmit.bind(this)}
          name="coupon-form"
        >
          <h2>{translate('coupons.entercode.title')}</h2>
          <div className="frm-field-wrapper">
            <input
              className="inp inp-text inp-code"
              ref="code"
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



// WEBPACK FOOTER //
// ./src/js/app/modules/coupon/components/CouponForm.js