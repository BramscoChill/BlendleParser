/* eslint-disable react/prop-types */
// Disable prop-types linting because we use setPropTypes
import React from 'react';
import { string, node } from 'prop-types';
import { compose, pure, setPropTypes } from 'recompose';
import CSS from './style.scss';

const enhance = compose(
  setPropTypes({
    sectionId: string.isRequired,
    children: node,
  }),
  pure,
);

function ScrollingSection({ children }) {
  return (
    <div className={CSS.scrollingSection}>
      {children.length > 0 &&
        React.Children.map(children, (child, index) => (
          <div key={`tilewrapper-${index}`} className={CSS.tileWrapper}>
            {child}
          </div>
        ))}
    </div>
  );
}

export const ScrollingSectionComponent = ScrollingSection;
export default enhance(ScrollingSection);



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/ScrollingSection/index.js