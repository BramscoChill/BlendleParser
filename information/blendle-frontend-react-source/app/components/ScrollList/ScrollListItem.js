import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSS from './ScrollListItem.scss';

export default function ScrollListItem(props) {
  const { className, axis, availableSize, visible } = props;
  const containerClassName = classNames(className, CSS[axis], CSS.container);
  return (
    <li className={containerClassName}>
      <div className={CSS.content}>
        {cloneElement(props.children, { axis, availableSize, visible })}
      </div>
    </li>
  );
}

ScrollListItem.propTypes = {
  axis: PropTypes.oneOf(['x', 'y']),
  availableSize: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
  visible: PropTypes.bool,
};



// WEBPACK FOOTER //
// ./src/js/app/components/ScrollList/ScrollListItem.js