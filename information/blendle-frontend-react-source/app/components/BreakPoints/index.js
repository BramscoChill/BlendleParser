import React from 'react';
import classNames from 'classnames';
import CSS from './style.scss';

/*
 * This HOC adds a classname to the first child element, which takes care of hiding/showing the
 * element using CSS breakpoints.
 *
 * NOTE: When using these components, the childs *will* get mounted, but they might be invisible. In
 * some cases this works better than not mounting the component at all. An example would be a small
 * piece of text or a simple element. You should not hide entire containers/complex components this
 * way.
 */

function cloneWithClassName(className) {
  return function Component({ children, ...props }) {
    return React.cloneElement(children, {
      ...props,
      className: classNames(className, children.props.className),
    });
  };
}

export const SmallScreenOnly = cloneWithClassName(CSS.smallScreen);
export const NotSmallScreen = cloneWithClassName(CSS.notSmallScreen);



// WEBPACK FOOTER //
// ./src/js/app/components/BreakPoints/index.js