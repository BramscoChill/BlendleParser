const onlyProd = process.env.BUILD_ENV === 'production';
const excludeProd = !onlyProd;
const excludeLocal = process.env.BUILD_ENV !== 'local';
const alphaCountries = ['US', 'FR'];
const betaCountries = ['US'];
const premiumCountries = ['NL'];

export default {
  // due to copyright issues, we need to hide the images of items after X days
  hideItemImagesAfterDays: 30,

  // contains the locales of the providers who are available on the frontend.
  // used for filtering search results
  providerLocales: ['nl_BE', 'nl_NL', 'en_GB', 'en_US', 'de_DE'],

  defaultCountry: 'US',

  // alpha country is an approval-only country
  alphaCountries,

  // beta country is a signup/access code country, last step before public launch
  betaCountries,

  premiumCountries,

  supportedCountries: ['NL', 'DE'],
  transformCountries: {
    CH: 'DE', // Switzerland
    AT: 'DE', // Austria
    AW: 'NL', // Aruba
    CW: 'NL', // Curacao
    BQ: 'NL', // Bonaire, Sint Eustatius en Saba (BES-eilanden)
    AN: 'NL', // Nederlandse Antillen
    SX: 'NL', // Sint Maarten
    SR: 'NL', // Suriname
    BE: 'NL', // Belguim
    GB: 'US', // United Kingdom
    CA: 'US', // Canada
    AU: 'US', // Australia
  },

  defaultLocale: 'en_US',
  alphaLocales: ['fr_FR'],
  betaLocales: [],
  supportedLocales: ['nl_NL', 'de_DE', 'en_US'],

  defaultCurrency: 'USD',

  // Use these settings to implement exceptions based on countries
  countryExceptions: {
    US: {
      hiddenTrendingTimelines: ['international'],
      hideFromCountrySelector: onlyProd,
      mergeOnboardingPublications: true,
      showAccessCodeDeeplink: alphaCountries.includes('US') || betaCountries.includes('US'),
      showBetaLogo: betaCountries.includes('US'),
      hideMyIssues: true,
      hideCountrySetting: excludeLocal,
      hideSubscriptionsSetting: true,
      hideOnboaringUserCount: true,
      hideDeeplinkIntro: true,
    },
    NL: {
      showProviderTrackingSetting: true,
      showRetargetingSetting: true,
      showPublicLab: excludeProd,
    },
  },
};



// WEBPACK FOOTER //
// ./src/js/app/config/settings.js