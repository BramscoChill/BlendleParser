import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { translate } from 'instances/i18n';
import classNames from 'classnames';
import ManagedInput from 'components/ManagedInput';
import CreditcardInput from './CreditcardInput';
import CSS from './style.scss';
import BrowserEnvironment from 'instances/browser_environment';

export default class CreditcardForm extends React.Component {
  static propTypes = {
    onNameBlur: PropTypes.func.isRequired,
    onNumberInputChange: PropTypes.func.isRequired,
    onCardNumberInputChange: PropTypes.func.isRequired,
    onTextInputChange: PropTypes.func.isRequired,
    onCardNumberBlur: PropTypes.func.isRequired,
    onYearBlur: PropTypes.func.isRequired,
    onMonthBlur: PropTypes.func.isRequired,
    onCvcBlur: PropTypes.func.isRequired,
    creditcardDetails: PropTypes.object.isRequired,
  };

  componentDidUpdate() {
    this._focusOnNextElement();
  }

  componentWillUnmount() {
    clearTimeout(this._elementFocusTimeout);
  }

  _focusOnNextElement() {
    let inpToFocusOn = null;
    const isAmex = this.props.creditcardDetails.cardType === 'amex';
    const ccDetails = this.props.creditcardDetails;
    if (
      ccDetails.lastEditedField === 'cardNumber' &&
      ccDetails.cardNumber.value.length === (isAmex ? 15 : 16)
    ) {
      inpToFocusOn = this._month;
    }

    if (ccDetails.lastEditedField === 'month' && ccDetails.month.value.length === 2) {
      inpToFocusOn = this._year;
    }

    if (ccDetails.lastEditedField === 'year' && ccDetails.year.value.length === 2) {
      inpToFocusOn = this._cvcCode;
    }

    if (inpToFocusOn) {
      if (inpToFocusOn === this._focusInput) {
        return;
      }

      this._focusInput = inpToFocusOn;
      let element = ReactDOM.findDOMNode(inpToFocusOn);

      if (element.tagName.toLowerCase() !== 'input') {
        element = element.querySelector('input');
      }

      if (BrowserEnvironment.isMobile()) {
        this._elementFocusTimeout = setTimeout(() => element.focus(), 30); // Without this timeout, the form jumps up and down on mobile devices.
        return;
      }

      element.focus();
    }
  }

  _renderCardholder() {
    const cardHolder = this.props.creditcardDetails.name;
    return (
      <div className={CSS.formItem}>
        <label>{translate('payment.creditcard.form.cardholder')}</label>
        <ManagedInput
          autoComplete="cc-name"
          onBlur={this.props.onNameBlur}
          type="text"
          name="name"
          error={cardHolder.error}
          placeholder={translate('payment.creditcard.form.cardholder_placeholder')}
          className="inp inp-text inp-fullwidth"
          value={cardHolder.value || ''}
          onChange={this.props.onTextInputChange}
          noState
        />
      </div>
    );
  }

  _renderCardNumber() {
    const cardNumber = this.props.creditcardDetails.cardNumber;
    const cardType = this.props.creditcardDetails.cardType;
    return (
      <div className={CSS.formItem}>
        <label>{translate('payment.creditcard.form.cardnumber')}</label>
        <CreditcardInput
          onChange={this.props.onCardNumberInputChange}
          onBlur={this.props.onCardNumberBlur}
          value={cardNumber.value || ''}
          error={cardNumber.error}
          name="cardNumber"
          cardType={cardType}
          placeholder={translate('payment.creditcard.form.cardnumber_placeholder')}
          className="inp inp-fullwidth inp-number"
        />
      </div>
    );
  }

  _renderExpirationDate() {
    const { year, month } = this.props.creditcardDetails;

    return (
      <div className={classNames(CSS.expirationDate, CSS.formItem)}>
        <label>{translate('payment.creditcard.form.expiration_date')}</label>
        <div className={CSS.expirationDateInput}>
          <div className={CSS.dateInputContainer}>
            <ManagedInput
              type="text"
              pattern="\d*"
              name="month"
              autoComplete="cc-exp-month"
              format="XX"
              ref={c => (this._month = c)} // eslint-disable-line no-return-assign
              value={month.value}
              error={month.error}
              maxLength={2}
              onBlur={this.props.onMonthBlur}
              onChange={this.props.onNumberInputChange}
              placeholder={translate('payment.creditcard.form.month_placeholder')}
              className="inp inp-number"
              noState
            />
          </div>
          <label>/</label>
          <div className={CSS.dateInputContainer}>
            <ManagedInput
              type="text"
              pattern="\d*"
              name="year"
              format="XX"
              ref={c => (this._year = c)} // eslint-disable-line no-return-assign
              autoComplete="cc-exp-year"
              value={year.value}
              error={year.error}
              maxLength={2}
              onBlur={this.props.onYearBlur}
              onChange={this.props.onNumberInputChange}
              placeholder={translate('payment.creditcard.form.year_placeholder')}
              className="inp inp-number"
              noState
            />
          </div>
        </div>
      </div>
    );
  }

  _renderCvc() {
    const { cardType, cvcCode } = this.props.creditcardDetails;
    const isAmexCard = cardType === 'amex';

    const format = isAmexCard ? 'XXXX' : 'XXX';
    const maxLength = isAmexCard ? 4 : 3;

    return (
      <div className={classNames(CSS.cvc, CSS.formItem)}>
        <label>{translate('payment.creditcard.form.cvc_code')}</label>
        <ManagedInput
          type="text"
          pattern="\d*"
          name="cvcCode"
          autoComplete="cc-csc"
          format={format}
          ref={c => (this._cvcCode = c)} // eslint-disable-line no-return-assign
          value={cvcCode.value || ''}
          error={cvcCode.error}
          maxLength={maxLength}
          onChange={this.props.onNumberInputChange}
          onBlur={this.props.onCvcBlur}
          placeholder={translate('payment.creditcard.form.cvc_code_placeholder')}
          maskClassName={CSS.cvcInput}
          className="inp inp-number"
          noState
        />
      </div>
    );
  }

  render() {
    return (
      <form name="cc_inline" className={CSS.container}>
        {this._renderCardholder()}
        {this._renderCardNumber()}
        {this._renderExpirationDate()}
        {this._renderCvc()}
      </form>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/components/CreditcardForm/index.js