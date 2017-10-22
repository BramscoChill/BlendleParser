import React, { PureComponent } from 'react';
import PremiumFormLandingContainer from './PremiumFormLanding';
import PremiumLanding from './PremiumLanding';

export default class PremiumInlineFormLandingContainer extends PureComponent {
  _renderBanner() {
    return <PremiumFormLandingContainer {...this.props} />;
  }

  render() {
    return <PremiumLanding topBanner={this._renderBanner()} {...this.props} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/PremiumFormLandingWithDetails.js