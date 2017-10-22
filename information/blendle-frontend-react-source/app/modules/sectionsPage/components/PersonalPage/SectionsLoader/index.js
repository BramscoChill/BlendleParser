import React from 'react';
import classNames from 'classnames';
import { number } from 'prop-types';
import Spinner from 'components/Loading';
import CSS from './style.scss';

function SectionsLoader({ sectionsCount }) {
  const className = classNames(CSS.loadingWrapper, sectionsCount === 0 && CSS.noSections);

  return (
    <div className={className}>
      <Spinner className={CSS.loader} />
    </div>
  );
}

SectionsLoader.propTypes = {
  sectionsCount: number.isRequired,
};

export default SectionsLoader;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/PersonalPage/SectionsLoader/index.js