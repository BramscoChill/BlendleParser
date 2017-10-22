import React from 'react';
import PropTypes from 'prop-types';
import { compose, onlyUpdateForKeys } from 'recompose';
import { get } from 'lodash/fp';
import { isMobileBreakpoint } from 'helpers/viewport';
import { applyBoxShadow } from '../../helpers/applyStyle';
import CSS from './style.scss';

const titleStyle = metadata => ({
  ...applyBoxShadow({
    x: isMobileBreakpoint() ? '-10px' : '-20px',
    y: isMobileBreakpoint() ? '10px' : '20px',
    color: get('title_shadow_color', metadata),
  }),
});

const enhance = compose(onlyUpdateForKeys(['children', 'metadata']));

function Title({ children, metadata }) {
  return (
    <div className={CSS.titleContainer}>
      <h1 className={CSS.title} style={titleStyle(metadata)}>
        <span>{children}</span>
      </h1>
    </div>
  );
}

Title.propTypes = {
  children: PropTypes.any,
  metadata: PropTypes.object,
};

export const TitleComponent = Title;
export default enhance(Title);



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/components/Title/index.js