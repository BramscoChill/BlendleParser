import React from 'react';
import classNames from 'classnames';
import { number, bool, node } from 'prop-types';
import StoryTilePlaceholder from './StoryTilePlaceholder';
import CSS from './style.scss';

function LoadingPlaceholders({
  numberOfPlaceholders,
  numberOfLoadedTiles,
  hideLoadingState,
  isLoading,
  children,
}) {
  const containerClassName = classNames(CSS.placeholdersContainer, {
    [CSS.isHidden]: hideLoadingState,
  });

  return (
    <div>
      {children}
      <div className={containerClassName}>
        {Array.from({ length: numberOfPlaceholders }).map((item, index) => (
          <StoryTilePlaceholder
            key={`placeholder-${index}`} // eslint-disable-line react/no-array-index-key
            index={index}
            isDoneLoading={!isLoading}
            hasTile={numberOfLoadedTiles - 1 > index}
          />
        ))}
      </div>
    </div>
  );
}

LoadingPlaceholders.propTypes = {
  numberOfPlaceholders: number.isRequired,
  numberOfLoadedTiles: number.isRequired,
  isLoading: bool.isRequired,
  hideLoadingState: bool.isRequired,
  children: node,
};

export default LoadingPlaceholders;



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/components/LoadingPlaceholders/index.js