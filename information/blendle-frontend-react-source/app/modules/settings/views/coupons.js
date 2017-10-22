import Auth from 'controllers/auth';
import { redeemCoupon } from 'managers/coupon';
import SimpleFormView from 'views/helpers/simpleform';
import { locale as i18n } from 'instances/i18n';
import couponsTemplate from 'templates/modules/settings/coupons';
import Analytics from 'instances/analytics';
import { keyCode } from 'app-constants';
import React from 'react';
import ReactDOM from 'react-dom';
import ByeBye from 'byebye';
import CouponDialogue from 'components/dialogues/Coupon';
import { couponErrorMessage } from 'selectors/coupon';

const CouponsView = SimpleFormView.extend({
  className: 'v-coupons pane',
  events: {
    'submit .frm-redeem-coupon': '_eSubmit',
    'click .btn-redeem': '_eRedeemCoupon',
    'keyup .inp-couponcode': '_eKeyupCouponcode',
  },

  render() {
    this.el.innerHTML = couponsTemplate({ i18n });

    this.display();

    return this;
  },

  _eRedeemCoupon(e) {
    e.preventDefault();

    const couponCode = this.el.querySelector('.inp-couponcode').value;

    this._removeErrorField('couponcode');
    this.el.querySelector('.btn-redeem').classList.add('s-loading');

    if (couponCode === '') {
      this.el.querySelector('.btn-redeem').classList.remove('s-loading');
      this._drawErrorField('couponcode', i18n.settings.coupons.redeem.error_empty);
      return;
    }

    redeemCoupon(couponCode, Auth.getUser().id)
      .then(this._showRedeemConfirm.bind(this), (err) => {
        this._drawErrorField('couponcode', couponErrorMessage(err.type));

        Analytics.track('Redeem Coupon: Failed', {
          type: 'settings',
          reason: err.type,
        });
      })
      .fin(() => {
        this.el.querySelector('.btn-redeem').classList.remove('s-loading');
      });
  },

  _showRedeemConfirm(result) {
    this.el.querySelector('.redeem').classList.add('s-success');
    this.el.querySelector('.redeem-success .confirmation').innerHTML = i18n.coupons.redeemed.title;

    const rewards = result.rewards;
    const couponDialog = this.addView(
      new ByeBye.ReactView({
        renderComponent: () => (
          <CouponDialogue
            rewards={rewards}
            onClose={() => {
              ReactDOM.unmountComponentAtNode(couponDialog.el);
            }}
          />
        ),
      }),
      'couponDialog',
    );

    couponDialog.render();

    Analytics.track('Redeem Coupon: Success', {
      type: 'settings',
      amount: result.transaction.amount,
    });
  },

  _eSubmit(e) {
    e.preventDefault();

    this._eRedeemCoupon(e);
  },

  _eKeyupCouponcode(e) {
    if (e.keyCode === keyCode.BACKSPACE) {
      this._removeErrorField('couponcode');
    }
  },

  /**
   * Check if the current selection in this view is valid.
   *
   * @return {Boolean} current selection is valid
   */
  _isValid() {
    if (this.el.querySelector('.inp-name').value === '') {
      return false;
    }

    const emailValue = this.el.querySelector('.inp-email').value;

    if (emailValue === '' || !emailValue.match(/^.+@.+\..+$/)) {
      return false;
    }

    // Amount is set, amount is higher than 0, method is selected and method is valid
    return this.getView('payment_amount').isValid() && this.getView('payment_method').isValid();
  },
});

export default CouponsView;



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/views/coupons.js