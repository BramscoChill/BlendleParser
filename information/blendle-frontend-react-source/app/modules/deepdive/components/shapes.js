import { shape, string } from 'prop-types';

export const deepDiveMetaDataShape = shape({
  background_image: string,
  title_shadow_color: string,
  intro_text_color: string,
  number_text_shadow: string,
});

export const pickMetaDataShape = shape({
  background: string,
  title_text_color: string,
  title_text_shadow: string,
});



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/components/shapes.js