import alt from 'instances/altInstance';
import CouponActions from '../actions/CouponActions';
import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';

class CouponStore {
  constructor() {
    this.bindActions(CouponActions);

    this.state = {
      data: {},
      error: null,
      status: STATUS_INITIAL,
    };
  }

  onRedeem({ code }) {
    this.setState({ data: { code }, status: STATUS_PENDING });
  }

  onRedeemSuccess({ data }) {
    this.setState({
      data: {
        code: this.state.code,
        ...data,
      },
      status: STATUS_OK,
    });
  }

  onRedeemError({ error }) {
    this.setState({ error, status: STATUS_ERROR });
  }
}

export default alt.createStore(CouponStore, 'CouponStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/CouponStore.js