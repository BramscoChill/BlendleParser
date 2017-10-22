/* eslint-disable react/prop-types */
// Disable prop type linting because we use setPropTypes
import React from 'react';
import { compose, setPropTypes, onlyUpdateForPropTypes, setDisplayName } from 'recompose';
import { string, arrayOf, oneOf, bool, number } from 'prop-types';
import { memoize } from 'lodash';
import classNames from 'classnames';
import { Columns } from '@blendle/lego';
import { getMemoizedVariantByIndex } from 'helpers/branding';
import { isFeaturedSection } from '../../selectors/sections';
import TilesWrapper from '../TilesWrapper';
import SectionHeader from '../SectionHeader';
import SectionContextMenuContainer from '../../containers/SectionContextMenuContainer';
import {
  DESKTOP_LAYOUTS,
  DESKTOP_LAYOUT_GRID,
  MOBILE_LAYOUT_WRAPPING,
  MOBILE_LAYOUTS,
} from '../../constants';
import SectionTileContainer from '../../containers/SectionTileContainer';
import CSS from './style.scss';

const TILE_WIDTH_PX = 280;
const TILE_HEIGHT_PX = 350;

/**
 * Get the memoized analytics for a section tile.
 * The memoization is done based on the combination of sectionId, itemId and index in section
 * to ensure we don't create a new object reference on each rerender
 */
const getTileAnalytics = memoize(
  (sectionId, itemId, indexInSection, sectionType, internalLocation) => ({
    internal_location: internalLocation,
    section_id: sectionId,
    section_type: sectionType,
    position: indexInSection,
  }),
  (sectionId, itemId, indexInSection, internalLocation) =>
    `${sectionId}::${itemId}::${indexInSection}::${internalLocation}`,
);

const enhance = compose(
  onlyUpdateForPropTypes,
  setPropTypes({
    sectionId: string.isRequired,
    tilesCount: number.isRequired,
    isLoading: bool.isRequired,
    internalLocation: string,
    sectionType: string.isRequired,
    title: string,
    subtitle: string,
    desktopLayout: oneOf(DESKTOP_LAYOUTS),
    mobileLayout: oneOf(MOBILE_LAYOUTS),
    itemIds: arrayOf(string).isRequired,
  }),
  setDisplayName('PageSection'),
);

function PageSection({
  itemIds,
  internalLocation = 'timeline/premium',
  title,
  subtitle,
  headerComponent: HeaderComponent = SectionHeader,
  hideContextMenu,
  sectionId,
  sectionType,
  isLoading,
  tilesCount,
  tileComponent: TileComponent = SectionTileContainer,
  desktopLayout = DESKTOP_LAYOUT_GRID,
  mobileLayout = MOBILE_LAYOUT_WRAPPING,
}) {
  return (
    <section
      className={classNames(CSS.pageSection, isFeaturedSection(sectionId) && CSS.fullWidth)}
      data-test-identifier="page-section"
    >
      <Columns className={CSS.sectionHeader}>
        <HeaderComponent title={title} subtitle={subtitle} />
        {!hideContextMenu && <SectionContextMenuContainer id={sectionId} />}
      </Columns>
      <TilesWrapper
        sectionId={sectionId}
        desktopLayout={desktopLayout}
        mobileLayout={mobileLayout}
        isLoading={isLoading}
        tilesCount={tilesCount}
      >
        {itemIds.length > 0 &&
          itemIds.map((itemId, index) => (
            <TileComponent
              key={`tile-${itemId}`}
              itemId={itemId}
              getBrandingVariant={getMemoizedVariantByIndex(itemId, index)}
              tileWidth={TILE_WIDTH_PX}
              tileHeight={TILE_HEIGHT_PX}
              sectionId={sectionId}
              indexInSection={index}
              analytics={getTileAnalytics(sectionId, itemId, index, sectionType, internalLocation)}
            />
          ))}
      </TilesWrapper>
    </section>
  );
}

export const PageSectionComponent = PageSection;
export default enhance(PageSection);



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/PageSection/index.js