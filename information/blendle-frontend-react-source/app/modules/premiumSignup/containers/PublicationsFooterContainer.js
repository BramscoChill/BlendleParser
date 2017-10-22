import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import AuthStore from 'stores/AuthStore';
import SignUpStore from 'stores/SignUpStore';
import AffiliatesStore from 'stores/AffiliatesStore';
import withRouter from 'react-router/lib/withRouter';
import { getOnboardingSuccessUrl } from 'helpers/onboarding';
import PublicationsFooter from '../components/PublicationsFooter';
import finishSignup from '../helpers/finishSignup';

class PublicationsFooterContainer extends PureComponent {
  static propTypes = {
    route: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };

  _mapStateToProps = ({ authState, signupState, affiliatesState }) => {
    const { user } = authState;
    const { platform } = signupState;
    const { route, params } = this.props;
    const routeBase = window.location.pathname.replace(`/${route.path}`, '');

    return {
      successUrl: getOnboardingSuccessUrl(user, routeBase, {
        itemId: params.itemId,
        signupPlatform: platform,
        affiliatesState,
      }),
      onNext: this._onNext,
    };
  };

  _onNext = () => finishSignup(this.props.params.itemId);

  render() {
    return (
      <AltContainer
        stores={{
          authState: AuthStore,
          signupState: SignUpStore,
          affiliatesState: AffiliatesStore,
        }}
        transform={this._mapStateToProps}
        component={PublicationsFooter}
      />
    );
  }
}

export default withRouter(PublicationsFooterContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/PublicationsFooterContainer.js