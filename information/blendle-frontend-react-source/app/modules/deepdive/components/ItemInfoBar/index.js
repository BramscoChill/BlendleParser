import React from 'react';
import { string, number, bool } from 'prop-types';
import { pure } from 'recompose';
import { getProviderLogoUrl } from 'helpers/providerHelpers';
import { formatCurrency, translate } from 'instances/i18n';
import { Rows, Columns, CheckIcon } from '@blendle/lego';
import CSS from './style.scss';

const providerLogo = providerId => getProviderLogoUrl(providerId, 'provider-w-crop.png');

function renderPriceInfo(price, isPurchased, hasSubscription) {
  if (hasSubscription) {
    return <div>{translate('timeline.tiles.subscriber')}</div>;
  }

  if (isPurchased) {
    return <CheckIcon className={CSS.purchased} />;
  }

  return <div>{formatCurrency(price)}</div>;
}

function ItemInfoBar({ isLoading, providerId, price, isPurchased, hasSubscription, readingTime }) {
  if (isLoading) {
    return null;
  }

  return (
    <Columns className={CSS.infoBar}>
      <img className={CSS.providerLogo} src={providerLogo(providerId)} alt="logo" />
      <Rows className={CSS.meta}>
        <Columns>
          {renderPriceInfo(price, isPurchased, hasSubscription)}
          &nbsp;&nbsp;&middot;&nbsp;&nbsp;
          <div className={CSS.readingTime}>
            {translate('timeline.tiles.minutes_reading', { minutes: readingTime })}
          </div>
        </Columns>
      </Rows>
    </Columns>
  );
}

ItemInfoBar.propTypes = {
  isLoading: bool.isRequired,
  providerId: string,
  price: number,
  isPurchased: bool,
  hasSubscription: bool,
  readingTime: number,
};

export const ItemInfoBarComponent = ItemInfoBar;
export default pure(ItemInfoBar);



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/components/ItemInfoBar/index.js