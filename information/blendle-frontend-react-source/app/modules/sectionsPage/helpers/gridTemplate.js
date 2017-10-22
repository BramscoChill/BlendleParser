import { memoize, sample } from 'lodash';
import {
  bottomLeftGradient,
  showIntroText,
  mediumProviderLogo,
} from '../components/SectionTile/features';

export const GRID_ROWS = 12;
export const GRID_COLUMNS = 12;
export const GRID_TEMPLATE = `repeat(${GRID_ROWS}, 1fr) / repeat(${GRID_COLUMNS}, 1fr)`; // We use a 6x12 grid to place the tiles

const tile = (rowWeight, columnWeight, features = []) => [
  Math.round(rowWeight * GRID_ROWS),
  Math.round(columnWeight * GRID_COLUMNS),
  features,
];
const variant = (gridHeight, tilesTemplate, options = {}) => ({
  id: Math.random(),
  gridHeight,
  tilesTemplate,
  analytics: {
    rows: GRID_ROWS,
    columns: GRID_COLUMNS,
    template: tilesTemplate.map(([row, column]) => `${row}/${column}`).join(','),
  },
  options,
});

const GRID_BREAKPOINT_PX = 840;

// Contains the grid templates for each number of tiles.
// Every amount of tiles can have multiple variants
// Each variant can have a different total grid height
// The tiles(1, 1 / 2) call defines [rowSpan, col umnSpan] for the item on that index
// eg [1, 1 / 2] means the item spans the entire row and half the column
const TILES_TEMPLATES = new Map([
  [1, [variant(500, [tile(1, 1, [showIntroText, bottomLeftGradient, mediumProviderLogo])])]],
  [2, [variant(500, [tile(1, 1 / 2), tile(1, 1 / 2)])]],
  [
    3,
    [
      variant(500, [tile(1, 1 / 3), tile(1, 1 / 3), tile(1, 1 / 3)], {
        minWidth: GRID_BREAKPOINT_PX,
      }),
      variant(870, [
        tile(7 / 12, 1, [showIntroText, bottomLeftGradient, mediumProviderLogo]),
        tile(5 / 12, 1 / 2),
        tile(5 / 12, 1 / 2),
      ]),
    ],
  ],
  [
    4,
    [
      variant(
        750,
        [
          tile(1 / 2, 2 / 3),
          tile(1, 1 / 3, [bottomLeftGradient, showIntroText]),
          tile(1 / 2, 1 / 3),
          tile(1 / 2, 1 / 3),
        ],
        {
          minWidth: GRID_BREAKPOINT_PX,
        },
      ),
      variant(
        750,
        [tile(1 / 2, 5 / 12), tile(1 / 2, 7 / 12), tile(1 / 2, 7 / 12), tile(1 / 2, 5 / 12)],
        { maxWidth: GRID_BREAKPOINT_PX },
      ),
      variant(
        750,
        [tile(1 / 2, 2 / 3), tile(1 / 2, 1 / 3), tile(1 / 2, 1 / 3), tile(1 / 2, 2 / 3)],
        {
          minWidth: GRID_BREAKPOINT_PX,
        },
      ),
      variant(
        750,
        [
          tile(1, 1 / 3, [bottomLeftGradient, showIntroText]),
          tile(1 / 2, 2 / 3),
          tile(1 / 2, 1 / 3),
          tile(1 / 2, 1 / 3),
        ],
        {
          minWidth: GRID_BREAKPOINT_PX,
        },
      ),
    ],
  ],
  [
    5,
    [
      variant(
        750,
        [
          tile(1 / 2, 1 / 2),
          tile(1 / 2, 1 / 2),
          tile(1 / 2, 1 / 3),
          tile(1 / 2, 1 / 3),
          tile(1 / 2, 1 / 3),
        ],
        {
          minWidth: GRID_BREAKPOINT_PX,
        },
      ),
      variant(
        750,
        [
          tile(1 / 2, 2 / 3, [showIntroText]),
          tile(1 / 2, 1 / 3),
          tile(1 / 2, 1 / 3),
          tile(1 / 2, 1 / 3),
          tile(1 / 2, 1 / 3),
        ],
        {
          minWidth: GRID_BREAKPOINT_PX,
        },
      ),
      variant(
        1000,
        [
          tile(1 / 3, 1),
          tile(1 / 3, 7 / 12),
          tile(1 / 3, 5 / 12),
          tile(1 / 3, 5 / 12),
          tile(1 / 3, 7 / 12),
        ],
        {
          maxWidth: GRID_BREAKPOINT_PX,
        },
      ),
    ],
  ],
]);

/**
 * Get one of the possible grid variants
 * @param {String} sectionId - sectionId used for memoizing the chosen variant
 * @param {Array} validVariants - Possible variants for the given screen width
 * @returns { Object } The template variant to use
 */
const memoizedSample = memoize(
  (sectionId, validVariants) => sample(validVariants),
  (sectionId, validVariants) =>
    `${sectionId}::${validVariants.join(validVariant => validVariant.id)}`,
);

/**
 * Get the grid template for the current section
 * @param {String} sectionId - the ID of the section used to memoize the grid template
 * @param {Number} tilesCount - Number of tiles in the section
 * @returns {Object} The template variant to use
 */
export const getTemplateVariant = memoize((sectionId, tilesCount, gridWidth) => {
  const variants = TILES_TEMPLATES.get(tilesCount);
  if (!variants) {
    throw new Error(`No grid variant exists for ${tilesCount} tiles`);
  }

  const validVariants = variants.filter(({ options }) => {
    const hasValidMinWidth = !options.minWidth || options.minWidth <= gridWidth;
    const hasValidMaxWidth = !options.maxWidth || options.maxWidth >= gridWidth;

    return hasValidMinWidth && hasValidMaxWidth;
  });

  return memoizedSample(sectionId, validVariants);
}, (sectionId, tilesCount, gridWidth) => `${sectionId}-${tilesCount}-${gridWidth}`);



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/helpers/gridTemplate.js