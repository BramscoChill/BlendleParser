import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PREMIUM_MONTHLY_PRODUCT, PREMIUM_PROVIDER_ID, PREMIUM_TRIAL_PRODUCT } from 'app-constants';
import Link from 'components/Link';
import { Backdrop } from '@blendle/lego';
import Analytics from 'instances/analytics';
import CSS from './style.scss';

export default class PremiumUpsellBanner extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    color: PropTypes.string,
    innerColor: PropTypes.string,
    subscriptionProductUid: PropTypes.string,
    href: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    href: `/subscription/${PREMIUM_PROVIDER_ID}`,
    subscriptionProductUid: PREMIUM_MONTHLY_PRODUCT,
    color: Backdrop.red(0),
    innerColor: Backdrop.yellow(),
  };

  _onClickButton = () => {
    Analytics.track('Subscription Upsell Started', {
      internal_location: 'user_dropdown',
      provider_id: PREMIUM_PROVIDER_ID,
      subscription_product_uid: this.props.subscriptionProductUid,
    });
  };

  render() {
    const { color, innerColor, children, href } = this.props;

    return (
      <div className={CSS.premiumBannerContainer}>
        <div className={CSS.premiumBanner}>
          <Backdrop.SmallBottomRight
            className={CSS.premiumBackdrop}
            color={color}
            innerColor={innerColor}
          />
          <Link className={CSS.premiumLink} onClick={this._onClickButton} href={href}>
            {children}
          </Link>
        </div>
      </div>
    );
  }
}

PremiumUpsellBanner.trialBanner = props => (
  <PremiumUpsellBanner
    color={Backdrop.blue(180)}
    innerColor={Backdrop.green()}
    href="/premium-intro"
    subscriptionProductUid={PREMIUM_TRIAL_PRODUCT}
    {...props}
  />
);



// WEBPACK FOOTER //
// ./src/js/app/components/navigation/PremiumUpsellBanner/index.js