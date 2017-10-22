import React from 'react';
import Link from 'components/Link';
import { translateElement } from 'instances/i18n';
import CSS from './style.scss';

const DeeplinkSignupPane = () => (
  <div className={CSS.signupPane}>
    <div className={CSS.mobileBlock}>
      <div className={CSS.mobileContent}>
        <Link href={`${window.location.pathname}/signup`} className={`${CSS.button} btn`}>
          Lees dit verhaal gratis
        </Link>
        <p>
          <strong>Heb je al een Blendle-account?</strong> Even snel{' '}
          <Link href="/login">inloggen</Link>.
        </p>
      </div>
    </div>
    <div className={CSS.content}>
      <h2 className={CSS.subtitle}>Dit verhaal + nog veel meer lees je via Blendle.</h2>
      <h1 className={CSS.title}>Het beste uit alle kranten en tijdschriften op één plek</h1>

      <div>
        <h3 className={CSS.startTrialTitle}>Probeer een weekje gratis</h3>
        <p className={CSS.startTrialBody}>
          Je gratis week stopt vanzelf, dus je zit nergens aan vast.
        </p>
        <Link href={`${window.location.pathname}/signup`} className={`${CSS.button} btn`}>
          Gratis verder lezen!
        </Link>
      </div>

      <footer className={CSS.footer}>
        {translateElement('deeplink.footer.terms_conditions', false)}{' '}
        {translateElement('deeplink.footer.cookies', false)}
      </footer>
    </div>
  </div>
);

export default DeeplinkSignupPane;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/DeeplinkSignupPane/index.js