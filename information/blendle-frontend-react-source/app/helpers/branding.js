import { Backdrop } from '@blendle/lego';
import { memoize } from 'lodash';

export const BRANDING_GRADIENTS = [
  {
    background: Backdrop.red,
    foreground: Backdrop.yellow,
    position: 'topRight',
  },
  {
    background: Backdrop.green,
    foreground: Backdrop.purple,
    position: 'bottomCenter',
  },
  {
    background: Backdrop.lightBlue,
    foreground: Backdrop.green,
    position: 'centerLeft',
  },
  {
    background: Backdrop.purple,
    foreground: Backdrop.yellow,
    position: 'topLeft',
  },
  {
    background: Backdrop.darkBlue,
    foreground: Backdrop.purple,
    position: 'topCenter',
  },
];

export function getVariantByIndex(index) {
  return BRANDING_GRADIENTS[index % BRANDING_GRADIENTS.length];
}

export const brandingVariant = () => {
  let index = 0;
  return () => {
    index += 1;
    return getVariantByIndex(index - 1);
  };
};

/**
 * Get a branding variant based on the array index, but memoize the result for each tileId.
 * @arg {String} tileId Tile ID, only used for memoization
 * @arg {Number} index  Index, used to pick a branding variant
 * @return {function}
 */
export const getMemoizedVariantByIndex = memoize((tileId, index) => () => getVariantByIndex(index));



// WEBPACK FOOTER //
// ./src/js/app/helpers/branding.js