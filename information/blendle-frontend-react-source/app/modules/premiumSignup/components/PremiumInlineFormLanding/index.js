import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { shouldGetAutoRenewTrial } from 'helpers/premiumEligibility';
import { isMobile } from 'instances/browser_environment';
import SignupDisclaimer from '../SignupDisclaimer';
import SignupFormContainer from '../../containers/SignUpFormContainer';
import CSS from './style.scss';

export default class PremiumInlineFormLanding extends PureComponent {
  static propTypes = {
    isAffiliate: PropTypes.bool,
  };

  _onClickLink(e) {
    e.preventDefault();

    const inputEl = document.querySelector(`.${CSS.signupForm} input[type="text"]`);

    if (inputEl) {
      inputEl.focus();
    }
  }

  _renderDevicesImage() {
    return (
      <div className={CSS.imageContainer}>
        <img
          className={CSS.image}
          src="https://assets.blendleimg.com/img/backgrounds/landing_v2_desktop.png?format=auto"
          srcSet="https://assets.blendleimg.com/img/backgrounds/landing_v2_desktop.png?format=auto, https://assets.blendleimg.com/img/backgrounds/landing_v2_desktop@2x.png?format=auto 2x"
          role="presentation"
        />
      </div>
    );
  }

  render() {
    const disclaimer = shouldGetAutoRenewTrial() ? (
      <span>Je kunt op elk moment opzeggen</span>
    ) : (
      <span>
        <strong>Stopt vanzelf,</strong> je zit nergens aan vast
      </span>
    );

    return (
      <div className={CSS.inlineFormLanding}>
        <div className={CSS.formPanel}>
          <h1 className={CSS.title}>Het beste uit 120 kranten en tijdschriften op één plek</h1>
          <button className={CSS.subtitle} onClick={this._onClickLink} href="#">
            {' '}
            Probeer een week gratis.
          </button>
          <span className={CSS.inlineImage}>{this._renderDevicesImage()}</span>
          <div className={CSS.signupForm}>
            <SignupFormContainer
              buttonText="Probeer een week gratis"
              locationInLayout="inline_form"
              autoFocus={!isMobile()}
            />
            <span className={CSS.stopsAutomatically}>{disclaimer}</span>
          </div>
          <SignupDisclaimer className={CSS.disclaimer} />
        </div>
        <div className={CSS.contentPanel}>{this._renderDevicesImage()}</div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/PremiumInlineFormLanding/index.js