import ByeBye from 'byebye';
import Environment from 'environment';

export default {
  getSupported() {
    return ByeBye.ajax({ url: Environment.i18n }).then((response) => {
      if (!response.headers) {
        const responseWithoutData = { ...response };
        delete responseWithoutData.data;

        window.Raven.captureMessage('No headers for i18n endpoint', {
          extra: {
            response: JSON.stringify(responseWithoutData),
          },
        });
      }

      return {
        countryHeader: response.headers['x-country'],
        ...response.data,
      };
    });
  },
};



// WEBPACK FOOTER //
// ./src/js/app/managers/localization.js