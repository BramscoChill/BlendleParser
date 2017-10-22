export default {
  name: 'production',
  api: 'https://static.blendle.com/api.json',
  tokens: 'https://ws-no-zoom.blendle.com/tokens',
  i18n: 'https://ws-no-zoom.blendle.com/i18n',
  credentials: 'https://ws-no-zoom.blendle.com/credentials',
  providerConfigurations: 'https://static.blendle.nl/provider_configurations.json',
  // Also change analytics in environment.js
  analytics: 'https://events.blendle.com/v1/events',
  gaTrackingId: 'UA-90032766-6', // google analytics tracking id
  maintenanceFile: 'https://static.blendle.com/maintenance.json',
  adyenCseKey:
    '10001|991DD7AEAA0BC438A6309EE7843EDFB760BA197F4FF9C91DD4FB90C087A698BFAFCAB250145D32A05FD924DC85892BDE914C44D3EADC65D98A0FAE8BDC66A6D692F75C9BA1A064242E58273ED2B8ECF58E73F17718E31908745FA3CF959CBA6A85E4869D728AC4A6754765D020A293EDEE24D04571BE5761D546115874A08DAAD0DBA1C1D31D7B555FC4A66F47BD3EFF189BF89988DC2CD962D0F6C692E63C4B9ABF00A6C3F696D147817E0E3A74D17B5DC99FCF20C3D3B7CED244148FC27311CE83175CD34486F86871DCFC9EEB7215C2EB3DAE13DFBF92F9FE9F804B02E6E00CF8F61E029BA78B7542E7FFDCC256400185F6562BF7840620A91BDE0C7418E1',
  requireLogin: true,
  ssl: true,
  imgixBaseUrl: 'https://publication.blendleimg.com',
};



// WEBPACK FOOTER //
// ./src/js/app/config/env/production.js