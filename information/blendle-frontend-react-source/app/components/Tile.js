import React, { PureComponent, cloneElement, isValidElement, Children } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Tile extends PureComponent {
  static propTypes = {
    style: PropTypes.object,
    children: PropTypes.node,
    className: PropTypes.string,
    type: PropTypes.string,
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { className, type, children, style, visible, ...rest } = this.props;
    const cls = classNames('v-pane-tile', className, {
      [`l-${type}`]: type,
    });

    return (
      <div className={cls} style={style}>
        {Children.map(children, c => (isValidElement(c) ? cloneElement(c, rest) : c))}
      </div>
    );
  }
}

export default Tile;



// WEBPACK FOOTER //
// ./src/js/app/components/Tile.js