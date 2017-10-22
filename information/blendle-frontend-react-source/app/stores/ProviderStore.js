import alt from 'instances/altInstance';
import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK } from 'app-constants';
import ProviderActions from 'actions/ProviderActions';

const DEFAULT_PROVIDER_ID = '__default__';

class ProviderStore {
  constructor() {
    this.bindActions(ProviderActions);

    this.state = {
      status: STATUS_INITIAL,
      defaultProvider: null,
      providers: [],
    };
  }

  onFetchProviderConfigurations() {
    this.setState({
      status: STATUS_PENDING,
    });
  }

  onFetchProviderConfigurationsSuccess(providers) {
    this.setState({
      status: STATUS_OK,
      providers,
      defaultProvider: providers.find(provider => provider.id === DEFAULT_PROVIDER_ID),
    });
  }
}

export default alt.createStore(ProviderStore, 'ProviderStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/ProviderStore.js