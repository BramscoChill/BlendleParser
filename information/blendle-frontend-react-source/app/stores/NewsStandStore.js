import alt from 'instances/altInstance';
import KioskActions from '../actions/KioskActions';
import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';

class NewsStandStore {
  constructor() {
    this.bindActions(KioskActions);

    this.state = {
      status: STATUS_INITIAL,
      kiosk: {},
    };
  }

  onSetInactive({ active }) {
    this.setState({ active });
  }

  onSetActive({ active }) {
    this.setState({ active });
  }

  onFetchNewsStand() {
    this.setState({
      status: STATUS_PENDING,
    });
  }

  onFetchNewsStandSuccess({ newsStand }) {
    this.setState({
      status: STATUS_OK,
      newsStand,
    });
  }

  onFetchNewsStandError({ message }) {
    this.setState({
      status: STATUS_ERROR,
      newsStand: null,
      message,
    });
  }

  onFetchCountryKioskSuccess({ kiosk }) {
    this.setState({ kiosk });
  }
}

export default alt.createStore(NewsStandStore, 'NewsStandStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/NewsStandStore.js