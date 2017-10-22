import Environment from 'environment';

const DEFAULT_ENCRYPTION_OPTIONS = {
  enableValidations: true,
};

function createCseInstance(options) {
  return new Promise((resolve) => {
    require.ensure([], () => {
      const adyenEncrypt = require('adyen-cse-js');

      const encryptionOptions = {
        ...DEFAULT_ENCRYPTION_OPTIONS,
        ...options,
      };

      const instance = adyenEncrypt.createEncryption(Environment.adyenCseKey, encryptionOptions);
      resolve(instance);
    });
  });
}

function createCardData(cardNumber, cvc, holderName, expiryMonth, expiryYear) {
  const formattedYear = expiryYear.length === 2 ? `20${expiryYear}` : expiryYear;

  return {
    number: cardNumber,
    expiryYear: formattedYear,
    cvc,
    holderName,
    expiryMonth,
  };
}

export const encryptCreditcard = ({
  cardNumber,
  cvc,
  holderName,
  expiryMonth,
  expiryYear,
  options,
}) =>
  createCseInstance(options).then((cseInstance) => {
    // See adyen docs https://docs.adyen.com/developers/easy-encryption#adyenhosted
    // We currently do this client side, we should follow Adyen's advice to generate
    // this value on the backend should the edge cased mentioned in the docs occur often, if at all
    const generationtime = new Date().toISOString();
    const cardData = {
      ...createCardData(cardNumber, cvc, holderName, expiryMonth, expiryYear),
      generationtime,
    };

    return cseInstance.encrypt(cardData);
  });

export const validateCreditcard = ({
  cardNumber,
  cvc,
  holderName,
  expiryMonth,
  expiryYear,
  options,
}) =>
  createCseInstance(options).then((cseInstance) => {
    const cardData = createCardData(cardNumber, cvc, holderName, expiryMonth, expiryYear);
    return cseInstance.validate(cardData);
  });



// WEBPACK FOOTER //
// ./src/js/app/helpers/adyenCse.js