import React from 'react';
import PropTypes from 'prop-types';
import { DialogBody, Button, Backdrop } from '@blendle/lego';
import { translate, translateElement } from 'instances/i18n';
import Illustration from '../Illustration';
import CSS from './style.scss';

const MoneyBack = ({ close, className }) => (
  <div data-test-identifier="purchase-warning-second">
    <Backdrop className={CSS.backdrop} innerClassName={CSS.backdropInner} />
    <Illustration name="newspaper_refund" />
    <DialogBody className={className}>
      <h1>{translateElement('item.text.purchase_warning_second_title')}</h1>
      {translateElement('item.text.purchase_warning_second')}
      <div>
        <Button onClick={close} data-test-identifier="purchase-warning-close-btn">
          {translate('item.text.open_item')}
        </Button>
      </div>
    </DialogBody>
  </div>
);
MoneyBack.propTypes = {
  close: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default MoneyBack;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/SignUpRewardDialog/MoneyBackContent/index.js