import React from 'react';
import PremiumBannerContainer from 'modules/item/containers/GetPremiumBannerContainer';
import CSS from './style.scss';

function UpsellBanner() {
  return (
    <div className={CSS.upsellBannerContainer}>
      <PremiumBannerContainer
        shouldCheckItemConditions={false}
        shouldHideOnMobile={false}
        analytics={{
          internal_location: 'timeline/premium',
          location_in_layout: 'sections',
        }}
      />
    </div>
  );
}

export default UpsellBanner;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/PersonalPage/UpsellBanner/index.js