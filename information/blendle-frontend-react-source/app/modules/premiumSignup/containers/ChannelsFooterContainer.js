import { compose, branch, mapProps } from 'recompose';
import withRouter from 'react-router/lib/withRouter';
import altConnect from 'higher-order-components/altConnect';
import { replaceLastPath } from 'helpers/url';
import AuthStore from 'stores/AuthStore';
import SignUpStore from 'stores/SignUpStore';
import AffiliatesStore from 'stores/AffiliatesStore';
import ExperimentsStore from 'stores/ExperimentsStore';
import {
  DeeplinkOnboardingSkipProviderStep,
  DeeplinkOnboardingSkipProviderStepSkipStep,
} from 'config/runningExperiments';
import { assignedExperimentVariant } from 'helpers/experiments';
import { getOnboardingSuccessUrl } from 'helpers/onboarding';
import ChannelsFooter from '../components/ChannelsFooter';
import finishSignUp from '../helpers/finishSignup';

function mapStateToPropsForExperiment({ experimentsState }) {
  const skipProviderStepVariant = assignedExperimentVariant(
    DeeplinkOnboardingSkipProviderStep,
    experimentsState,
  );

  return {
    skipProviderStepVariant,
  };
}
mapStateToPropsForExperiment.stores = { ExperimentsStore };

function mapPropsForControlVariant({ location }) {
  return {
    nextRoute: replaceLastPath(location.pathname, 'publications'),
  };
}

function mapStateToPropsForTestVariant(
  { authState, affiliatesState, signUpState },
  { location, params },
) {
  const { user } = authState;
  const { platform } = signUpState;
  const routeBase = replaceLastPath(location.pathname, '');

  return {
    nextRoute: getOnboardingSuccessUrl(user, routeBase, {
      itemId: params.itemId,
      signupPlatform: platform,
      affiliatesState,
    }),
    handleClickNext: () => finishSignUp(params.itemId),
  };
}
mapStateToPropsForTestVariant.stores = { AffiliatesStore, SignUpStore, AuthStore };

export default compose(
  altConnect(mapStateToPropsForExperiment),
  withRouter,
  branch(
    ({ skipProviderStepVariant }) =>
      skipProviderStepVariant === DeeplinkOnboardingSkipProviderStepSkipStep,
    altConnect(mapStateToPropsForTestVariant), // Test variant
    mapProps(mapPropsForControlVariant), // Control variant
  ),
)(ChannelsFooter);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/ChannelsFooterContainer.js