module.exports = (function () {
  const GoogleAdwords = require('helpers/googleadwords');
  const features = require('config/features');
  const { countryEligibleForPremium } = require('helpers/premiumEligibility');

  const conversionId = 968429753;
  const labelMapping = {
    signup: '544FCOb8glYQuaHkzQM',
  };

  const googleAdwords = new GoogleAdwords(conversionId, labelMapping);

  // Disable google adwords in most environments.
  googleAdwords.disable();

  // Only allow adwords on countries where Premium is supported (different privacy policy)
  if (features.adwords && countryEligibleForPremium()) {
    googleAdwords.enable();
  }

  return googleAdwords;
}());



// WEBPACK FOOTER //
// ./src/js/app/instances/googleadwords.js