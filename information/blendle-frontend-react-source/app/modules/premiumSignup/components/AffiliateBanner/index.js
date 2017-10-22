import React, { PureComponent } from 'react';
import { Button, ButtonGroup, TextInput } from '@blendle/lego';
import Link from 'components/Link';
import AvatarImage from 'components/AvatarImage';
import LandingBrowser from '../PremiumLanding/LandingBrowser';
import { couponErrorMessage } from 'selectors/coupon';
import CSS from './style.scss';

export default class AffiliateBanner extends PureComponent {
  _renderAuthState = () => {
    const { user } = this.props;
    if (user) {
      const avatar = user.getAvatarHref();

      return (
        <div className={CSS.authState}>
          <AvatarImage src={avatar} className={CSS.avatar} />
          <div>
            Je bent ingelogd als <strong>{user.get('email')}</strong>.{' '}
            <Link href="#" onClick={this.props.onClickLogout}>
              Ben jij dit niet?
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className={CSS.authState}>
        <div>
          <strong>Je bent nog niet ingelogd.</strong> In de volgende stap kun je een account
          aanmaken of inloggen.
        </div>
      </div>
    );
  };

  _renderCouponForm = () => {
    const { error } = this.props;

    return (
      <div className={CSS.formContainer}>
        <strong>Jouw code:</strong>
        <form onSubmit={this.props.onSubmit} name="coupon-form">
          <ButtonGroup vertical>
            <TextInput
              className={CSS.input}
              placeholder="XXXXXXXXX"
              name="couponcode"
              error={!!error}
              message={error ? couponErrorMessage(error.type) : null}
              onChange={this.props.onChangeCode}
              defaultValue={this.props.initialCode}
            />
            <Button color="cash-green" type="submit" isLoading={this.props.isLoading}>
              Cadeautje ophalen
            </Button>
          </ButtonGroup>
        </form>
        {this._renderAuthState()}
      </div>
    );
  };

  _renderBannerImage() {
    const { bannerImage } = this.props;

    if (bannerImage) {
      return <img src={bannerImage} alt="" />;
    }

    // We need to reserve some space for the overlapping browser screenshot
    return <div className={`${CSS.bannerImage} ${CSS.emptyBanner}`} />;
  }

  render() {
    return (
      <section
        id="topbanner"
        className={CSS.affiliateBanner}
        data-test-identifier="premium-affiliate-coupon-banner"
      >
        <h1
          className={CSS.title}
          dangerouslySetInnerHTML={{
            __html: this.props.titleText,
          }}
        />
        <p className={CSS.subtitle}>{this.props.subtitleText}</p>
        {this._renderCouponForm()}
        {this._renderBannerImage()}
        <LandingBrowser className={CSS.browser} deviceType="samsung" />
      </section>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/AffiliateBanner/index.js