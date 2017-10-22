import React from 'react';
import PropTypes from 'prop-types';
import Analytics from 'instances/analytics';
import { track } from 'helpers/premiumOnboardingEvents';
import Link from 'components/Link';
import classNames from 'classnames';
import CSS from './SignupDisclaimer.scss';

function sendTOSEvent() {
  track(Analytics, 'Signup/Terms and Conditions');
}

function sendPrivacyEvent() {
  track(Analytics, 'Signup/Privacy');
}

const SignupDisclaimer = ({ className }) => (
  <p className={classNames(CSS.disclaimer, className)}>
    Bij het aanmelden ga je akkoord met onze{' '}
    <Link href="/about/privacy" onClick={sendPrivacyEvent}>
      privacyverklaring
    </Link>{' '}
    en{' '}
    <Link href="/about/termsandconditions" onClick={sendTOSEvent}>
      de meest leesbare algemene voorwaarden
    </Link>{' '}
    van Nederland.
  </p>
);

SignupDisclaimer.propTypes = {
  className: PropTypes.string,
};

export default SignupDisclaimer;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/SignupDisclaimer/index.js