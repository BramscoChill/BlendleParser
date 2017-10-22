import React, { Children, cloneElement } from 'react';
import { node, number, string } from 'prop-types';
import { assign } from 'lodash';
import { Grid, GridItem } from '@blendle/lego';
import {
  GRID_ROWS,
  GRID_COLUMNS,
  GRID_TEMPLATE,
  getTemplateVariant,
} from '../../helpers/gridTemplate';
import { MAX_SECTION_WIDTH_PX } from '../../constants';
import CSS from './style.scss';

/**
 * Calculate the tile dimensions from the total size of the grid and
 * the grid item's row and column span
 * @param {Number} gridWidth - The total width oif the grid
 * @param {Number} gridHeight - The total height of the grid
 * @param {Number} rowSpan - The amount of rows this grid item spans
 * @param {Number} columnSpan - The amount of columns this grid item spans
 */
function getTileDimensions(gridWidth, gridHeight, rowSpan, columnSpan) {
  const columnWidth = gridWidth / GRID_COLUMNS;
  const rowHeight = gridHeight / GRID_ROWS;

  return {
    width: columnWidth * columnSpan,
    height: rowHeight * rowSpan,
  };
}

function GridSection({ children, innerWidth, sectionId }) {
  // Manually slice the array so only 5 tiles are rendered max (backend should handle this)
  const tilesArray = Children.toArray(children).slice(0, 5);
  const tilesCount = tilesArray.length;
  if (tilesCount < 1) {
    // TODO: Figure out why / when this happens
    return null;
  }

  const { gridHeight, tilesTemplate, analytics: gridAnalytics } = getTemplateVariant(
    sectionId,
    tilesCount,
    innerWidth,
  );
  const gridWidth = Math.min(innerWidth, MAX_SECTION_WIDTH_PX);

  return (
    <Grid
      className={CSS.gridSection}
      template={GRID_TEMPLATE}
      style={{
        height: gridHeight,
      }}
    >
      {tilesArray.map((tileComponent, index) => {
        const [rowSpan, columnSpan, features] = tilesTemplate[index];
        const { width, height } = getTileDimensions(gridWidth, gridHeight, rowSpan, columnSpan);

        return (
          <GridItem
            key={`gridItem-${tileComponent.key}`}
            row={`span ${rowSpan}`}
            column={`span ${columnSpan}`}
          >
            {cloneElement(tileComponent, {
              // Mutating the current props seems hacky, but for a grid it's actually needed
              // Because we always want to include the grid template details
              // In the analytics, without creating a new object reference
              analytics: assign(tileComponent.props.analytics, { grid: gridAnalytics }),
              features: [...tileComponent.props.features, ...features].filter(feature => !!feature),
              tileWidth: width,
              tileHeight: height,
            })}
          </GridItem>
        );
      })}
    </Grid>
  );
}

GridSection.propTypes = {
  children: node.isRequired,
  sectionId: string.isRequired,
  innerWidth: number.isRequired,
};

export default GridSection;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/GridSection/index.js