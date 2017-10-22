import alt from 'instances/altInstance';
import Environment from 'environment';
import axios from 'axios';

class ProviderActions {
  fetchProviderConfigurations() {
    axios
      .get(Environment.providerConfigurations, {
        headers: {
          accept: 'application/hal+json',
        },
      })
      .then(resp => resp.data._embedded.configurations)
      .then(this.fetchProviderConfigurationsSuccess);

    return null;
  }

  fetchProviderConfigurationsSuccess = x => x;
}

export default alt.createActions(ProviderActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/ProviderActions.js