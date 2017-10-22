import ModuleNavigationActions from 'actions/ModuleNavigationActions';

export default function activeModuleMiddleware() {
  return {
    renderRouteComponent(child, details) {
      const routeModule = details.route.module;
      if (routeModule) {
        ModuleNavigationActions.setActiveModule.defer(routeModule);
      }

      return child;
    },
  };
}



// WEBPACK FOOTER //
// ./src/js/app/libs/middleware/routerActiveModule.js