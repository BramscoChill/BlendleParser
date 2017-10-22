import React, { Component } from 'react';
import PropTypes from 'prop-types';
import browserHistory from 'react-router/lib/browserHistory';
import match from 'react-router/lib/match';
import Router from 'react-router/lib/Router';
import applyRouterMiddleware from 'react-router/lib/applyRouterMiddleware';
import Auth from 'controllers/auth';
import routerRequireAuth from 'libs/middleware/routerRequireAuth';
import routerZendesk from 'libs/middleware/routerZendesk';
import routerActiveModule from 'libs/middleware/routerActiveModule';
import Error from 'components/Application/Error';
import Prerender from 'components/Application/Prerender';
import { hasAccessToPremiumFeatures, countryEligibleForPremium } from 'helpers/premiumEligibility';
import { NOT_FOUND, HOME_ROUTE } from 'app-constants';
import { blendlePremium } from 'config/features';

const redirect = (from, to) => ({
  path: from,
  requireAuth: false,
  onEnter: (nextState, replace) => {
    replace(to);
  },
});

const rootRoute = {
  childRoutes: [
    {
      path: '/',
      requireAuth: false,
      indexRoute: {
        onEnter: (nextState, replace) => {
          if (nextState.location.query.md_email) {
            const { opt_out_type: optOutType } = nextState.location.query;
            return replace(`/unsubscribe-newsletter/${optOutType}`);
          }

          // User comes from premium invite mail
          const userHasPremium = Auth.getUser() && Auth.getUser().hasActivePremiumSubscription();
          if (!userHasPremium && nextState.location.query.skip_launch_dialogs) {
            return replace(`${HOME_ROUTE}${window.location.search}`);
          }

          const user = Auth.getUser();
          if (user) {
            return replace(HOME_ROUTE);
          }

          if (blendlePremium && countryEligibleForPremium()) {
            return replace('/getpremium');
          }

          return replace('/signup/kiosk');
        },
      },
      component: require('containers/ApplicationContainer'),
      childRoutes: [
        redirect('/getpremium/try', '/'),
        redirect('/getpremium/go', '/'),
        redirect('/voorjou', '/'),
        redirect('/premium', '/'),
        redirect('/getpremium/magazine', '/'),
        redirect('/hello', '/getpremium/actie/coupon'),
        redirect('/ade', '/getpremium/actie/ADE'),
        redirect('/ADE', '/getpremium/actie/ADE'),
        ...require('modules/about/routes'),
        ...require('modules/access/routes'),
        ...require('modules/alerts/routes'),
        ...require('modules/campaigns/routes'),
        ...require('modules/coupon/routes'),
        ...require('modules/dialogue/routes'),
        ...require('modules/emailLogin/routes'),
        ...require('modules/item/routes'),
        ...require('modules/issue/routes'),
        ...require('modules/kiosk/routes'),
        ...require('modules/payment/routes'),
        ...require('modules/preferences/routes'),
        ...require('modules/premiumSignup/routes'),
        ...require('modules/timeline/routes'),
        ...require('modules/search/routes'),
        ...require('modules/settings/routes'),
        ...require('modules/social/routes'),
        ...require('modules/subscription/routes'),
        ...require('modules/signup/routes'),

        ...require('modules/overlay/routes'),
        ...require('modules/deepdive/routes'),
        ...require('modules/sectionsPage/routes'),
        ...require('modules/goodbye/routes'),
        {
          requireAuth: true,
          path: 'logout(/:loginEmail)',
          onEnter(nextState, replace) {
            const { loginEmail } = nextState.params;

            if (Auth.getUser()) {
              Auth.logout().then(() => {
                if (loginEmail) {
                  replace(`/login?email=${loginEmail}`);
                } else {
                  replace('/');
                }
              });
            } else {
              replace('/');
            }
          },
        },
        {
          requireAuth: false,
          module: 'error',
          path: '*',
          getComponents: (nextState, cb) => {
            cb(null, {
              content: () => <Error type={NOT_FOUND} />,
            });
          },
        },
      ],
    },
  ],
};

class RouterContainer extends Component {
  static propTypes = {
    error: PropTypes.object,
  };

  state = {
    renderProps: {},
    renderRouter: false,
  };

  componentDidMount() {
    // wait with rendering of the router until the async route has been resolved
    // see https://github.com/ReactTraining/react-router/blob/3035e967ee80ee32e9369708184477c9b59d94e2/docs/guides/ServerRendering.md#async-routes
    match(
      {
        history: browserHistory,
        routes: rootRoute,
      },
      (error, redirect, renderProps) => {
        this.setState({
          renderRouter: true,
          renderProps,
        });
      },
    );
  }

  render() {
    const { error } = this.props;
    if (error) {
      return <Error type={error.type} message={error.message} />;
    }

    if (this.state.renderRouter) {
      return (
        <Router
          {...this.state.renderProps}
          history={browserHistory}
          routes={rootRoute}
          render={applyRouterMiddleware(
            routerRequireAuth(Auth),
            routerZendesk(),
            routerActiveModule(),
          )}
        />
      );
    }

    return <Prerender />;
  }
}

RouterContainer.propTypes = {
  error: PropTypes.object,
};

export default RouterContainer;



// WEBPACK FOOTER //
// ./src/js/app/containers/RouterContainer.js