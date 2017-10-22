module.exports = (function () {
  // Libraries
  const _ = require('lodash');
  const sprintf = require('sprintf-js').sprintf;

  const commonMistakes = {
    tld: {
      com: ['con', 'kom', 'cm', 'cmo', 'cim', 'cpm'],
      nl: ['ml', 'ln', 'nk', 'bl'],
      net: ['nt', 'met'],
      'tante.nel': ['nel'],
    },
    hostname: {
      gmail: ['gmai', 'gail', 'gmai', 'gnail', 'mgail', 'gmial', 'mgail', 'gamil', 'gmal'],
      hotmail: [
        'htmail',
        'otmail',
        'hotmal',
        'hotmai',
        'hotmial',
        'hoitmail',
        'homail',
        'hotrmail',
        'hotmil',
        'hotmaill',
      ],
      live: ['lve', 'liv'],
      yahoo: ['yhoo', 'yaho'],
    },
  };

  const EmailAddressManager = {
    disectAddress(email) {
      // Split up into user and domain.
      const parts = email.split('@');
      const user = parts[0];
      const domain = parts[1];

      // Get TLD and hostname from domain.
      const domainParts = domain && domain.split('.');
      const tld = domainParts && domainParts.pop();
      const hostname = domainParts && domainParts.join('.');

      return {
        user,
        hostname,
        tld,
      };
    },

    compileAddress(parts) {
      return sprintf('%s@%s.%s', parts.user, parts.hostname, parts.tld);
    },

    checkForCommonMistakes(email) {
      let inputParts = this.disectAddress(email),
        suggestionParts = {},
        suggest = false;

      if (!inputParts.user || !inputParts.hostname || !inputParts.tld) {
        return false;
      }

      // Check all parts against our list of common mistakes and come up with a suggestions.
      // TLD
      for (const tld in commonMistakes.tld) {
        if (commonMistakes.tld[tld].indexOf(inputParts.tld) !== -1) {
          suggestionParts.tld = tld;
          suggest = true;
        }
      }

      // Hostname
      for (const hostname in commonMistakes.hostname) {
        if (commonMistakes.hostname[hostname].indexOf(inputParts.hostname) !== -1) {
          suggestionParts.hostname = hostname;
          suggest = true;
        }
      }

      // Merge input with suggestionParts, or return false if we have no suggestion.
      if (suggest) {
        return this.compileAddress(_.extend(inputParts, suggestionParts));
      }
      return false;
    },
  };

  return EmailAddressManager;
}());



// WEBPACK FOOTER //
// ./src/js/app/managers/emailaddress.js