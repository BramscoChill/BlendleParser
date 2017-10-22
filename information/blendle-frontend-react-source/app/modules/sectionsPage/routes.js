import { asyncRoute } from 'helpers/routerHelpers';
import AuthStore from 'stores/AuthStore';
import redirectIfOnboardingNotComplete from 'helpers/redirectIfOnboardingNotComplete';
import AffiliatesActions from 'actions/AffiliatesActions';
import { storyRoute } from 'modules/stories/routes';
import PremiumVerifiedOverlayContainer from 'containers/overlays/PremiumVerifiedOverlayContainer';
import googleAnalytics from 'instances/google_analytics';
import { getTrackingURL } from 'helpers/url';
import SectionsPageActions from './actions/SectionsPageActions';

const baseRoute = { module: 'sectionsPage' };

function onEnter(nextState, replace, callback) {
  const { user } = AuthStore.getState();

  redirectIfOnboardingNotComplete(user, replace, callback);

  document.body.classList.add('m-sections-page');

  callback();
}

function onLeave() {
  SectionsPageActions.setHidden(window.scrollY);
  document.body.classList.remove('m-sections-page');
}

function route(path, getComponentsHandler, other) {
  return {
    ...baseRoute,
    path,
    onLeave,
    getComponents: asyncRoute(getComponentsHandler),
    ...other,
  };
}

const personalPageRoute = path => ({
  ...baseRoute,
  onEnter,
  onChange: onEnter,
  onLeave,
  path,
  getComponents: asyncRoute((nextState, cb) => {
    require.ensure(
      [],
      () => {
        const Container = require('./containers/PersonalPageContainer');
        cb(null, {
          content: Container,
        });
      },
      'sectionsPage',
    );
  }),
  childRoutes: [
    route('success', (nextState, cb) => {
      googleAnalytics.trackPageView(getTrackingURL(window.location));

      // Select the affiliate from the url to make sure we see the affiliate copy
      const affiliate = nextState.location.query.affiliate;
      if (affiliate) {
        AffiliatesActions.selectAffiliate(affiliate);
      }

      require.ensure(
        [],
        () => {
          cb(null, {
            overlay: PremiumVerifiedOverlayContainer,
          });
        },
        'bundle',
      );
    }),
    route('extend', (nextState, cb) => {
      googleAnalytics.trackPageView(window.location.pathname);

      require.ensure(
        [],
        () => {
          cb(null, {
            overlay: require('containers/ExtendedTrialOverlayContainer'),
          });
        },
        'bundle',
      );
    }),
    storyRoute('story/:storyId'),
  ],
});

export default [personalPageRoute('/home')];



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/routes.js