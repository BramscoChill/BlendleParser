import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TOP_BAR_SLIDE_IN_PERCENTAGE } from 'app-constants';
import prefixedStyle from 'helpers/prefixedStyle';
import TopbarContent from './TopbarContent';
import withHideOnScroll from '../../higher-order-components/withHideOnScroll';
import CSS from './style.scss';

const topBarStyle = (isHidden, readPercentage) => {
  const style = {};

  if (isHidden) {
    style.transform = 'translateY(-200%)';
  }

  if (readPercentage >= TOP_BAR_SLIDE_IN_PERCENTAGE && isHidden) {
    const remainingAbsolute = 100 - readPercentage;
    const remainingPercentage = remainingAbsolute / (100 - TOP_BAR_SLIDE_IN_PERCENTAGE) * 120;

    style.transform = `translateY(-${remainingPercentage}%)`;
  }

  return prefixedStyle(style);
};

class TopBar extends PureComponent {
  static propTypes = {
    provider: PropTypes.object,
    analytics: PropTypes.object,
    hasReachedEnd: PropTypes.bool,
    isPinned: PropTypes.bool,
    scrolledIntoItem: PropTypes.bool,
    percentageRead: PropTypes.number,
    onClose: PropTypes.func.isRequired,
    pinItem: PropTypes.func.isRequired,
    isHiddenByScroll: PropTypes.bool,
  };

  static defaultProps = {
    provider: null,
    isPinned: false,
    analytics: {},
    hasReachedEnd: false,
    scrolledIntoItem: false,
    percentageRead: 0,
    isHiddenByScroll: false,
  };

  render() {
    const {
      isHiddenByScroll,
      onClose,
      provider,
      percentageRead,
      hasReachedEnd,
      isPinned,
      scrolledIntoItem,
      pinItem,
    } = this.props;

    const isHidden = isHiddenByScroll && !hasReachedEnd;
    const className = classNames(CSS.topBar, {
      [CSS.hidden]: isHidden,
      [CSS.shadow]: scrolledIntoItem,
    });

    return (
      <div className={className} style={topBarStyle(isHidden, percentageRead)}>
        <TopbarContent
          onClose={onClose}
          provider={provider}
          isPinned={isPinned}
          pinItem={pinItem}
        />
      </div>
    );
  }
}

export default withHideOnScroll(TopBar);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/TopBar/index.js