import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Link from 'components/Link';
import { translateElement, formatCurrency } from 'instances/i18n';
import CSS from './style.scss';

class RefundItem extends PureComponent {
  static propTypes = {
    refundLink: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  };

  render() {
    const className = classNames(CSS.refundItem, CSS.centered);

    return (
      <Link href={this.props.refundLink} className={className}>
        {translateElement('item.text.refund', [formatCurrency(this.props.price / 100)])}
      </Link>
    );
  }
}

export default RefundItem;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/RefundItem/index.js