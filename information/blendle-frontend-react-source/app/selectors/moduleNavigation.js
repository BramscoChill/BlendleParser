import { get } from 'lodash';

export const navigationAnalytics = (moduleNavigationState, url = moduleNavigationState.activeUrl) =>
  get(moduleNavigationState, ['analytics', url], {});



// WEBPACK FOOTER //
// ./src/js/app/selectors/moduleNavigation.js