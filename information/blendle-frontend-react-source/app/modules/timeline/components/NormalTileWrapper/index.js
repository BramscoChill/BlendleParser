import React from 'react';
import { node } from 'prop-types';
import CSS from './style.scss';

function NormalTileWrapper({ children }) {
  return <div className={CSS.normalTileWrapper}>{children}</div>;
}

NormalTileWrapper.propTypes = {
  children: node.isRequired,
};

export default NormalTileWrapper;



// WEBPACK FOOTER //
// ./src/js/app/modules/timeline/components/NormalTileWrapper/index.js