import React from 'react';
import { translate } from 'instances/i18n';
import Link from 'components/Link';

export default () => (
  <nav className="about-menu">
    <Link className="about-menu-link" href="/about">
      {translate('about.about.navigation')}
    </Link>
    <Link className="about-menu-link" href="/about/termsandconditions">
      {translate('about.terms_and_conditions.navigation')}
    </Link>
    <Link className="about-menu-link" href="/about/privacy">
      {translate('about.privacy_statement.navigation')}
    </Link>
    <Link className="about-menu-link" href="https://blendle.homerun.co/">
      {translate('navigation.links.jobs.label')}
    </Link>
  </nav>
);



// WEBPACK FOOTER //
// ./src/js/app/modules/about/components/AboutMenu.js