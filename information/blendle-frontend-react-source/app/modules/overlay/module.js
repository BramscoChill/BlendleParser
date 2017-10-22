import React from 'react';
import PremiumVerifiedOverlayContainer from 'containers/overlays/PremiumVerifiedOverlayContainer';

export function openPremiumSuccess(dismissRoute) {
  return <PremiumVerifiedOverlayContainer dismissRoute={dismissRoute} />;
}



// WEBPACK FOOTER //
// ./src/js/app/modules/overlay/module.js