import Environment from 'environment';

const premiumProviderId = 'blendlepremium';
const premiumTrialProduct = 'blendlepremium_trial';
const premiumExtendedTrialProduct = 'blendlepremium_extended_trial';
const premiumOneMonthPromo = 'blendlepremium_one_month_promo';
const premiumJessePromo = 'blendlepremium_one_month_jesse_promo';
const premiumMonthlyProduct = 'blendlepremium_monthly';
const premiumYearlyProduct = 'blendlepremium_yearly';
const premiumOneWeekAutoRenewal = 'blendlepremium_one_week_auto_renewal';
const premiumVodafoneHalfYearProduct = 'blendlepremium_vodafone_half_year_no_renewal';
const premiumFreeloaderProduct = 'blendlepremium_freeloader';

const premiumTrialSubscriptionProducts = [premiumTrialProduct, premiumExtendedTrialProduct];
const premiumPaidSubscriptionProducts = [
  premiumMonthlyProduct,
  premiumYearlyProduct,
  premiumOneMonthPromo,
  premiumOneWeekAutoRenewal,
  premiumJessePromo,
];
const premiumExternallyManagedProducts = [
  'blendlepremium_vodafone_half_year',
  'blendlepremium_vodafone_monthly',
];

const staffPicks = {
  NL: 'staffpicks',
  BE: 'staffpicks',
  DE: 'staffpicksde',
  US: 'staffpicksus',
};

const CUSTOM_SUBSCRIPTION_URLS = {
  zeit:
    'https://premium.zeit.de/bestellung/1551085?wt_zmc=fix.ext.zonpme.blendle.subscription.n4.text.link.link&utm_medium=fix&utm_source=blendle_zonpme_ext&utm_campaign=subscription&utm_content=n4_text_link_link#start',
};

const CHANNEL_COLORS = {
  staffpicks: {
    text: '#000',
    background: '#FEB800',
  },
  achterklap: {
    background: '#8700B9',
    text: '#FFF',
  },
  economie: {
    background: '#FFF5B1',
    text: '#000',
  },
  muziek: {
    background: '#008DE8',
    text: '#FFF',
  },
  tech: {
    background: '#00DD5B',
    text: '#FFF',
  },
  politiek: {
    background: '#D9FD3D',
    text: '#000',
  },
  interviews: {
    background: '#001EB9',
    text: '#FFF',
  },
  columns: {
    background: '#5F4439',
    text: '#FFF',
  },
  crime: {
    background: '#78036E',
    text: '#FFF',
  },
  gezondheid: {
    background: '#BAFFFA',
    text: '#000',
  },
  buitenland: {
    background: '#00DFB7',
    text: '#000',
  },
  wetenschap: {
    background: '#000E51',
    text: '#FFF',
  },
  voetbalblendle: {
    background: '#FC1F58',
    text: '#FFF',
  },
  blendlemedia: {
    background: '#FF3796',
    text: '#FFF',
  },
  blendlesport: {
    background: '#008DA2',
    text: '#FFF',
  },
  food: {
    background: '#C5FF8A',
    text: '#000',
  },
  onderwijs: {
    background: '#84FD78',
    text: '#000',
  },
  cultuur: {
    background: '#147800',
    text: '#FFF',
  },
  geest: {
    background: '#A574FF',
    text: '#FFF',
  },
  reizen: {
    background: '#FFF031',
    text: '#000',
  },
  klimaat: {
    background: '#32E7FD',
    text: '#000',
  },
  geschiedenis: {
    background: '#002674',
    text: '#FFF',
  },
  usverkiezingen: {
    background: '#9357A9',
    text: '#FFF',
  },
  // USA CHANNELS
  techscience: {
    background: '#00DD5B',
    text: '#FFF',
  },
  politics: {
    background: '#D9FD3D',
    text: '#FFF',
  },
  election2016: {
    background: '#EF303B',
    text: '#FFF',
  },
  opinion: {
    background: '#5F4439',
    text: '#FFF',
  },
  businesseconomy: {
    background: '#FFF5B1',
    text: '#000',
  },
  wellnesshealth: {
    background: '#BAFFFA',
    text: '#000',
  },
  culturelifestyle: {
    background: '#147800',
    text: '#FFF',
  },
  sports: {
    background: '#008DA2',
    text: '#FFF',
  },
  interview: {
    background: '#001EB9',
    text: '#FFF',
  },
  usmedia: {
    background: '#FF3796',
    text: '#000',
  },
  staffpicksus: {
    background: '#FEB800',
    text: '#000',
  },
  mustread: {
    background: '#4A5170',
    text: '#FFF',
  },
};

const LAB_EXPERIMENTS = {
  EDITOR_BUTTON: 'editor_button',
  DEEP_DIVES: 'deep_dives_enabled',
  TEXT_TO_SPEECH: 'TEXT_TO_SPEECH',
  ENTITIES_IN_THE_READER: 'ENTITIES_IN_THE_READER',
};

const LINDA_SHARER = 'blendanieuws';

const UPSELL_STATE = {
  BEFORE_TRIAL: 'beforeTrial',
  DURING_EXPIRING_TRIAL: 'duringTrial',
  ENDED_SUBSCRIPTION: 'endedSubscription',
  NO_UPSELL: 'noUpsell',
};

export default {
  XHR: 'XHR',

  XHR_STATUS: 'XHR_STATUS',
  XHR_ERROR: 'XHR_ERROR',
  XHR_TIMEOUT: 'XHR_TIMEOUT',
  XHR_ABORT: 'XHR_ABORT',

  STATUS_ERROR: -1,
  STATUS_INITIAL: 0,
  STATUS_PENDING: 1,
  STATUS_OK: 2,

  NO_TOKEN: 'NO_TOKEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  AUTH_REQUIRED: 'AuthRequired',

  NOT_FOUND: 'NOT_FOUND',
  MAINTENANCE: 'Maintenance',
  FONTS: 'Fonts',
  INSUFFICIENT_FUNDS: 'InsufficientFunds',
  COUPON: 'Coupon',

  SIGNUP_TYPE_COUPON: 'SIGNUP_TYPE_COUPON',
  SIGNUP_TYPE_AFFILIATE: 'SIGNUP_TYPE_AFFILIATE',
  SIGNUP_TYPE_PAID_ADVERTISEMENT: 'SIGNUP_TYPE_PAID_ADVERTISEMENT',
  SIGNUP_TYPE_DEEPLINK: 'DEEPLINK',
  SIGNUP_TYPE_SUBSCRIPTION: 'SUBSCRIPTION',
  SIGNUP_TYPE_PREMIUM_ONBOARDING: 'SIGNUP_TYPE_PREMIUM_ONBOARDING',
  SIGNUP_TYPE_ONBOARDING: 'SIGNUP_TYPE_ONBOARDING',
  SIGNUP_TYPE_EMAIL_DEEPLINK: 'SIGNUP_TYPE_EMAIL_DEEPLINK',

  SIGNUP_PLATFORM_EMAIL: 'SIGNUP_EMAIL',
  SIGNUP_PLATFORM_FACEBOOK: 'SIGNUP_FACEBOOK',

  EMAIL_BLACKLISTED: 'BlacklistedEmail',
  EMAIL_INVALID: 'InvalidEmail',
  EMAIL_NOT_CONFIRMED: 'EmailNotConfirmed',
  EMAIL_CONTAINS_PLUS_SIGN: 'EmailContainsPlusSign',
  EMAIL_EXISTS: 'ExistingEmail',
  USER_ID_TAKEN: 'UserIdTaken',
  FIRST_NAME_INVALID: 'FirstNameInvalid',
  PASSWORD_INVALID: 'PasswordInvalid',

  USER_REJECTED_EMAIL: 'USER_REJECTED_EMAIL',

  FACEBOOK_FAILURE: 'FacebookFailure',

  COUPON_INVALID: 'CouponInvalid',
  COUPON_REDEEMED: 'CouponRedeemed',
  COUPON_EXCEEDED_MAX: 'CouponExceededMaximum',
  COUPON_EXPIRED: 'CouponExpired',
  COUPON_NEW_USERS_ONLY: 'CouponNewUsersOnly',
  COUPON_CAMPAIGN_EXPIRED: 'CouponCampaignExpired',
  COUPON_PRODUCT_ERROR: 'CouponProductError',

  PREMIUM_REASON_MUST_READ: 'PREMIUM_REASON_MUST_READ',
  PREMIUM_REASON_CHANNEL: 'PREMIUM_REASON_CHANNEL',
  PREMIUM_REASON_STAFF_PICK: 'PREMIUM_REASON_STAFF_PICK',
  PREMIUM_REASON_FOR_YOU: 'PREMIUM_REASON_FOR_YOU',
  HIDE_PREMIUM_BULLETIN_KEY: 'HIDE_PREMIUM_BULLETIN_KEY',

  DEEPLINK_LOCATION_IN_LAYOUT_KEY: 'DEEPLINK_LIL_KEY',

  ORDER_REFUSED: 'ORDER_REFUSED',

  MANUAL_LOGOUT: 'Manual_logout',
  MISSING_PASSWORD: 'MissingPassword',

  LIBRARY_UNAVAILABLE: 'LIBRARY_UNAVAILABLE',

  REDIRECT_TO_URL: 'RedirectToUrl',

  RECURRING_MINIMAL_AMOUNT: 1, // Minimal amount (euro's) before a recurring payment is triggered

  BLENDLE_COUPON: 'Blendle',

  STAFFPICKS: staffPicks,

  STAFFPICKS_CHANNELS: Object.keys(staffPicks).map(country => staffPicks[country]),

  DEFAULT_AVATAR:
    Environment.name === 'localhost:3000/static/images/avatar.jpg'
      ? ''
      : 'https://static.blendle.com/images/default/avatar/default.jpg',

  ARTICLE_SWAP_ERROR_TYPES: {
    SWAP_LIMIT_REACHED: 'SwapLimitReached',
    NO_SWAP_CANDIDATES: 'NoSwapCandidates',
    BUNDLE_TOO_OLD: 'BundleTooOld',
  },

  MAX_TILE_HEIGHT: 760,

  PREMIUM_TILE_WIDTH: 370,
  FEATURED_PREMIUM_TILE_WIDTH: 600,
  MOBILE_PREMIUM_TILE_HEIGHT: 350,
  FEATURED_MOBILE_PREMIUM_TILE_HEIGHT: 400,
  MAX_PREMIUM_TILE_HEIGHT: 740,

  DESKTOP_NAVIGATION_HEIGHT_PX: 62,

  AUTO_REFUND_TIMEOUT: 10000, // 10s in milliseconds
  // TODO - Determine an appropriate delay with Mathieu and the other clients
  VIEW_TIMELINE_DELAY: 0,

  TOP_BAR_SLIDE_IN_PERCENTAGE: 97,

  keyCode: {
    BACKSPACE: 8,
    TAB: 9,
    CONTROL: 17,
    ESC: 27,
    RETURN: 13,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    COMMAND: 91,
  },

  JOBS_URL_BASE:
    'https://blendle.homerun.co/utm_medium=web&utm_campaign=werken-bij-blendle&utm_source=blendle&utm_content=usernavigation&',

  HOME_ROUTE: '/home',
  PREMIUM_TRIAL_PRODUCT: premiumTrialProduct,
  PREMIUM_EXTENDED_TRIAL_PRODUCT: premiumExtendedTrialProduct,
  PREMIUM_ONE_MONTH_PROMO: premiumOneMonthPromo,
  PREMIUM_JESSE_PROMO: premiumJessePromo,
  PREMIUM_ONE_WEEK_AUTO_RENEWAL: premiumOneWeekAutoRenewal,
  PREMIUM_MONTHLY_PRODUCT: premiumMonthlyProduct,
  PREMIUM_YEARLY_PRODUCT: premiumYearlyProduct,
  PREMIUM_FREELOADER_PRODUCT: premiumFreeloaderProduct,
  PREMIUM_TRIAL_SUBSCRIPTION_PRODUCTS: premiumTrialSubscriptionProducts,
  PREMIUM_PAID_SUBSCRIPTION_PRODUCTS: premiumPaidSubscriptionProducts,
  PREMIUM_PROVIDER_ID: premiumProviderId,
  PREMIUM_PRODUCTS_MANAGED_EXTERNALLY: premiumExternallyManagedProducts,
  PREMIUM_ALL_SUBSCRIPTION_PRODUCTS: [
    ...premiumTrialSubscriptionProducts,
    ...premiumPaidSubscriptionProducts,
    ...premiumExternallyManagedProducts,
    premiumVodafoneHalfYearProduct,
    premiumFreeloaderProduct,
  ],

  PREMIUM_BUNDLE_TYPES: {
    DAILY: 'daily',
    MUST_READ: 'mustreads',
    FOR_YOU: 'foryou',
    MAGAZINE: 'magazine',
    SPECIAL: 'special',
    WEEKLY: 'weekly',
    MANUAL: 'manual',
    REST: 'rest',
  },

  LAB_EXPERIMENTS,
  CUSTOM_SUBSCRIPTION_URLS,
  CHANNEL_COLORS,

  ITEM_PREFERENCE_TYPES: {
    CHANNEL: 'channel',
    PROVIDER: 'provider',
    NO_REASON: 'no_reason',
  },

  PREFER: {
    LESS: 'less',
    NEGATIVE: 'negative',
    RESET: 'reset',
  },

  APP_STORE_URL: 'https://itunes.apple.com/nl/app/blendle/id947936149',
  PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=com.blendle.app',

  LINKEDIN_LINK:
    Environment.name === 'test'
      ? ''
      : 'http://www.linkedin.com/shareArticle?mini=true&url=%s&title=%s&summary=%s&source=%s',

  PARTNER_SHARERS: [LINDA_SHARER],
  UPSELL_STATE,

  HELP_DESK_URL: 'https://www.blendle.support/',

  JESSE_FILM_ITEM_ID: 'bnl-jesse-20170901-v1d30',
  JESSE_FILM_URL: 'https://www.jessefilm.nl/',
};



// WEBPACK FOOTER //
// ./src/js/app/app-constants.js