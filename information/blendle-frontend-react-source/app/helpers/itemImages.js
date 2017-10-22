import moment from 'moment';
import { hideItemImagesAfterDays } from 'config/settings';
import { hideImagesAfterXDays } from 'config/features';
import {
  providerImagesExpire,
  isProviderWithoutImages,
  prefillSelector,
} from 'selectors/providers';

const now = moment();
const allowedArticles = ['bnl-par-20151215-5578786'];

export function allowImages(itemDate, itemId, providerId) {
  if (prefillSelector(isProviderWithoutImages)(providerId)) {
    return false;
  }

  if (!prefillSelector(providerImagesExpire)(providerId)) {
    return true;
  }

  if (allowedArticles.includes(itemId)) {
    return true;
  }

  if (!hideImagesAfterXDays) {
    return true;
  }

  const diff = now.diff(moment(itemDate), 'days');
  return diff < hideItemImagesAfterDays;
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/itemImages.js