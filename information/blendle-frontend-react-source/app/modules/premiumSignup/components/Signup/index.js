import { shouldGetAutoRenewTrial } from 'helpers/premiumEligibility';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SignUpFormContainer from '../../containers/SignUpFormContainer';
import SignupDisclaimer from '../SignupDisclaimer';
import CSS from './SignUp.scss';

class SignUp extends Component {
  static propTypes = {
    dialogTitle: PropTypes.string,
    introText: PropTypes.string,
    tagline: PropTypes.string,
    itemId: PropTypes.string,
  };

  static defaultProps = {
    dialogTitle: 'Een week lang gratis de beste artikelen',
  };

  _renderIntro() {
    if (this.props.introText) {
      return <p className={CSS.intro}>{this.props.introText}</p>;
    }

    if (this.props.tagline) {
      return <p className={CSS.intro}>{this.props.tagline}</p>;
    }

    const disclaimer = shouldGetAutoRenewTrial() ? (
      <p className={CSS.intro}>Je kunt op elk moment opzeggen</p>
    ) : (
      <p className={CSS.intro}>
        <em>Stopt vanzelf,</em> dus je zit nergens aan vast.
      </p>
    );

    return disclaimer;
  }

  render() {
    const { itemId } = this.props;
    const footerClasses = classnames(CSS.footer, CSS.hideOnDektop);

    return (
      <div>
        <h2 className={CSS.title}>{this.props.dialogTitle}</h2>
        {this._renderIntro()}
        <SignUpFormContainer itemId={itemId} locationInLayout="signup_dialog" />
        <SignupDisclaimer className={footerClasses} />
      </div>
    );
  }
}

export default SignUp;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/Signup/index.js