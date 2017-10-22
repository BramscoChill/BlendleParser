import React from 'react';
import { bool, string, func } from 'prop-types';
import Link from 'components/Link';
import CSS from './CtaButton.scss';

function CtaButton({ hadPremiumSubscription, followupSubscription, onUpsellClicked }) {
  const ctaCopy = hadPremiumSubscription ? 'Lees meer' : 'Probeer het gratis';
  const ctaUrl = hadPremiumSubscription
    ? `/subscription/${followupSubscription}`
    : '/premium-intro';

  return (
    <Link href={ctaUrl} onClick={onUpsellClicked} className={`${CSS.ctaButton} btn s-small`}>
      {ctaCopy}
    </Link>
  );
}

CtaButton.propTypes = {
  hadPremiumSubscription: bool.isRequired,
  followupSubscription: string.isRequired,
  onUpsellClicked: func.isRequired,
};

export default CtaButton;



// WEBPACK FOOTER //
// ./src/js/app/modules/timeline/components/UpgradeBulletin/CtaButton.js