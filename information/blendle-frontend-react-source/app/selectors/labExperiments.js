import LabStore from 'stores/LabStore';
import { LAB_EXPERIMENTS } from 'app-constants';
import { get } from 'lodash';

export const labExperimentEnabled = (key) => {
  const foundExperiment = LabStore.getState().experiments.find(
    experiment => experiment.key === key,
  );
  return (foundExperiment && foundExperiment.enabled) || false;
};

export const editorButtonEnabled = () => labExperimentEnabled(LAB_EXPERIMENTS.EDITOR_BUTTON);

export const deepDivesEnabled = () => labExperimentEnabled(LAB_EXPERIMENTS.DEEP_DIVES);

export const textToSpeechEnabled = () => labExperimentEnabled(LAB_EXPERIMENTS.TEXT_TO_SPEECH);



// WEBPACK FOOTER //
// ./src/js/app/selectors/labExperiments.js