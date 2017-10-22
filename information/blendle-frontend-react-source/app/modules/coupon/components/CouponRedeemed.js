import React from 'react';
import PropTypes from 'prop-types';
import { history } from 'byebye';
import Link from 'components/Link';
import { translate, translateElement } from 'instances/i18n';
import CouponDialogue from 'components/dialogues/Coupon';

export default class CouponRedeemed extends React.Component {
  static propTypes = {
    rewards: PropTypes.array,
    isNewUser: PropTypes.bool,
  };

  _onClickButton(e) {
    e.preventDefault();
    history.navigate('/', { trigger: true });
  }

  _renderTitle() {
    if (this.props.isNewUser) {
      return (
        <h1 className="title">
          {translateElement(<span />, 'coupons.redeemed.title_new_user', false)}
        </h1>
      );
    }

    return (
      <h1 className="title">
        {translateElement(<span />, 'coupons.redeemed.title', false)}
        <CouponDialogue rewards={this.props.rewards} onClose={this._onClickButton} />
      </h1>
    );
  }

  _renderContent() {
    if (!this.props.isNewUser) {
      return (
        <Link href="/" className="btn btn-continue">
          {translate('coupons.redeemed.readon_button')}
        </Link>
      );
    }
    return <p>{translate('coupons.redeemed.view_mailbox')}</p>;
  }

  render() {
    return (
      <div className="v-coupon-redeemed">
        <span className="icon" />
        {this._renderTitle()}
        {this._renderContent()}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/coupon/components/CouponRedeemed.js