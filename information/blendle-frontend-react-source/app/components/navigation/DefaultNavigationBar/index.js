import React from 'react';
import { bool, func } from 'prop-types';
import { getCountryCode, translate } from 'instances/i18n';
import { getExceptionForCountry } from 'helpers/countryExceptions';
import classNames from 'classnames';
import {
  BookmarkIcon,
  BrowseIcon,
  SearchIcon,
  NavigationBar,
  NavigationLeft,
  NavigationRight,
  NavigationItem,
} from '@blendle/lego';
import Link from 'components/Link';
import UserDropdownContainer from 'containers/navigation/UserDropdownContainer';
import PinsCountContainer from 'containers/navigation/PinsCountContainer';
import MicropaymentSignupNavigationBar from '../MicropaymentSignupNavigationBar';
import SearchBar from '../SearchBar';
import PremiumUpsellLink from '../PremiumUpsellLink';
import LogoLink from '../LogoLink';
import CSS from './style.scss';

const HOME_ALIASES = ['/home', '/premium2'];

function DefaultNavigationBar({
  isLoggedIn,
  isOnSearchRoute,
  hasPremiumSubscription,
  searchOpen,
  onToggleSearch,
}) {
  // We only have to check if the user is not logged in. The premium signup module defines the
  // navigation bar in the router, so this will never render on the premium sigup.
  if (!isLoggedIn) {
    return <MicropaymentSignupNavigationBar />;
  }

  return (
    <NavigationBar data-test-identifier="navigation-bar-main">
      <NavigationLeft>
        <LogoLink
          className={CSS.logo}
          beta={getExceptionForCountry(getCountryCode(), 'showBetaLogo', false)}
          width={97}
          height={26}
        />
        <span className={CSS.collapseOnSmall} data-test-identifier="navigation-bar-main-links">
          <NavigationItem>
            <Link href="/" aliases={HOME_ALIASES} className={CSS.link}>
              {translate(
                `navigation.links.${hasPremiumSubscription ? 'premium' : 'for_you'}.label`,
              )}
            </Link>
          </NavigationItem>
          <NavigationItem>
            <Link href="/kiosk" className={CSS.link}>
              {translate('navigation.links.kiosk.label')}
            </Link>
          </NavigationItem>
          <NavigationItem>
            <Link href="/pins" className={CSS.link}>
              {translate('navigation.links.readlater.label')}
            </Link>
            <PinsCountContainer data-test-identifier="navigation-readlater-count" />
          </NavigationItem>
          <NavigationItem>
            <Link href="/alerts" className={CSS.link}>
              {translate('navigation.links.alerts.label')}
            </Link>
          </NavigationItem>
        </span>
      </NavigationLeft>
      <NavigationRight>
        <NavigationItem className={CSS.collapseOnLarge}>
          <Link href="/kiosk" className={CSS.iconWrapper}>
            <BrowseIcon className={CSS.iconBrowse} />
          </Link>
        </NavigationItem>
        <NavigationItem className={CSS.collapseOnLarge}>
          <Link href="/pins" className={CSS.iconWrapper}>
            <BookmarkIcon className={CSS.iconBookmark} />
          </Link>
          <PinsCountContainer />
        </NavigationItem>
        <NavigationItem onClick={onToggleSearch} className={CSS.collapseOnLarge}>
          <span className={classNames(CSS.iconWrapper, isOnSearchRoute && 'active')}>
            <SearchIcon className={CSS.iconSearch} />
          </span>
        </NavigationItem>
        <PremiumUpsellLink />
        <SearchBar isOpen={searchOpen} onToggleSearch={onToggleSearch} />
        <UserDropdownContainer />
      </NavigationRight>
    </NavigationBar>
  );
}

DefaultNavigationBar.propTypes = {
  isLoggedIn: bool.isRequired,
  isOnSearchRoute: bool.isRequired,
  hasPremiumSubscription: bool.isRequired,
  searchOpen: bool.isRequired,
  onToggleSearch: func.isRequired,
};

export default DefaultNavigationBar;



// WEBPACK FOOTER //
// ./src/js/app/components/navigation/DefaultNavigationBar/index.js