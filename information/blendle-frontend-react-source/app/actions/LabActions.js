import alt from 'instances/altInstance';
import { removeItem, setItem } from 'helpers/localStorage';
import Analytics from 'instances/analytics';
import { LAB_EXPERIMENTS } from 'app-constants';
import { getItem } from 'helpers/localStorage';
import hasPrivateLabAccess from 'helpers/hasPrivateLabAccess';
import { get } from 'lodash/fp';

function getExperiments(user) {
  const allExperiments = [
    {
      key: LAB_EXPERIMENTS.EDITOR_BUTTON,
      description: 'Show article editor button in reader dropdown',
      local: true,
      enabled: !!getItem(LAB_EXPERIMENTS.EDITOR_BUTTON),
    },
    {
      key: LAB_EXPERIMENTS.DEEP_DIVES,
      description: 'Show Deep Dives on the webclient',
      local: true,
      enabled: !!getItem(LAB_EXPERIMENTS.DEEP_DIVES),
    },
    {
      key: LAB_EXPERIMENTS.TEXT_TO_SPEECH,
      local: true,
      description: 'Show a button in the reader to listen to an article',
      enabled: !!getItem(LAB_EXPERIMENTS.TEXT_TO_SPEECH),
    },
    {
      key: LAB_EXPERIMENTS.ENTITIES_IN_THE_READER,
      local: true,
      description: 'Show entities in the reader',
      enabled: !!getItem(LAB_EXPERIMENTS.ENTITIES_IN_THE_READER),
    },
  ];

  if (hasPrivateLabAccess(user)) {
    return allExperiments;
  }

  return allExperiments.filter(experiment => experiment.isPublic);
}

class LabActions {
  constructor() {
    this.generateActions('toggleExperimentError');
  }

  loadExperiments(user) {
    return getExperiments(user);
  }

  toggleExperiment(user, experiment, toggle) {
    const { key, local, isPublic } = experiment;
    return (dispatch) => {
      dispatch({ experiment });

      if (!isPublic && !hasPrivateLabAccess(user)) {
        return this.toggleExperimentError({ experiment });
      }

      if (local) {
        if (toggle) {
          setItem(key, true);
        } else {
          removeItem(key);
        }

        return this.toggleExperimentSuccess(experiment, toggle);
      }

      return user
        .savePreferences({
          [key]: toggle,
        })
        .then(() => this.toggleExperimentSuccess(experiment, toggle))
        .catch(() => this.toggleExperimentError({ experiment }));
    };
  }

  toggleExperimentSuccess(experiment, toggle) {
    if (toggle) {
      Analytics.track(`Opt In: ${experiment.key}`);
    } else {
      Analytics.track(`Opt Out: ${experiment.key}`);
    }

    return {
      experiment,
      toggle,
    };
  }
}

export default alt.createActions(LabActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/LabActions.js