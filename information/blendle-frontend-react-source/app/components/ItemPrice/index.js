import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translate, formatCurrency } from 'instances/i18n';
import CSS from './style.scss';

class ItemPrice extends PureComponent {
  static propTypes = {
    price: PropTypes.number.isRequired, // in cents
    subscription: PropTypes.bool.isRequired,
    purchased: PropTypes.bool.isRequired,
    isPremiumItem: PropTypes.bool.isRequired,
    isItemOpened: PropTypes.bool.isRequired,
    issuePurchased: PropTypes.bool.isRequired,
    isFreeloader: PropTypes.bool.isRequired,
    color: PropTypes.oneOf(['white', 'midnight']),
    className: PropTypes.string,
  };

  _renderText() {
    const { price, subscription, issuePurchased, isPremiumItem, isFreeloader } = this.props;

    if ((isPremiumItem && subscription) || isFreeloader) {
      return null;
    }

    if (subscription) {
      return translate('timeline.tiles.subscriber');
    }

    if (issuePurchased) {
      return translate('timeline.tiles.edition');
    }

    return formatCurrency(price / 100);
  }

  render() {
    const {
      subscription,
      issuePurchased,
      purchased,
      hidePurchased,
      isItemOpened,
      isPremiumItem,
      isFreeloader,
      className,
      color,
    } = this.props;

    if (purchased && hidePurchased) {
      return null;
    }

    const itemPriceClasses = classNames(CSS.itemPrice, {
      [CSS.acquired]: purchased,
      [CSS.opened]: purchased && isItemOpened, // only show the opened check icon if the item is also acquired
      [CSS.amount]: !subscription && !issuePurchased,
      [CSS.subscription]: subscription || issuePurchased,
      [CSS.freeloader]: isFreeloader,
      [CSS.premiumItem]: isPremiumItem,
      // color is only vaild if the price is shown, otherwise a background will be added
      [CSS[color]]: !!color && !subscription && !issuePurchased,
    });

    const classes = classNames(CSS.itemPriceContainer, className);
    return (
      <div className={classes} data-test-identifier="tile-price">
        <div className={itemPriceClasses}>{this._renderText()}</div>
      </div>
    );
  }
}

export default ItemPrice;



// WEBPACK FOOTER //
// ./src/js/app/components/ItemPrice/index.js