import React from 'react';
import { getCountryCode } from 'instances/i18n';
import { getExceptionForCountry } from 'helpers/countryExceptions';
import { NavigationBar, NavigationLeft, NavigationRight } from '@blendle/lego';
import LoginWarningContainer from 'containers/navigation/LoginWarningContainer';
import LoginDropdownContainer from 'containers/navigation/LoginDropdownContainer';
import LocaleDropdownContainer from 'containers/navigation/LocaleDropdownContainer';
import LogoLink from '../LogoLink';
import CSS from './style.scss';

function MicropaymentSignupNavigationBar() {
  return (
    <NavigationBar data-test-identifier="navigation-bar-main">
      <NavigationLeft>
        <LogoLink
          className={CSS.logo}
          beta={getExceptionForCountry(getCountryCode(), 'showBetaLogo', false)}
          width={97}
          height={26}
        />
      </NavigationLeft>
      <NavigationRight>
        <LocaleDropdownContainer />
        <LoginDropdownContainer />
        <LoginWarningContainer />
      </NavigationRight>
    </NavigationBar>
  );
}

export default MicropaymentSignupNavigationBar;



// WEBPACK FOOTER //
// ./src/js/app/components/navigation/MicropaymentSignupNavigationBar/index.js