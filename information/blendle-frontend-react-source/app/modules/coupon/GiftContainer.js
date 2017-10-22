import React from 'react';
import CouponPage from 'modules/coupon/components/CouponPage';
import AltContainer from 'alt-container';
import GiftStore from 'stores/GiftStore';
import AuthStore from 'stores/AuthStore';
import GiftActions from 'actions/GiftActions';

function transformRewards(giftResponse) {
  if (giftResponse.data) {
    return {
      rewards: [{ name: '', amount: giftResponse.data.amount }],
    };
  }
}

class GiftContainer extends React.Component {
  _onFocus = (ev) => {
    ev.preventDefault();

    GiftActions.setFocus(true);
  };

  _onBlur = (ev) => {
    ev.preventDefault();

    GiftActions.setFocus(false);
  };

  render() {
    return (
      <AltContainer
        stores={{ GiftStore, AuthStore }}
        render={(stores) => {
          const couponData = transformRewards(stores.GiftStore.data);

          return (
            <CouponPage
              className="coupon-gifts"
              type="coupon-gift-card"
              user={stores.AuthStore.user}
              couponStatus={stores.GiftStore.status}
              couponData={couponData}
              couponError={stores.GiftStore.error}
              onRedeem={GiftActions.redeem}
              onChangeCode={GiftActions.setCode}
              onFocusCode={this._onFocus}
              onBlurCode={this._onBlur}
              code={stores.GiftStore.code}
              isFocussed={stores.GiftStore.isFocussed}
              placeholder="BARCODE-PIN"
            />
          );
        }}
      />
    );
  }
}

export default GiftContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/coupon/GiftContainer.js