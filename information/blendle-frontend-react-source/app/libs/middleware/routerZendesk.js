import zendesk from 'instances/zendesk';

const invisibleModules = [
  'item',
  'sectionsPage',
  'premiumsignup',
  'timeline',
  'bundle',
  'campaign',
  'kiosk',
  'alerts',
  'issue',
  'subscription',
  'preferences',
];

// Keep track of visibility, when calling show or hide the animation is always triggered.
let currentlyVisible;

function toggle(visible) {
  if (currentlyVisible !== visible) {
    currentlyVisible = visible;
    zendesk.execute(visible ? 'show' : 'hide');
  }
}

export default function () {
  return {
    renderRouteComponent(child, details) {
      const routeModule = details.route.module;
      if (routeModule) {
        toggle(!invisibleModules.includes(routeModule));
      }
      return child;
    },
  };
}



// WEBPACK FOOTER //
// ./src/js/app/libs/middleware/routerZendesk.js