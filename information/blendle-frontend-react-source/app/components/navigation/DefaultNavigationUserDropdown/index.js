import React from 'react';
import { string, func, bool } from 'prop-types';
import { formatCurrency, translate } from 'instances/i18n';
import { NavigationUserDropdown, DropdownOptionGroup, DropdownOption, Label } from '@blendle/lego';
import Link from 'components/Link';
import PremiumUpsellOption from './PremiumUpsellOption';
import CSS from './style.scss';

function DefaultNavigationUserDropdown({
  avatarUrl,
  showPreferencesLink,
  arrowColor,
  balance,
  balanceColor,
  helpPageHref,
  onToggleDropdown,
}) {
  return (
    <NavigationUserDropdown
      onToggleDropdown={onToggleDropdown}
      avatarUrl={avatarUrl}
      data-test-identifier="navigation-user-dropdown"
      arrowColor={arrowColor}
    >
      <PremiumUpsellOption />
      <DropdownOptionGroup>
        <DropdownOption>
          <Link href="/me" className={CSS.dropdownLink}>
            <strong>{translate('navigation.links.profile.label')}</strong>
          </Link>
        </DropdownOption>
        {showPreferencesLink && (
          <DropdownOption>
            <Link href="/preferences/channels" className={CSS.dropdownLink}>
              <strong>{translate('navigation.links.readingprefs.label')}</strong>
            </Link>
          </DropdownOption>
        )}
        <DropdownOption>
          <Link href="/settings/wallet" className={CSS.dropdownLink}>
            <strong>{translate('navigation.links.wallet.label')}</strong>
            <Label inline color={balanceColor} className={CSS.balance}>
              {formatCurrency(balance)}
            </Label>
          </Link>
        </DropdownOption>
        <DropdownOption>
          <Link href="/alerts" className={`${CSS.dropdownLink} ${CSS.smallScreensOnly}`}>
            <strong>{translate('navigation.links.alerts.label')}</strong>
          </Link>
        </DropdownOption>
      </DropdownOptionGroup>
      <div>
        <DropdownOption>
          <Link href="/settings" className={CSS.dropdownLink}>
            {translate('navigation.links.settings.label')}
          </Link>
        </DropdownOption>
        <DropdownOption>
          <Link href="/about" className={CSS.dropdownLink}>
            {translate('navigation.links.about.label')}
          </Link>
        </DropdownOption>
        <DropdownOption>
          <Link href={helpPageHref} className={CSS.dropdownLink}>
            {translate('app.help')}
          </Link>
        </DropdownOption>
        <DropdownOption>
          <Link href="/logout" className={CSS.dropdownLink}>
            {translate('navigation.links.logout.label')}
          </Link>
        </DropdownOption>
      </div>
    </NavigationUserDropdown>
  );
}

DefaultNavigationUserDropdown.propTypes = {
  avatarUrl: string.isRequired,
  showPreferencesLink: bool.isRequired,
  arrowColor: string.isRequired,
  balance: string.isRequired,
  balanceColor: string.isRequired,
  helpPageHref: string.isRequired,
  onToggleDropdown: func.isRequired,
};

export default DefaultNavigationUserDropdown;



// WEBPACK FOOTER //
// ./src/js/app/components/navigation/DefaultNavigationUserDropdown/index.js