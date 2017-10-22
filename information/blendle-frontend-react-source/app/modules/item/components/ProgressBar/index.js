import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSS from './styles.scss';

class ProgressBar extends PureComponent {
  static propTypes = {
    progress: PropTypes.number.isRequired,
    hidden: PropTypes.bool,
  };

  render() {
    const { progress, hidden } = this.props;

    const style = {
      transform: `translateX(${-100 + progress}%)`,
    };

    return <div className={classNames(CSS.progress, hidden && CSS.hidden)} style={style} />;
  }
}

export default ProgressBar;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ProgressBar/index.js