import alt from 'instances/altInstance';
import TopUpActions from 'actions/TopUpActions';
import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';

class TopUpStore {
  constructor() {
    this.bindActions(TopUpActions);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      amounts: [5, 10, 20, 50],
      transactionFees: { 5: 0.3 },
      selectedAmount: 10,
      activeStep: 'options',
      recurringRequest: false,
      status: STATUS_INITIAL,
      redeemStatus: STATUS_INITIAL,
      topUpStatus: STATUS_INITIAL,
    };
  }

  onResetState() {
    this.setState(this.getInitialState());
  }

  onSetAmount(selectedAmount) {
    this.setState({ selectedAmount });
  }

  onSetActiveStep(activeStep) {
    this.setState({ activeStep });
  }

  onSetRecurringRequestContract({ recurringRequest }) {
    this.setState({ recurringRequest });
  }

  onTopUp() {
    this.setState({ topUpStatus: STATUS_PENDING });
  }

  onTopupCreditcard() {
    this.setState({ topUpStatus: STATUS_PENDING });
  }

  onTopUpSuccess() {
    this.setState({ topUpStatus: STATUS_OK });
  }

  onTopUpError() {
    this.setState({ topUpStatus: STATUS_ERROR });
  }
}

export default alt.createStore(TopUpStore, 'TopUpStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/TopUpStore.js