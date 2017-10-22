import React from 'react';
import PropTypes from 'prop-types';
import { compose, onlyUpdateForKeys } from 'recompose';
import { get } from 'lodash/fp';
import { applyBackgroundImage } from '../../helpers/applyStyle';
import GridContainer from '../GridContainer';
import CSS from './style.scss';

const backgroundImage = get('background_image');

const headerStyle = metadata => ({
  ...applyBackgroundImage(backgroundImage(metadata)),
});

const enhance = compose(onlyUpdateForKeys(['children', 'metadata']));

function Header({ children, metadata }) {
  const hasBackgroundImage = backgroundImage(metadata);

  return (
    <div className={CSS.header} style={headerStyle(metadata)}>
      {hasBackgroundImage && <div className={CSS.backgroundImageOverlay} />}
      <GridContainer>{children}</GridContainer>
    </div>
  );
}

Header.propTypes = {
  children: PropTypes.any,
  metadata: PropTypes.object,
};

export const HeaderComponent = Header;
export default enhance(Header);



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/components/Header/index.js