import React from 'react';
import { string, func, bool, number, arrayOf, object } from 'prop-types';
import { BookmarkIcon, SocialCount, Rows, Columns } from '@blendle/lego';
import { getProviderLogoUrl } from 'helpers/providerHelpers';
import ItemPriceContainer from 'containers/ItemPriceContainer';
import ManifestDropdownContainer from 'containers/ManifestDropdownContainer';
import classNames from 'classnames';
import {
  featuresPropType,
  largePadding,
  featuredProviderLogo,
  mediumProviderLogo,
} from '../features';
import CSS from './style.scss';

const providerLogo = providerId => getProviderLogoUrl(providerId, 'provider-w-crop.png');

function TileHead({
  providerId,
  itemId,
  onClickReadLater,
  hasBackgroundImage,
  isPinned,
  shouldShowShareCount,
  shareCount,
  avatars,
  features,
  analytics,
}) {
  const classes = classNames(CSS.rows, {
    [CSS.rowsLargePadding]: features.includes(largePadding),
    [CSS.noBackground]: !hasBackgroundImage,
  });

  return (
    <Rows className={classes}>
      <Columns className={CSS.topRow}>
        <div
          className={classNames(
            CSS.providerLogo,
            features.includes(mediumProviderLogo) && CSS.providerLogoMedium,
            features.includes(featuredProviderLogo) && CSS.providerLogoFeatured,
          )}
          style={{ backgroundImage: `url(${providerLogo(providerId)}` }}
        />
        <Columns>
          <ItemPriceContainer
            itemId={itemId}
            className={CSS.itemPrice}
            color="white"
            hidePurchased
          />
          <button
            className={classNames(CSS.readLaterIcon, isPinned && CSS.isPinned)}
            onClick={onClickReadLater}
          >
            <BookmarkIcon />
          </button>
          <div className={CSS.dropdownContainer}>
            <ManifestDropdownContainer
              triggerClassName={CSS.smallTrigger}
              analytics={analytics}
              itemId={itemId}
              hidePin
            />
          </div>
        </Columns>
      </Columns>
      <Columns>
        {shouldShowShareCount && <SocialCount count={shareCount} avatars={avatars} />}
      </Columns>
    </Rows>
  );
}

TileHead.propTypes = {
  providerId: string.isRequired,
  itemId: string.isRequired,
  onClickReadLater: func.isRequired,
  isPinned: bool.isRequired,
  hasBackgroundImage: bool.isRequired,
  shouldShowShareCount: bool.isRequired,
  shareCount: number.isRequired,
  avatars: arrayOf(string).isRequired,
  features: featuresPropType,
  // eslint-disable-next-line react/forbid-prop-types
  analytics: object,
};

TileHead.defaultProps = {
  features: [],
  analytics: {},
};

export default TileHead;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/SectionTile/TileHead/index.js