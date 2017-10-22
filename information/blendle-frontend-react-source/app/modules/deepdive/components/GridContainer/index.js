import React, { PropTypes } from 'react';
import { pure } from 'recompose';
import CSS from './style.scss';

const GridContainer = ({ children }) => <div className={CSS.gridContainer}>{children}</div>;

GridContainer.propTypes = {
  children: PropTypes.any,
};

export const GridContainerComponent = GridContainer;
export default pure(GridContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/components/GridContainer/index.js