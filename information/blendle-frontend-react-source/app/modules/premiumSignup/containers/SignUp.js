import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router/lib/withRouter';
import AltContainer from 'alt-container';
import AffiliatesStore from 'stores/AffiliatesStore';
import { getCustomCopy } from 'helpers/affiliates';
import SignUp from 'modules/premiumSignup/components/Signup';

class SignUpContainer extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    isDeeplinkSignup: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  _renderSignUp = (affiliatesState) => {
    const customCopy = getCustomCopy('signUp', affiliatesState.affiliate);
    const { itemId } = this.props.params;
    const isDeeplink = !!itemId;

    if (isDeeplink) {
      customCopy.dialogTitle = 'Je krijgt een week Blendle Premium cadeau!';
      customCopy.introText =
        'Elke dag de beste artikelen uit alle kranten en tijdschriften. Je zit nergens aan vast.';
      customCopy.buttonText = 'Aanmelden';
    }

    return <SignUp itemId={itemId} {...customCopy} />;
  };

  render() {
    return <AltContainer store={AffiliatesStore} render={this._renderSignUp} />;
  }
}

export default withRouter(SignUpContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/SignUp.js