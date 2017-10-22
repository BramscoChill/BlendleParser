import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CSS from './style.scss';

class SubscriptionRadioOptionContent extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    remark: PropTypes.string,
    description: PropTypes.string.isRequired,
    priceDuration: PropTypes.string.isRequired,
  };

  render() {
    const { price, label, remark, description, priceDuration } = this.props;

    return (
      <div className={CSS.content}>
        <div className={CSS.info}>
          <span className={CSS.label}>{label}</span>
          {remark ? <span className={CSS.remark}>{remark}</span> : null}
          <span className={CSS.description}>{description}</span>
        </div>
        <div className={CSS.price}>
          <span className={CSS.amount}>{price}</span>
          {priceDuration}
        </div>
      </div>
    );
  }
}

export default SubscriptionRadioOptionContent;



// WEBPACK FOOTER //
// ./src/js/app/modules/subscription/components/SubscriptionRadioOption/index.js