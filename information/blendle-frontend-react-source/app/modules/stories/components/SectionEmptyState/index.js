import React from 'react';
import { number, bool } from 'prop-types';
import { memoize } from 'lodash';
import Link from 'components/Link';
import { ANIMATION_DELAY_INTERVAL_MS } from '../../constants';
import LoadingPlaceholders from '../LoadingPlaceholders';
import CSS from './style.scss';

const getKey = memoize(Math.random);

function SectionEmptyState({ numberOfPlaceholders, didSetPreferences, isLoading, storiesCount }) {
  const hasStories = storiesCount > 0;
  const shouldShowAdd = !isLoading && !hasStories;
  const numberOfLoadedTiles = storiesCount || numberOfPlaceholders;

  return (
    <LoadingPlaceholders
      numberOfPlaceholders={numberOfPlaceholders}
      numberOfLoadedTiles={numberOfLoadedTiles}
      hideLoadingState={didSetPreferences}
      isLoading={isLoading}
    >
      {shouldShowAdd &&
        Array.from({ length: numberOfPlaceholders }).map((v, index) => (
          <Link
            key={getKey(index)}
            href="/preferences/channels"
            className={CSS.addTile}
            style={{
              animationDelay: `${index * ANIMATION_DELAY_INTERVAL_MS}ms`,
            }}
          />
        ))}
    </LoadingPlaceholders>
  );
}

SectionEmptyState.propTypes = {
  isLoading: bool.isRequired,
  didSetPreferences: bool.isRequired,
  numberOfPlaceholders: number.isRequired,
  storiesCount: number,
};

SectionEmptyState.defaultProps = {
  storiesCount: 0,
};

export default SectionEmptyState;



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/components/SectionEmptyState/index.js