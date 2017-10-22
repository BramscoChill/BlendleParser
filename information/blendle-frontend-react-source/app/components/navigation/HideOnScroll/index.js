import React from 'react';
import { node } from 'prop-types';
import Headroom from 'react-headroom';
import CSS from './style.scss';

function HideOnScroll({ children }) {
  return (
    <Headroom className={CSS.hideOnScroll} upTolerance={10} downTolerance={10}>
      {children}
    </Headroom>
  );
}

HideOnScroll.propTypes = {
  children: node,
};

HideOnScroll.defaultProps = {
  children: null,
};

export default HideOnScroll;



// WEBPACK FOOTER //
// ./src/js/app/components/navigation/HideOnScroll/index.js