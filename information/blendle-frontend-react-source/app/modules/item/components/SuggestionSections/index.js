import React from 'react';
import { arrayOf, oneOf, shape, bool, string } from 'prop-types';
import { STATUS_INITIAL } from 'app-constants';
import PageSection from 'modules/sectionsPage/components/PageSection';
import {
  DESKTOP_LAYOUT_HORIZONTAL,
  DESKTOP_LAYOUT_GRID,
  MOBILE_LAYOUTS,
} from 'modules/sectionsPage/constants';
import NormalTileContainer from 'containers/NormalTileContainer';
import SuggestionVisibleSensor from './SuggestionVisibleSensor';
import SuggestionSectionHeader from './SuggestionSectionHeader';
import {
  SUGGESTION_SECTIONS,
  SUGGESTION_SECTION_RELATED,
  SUGGESTION_SECTION_TRENDING,
} from '../../constants';

const PROVIDER_TILE_TYPES = [SUGGESTION_SECTION_RELATED, SUGGESTION_SECTION_TRENDING];

function SuggestionSections({ sections }) {
  return (
    <div>
      {sections.filter(section => !section.isLoading).map((section) => {
        const isProviderTile = PROVIDER_TILE_TYPES.includes(section.type);
        return (
          <SuggestionVisibleSensor key={`suggestion-${section.type}`} type={section.type}>
            <div data-test-identifier={`suggestions-${section.type}`}>
              <PageSection
                itemIds={section.itemIds}
                tilesCount={section.itemIds.length}
                internalLocation={section.type}
                sectionType="readmore"
                desktopLayout={isProviderTile ? DESKTOP_LAYOUT_HORIZONTAL : DESKTOP_LAYOUT_GRID}
                mobileLayout={section.mobileLayout}
                tileComponent={isProviderTile ? NormalTileContainer : undefined}
                hideContextMenu
                sectionId={section.type}
                title={section.label}
                headerComponent={SuggestionSectionHeader}
                isLoading={section.isLoading}
              />
            </div>
          </SuggestionVisibleSensor>
        );
      })}
    </div>
  );
}

SuggestionSections.propTypes = {
  sections: arrayOf(
    shape({
      label: string.isRequired,
      isLoading: bool.isRequired,
      mobileLayout: oneOf(MOBILE_LAYOUTS).isRequired,
      type: oneOf(SUGGESTION_SECTIONS).isRequired,
      itemIds: arrayOf(string).isRequired,
    }),
  ),
};

SuggestionSections.defaultProps = {
  status: STATUS_INITIAL,
  sections: [],
};

export default SuggestionSections;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/SuggestionSections/index.js