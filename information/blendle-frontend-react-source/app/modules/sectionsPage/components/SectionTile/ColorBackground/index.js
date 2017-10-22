import React from 'react';
import { string, oneOf, bool } from 'prop-types';
import { Backdrop } from '@blendle/lego';
import CSS from './style.scss';

const positions = new Map([
  ['topRight', CSS.brandingTopRight],
  ['bottomCenter', CSS.brandingBottomCenter],
  ['centerLeft', CSS.brandingCenterLeft],
  ['topLeft', CSS.brandingTopLeft],
  ['topCenter', CSS.brandingTopCenter],
]);

const innerStyles = {
  hidden: { display: 'none' },
  visible: {},
};

function ColorBackground({ backgroundColor, position, hideForeground }) {
  const innerStyle = hideForeground ? innerStyles.hidden : innerStyles.visible;

  return (
    <Backdrop
      color={backgroundColor}
      className={CSS.backgroundColor}
      innerClassName={`${CSS.brandingShape} ${positions.get(position)}`}
      innerStyle={innerStyle}
    />
  );
}

ColorBackground.propTypes = {
  backgroundColor: string.isRequired,
  position: oneOf(Array.from(positions.keys())).isRequired,
  hideForeground: bool,
};

ColorBackground.defaultProps = {
  hideForeground: false,
};

export default ColorBackground;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/SectionTile/ColorBackground/index.js