import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router/lib/withRouter';
import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';
import Analytics from 'instances/analytics';
import ConfirmAccountStore from 'stores/ConfirmAccountStore';
import ConfirmAccountActions from 'actions/ConfirmAccountActions';
import SignUpStore from 'stores/SignUpStore';
import { getCouponCode } from 'selectors/signUp';
import { track } from 'helpers/premiumOnboardingEvents';
import { emailErrorMessages, getErrorMessage } from 'helpers/inputErrorMessages';
import AuthStore from 'stores/AuthStore';
import ChangeEmail from 'modules/premiumSignup/components/ChangeEmail';

class ChangeEmailContainer extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      user: {},
      email: '',
      error: null,
      errorMessage: null,
      changeEmailStatus: STATUS_INITIAL,
      resendStatus: STATUS_INITIAL,
    };
  }

  componentWillMount() {
    const user = AuthStore.getState().user;

    this.setState({
      user,
      email: user.get('email'),
    });
  }

  componentDidMount() {
    ConfirmAccountStore.listen(this._onConfirmAccountStore);
  }

  componentWillUnmount() {
    ConfirmAccountStore.unlisten(this._onConfirmAccountStore);
  }

  _onChange = (e) => {
    this.setState({
      error: null,
      errorMessage: null,
      email: e.target.value,
    });
  };

  _onSubmit = (e) => {
    e.preventDefault();

    const { user, email } = this.state;

    if (email.length === 0) {
      return this.setState({ error: true });
    }

    const payload = {
      coupon_code: getCouponCode(SignUpStore.getState()),
    };

    track(Analytics, 'Signup/Resend Confirmation Email');

    if (user.get('email') === email) {
      return ConfirmAccountActions.resendConfirmationEmail(user.id, payload);
    }

    return ConfirmAccountActions.changeEmail(email, user);
  };

  _onConfirmAccountStore = (storeState) => {
    const { changeEmailStatus, resendStatus, error } = storeState;

    if (resendStatus === STATUS_OK) {
      setTimeout(() => {
        this.props.router.push('/getpremium/confirm');
      });
    }

    if (changeEmailStatus === STATUS_ERROR && error) {
      this.setState({
        error: true,
        errorMessage: getErrorMessage(error.type, emailErrorMessages, { withFallback: true }),
      });
    }

    this.setState({
      changeEmailStatus,
      resendStatus,
    });
  };

  render() {
    const { email, error, errorMessage, changeEmailStatus, resendStatus } = this.state;

    return (
      <ChangeEmail
        email={email}
        isLoading={[changeEmailStatus, resendStatus].includes(STATUS_PENDING)}
        error={error}
        errorMessage={errorMessage}
        onChange={this._onChange}
        onSubmit={this._onSubmit}
      />
    );
  }
}

export default withRouter(ChangeEmailContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/ChangeEmail.js