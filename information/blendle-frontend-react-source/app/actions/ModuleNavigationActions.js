import alt from 'instances/altInstance';

class ModuleNavigationActions {
  setActiveUrl(url) {
    let activeUrl = url;
    if (!url.startsWith('/')) {
      activeUrl = `/${url}`;
    }

    return { activeUrl };
  }

  setActiveModule = activeModule => activeModule;

  setAnalytics(url, analytics) {
    return { url, analytics };
  }
}

export default alt.createActions(ModuleNavigationActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/ModuleNavigationActions.js