import React from 'react';
import { func, node, bool, string } from 'prop-types';
import { compose, setPropTypes, withHandlers } from 'recompose';
import Observer from 'react-intersection-observer';

const enhance = compose(
  setPropTypes({
    onNearEnd: func.isRequired,
    className: string,
    isActive: bool,
    children: node,
  }),
  withHandlers({
    onChange: ({ onNearEnd, isActive }) => (isIntersected) => {
      if (isIntersected && isActive) {
        onNearEnd();
      }
    },
  }),
);

// Ignore onChange propType because it's added by the HOC
/* eslint react/prop-types: ['error', {ignore: ['onChange']}] */
function LoadMoreTrigger({ onChange, children, className }) {
  return (
    <Observer onChange={onChange} className={className}>
      {children}
    </Observer>
  );
}

LoadMoreTrigger.propTypes = {
  children: node,
  className: string,
};

LoadMoreTrigger.defaultProps = {
  children: null,
  className: string,
};

export default enhance(LoadMoreTrigger);



// WEBPACK FOOTER //
// ./src/js/app/components/LoadMoreTrigger/index.js