import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PremiumPersonaLanding from '../components/PremiumPersonaLanding';
import withRouter from 'react-router/lib/withRouter';
import withAuthListener from '../higher-order-components/withAuthListener';

// We map personas to numbers instead of actual people,
// because we don't want users to see their persona
// Spreadsheet:
const personaIdMap = {
  0: 'pieter',
  1: 'maria',
  2: 'mark',
};

class PremiumPersonaLandingContainer extends PureComponent {
  static propTypes = {
    routeParams: PropTypes.object.isRequired,
  };

  render() {
    const { routeParams } = this.props;
    const personaType = personaIdMap[routeParams.personaId];
    return <PremiumPersonaLanding personaType={personaType} {...this.props} />;
  }
}

export default withRouter(withAuthListener(PremiumPersonaLandingContainer));



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/PremiumPersonaLandingContainer.js