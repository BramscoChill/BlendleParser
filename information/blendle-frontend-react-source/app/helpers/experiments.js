import ExperimentActions from 'actions/ExperimentsActions';
import { runningExperiments, forcedVariants } from 'config/runningExperiments';
import { pickVariant, hasForcedVariant } from 'helpers/abTest';
import AffiliatesStore from 'stores/AffiliatesStore';

let assignedExperimentsCache = [];

const getForcedVariant = experimentName => forcedVariants[experimentName];

function classifyUser(experimentName, user) {
  const experiment = runningExperiments.find(running => running.name === experimentName);

  // Allow forcing a variant (eg. ?abjs-setvar-Example_Test=first_variation&abjs-setcookie=yes)
  // Or let the AB test pick the variant if there is no user yet (uses cookies)
  if (!user || hasForcedVariant(window.location.search, experiment.name)) {
    const assignedExperiment = {
      ...experiment,
      assignedVariation: pickVariant(experiment),
    };

    // Update experiment state
    ExperimentActions.syncExperiment.defer(assignedExperiment, user);

    return assignedExperiment;
  }

  const userExperiments = user.getExperiments();
  // Use existing variant if present
  const existingUserVariant = userExperiments.find(ue => ue.name === experimentName);
  if (existingUserVariant) {
    return {
      ...experiment,
      assignedVariation: existingUserVariant.group,
    };
  }

  // Otherwise we classify a variant for this user
  const assignedExperiment = {
    ...experiment,
    assignedVariation: pickVariant(experiment),
  };
  ExperimentActions.syncExperiment.defer(assignedExperiment, user);

  return assignedExperiment;
}

/**
 * Return the assigned variant or null. Note: this does not assign to a variant if it does not find
 * a variant. For that, see assignExperimentVariant();
 * @param  {String} experimentName   Experiment name
 * @param  {Object} experimentsStore The full experimentsStore state
 * @return {String|null}             The assigned variant as string, or null
 */
export const assignedExperimentVariant = (experimentName, experimentsStore) => {
  const forcedVariant = getForcedVariant(experimentName);
  if (forcedVariant) {
    return forcedVariant;
  }

  const experiment = experimentsStore.experiments.find(exp => exp.name === experimentName) || {};
  return experiment.assignedVariation || null;
};

/**
 * Return the assigned variant, or assign a user to a variant if it does not have a variant. Note:
 * if the user is not in a group yet, this *will* assign them to a group.
 * @param experimentName
 * @param experimentsStore
 * @param user
 * @returns {*}
 */
export function assignExperimentVariant(experimentName, experimentsStore, user) {
  const forcedVariant = getForcedVariant(experimentName);
  if (forcedVariant) {
    return forcedVariant;
  }

  // Check if the experiment is already synced to the user
  const syncedVariant = experimentsStore
    ? assignedExperimentVariant(experimentName, experimentsStore)
    : null;

  if (syncedVariant) {
    return syncedVariant;
  }

  // Assign the experiment and sync it with the server if authenticated
  const assignedExperiment = classifyUser(experimentName, user);
  assignedExperimentsCache.push(assignedExperiment);

  return assignedExperiment.assignedVariation;
}

export function getCachedExperimentAssignments() {
  return assignedExperimentsCache;
}

export function clearExperimentsCache() {
  assignedExperimentsCache = [];
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/experiments.js