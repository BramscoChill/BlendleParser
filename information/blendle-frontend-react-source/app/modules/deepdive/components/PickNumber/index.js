import React, { PropTypes } from 'react';
import { pure } from 'recompose';
import { get } from 'lodash/fp';
import { Parallax } from '@blendle/lego';
import { isMobileBreakpoint } from 'helpers/viewport';
import { applyTextShadow } from '../../helpers/applyStyle';
import CSS from './style.scss';

const padNumber = (number) => {
  const padded = `0${number}`;

  if (padded.length === 2) {
    return padded;
  }

  return padded.substr(1);
};

const style = metadata => ({
  ...applyTextShadow({
    x: isMobileBreakpoint() ? '-7px' : '-10px',
    y: isMobileBreakpoint() ? '7px' : '10px',
    color: get('number_text_shadow', metadata),
  }),
});

const PickNumber = ({ number, deepDiveMetadata }) => (
  <Parallax distance={50}>
    <div className={CSS.number} style={style(deepDiveMetadata)}>
      {padNumber(number)}
    </div>
  </Parallax>
);

PickNumber.propTypes = {
  number: PropTypes.number.isRequired,
  deepDiveMetadata: PropTypes.object,
};

export const PickNumberComponent = PickNumber;
export default pure(PickNumber);



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/components/PickNumber/index.js