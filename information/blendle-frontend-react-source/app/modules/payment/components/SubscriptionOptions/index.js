import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'instances/i18n';
import SelectPaymentMethodContainer from 'modules/payment/containers/SelectPaymentMethodContainer';
import SelectBank from 'modules/payment/components/SelectBank';
import Button from 'components/Button';
import CSS from './style.scss';

function SubscriptionOptions({
  title,
  choosePaymentMethod,
  children,
  paymentDisclaimer,
  ctaDisclaimer,
  isSubmitDisabled,
  onSubmitOptions,
  submitButtonText,
  onBankChange,
  paymentMethod,
  selectedBank,
  userCanSelectBank,
  isLoading,
  error,
}) {
  const dialogueTitle = title || translate('payment.subscription.sellingpoint');
  const errorMessage = error ? <span className="errorMessage">{error}</span> : null;
  const paymentMethodLabel = choosePaymentMethod ? 'Kies je betaalmethode' : null;
  const selectBank = userCanSelectBank && (
    <SelectBank onSelect={onBankChange} paymentMethod={paymentMethod} selectedBank={selectedBank} />
  );

  return (
    <div className="top-up-options">
      <h1 className="sellingpoint">{dialogueTitle}</h1>
      {children}
      <div className="top-up-options-dropdowns">
        {paymentMethodLabel}
        <SelectPaymentMethodContainer />
        {selectBank}
      </div>
      <div className={CSS.paymentDisclaimer}>{paymentDisclaimer}</div>
      <div className="top-up-options-actions">
        <Button
          disabled={isSubmitDisabled}
          loading={isLoading}
          className="btn-green btn-fullwidth btn-checkout"
          onClick={onSubmitOptions}
        >
          {submitButtonText}
        </Button>
        {errorMessage}
        <small className={CSS.ctaDisclaimer}>{ctaDisclaimer}</small>
      </div>
    </div>
  );
}

SubscriptionOptions.propTypes = {
  title: PropTypes.string,
  submitButtonText: PropTypes.string,
  children: PropTypes.node,
  isSubmitDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  userCanSelectBank: PropTypes.bool,
  paymentMethod: PropTypes.object,
  paymentDisclaimer: PropTypes.string,
  ctaDisclaimer: PropTypes.string,
  choosePaymentMethod: PropTypes.bool,
  selectedBank: PropTypes.string,
  onBankChange: PropTypes.func.isRequired,
  onSubmitOptions: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default SubscriptionOptions;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/components/SubscriptionOptions/index.js