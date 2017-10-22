import React from 'react';
import PropTypes from 'prop-types';
import { CloseIcon } from '@blendle/lego';
import classNames from 'classnames';
import Analytics from 'instances/analytics';
import { track } from 'helpers/premiumOnboardingEvents';
import Link from 'components/Link';

import { cookiebar, cookiebarHidden, text, closeButton, link } from './CookieBar.scss';

function sendEvent() {
  track(Analytics, 'Signup/Privacy');
}

const CookieBar = ({ onClose, hidden }) => {
  const wrapperClass = classNames(cookiebar, {
    [cookiebarHidden]: hidden,
  });

  document.body.classList.toggle('cookieBarOpen', !hidden);

  return (
    <div className={wrapperClass}>
      <div className={text}>
        We willen je graag dingen kunnen aanbevelen op basis van jouw interesses. Ook buiten
        Blendle: bijvoorbeeld artikelen op Facebook. Daar plaatsen we een cookie voor. Als je onze
        website gebruikt, gaan we ervan uit dat je dat oké vindt.{' '}
        <Link href="/about/privacy" className={link} onClick={sendEvent}>
          Hier vind je onze privacyverklaring
        </Link>.
      </div>
      <div>
        <button className={closeButton} aria-label="close" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};
CookieBar.propTypes = {
  onClose: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
};

export default CookieBar;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/CookieBar/index.js