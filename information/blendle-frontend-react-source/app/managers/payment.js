module.exports = (function () {
  // Libraries
  const _ = require('lodash');
  const ByeBye = require('byebye');
  const Settings = require('controllers/settings');
  const uri2url = require('helpers/url').uri2url;

  const priorityBanks = {
    ideal: [
      '0031', // ABN Amro
      '0021', // Rabobank
      '0721', // ING
      '0751', // SNS
      '0511', // Triodos
      '0161', // Van Lanschot Bankiers
    ],
  };

  /**
   * Takes a relative path and correctly prefixes it.
   *
   * Also fixes a redirect issue when using Chrome on iOS.
   *
   * @param  {String} path relative path (like 'payment/success')
   * @return {String} URI
   */
  function formatRedirectURI(path) {
    const url = uri2url(path);

    // Fix stuff in Chrome on iOS
    if (window.BrowserDetect.iOS && window.BrowserDetect.browser === 'Chrome') {
      return url.replace(/https?/, 'googlechrome');
    }

    return url;
  }

  function formatURLs(options) {
    if (options.success_url) {
      options.success_url = formatRedirectURI(options.success_url);
    }

    if (options.pending_url) {
      options.pending_url = formatRedirectURI(options.pending_url);
    }

    if (options.cancel_url) {
      options.cancel_url = formatRedirectURI(options.cancel_url);
    }

    return options;
  }

  const PaymentManager = {
    /**
     * Get the amounts we support
     * @return {Array} supported amounts
     */
    getAmounts() {
      return [5, 10, 20, 50];
    },

    /**
     * Get fees to pay for certain amounts
     * @return {Object} object with amount as key and fee as value.
     */
    getTransactionFees() {
      return {
        5: 0.3,
      };
    },

    /**
     * Get the payment method which should be selected by default
     *
     * @return {String} default payment method
     */
    getDefaultPaymentMethod() {
      return 'ideal';
    },

    /**
     * Get payment methods from the backend
     *
     * @param  {User} user the user to get the payment methods for
     * @return {Promise}
     */
    getPaymentMethods(user) {
      return ByeBye.ajax({
        url: Settings.getLink('adyen_payment_methods', { user_id: user.id }),
      }).then(response => Promise.resolve(response.data));
    },

    /**
     * Get payment methods and correctly filter and process so creditcards are grouped
     *
     * @param  {[type]} user [description]
     * @return {Promise}
     */
    getPaymentMethodsProcessed(user) {
      return this.getPaymentMethods(user)
        .then(this._processPaymentMethods.bind(this))
        .catch(() => new Error('Unable to fetch payment methods.'));
    },

    _processPaymentMethods(data) {
      const creditCard = {
        name: 'Creditcard',
        code: 'creditcard',
        banks: [],
      };

      const paymentMethods = _.reduce(
        data,
        (paymentMethods, provider) => {
          // Exclude direct debit
          if (provider.code === 'directdebit_NL') {
            return paymentMethods;
          }
          if (['amex', 'discover', 'mc', 'visa'].includes(provider.code)) {
            creditCard.banks.push(provider);
            return paymentMethods;
          }
          if (provider.banks) {
            provider.banks = this._orderBanks(provider.code, provider.banks);
          }
          paymentMethods.push(provider);
          return paymentMethods;
        },
        [creditCard],
      );

      const preferredMethods = ['ideal', 'directEbanking', 'paypal', 'creditcard'];

      paymentMethods.sort((a, b) => {
        const aCodeIndex = preferredMethods.indexOf(a.code);
        const bCodeIndex = preferredMethods.indexOf(b.code);

        if (aCodeIndex < bCodeIndex) {
          return -1;
        }

        if (aCodeIndex > bCodeIndex) {
          return 1;
        }

        return 0;
      });

      return paymentMethods;
    },

    /**
     * Get the recurring contracts for this user
     * @param {User} user
     * @returns {Promise}
     */
    getRecurringContract(user) {
      return ByeBye.ajax({
        url: Settings.getLink('user_payment', { user_id: user.id }),
        type: 'GET',
      }).then(res => res.data);
    },

    /**
     * Set recurring contract
     * @param {User} user
     * @param {Boolean} enabled
     * @returns {Promise}
     */
    setRecurringContract(user, enabled) {
      return ByeBye.ajax({
        url: Settings.getLink('user_payment', { user_id: user.id }),
        type: 'PUT',
        data: JSON.stringify({
          recurring_enabled: enabled,
        }),
      }).then(res => res.data);
    },

    /**
     * Get the recurring contracts for this user
     * @param {Object} data as the response from user_payment
     * @returns {Object}
     */
    getRecurringState(data) {
      const enabled = data.recurring_enabled;
      const recurringContracts = _.get(data, '_embedded.recurring_contracts', []);

      let state = 'norecurring_nocontracts';
      if (enabled && recurringContracts.length) {
        state = 'recurring';
      } else if (enabled && !recurringContracts.length) {
        state = 'recurring_nocontracts';
      } else if (!enabled && recurringContracts.length) {
        state = 'norecurring_hascontracts';
      }

      return {
        state,
        enabled,
        recurringContracts,
        data,
      };
    },

    /**
     * Add 10 euro to the user's balance as a recurring payment
     * @param  {User} user User who should get an upgrade
     * @return {Promise}
     */
    upgradeRecurring(user) {
      return ByeBye.ajax({
        url: Settings.getLink('adyen_place_order', { user_id: user.id }),
        type: 'POST',
        data: JSON.stringify({
          amount: 10,
        }),
      });
    },

    /**
     * Fetch a payment url to redirect the user towards.
     *
     * @param  {User} user to arrange stuff for
     * @param  {Object} options
     *  - method {String}
     *  - recurring {Boolean}
     *  - amount {String}
     *  - success_url {String}
     *  - pending_url {String}
     *  - cancel_url {String}
     *  - product {String} null|coupon
     *  - email {String} receiver email
     *  - name {String} receiver name
     *  - message {String} message to send the receiver
     * @return {[type]}         [description]
     */
    fetchPaymentURL(user, options) {
      // Format urls
      const formattedOptions = formatURLs(options);

      // Special case for creditcards (@TODO: needs to be fixed in de backend too)
      if (formattedOptions.method === 'creditcard') {
        formattedOptions.method = formattedOptions.bank;
      }

      return ByeBye.ajax({
        type: 'POST',
        url: Settings.getLink('adyen_payment_proposal', { user_id: user.id }),
        data: JSON.stringify(formattedOptions),
      }).then(resp => resp.data.location);
    },

    fetchOrderURL(options) {
      // Format urls
      const formattedOptions = formatURLs(options);

      // Special case for creditcards (@TODO: needs to be fixed in de backend too)
      if (formattedOptions.method === 'creditcard') {
        formattedOptions.method = formattedOptions.bank;
      }

      return ByeBye.ajax({
        type: 'POST',
        url: Settings.getLink('orders'),
        data: JSON.stringify(formattedOptions),
        skipJWTRefresh: !!formattedOptions.payment, // if payment jwt is present it should skip refreshing the auth jwt
      }).then(resp => resp.data);
    },

    directTopUp({ amount, recurringContractId, adyen_encrypted_data, method, recurring }, userId) {
      return ByeBye.ajax({
        type: 'POST',
        url: Settings.getLink('adyen_payment_proposal', { user_id: userId }),
        data: JSON.stringify({
          amount,
          recurring_contract: recurringContractId,
          adyen_encrypted_data,
          method,
          recurring,
        }),
      }).then((resp) => {
        if (resp.data.status !== 'success') {
          throw resp.data;
        }

        if (resp.status === 200) {
          return resp.data.message;
        }

        throw resp;
      });
    },

    _orderBanks(type, banks) {
      if (!priorityBanks[type]) return banks;

      const orderedBanks = _.reduce(
        priorityBanks[type],
        (orderedBanks, value) => {
          const bank = _.find(banks, { code: value });

          if (bank) {
            orderedBanks.push(bank);
          }

          return orderedBanks;
        },
        [],
      );

      return orderedBanks.concat(
        _.filter(banks, value => priorityBanks[type].indexOf(value.code) === -1),
      );
    },
  };

  return PaymentManager;
}());



// WEBPACK FOOTER //
// ./src/js/app/managers/payment.js