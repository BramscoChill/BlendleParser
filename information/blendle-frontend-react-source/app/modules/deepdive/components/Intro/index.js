import React from 'react';
import PropTypes from 'prop-types';
import { compose, onlyUpdateForKeys } from 'recompose';
import { get } from 'lodash/fp';
import { applyTextColor } from '../../helpers/applyStyle';
import CSS from './style.scss';

const introStyle = metadata => ({
  ...applyTextColor(get('intro_text_color', metadata)),
});

const enhance = compose(onlyUpdateForKeys(['children', 'metadata']));

function Intro({ children, metadata }) {
  return (
    <p
      className={CSS.intro}
      style={introStyle(metadata)}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}

Intro.propTypes = {
  children: PropTypes.any,
  metadata: PropTypes.object,
};

export const IntroComponent = Intro;
export default enhance(Intro);



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/components/Intro/index.js