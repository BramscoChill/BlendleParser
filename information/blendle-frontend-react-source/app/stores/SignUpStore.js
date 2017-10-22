import {
  STATUS_INITIAL,
  STATUS_PENDING,
  STATUS_OK,
  SIGNUP_PLATFORM_EMAIL,
  STATUS_ERROR,
} from 'app-constants';
import alt from 'instances/altInstance';
import SignUpActions from '../actions/SignUpActions';

class SignUpStore {
  constructor() {
    this.bindActions(SignUpActions);

    this.state = {
      error: null,
      status: STATUS_INITIAL,
      resendStatus: STATUS_INITIAL,
      validateStatus: STATUS_INITIAL,
      validateError: null,
      platform: SIGNUP_PLATFORM_EMAIL,
      context: null,
      userInput: {
        firstname: '',
        email: '',
        password: '',
      },
      email: null,
      favorites: [],
      publications: [],
    };
  }

  onSignUpFormChange({ firstname, email, password }) {
    this.setState({
      userInput: {
        firstname,
        email,
        password,
      },
      error: null,
    });
  }

  onSignUp({ email }) {
    this.setState({ status: STATUS_PENDING, error: null, email });
  }

  onSignUpSuccess() {
    this.setState({ status: STATUS_OK, error: null });
  }

  onSignUpError(error) {
    this.setState({ status: STATUS_ERROR, error });
  }

  onSignUpChangeEmail() {
    this.setState({ status: STATUS_INITIAL });
  }

  onValidateUserInfo() {
    this.setState({
      validateStatus: STATUS_PENDING,
      validateError: null,
      email: null,
      context: {},
    });
  }

  onValidateUserInfoSuccess({ email, context }) {
    this.setState({ validateStatus: STATUS_OK, email, context });
  }

  onValidateUserInfoError(validateError) {
    this.setState({ validateStatus: STATUS_ERROR, validateError });
  }

  onResendEmailConfirm() {
    this.setState({ resendStatus: STATUS_PENDING });
  }

  onResendEmailConfirmSuccess() {
    this.setState({ resendStatus: STATUS_OK });
  }

  onExtendContext(context) {
    this.setState({
      context: {
        ...this.state.context,
        ...context,
      },
    });
  }

  onAddFavorite({ providerId }) {
    this.state.favorites.push(providerId);
    this.setState({
      favorites: this.state.favorites,
    });
  }

  onRemoveFavorite({ providerId }) {
    this.setState({
      favorites: this.state.favorites.filter(favorite => favorite !== providerId),
    });
  }

  onFetchPublicationsByChannelPreferences() {
    this.setState({
      publications: [],
    });
  }

  onFetchPublicationsByChannelPreferencesSuccess({ publications }) {
    this.setState({
      publications,
    });
  }

  onSetSignupPlatform(platform) {
    this.setState({
      platform,
    });
  }
}

export default alt.createStore(SignUpStore, 'SignUpStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/SignUpStore.js