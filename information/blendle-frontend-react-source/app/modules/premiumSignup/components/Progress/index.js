import React from 'react';
import { object } from 'prop-types';
import ExperimentsStore from 'stores/ExperimentsStore';
import {
  DeeplinkOnboardingSkipProviderStep,
  DeeplinkOnboardingSkipProviderStepSkipStep,
} from 'config/runningExperiments';
import { assignedExperimentVariant } from 'helpers/experiments';

import CSS from './Progress.scss';

export default function Progress({ route }) {
  const skipProviderStepVariant = assignedExperimentVariant(
    DeeplinkOnboardingSkipProviderStep,
    ExperimentsStore.getState(),
  );

  const progress =
    skipProviderStepVariant === DeeplinkOnboardingSkipProviderStepSkipStep
      ? route.deeplinkOnboardingSkipProviderStepSkipStepProgress
      : route.progress;

  const style = {
    transform: `translateX(${-100 + progress}%)`,
  };
  return (
    <div className={CSS.progress} style={style}>
      <progress max={100} value={progress} />
    </div>
  );
}

Progress.propTypes = {
  route: object.isRequired,
};



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/Progress/index.js