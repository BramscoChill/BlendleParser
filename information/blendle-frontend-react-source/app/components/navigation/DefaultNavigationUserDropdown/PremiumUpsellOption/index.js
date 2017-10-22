import React from 'react';
import { object } from 'prop-types';
import { Button } from '@blendle/lego';
import UpsellStateContainer from 'containers/UpsellStateContainer';
import { getRemainingDays } from 'selectors/subscriptions';
import PremiumUpsellBanner from '../../PremiumUpsellBanner';
import CSS from './style.scss';

function BeforeTrial() {
  return (
    <PremiumUpsellBanner.trialBanner>
      Probeer gratis een weekje Blendle Premium
      <Button className={CSS.premiumButton} size="small" color="white">
        Lees meer!
      </Button>
    </PremiumUpsellBanner.trialBanner>
  );
}

function DuringTrial({ subscription }) {
  const daysLeft = getRemainingDays(subscription);

  // TODO: Translations to onesky
  const message =
    daysLeft === 0
      ? 'Je laatste dag gratis Blendle Premium. Toegang houden?'
      : `Nog ${daysLeft} ${daysLeft === 1
          ? 'dag'
          : 'dagen'} gratis Blendle Premium. Toegang houden?`;

  return (
    <PremiumUpsellBanner>
      {message}
      <Button className={CSS.premiumButton} size="small" color="white">
        Lees meer
      </Button>
    </PremiumUpsellBanner>
  );
}

DuringTrial.propTypes = {
  subscription: object.isRequired, // eslint-disable-line
};

function AfterTrial() {
  return (
    <PremiumUpsellBanner>
      Altijd onbeperkt toegang tot de beste stukken?
      <Button className={CSS.premiumButton} size="small" color="white">
        Meer over Premium
      </Button>
    </PremiumUpsellBanner>
  );
}

function PremiumUpsellOption() {
  return (
    <UpsellStateContainer
      renderBeforeTrial={BeforeTrial}
      renderDuringTrial={DuringTrial}
      renderAfterSubscription={AfterTrial}
    />
  );
}

export default PremiumUpsellOption;



// WEBPACK FOOTER //
// ./src/js/app/components/navigation/DefaultNavigationUserDropdown/PremiumUpsellOption/index.js