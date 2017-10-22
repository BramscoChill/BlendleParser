import ExperimentsStore from 'stores/ExperimentsStore';
import { getCachedExperimentAssignments } from 'helpers/experiments';
import { uniqBy } from 'lodash';

/**
 * Returns active experiments key (experiment name) value (assigned variation)
 * @returns {{ab_tests_ids: string, ...}}
 */
export default function getExperimentsStatsPayload() {
  const experiments = uniqBy(
    [...getCachedExperimentAssignments(), ...ExperimentsStore.getState().experiments],
    exp => exp.name,
  ); // Filter out duplicates

  return {
    ab_tests_ids: experiments.map(experiment => experiment.name).join(', '),
    ...experiments.reduce((map, experiment) => {
      map[experiment.name] = experiment.assignedVariation;
      return map;
    }, {}),
  };
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/getExperimentsStatsPayload.js