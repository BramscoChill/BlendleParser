import alt from 'instances/altInstance';
import axios from 'axios';
import Settings from 'controllers/settings';
import { pickVariant, hasForcedVariant } from 'helpers/abTest';
import { runningExperiments } from 'config/runningExperiments';
import { getCachedExperimentAssignments, clearExperimentsCache } from 'helpers/experiments';

function saveUserExperiment(user, experiment) {
  if (!user) {
    return;
  }
  const link = Settings.getLink('ab_test', {
    user_id: user.id,
    ab_test_id: experiment.name,
  });

  axios.post(link, { group: experiment.assignedVariation }).catch((error) => {
    if (error.status !== 409) {
      // don't log conflict
      throw error;
    }

    // Don't crash when we sync the same group twice
    if (error.status === 409) {
      return Promise.resolve();
    }
  });
}

export default alt.createActions({
  syncExperiments(user) {
    const userExperiments = user.getExperiments();

    const experiments = runningExperiments
      .map((experiment) => {
        const userExperiment = userExperiments.find(ue => ue.name === experiment.name);
        if (!userExperiment) {
          return null;
        }

        const assignedVariation = hasForcedVariant(window.location.search, experiment.name)
          ? pickVariant(experiment) // AB Test lib has support for forcing a variant through a query param
          : userExperiment.group;

        return {
          name: experiment.name,
          variants: experiment.variants,
          assignedVariation,
        };
      })
      .filter(exp => !!exp);

    const cachedUnsyncedExperiments = getCachedExperimentAssignments().filter(
      exp => !userExperiments.find(userExp => userExp.name === exp.name),
    ); // Exclude experiments that are already synced

    // Sync cached experiments that were assigned before user was authenticated with the server
    cachedUnsyncedExperiments.forEach(exp => saveUserExperiment(user, exp));

    clearExperimentsCache();

    return [...experiments, ...cachedUnsyncedExperiments];
  },

  syncExperiment(experiment, user) {
    saveUserExperiment(user, experiment);
    return experiment;
  },
});



// WEBPACK FOOTER //
// ./src/js/app/actions/ExperimentsActions.js