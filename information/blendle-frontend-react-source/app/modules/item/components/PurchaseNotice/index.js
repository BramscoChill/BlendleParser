import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import { removeTrailingSlash } from 'helpers/url';
import formatCurrency from 'helpers/formatcurrency';
import { translateElement } from 'instances/i18n';
import CSS from './style.scss';

class PurchaseNotice extends PureComponent {
  static propTypes = {
    price: PropTypes.number.isRequired,
  };

  render() {
    const href = `${removeTrailingSlash(window.location.pathname)}/refund`;

    return (
      <Link href={href} className={CSS.purchaseNotice} tabIndex={0}>
        <strong>{formatCurrency(this.props.price)}</strong>
        {translateElement('item.text.purchase_notice')}
      </Link>
    );
  }
}

export default PurchaseNotice;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/PurchaseNotice/index.js