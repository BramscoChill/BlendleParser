import alt from 'instances/altInstance';
import ModuleNavigationActions from 'actions/ModuleNavigationActions';

class ModuleNavigationStore {
  constructor() {
    this.bindActions(ModuleNavigationActions);

    this.state = {
      activeUrl: null,
      activeModule: null,
      previousUrl: null,
      analytics: {},
    };
  }

  onSetActiveUrl({ activeUrl }) {
    this.setState({
      activeUrl,
      previousUrl: this.state.activeUrl,
    });
  }

  onSetActiveModule(activeModule) {
    this.setState({ activeModule });
  }

  onSetAnalytics({ url, analytics }) {
    const newState = this.state.analytics;
    newState[url] = analytics;

    this.setState({ analytics: newState });
  }
}

export default alt.createStore(ModuleNavigationStore, 'ModuleNavigationStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/ModuleNavigationStore.js