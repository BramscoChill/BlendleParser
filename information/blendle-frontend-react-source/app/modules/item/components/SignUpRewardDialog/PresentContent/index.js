import React from 'react';
import PropTypes from 'prop-types';
import { DialogBody, Button, Backdrop } from '@blendle/lego';
import { translate, translateElement } from 'instances/i18n';
import Illustration from '../Illustration';
import CSS from './style.scss';

const getText = (userHasPremium, price, gift) =>
  translateElement(
    userHasPremium
      ? 'item.text.purchase_warning_intro_premium'
      : 'item.text.purchase_warning_intro',
    { price, gift },
  );

const PresentContent = ({ onNextStep, className, price, gift, userHasPremium }) => (
  <div data-test-identifier="purchase-warning-first">
    <Backdrop className={CSS.backdrop} innerClassName={CSS.backdropInner} />
    <Illustration name="first_article" />
    <DialogBody className={className}>
      <h1>{translate('item.text.purchase_warning_title', [gift])}</h1>
      {getText(userHasPremium, price, gift)}
      <div>
        <Button onClick={onNextStep} data-test-identifier="purchase-warning-next-btn">
          {translate('supersympathiek')}
        </Button>
      </div>
    </DialogBody>
  </div>
);

PresentContent.propTypes = {
  onNextStep: PropTypes.func.isRequired,
  className: PropTypes.string,
  price: PropTypes.string.isRequired,
  gift: PropTypes.string.isRequired,
  userHasPremium: PropTypes.bool,
};

export default PresentContent;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/SignUpRewardDialog/PresentContent/index.js