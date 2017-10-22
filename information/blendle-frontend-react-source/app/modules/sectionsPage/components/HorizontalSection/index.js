import React, { Children } from 'react';
import { node, string } from 'prop-types';
import classNames from 'classnames';
import CSS from './style.scss';

function HorizontalSection({ className, children }) {
  const tilesArray = Children.toArray(children).filter(child => !!child);

  return (
    <div className={classNames(CSS.tilesContainer, className)}>
      {tilesArray.map(tileComponent => (
        <div className={CSS.tileWrapper} key={`horizonta-wrapper-${tileComponent.key}`}>
          {tileComponent}
        </div>
      ))}
    </div>
  );
}

HorizontalSection.propTypes = {
  children: node.isRequired,
  className: string,
};

HorizontalSection.defaultProps = {
  className: '',
};

export default HorizontalSection;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/HorizontalSection/index.js