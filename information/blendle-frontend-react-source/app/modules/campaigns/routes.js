import { asyncRoute } from 'helpers/routerHelpers';

function onEnter() {
  document.body.classList.add('m-campaign');
}

function onLeave() {
  document.body.classList.remove('m-campaign');
}

const baseRoute = {
  module: 'campaign',
  requireAuth: false,
  onEnter,
  onLeave,
};

function couponRoute(path, id) {
  return {
    ...baseRoute,
    path,
    getComponent: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          const campaignModule = require('./module');
          cb(null, {
            content: () => campaignModule.openCoupon(id, nextState.params.code),
          });
        },
        'campaigns',
      );
    }),
  };
}

function campaignRoute(path, getContentComponent) {
  return {
    ...baseRoute,
    path,
    getComponent: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          const campaignModule = require('./module');
          cb(null, {
            content: () => getContentComponent(campaignModule),
          });
        },
        'campaigns',
      );
    }),
  };
}

function replaceRoute(path, replacePath) {
  return {
    path,
    onEnter: (nextState, replace) => replace(replacePath),
  };
}

export default [
  campaignRoute('email', mod => mod.openNewsletterSignUp()),
  campaignRoute('aholdzomer', mod => mod.openAholdCampaign('LKJ60HZD52')),
  campaignRoute('greetz', mod => mod.openGreetzCampaign()),
  campaignRoute('vnc', mod => mod.openVncCampaign()),
  campaignRoute('htm', mod => mod.openHtmCampaign()),

  campaignRoute('vodafone/V45TRs3P11', mod => mod.openVodafoneCampaign('vodafone_5', 'V45TRs3P11')),
  campaignRoute('vodafone/V45TRs3P33', mod =>
    mod.openVodafoneCampaign('vodafone_5b', 'V45TRs3P33'),
  ),
  campaignRoute('vodafone/V45TRs3P55', mod =>
    mod.openVodafoneCampaign('vodafone_10', 'V45TRs3P55'),
  ),
  campaignRoute('vodafone/V45TRs3P77', mod =>
    mod.openVodafoneCampaign('vodafone_15', 'V45TRs3P77'),
  ),

  couponRoute('paypal', 'paypal'),
  couponRoute('tmobile', 'tmobile'),
  couponRoute('deichmann', 'deichmann'),
  couponRoute('voetbalshop', 'voetbalshop'),
  couponRoute('kicker', 'kicker'),
  couponRoute('e-fellows(/:code)', 'efellows'),
  couponRoute('hsgalumni', 'stgallen'),
  couponRoute('vrr', 'vrr'),
  couponRoute('reportagenfm', 'reportagenfm'),
  couponRoute('reportagennewsletter', 'reportagennewsletter'),
  couponRoute('cjp', 'cjp'),
  couponRoute('theinnercirclev', 'theinnercirclev'),
  couponRoute('theinnercirclem', 'theinnercirclem'),
  couponRoute('wired', 'wired'),
  couponRoute('gq', 'gq'),
  couponRoute('lieferando(/:code)', 'lieferando'),
  couponRoute('skyscanner', 'skyscanner'),
  couponRoute('cosmosdirekt(/:code)', 'cosmosdirekt'),
  couponRoute('businesspunk', 'businesspunk'),
  couponRoute('timemagazine', 'timemagazine'),
  couponRoute('bier-deluxe', 'bier-deluxe'),
  couponRoute('brille24', 'brille24'),
  couponRoute('markt.de', 'markt'),
  couponRoute('festival.travel', 'festivaltravel'),
  couponRoute('hrs(/:code)', 'hrs'),
  couponRoute('thanks', 'nps_2016_en'),
  couponRoute('dankjewel', 'nps_2016_nl'),
  couponRoute('danke', 'nps_2016_de'),

  replaceRoute('ns', '/getpremium/actie/ns_cadeautje'),
];



// WEBPACK FOOTER //
// ./src/js/app/modules/campaigns/routes.js