import React, { PureComponent } from 'react';
import UpsellStateContainer from 'containers/UpsellStateContainer';
import { PREMIUM_PROVIDER_ID } from 'app-constants';
import Link from 'components/Link';
import classNames from 'classnames';
import features from 'config/features';
import { isTest } from 'helpers/environment';
import CSS from './style.scss';

class PremiumUpsellButton extends PureComponent {
  _onClickBeforeTrial = () => {
    // TODO: events?
  };

  _onClickDuringTrial = () => {
    // TODO: events?
  };

  _renderBeforeTrial = () => (
    <Link
      className={classNames(CSS.link, { [CSS.delay]: !isTest() })}
      onClick={this._onClickBeforeTrial}
      href="/premium-intro"
      data-test-identifier="reader-upsell-link"
    >
      Probeer Blendle Premium
    </Link>
  );

  _renderDuringTrial = () => (
    <Link
      className={classNames(CSS.link, { [CSS.delay]: !isTest() })}
      onClick={this._onClickDuringTrial}
      href={`/subscription/${PREMIUM_PROVIDER_ID}`}
      data-test-identifier="reader-upsell-link"
    >
      Blendle Premium houden
    </Link>
  );

  render() {
    if (!features.readerPremiumUpsell) {
      return null;
    }

    return (
      <UpsellStateContainer
        renderBeforeTrial={this._renderBeforeTrial}
        renderDuringTrial={this._renderDuringTrial}
      />
    );
  }
}

export default PremiumUpsellButton;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/PremiumUpsellLink/index.js