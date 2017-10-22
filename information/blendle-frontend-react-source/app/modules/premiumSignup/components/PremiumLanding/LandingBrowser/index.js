import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getHdImage } from 'helpers/images';
import staticImageUrl from 'helpers/staticImageUrl';
import { isMobileBreakpoint } from 'helpers/viewport';
import LandingCSS from '../style.scss';
import CSS from './style.scss';

function getImage(isMobile, deviceType) {
  switch (deviceType) {
    case 'samsung':
      if (isMobile) {
        return getHdImage(
          staticImageUrl('/img/backgrounds/blendle_mobile_android.png?auto=format'),
          staticImageUrl('/img/backgrounds/blendle_mobile_android@2x.png?auto=format'),
        );
      }

      return getHdImage(
        staticImageUrl('/img/backgrounds/timeline_tablet.png?auto=format'),
        staticImageUrl('/img/backgrounds/timeline_tablet@2x.png?auto=format'),
      );
    default:
      if (isMobile) {
        return getHdImage(
          staticImageUrl('/img/backgrounds/blendle_mobile.png?auto=format'),
          staticImageUrl('/img/backgrounds/blendle_mobile@2x.png?auto=format'),
        );
      }

      return getHdImage(
        staticImageUrl('/img/backgrounds/timeline.png?auto=format'),
        staticImageUrl('/img/backgrounds/timeline@2x.png?auto=format'),
      );
  }
}

const Browser = ({ className, deviceType }) => {
  const image = getImage(isMobileBreakpoint(), deviceType);

  return (
    <div className={classNames(className, CSS.browser, LandingCSS.slideUp)}>
      <img src={image} />
    </div>
  );
};

Browser.propTypes = {
  className: PropTypes.string,
  deviceType: PropTypes.string,
};

export default Browser;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/PremiumLanding/LandingBrowser/index.js