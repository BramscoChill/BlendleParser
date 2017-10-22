import React from 'react';
import Lock from 'components/icons/Lock';
import { translate } from 'instances/i18n';
import CSS from './style.scss';

export default () => (
  <div className={CSS.paymentDetails}>
    <Lock className={CSS.icon} />
    <p className={CSS.message}>{translate('payment.disclaimer_payment_details')}</p>
  </div>
);



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/components/PaymentDetailsMessage/index.js