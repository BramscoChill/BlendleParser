import React from 'react';
import PropTypes from 'prop-types';
import SignUpStore from 'stores/SignUpStore';
import AuthStore from 'stores/AuthStore';
import SignUpActions from 'actions/SignUpActions';
import SignUpVerification from './SignUpVerification';

export default class SignUpVerificationContainer extends React.Component {
  static propTypes = {
    analyticsName: PropTypes.string,

    // provide extra data to send to the signup and confirmation webservice
    // this could contain keys like `referrer` or `entry_item`
    signUpContext: PropTypes.object,
  };

  static defaultProps = {
    analyticsName: 'Signup Form',
    signUpContext: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      signUpStore: SignUpStore.getState(),
      authStore: AuthStore.getState(),
    };

    SignUpStore.listen(signUpStore => this.setState({ signUpStore }));
    AuthStore.listen(authStore => this.setState({ authStore }));
  }

  _onResendConfirmMail() {
    SignUpActions.resendEmailConfirm(
      this.state.authStore.user,
      this.props.signUpContext,
      this.props.analyticsName,
    );
  }

  render() {
    return (
      <SignUpVerification
        email={this.state.authStore.user.get('email')}
        resendStatus={this.state.signUpStore.resendStatus}
        onResend={this._onResendConfirmMail.bind(this)}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/signUp/SignUpVerificationContainer.js