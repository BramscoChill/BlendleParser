import alt from 'instances/altInstance';
import DeepDiveActions from 'actions/DeepDiveActions';
import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';

class DeepDiveStore {
  constructor() {
    this.bindActions(DeepDiveActions);

    this.state = {
      overview: {
        status: STATUS_INITIAL,
      },
      details: new Map(), // key (deepDiveId) value (deepDive)
    };
  }

  onFetchOverview() {
    this.setState({
      ...this.state,
      overview: {
        status: STATUS_PENDING,
      },
    });
  }

  onFetchOverviewSuccess({ deepDives }) {
    this.setState({
      ...this.state,
      overview: {
        status: STATUS_OK,
        deepDives,
      },
    });
  }

  onFetchOverviewError({ error }) {
    this.setState({
      ...this.state,
      overview: {
        status: STATUS_ERROR,
        error,
      },
    });
  }

  onFetchDeepDive({ id }) {
    const details = new Map(...this.state.details);
    details.set(id, { status: STATUS_PENDING });

    this.setState({
      ...this.state,
      details,
    });
  }

  onFetchDeepDiveSuccess({ id, deepDive }) {
    const details = new Map(...this.state.details);
    details.set(id, {
      status: STATUS_OK,
      deepDive,
    });

    this.setState({
      ...this.state,
      details,
    });
  }

  onFetchDeepDiveError({ id, error }) {
    const details = new Map(...this.state.details);
    details.set(id, {
      status: STATUS_ERROR,
      error,
    });

    this.setState({
      ...this.state,
      details,
    });
  }
}

export default alt.createStore(DeepDiveStore, 'DeepDiveStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/DeepDiveStore.js